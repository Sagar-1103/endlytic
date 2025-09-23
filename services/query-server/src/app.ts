import { CollectionQueryRequest, CollectionQueryResponse } from "@repo/proto/media";
import * as grpc from "@grpc/grpc-js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType, GoogleGenerativeAI } from "@google/generative-ai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
dotenv.config()

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "text-embedding-004",
    taskType: TaskType.RETRIEVAL_DOCUMENT,
    apiKey: process.env.GEMINI_API_KEY,
});

const pinecone = new PineconeClient();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);


export const collectionQuery = async (
    call: grpc.ServerUnaryCall<CollectionQueryRequest, CollectionQueryResponse>,
    cb: grpc.sendUnaryData<CollectionQueryResponse>
) => {
    try {
        const { collection, query } = call.request;

        if (!collection || !query) {
            return cb(
                {
                    code: grpc.status.INVALID_ARGUMENT,
                    message: "Missing required fields",
                },
                null
            );
        }

        const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
            pineconeIndex,
            maxConcurrency: 5,
        });

        // const filter = { collectionName: collection }; 

        const context = await vectorStore.similaritySearch(query, 7);
        // console.log("results",results);

        const SYSTEM_PROMPT = `
        You are an assistant specialized in helping with Postman API collections.  
        Your goal is to answer the user query using the provided context in a structured, informative, and clear manner.

        ### RESPONSE FORMAT
        Your response MUST be a valid JSON object strictly following this schema:

        {
        "text": "string (required, explanation in markdown). Always provide a clear explanation first.",
        "code": { "language": "string", "content": "string" } | null,
        "table": { "headers": [string], "rows": [[string]] } | null
        }

        ### STRICT RULES
        - "text" is ALWAYS required and must contain an explanation or description.
        - "code" and "table" keys MUST always exist, even if null.
        - If the user query asks explicitly for code, or if code would help clarify the explanation, "code" MUST be non-null, with correct "language" and "content".
        - If a table can help explain data, structure, or comparisons, provide it in "table"; otherwise, set it to null.
        - Provide explanations in "text" first, then optionally add "code" and "table" as supporting material—this emulates the conversational style of ChatGPT or Gemini.
        - Do NOT include any text outside the JSON object.
        - Do NOT add extra fields.
        - The JSON must always be valid and parsable by JSON.parse in JavaScript.

        Context: ${JSON.stringify(context)}
        User query: ${query}
        `;

        const result = await model.generateContent(SYSTEM_PROMPT);
        console.log(result.response.text());

        const response: CollectionQueryResponse = {
            jsonData: JSON.stringify(result.response.text()),
        };

        return cb(null, response)

    } catch (error) {
        console.error("Error generating presigned url.", error);
        return cb({
            code: grpc.status.INTERNAL,
            message: "Internal Server Error: " + error,
        });
    }

}