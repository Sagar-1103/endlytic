import dotenv from "dotenv";
import * as grpc from "@grpc/grpc-js";
import { CollectionQueryRequest, CollectionQueryResponse, MediaServiceClient } from "@repo/proto/media";
import { Request, Response } from "express";
import { GrpcError } from "../utils/gRPC";
dotenv.config();

const mediaClient = new MediaServiceClient(
    process.env.QUERY_SERVICE_PORT || "localhost:50052",
    grpc.credentials.createInsecure()
);


export const generateQueryResponse = async (req: Request, res: Response) => {
    const { query, collectionId, chatId } = req.body;
    const authorId = req.userId;

    if (!collectionId || !query || !authorId) {
        return res.status(401).json({ success: false, message: "Missing required fields" });
    }

    const requestData: CollectionQueryRequest = { collectionId: collectionId as string, authorId: authorId as string, query: query as string, chatId };

    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("X-Accel-Buffering", "no");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const call = mediaClient.collectionQuery(requestData);

    call.on("data", (response: CollectionQueryResponse) => {
        res.write(response.jsonData + "\n");
    });

    call.on("end", () => {
        res.end();
    });

    call.on("error", async (err: grpc.ServiceError) => {
        console.error("gRPC error:", err);
        if (!res.headersSent) {
            const gRPCError = await GrpcError(err)
            res.status(gRPCError.statusCode).json({ success: false, message: gRPCError.message });
        } else {
            res.end();
        }
    });
}
