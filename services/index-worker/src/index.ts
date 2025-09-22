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
  model: "text-embedding-004",
  taskType: TaskType.RETRIEVAL_DOCUMENT,
  apiKey:process.env.GEMINI_API_KEY,
});

const pinecone = new PineconeClient();
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX!);

amqp.connect("amqp://localhost",function(error0:Error,connection:Connection) {
    if(error0){
        throw error0;
    }
    connection.createChannel(async function(error1,channel) {
        if(error1){
            throw error1;
        }
        const queue = "collections";

        channel.assertQueue(queue,{
            durable:true
        });

        channel.prefetch(1);
        console.log("[*] Waiting for messages in %s. To exit press CTRL+C", queue);
        const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
            pineconeIndex,
            maxConcurrency: 5,
        });

        channel.consume(queue,async function(message){
            if(message){
                const {id,url} = JSON.parse(message.content.toString());
                const parsedCollection = await splitCollection(url,vectorStore);
                await prismaClient.collection.update({
                    where:{
                        id,
                    },
                    data:{
                        indexed:true,
                    }
                })
                console.log(`${parsedCollection.id} - ${parsedCollection.collectionName}`);
                channel.ack(message);
            }
        },{
            noAck: false
        })
    })
})