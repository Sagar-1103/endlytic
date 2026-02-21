import amqp, { Connection } from "amqplib/callback_api";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
import { PineconeStore } from "@langchain/pinecone";
import prismaClient from "@repo/db/client";
import { splitCollection } from "./utils/generator";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";
dotenv.config();

const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-001",
    taskType: TaskType.RETRIEVAL_DOCUMENT,
    apiKey: process.env.GEMINI_API_KEY,
});

const pinecone = new PineconeClient();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

const rabbitMqUrl = process.env.RABBITMQ_URL || "amqp://localhost";

amqp.connect(rabbitMqUrl, function (error0: Error, connection: Connection) {
    if (error0) {
        console.error("Failed to connect RabbitMQ:", error0.message);
        process.exit(1);
    }
    connection.createChannel(async function (error1, channel) {
        if (error1) {
            console.error("Failed to create RabbitMQ channel:", error1.message);
            process.exit(1);
        }
        const queue = "collections";

        channel.assertQueue(queue, {
            durable: true
        });

        channel.prefetch(1);
        console.log("[*] Waiting for messages in %s. To exit press CTRL+C", queue);

        let vectorStore;
        try {
            vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
                pineconeIndex,
                maxConcurrency: 5,
            });
        } catch (error: any) {
            console.error("[Pinecone] Failed to initialize vector store:", error.message);
            process.exit(1);
        }

        channel.consume(queue, async function (message) {
            if (message) {
                try {
                    const { id, url, userId } = JSON.parse(message.content.toString());
                    if (!id || !url || !userId) {
                        throw new Error("Invalid message payload: missing required fields.");
                    }
                    const parsedCollection = await splitCollection(url, id, vectorStore, userId);
                    await prismaClient.collection.update({
                        where: {
                            id,
                        },
                        data: {
                            indexed: true,
                            description: JSON.stringify(parsedCollection.collectionDescription),
                        }
                    })
                    console.log(`${id} - ${parsedCollection.collectionName}`);
                    channel.ack(message);
                } catch (error) {
                    console.error("Error processing message:", error);
                }
            }
        }, {
            noAck: false
        })
    })
})