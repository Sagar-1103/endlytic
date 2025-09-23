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
    const { collection, query } = req.query;

    if (!collection || !query) {
        return res.status(401).json({ success: false, message: "Missing required fields" });
    }

    const requestData: CollectionQueryRequest = { collection: collection as string, query: query as string };

    mediaClient.collectionQuery(requestData, async (err: grpc.ServiceError | null, response: CollectionQueryResponse) => {
        if (err) {
            res.status(err.code ?? 500).json({ success: false, message: err.message });
        } else {
            res.status(200).json({ success: true, data: response.jsonData, });
        }
    })
}
