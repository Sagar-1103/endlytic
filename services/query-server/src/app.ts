import { CollectionQueryRequest, CollectionQueryResponse } from "@repo/proto/media";
import * as grpc from "@grpc/grpc-js";
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import dotenv from "dotenv";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import prismaClient from "@repo/db/client";
dotenv.config()

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0,
    apiKey: process.env.GEMINI_API_KEY,
});

const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-001",
    taskType: TaskType.RETRIEVAL_DOCUMENT,
    apiKey: process.env.GEMINI_API_KEY,
});

const pinecone = new PineconeClient();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);


export const collectionQuery = async (
    call: grpc.ServerWritableStream<CollectionQueryRequest, CollectionQueryResponse>,
) => {
    try {
        const { collectionId, authorId, query, chatId } = call.request;

        if (!collectionId || !query || !chatId) {
            call.emit("error", {
                code: grpc.status.INVALID_ARGUMENT,
                message: "Missing required fields",
            });
            call.end();
            return;
        }

        const collection = await prismaClient.collection.findUnique({
            where: {
                id: collectionId
            }
        });

        if (!collection) {
            call.emit("error", {
                code: grpc.status.NOT_FOUND,
                message: "Collection not found",
            });
            call.end();
            return;
        }

        let chat = await prismaClient.chat.upsert({
            where: {
                id: chatId,
                authorId: authorId,
            },
            create: {
                id: chatId,
                authorId: authorId,
            },
            update: {}
        });

        if (!chat) {
            call.emit("error", {
                code: grpc.status.NOT_FOUND,
                message: "Chat not found",
            });
            call.end();
            return;
        }

        const history = await prismaClient.message.findMany({
            where: {
                authorId,
                chatId
            },
            take: 6,
        })

        const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
            pineconeIndex,
            maxConcurrency: 5,
        });

        const filter = { collectionId, userId: authorId };

        const context = await vectorStore.similaritySearch(query, 5, filter);

        interface LlmResponseSchema {
            title: string | null;
            text: string | null;
            code: {
                language: string;
                content: string;
            } | null;
            table: {
                headers: string[];
                rows: { [key: string]: string }[];
            } | null;
            chatId: string;
        }


        const parser = new JsonOutputParser<LlmResponseSchema>();

        const SYSTEM_PROMPT = `
        You are an expert AI assistant that helps developers explore APIs via Postman collections or OpenAPI specifications.  
        Your goal is to provide precise, actionable answers strictly based on the provided context, using **modern best practices and up-to-date standards by default**.
 
        ## RULES
        1. **Detect user intent**:  
            - If the query asks for a **summary/overview** → fill "text" only.  
            - If the query asks for **parameters, headers, endpoints, comparisons** → fill "table" (with "text" intro if needed).  
            - If the query references a specific **endpoint or method** → ALWAYS include "code" showing how to call that endpoint, in addition to "text" (and "table" if parameters apply).  
            - If the query explicitly asks for code → provide "code" plus supporting "text".  
            - If multiple forms are useful (e.g., explanation + code + table), include all.  
        2. Always set unused fields to "null". Do not omit them.   
        3. **Code Guidelines**:
            - Provide runnable code examples.
            - Default to **JavaScript (Axios without config, use direct axios functions) with async/await** unless another language is explicitly requested.
            - Also keep the same framework or technique as the last previous history, unless made my user to change.
            - Ensure URL, payload, and headers exactly match the context.
        4. **Use context faithfully**:  
            - Never hallucinate endpoints or parameters not found in context.  
            - If information is missing, state it clearly in "text". 
        5. **Chat Title**:  
            - If no Chat Title is provided → generate a concise, relevant title for the conversation.  
            - If a Chat Title is provided → return it unchanged. 

        ## INPUT
        Collection Description: {description}
        Context: {context}  
        User query: {query}
        Chat Title: {chatTitle}

        ## History
        History: {chat_history}

        ## FORMAT 
        Format: {format_instructions}
        `;

        const prompt = ChatPromptTemplate.fromTemplate(SYSTEM_PROMPT);

        const formatInstructions = `
            Respond **ONLY** in JSON, following this exact schema:

            {
                "title": string | null,
                "text": string | null,
                "code": {
                    "language": string,
                    "content": string
                } | null,
                "table": {
                    "headers": string[],
                    "rows": { [key: string]: string }[]
                } | null,
                "chatId": string
            }

            1. Always include all fields. If a field is not relevant, set it to null.
            2. Do NOT add any extra fields like 'content' or 'message'.
            3. 'title' should be concise and relevant.
            4. 'chatId' must always be set to the current chatId.
            5. 'text' contains descriptive explanation if relevant.
            6. 'code' contains example code if relevant, with 'language' and 'content'.
            7. 'table' contains structured information if relevant, as a string.

            Respond ONLY with JSON matching this schema. Do not add commentary outside JSON.
            `;

        const partialedPrompt = await prompt.partial({
            format_instructions: formatInstructions,
            chat_history: JSON.stringify(history),
            context: JSON.stringify(context)
        });

        const chain = partialedPrompt.pipe(model).pipe(parser);
        let result;
        for await (const s of await chain.stream({ query, description: collection.description, chatTitle: chat?.title })) {
            s.chatId = chat.id;
            const response: CollectionQueryResponse = {
                jsonData: JSON.stringify(s)
            };
            call.write(response);
            result = s;
        }

        if (!chat.title) {
            await prismaClient.chat.update({
                where: {
                    id: chat?.id
                },
                data: {
                    title: result?.title
                }
            })
        }

        await prismaClient.message.createMany({
            data: [
                {
                    role: "User",
                    content: JSON.stringify({ text: query }),
                    authorId: authorId,
                    chatId: chat.id
                },
                {
                    role: "Ai",
                    content: JSON.stringify(result),
                    authorId: authorId,
                    chatId: chat.id
                }
            ]
        })

        call.end();

    } catch (error) {
        console.error("Error in collectionQuery:", error);
        call.emit("error", {
            code: grpc.status.INTERNAL,
            message: "Internal Server Error: " + error,
        });
        call.end();
    }

}