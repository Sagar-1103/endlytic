import dotenv from "dotenv";
import * as grpc from "@grpc/grpc-js";
import { CollectionQueryRequest, CollectionQueryResponse, MediaServiceClient } from "@repo/proto/media";
import { Request, Response } from "express";
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

    const requestData: CollectionQueryRequest = { collectionId: collectionId as string, authorId:authorId as string, query: query as string,chatId };

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    const call = mediaClient.collectionQuery(requestData);

    call.on("data", (response: CollectionQueryResponse) => {
        res.write(response.jsonData);
    });

    call.on("end", () => {
        res.end();
    });

    call.on("error", (err: grpc.ServiceError) => {
        console.error("gRPC error:", err);
        if (!res.headersSent) {
            res.status(err.code ?? 500).json({ success: false, message: err.message });
        } else {
            res.end();
        }
  });
}
