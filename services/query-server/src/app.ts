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
            orderBy: {
                createdAt: "asc",
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
        Your goal is to provide precise, actionable answers strictly based on the provided context, using modern best practices and up-to-date standards by default.

        ## RULES

        ### 1. Detect user intent
        - If the query asks for a summary/overview → fill "text" only.
        - If the query asks for parameters, headers, endpoints, or comparisons → fill "table" (with "text" intro if needed).
        - If the query references a specific endpoint or method → ALWAYS include "code" showing how to call it, plus "text" (and "table" if parameters apply).
        - If the query explicitly asks for code → provide "code" plus supporting "text".
        - If multiple formats are useful (explanation + code + table), include all of them.

        ### 2. Framework & Language Detection — CRITICAL
        Determine the target framework/language using this priority order:
        (a) Explicit mention in the CURRENT query (highest priority) — e.g. "give me Next.js code", "use TanStack Query", "show in Python", "Angular service".
        (b) Framework/language found in recent chat HISTORY — carry it forward automatically unless overridden.
        (c) Nothing specified → default to plain JavaScript with Axios and async/await.

        Once the target is identified, ALWAYS produce idiomatic, production-quality code following the rules below.
        NEVER generate plain Node.js/Axios code when the user asked for a specific framework or language.

        === Next.js (App Router) ===
        - Use native fetch with Next.js cache options: fetch(url, { cache: 'no-store' }) or fetch(url, { next: { revalidate: 60 } }).
        - Server Components: write async function components. Add comment: // Server Component.
        - Client Components: add 'use client' directive, use useState + useEffect or TanStack Query.
        - API Route Handlers: export async function GET/POST in app/api/... files.
        - Always include TypeScript interfaces for request/response shapes.

        === Next.js (Pages Router) ===
        - Server-side: use getServerSideProps or getStaticProps with typed context.
        - Client-side: useEffect + useState with Axios. Include TypeScript types.

        === TanStack Query (React Query) ===
        - GET requests → useQuery({ queryKey: [...], queryFn: async () => { ... } }).
        - POST/PUT/PATCH/DELETE → useMutation({ mutationFn: async (data) => { ... }, onSuccess, onError }).
        - Always show the full React component that uses the hook, including isLoading / isError / data handling.
        - Use Axios as the fetcher function inside queryFn/mutationFn.
        - Include QueryClientProvider at the root if showing a standalone example.

        === React (no framework) ===
        - Use useEffect + useState (loading, error, data states). Use Axios. Include TypeScript types.

        === Vue 3 / Nuxt 3 ===
        - Vue 3: Composition API with ref, onMounted, and Axios.
        - Nuxt 3: use useFetch or useAsyncData for server-side-aware fetching.

        === Angular ===
        - Create an @Injectable service class that uses HttpClient.
        - Methods return Observable<T> with proper TypeScript types.
        - Show how to inject and subscribe in a component OnInit.

        === Python ===
        - Synchronous: use the requests library with proper error handling (try/except, response.raise_for_status()).
        - Async: use httpx with async/await or aiohttp.
        - Include type hints and print the parsed JSON response.

        === Go ===
        - Use net/http. Define request/response structs, marshal JSON for the body, read and unmarshal the response.
        - Handle all errors idiomatically (if err != nil).

        === Rust ===
        - Use the reqwest crate with tokio async runtime.
        - Define structs with serde::Deserialize/Serialize.

        === cURL ===
        - Produce a clean curl command with -X METHOD, all required -H headers, and -d body for non-GET requests.
        - Use --location for redirect following.

        === PHP ===
        - Use Guzzle HTTP client with proper error handling.

        === Swift / iOS ===
        - Use URLSession with async/await (iOS 15+) and Codable structs.

        === Kotlin / Android ===
        - Use Retrofit with a suspend function and a Coroutine ViewModel.

        Always set the "language" field to the exact name of the framework/language used, e.g.:
        "typescript-nextjs-app", "typescript-tanstack-query", "python", "go", "bash", "kotlin", "swift".

        ### 3. Code Quality
        - Runnable, copy-paste-ready code — not pseudocode.
        - Exact URL, HTTP method, headers, and body from the context.
        - Replace sensitive values (API keys, tokens) with clearly labelled placeholders like YOUR_API_KEY.
        - Always include TypeScript interfaces/types for TypeScript-based frameworks.
        - For TanStack Query: always wrap the hook inside a complete React component.
        - For Next.js: always clarify server vs client at the top of the snippet.

        ### 4. Context Fidelity
        - Never hallucinate endpoints or parameters not found in the provided context.
        - If information is missing, state clearly in "text" what is unavailable.

        ### 5. Chat Title
        - No title provided → generate a concise, relevant title.
        - Title already provided → return it unchanged.

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

        await prismaClient.message.create({
            data: {
                role: "User",
                content: JSON.stringify({ text: query }),
                authorId: authorId,
                chatId: chat.id
            }
        });

        await prismaClient.message.create({
            data: {
                role: "Ai",
                content: JSON.stringify(result),
                authorId: authorId,
                chatId: chat.id
            }
        });

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