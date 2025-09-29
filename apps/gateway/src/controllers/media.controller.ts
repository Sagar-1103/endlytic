import dotenv from "dotenv";
import * as grpc from "@grpc/grpc-js";
import { DeleteCollectionRequest, DeleteCollectionResponse, GetPresignedUrlRequest, GetPresignedUrlResponse, MediaServiceClient, MediaUploadedRequest, MediaUploadedResponse } from "@repo/proto/media";
import { Request, Response } from "express";
import { GrpcError } from "../utils/gRPC";
dotenv.config();

const mediaClient = new MediaServiceClient(
  process.env.MEDIA_SERVICE_PORT || "localhost:50051",
  grpc.credentials.createInsecure()
);

export const generatePresignedUrl = async (req:Request,res:Response) => {
    const {fileName,fileType} = req.query;
    
    if (!fileName || !fileType) {
        return res.status(400).json({success:false,message:"Missing required fields"});
    }

    const getPresignedUrlRequest:GetPresignedUrlRequest = {fileName:fileName as string,fileType: fileType as string};

    mediaClient.getPresignedUrl(getPresignedUrlRequest,async(err:grpc.ServiceError | null,response:GetPresignedUrlResponse)=>{
        if(err){
            const gRPCError = await GrpcError(err)
            res.status(gRPCError.statusCode).json({success:false,message:gRPCError.message});
        } else {
            res.status(200).json({success:true,url:response.url,message:response.message});
        }
    })
};

export const completeUpload = async(req:Request,res:Response) => {
    const {fileName} = req.body;

    const authorId = req.userId;

    if(!fileName || !authorId) {
        return res.status(401).json({success:false,message:"Missing required fields"});
    }

    const mediaUploadedRequest:MediaUploadedRequest = {fileName,authorId};

    mediaClient.mediaUploaded(mediaUploadedRequest,async(err:grpc.ServiceError | null,response:MediaUploadedResponse)=>{
        if(err) {
            const gRPCError = await GrpcError(err)
            res.status(gRPCError.statusCode).json({success:false,message:gRPCError.message});
        } else {
            res.status(201).json({sucess:true,message:response.message});
        }
    })
}

export const collectionDeletion = async(req:Request,res:Response) => {
    const { collectionId } = req.params;

    const authorId = req.userId;

    if(!collectionId || !authorId) {
        return res.status(401).json({success:false,message:"Missing required fields"});
    }

    const deleteCollectionRequest:DeleteCollectionRequest = {collectionId,authorId};

    mediaClient.deleteCollection(deleteCollectionRequest,async(err:grpc.ServiceError | null,response:DeleteCollectionResponse)=>{
        if(err) {
            const gRPCError = await GrpcError(err)
            res.status(gRPCError.statusCode).json({success:false,message:gRPCError.message});
        } else {
            res.status(201).json({sucess:true,deletedCollection:response.collection,message:response.message});
        }
    })
}
