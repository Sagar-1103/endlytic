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
  model: "gemini-2.0-flash",
  temperature: 0,
  apiKey: process.env.GEMINI_API_KEY,
});

const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
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

        if (!collectionId || !query) {
            call.emit("error", {
                code: grpc.status.INVALID_ARGUMENT,
                message: "Missing required fields",
            });
            call.end();
            return;
        }

        const collection = await prismaClient.collection.findUnique({
            where:{
                id:collectionId
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

        let chat;

        if(!chatId) {
            chat = await prismaClient.chat.create({
                data:{
                    authorId:authorId
                }
            })    
        } else {
            chat = await prismaClient.chat.findFirst({
                where:{
                    authorId,
                    id:chatId,
                }
            })
        }

        if (!chat) {
            call.emit("error", {
                code: grpc.status.NOT_FOUND,
                message: "Chat not found",
            });
            call.end();
            return;
        }

        const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
            pineconeIndex,
            maxConcurrency: 5,
        });

        const filter = { collectionId,userId:authorId }; 

        const context = await vectorStore.similaritySearch(query, 5,filter);

        interface LlmResponseSchema {
            title?:string;
            text?: string;
            code?: {
                language:string;
                content:string;
            };
            table?:string;
            chatId:string;
        }

        const parser = new JsonOutputParser<LlmResponseSchema>();

        const SYSTEM_PROMPT = `
        You are an assistant that helps developers explore APIs through Postman collections or OpenAPI specs.  
        You always use the provided **context** to answer. If the context lacks relevant info, clearly say so.  

        ## RULES
        1. **Detect user intent**:  
            - If the query asks for a **summary/overview** → fill "text" only.  
            - If the query asks for **parameters, headers, endpoints, comparisons** → fill "table" (with "text" intro if needed).  
            - If the query references a specific **endpoint or method** → ALWAYS include "code" showing how to call that endpoint, in addition to "text" (and "table" if parameters apply).  
            - If the query explicitly asks for code → provide "code" plus supporting "text".  
            - If multiple forms are useful (e.g., explanation + code + table), include all.  

        2. Always set unused fields to "null". Do not omit them.   

        3. **Code rules**:  
            - Always generate runnable example code for endpoint queries.  
            - Default to **JavaScript (Axios)** unless the user specifies another language.  
            - Ensure the payload, headers, and URL exactly match the context (no hallucination). 
        
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

        ## FORMAT 
        Format: {format_instructions}
        `;

        const prompt = ChatPromptTemplate.fromTemplate(SYSTEM_PROMPT);

        const formatInstructions = "Respond with a valid JSON object, containing three fields according to the situation: 'text' and 'code'(code with language and content) and 'table' and 'title'.";

        const partialedPrompt = await prompt.partial({
            format_instructions: formatInstructions,
        });

        const chain = partialedPrompt.pipe(model).pipe(parser);
        let result;
        for await (const s of await chain.stream({context:JSON.stringify(context), query,description:collection.description,chatTitle:chat?.title })) {
            s.chatId=chat.id;
            const response: CollectionQueryResponse = {
                jsonData:JSON.stringify(s)
            };
            call.write(response);
            result = s;
        }

        if(!chatId) {
            await prismaClient.chat.update({
                where:{
                    id:chat?.id
                },
                data:{
                    title:result?.title
                }
            })
        }

        if (chat?.id) {
            await prismaClient.message.create({
                data:{
                    role:"User",
                    content:JSON.stringify({text:query}),
                    authorId:authorId,
                    chatId:chat.id
                }
            })

            await prismaClient.message.create({
                data:{
                    role:"Ai",
                    content:JSON.stringify(result),
                    authorId:authorId,
                    chatId:chat.id
                }
            })
        }

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