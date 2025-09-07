import dotenv from "dotenv";
import * as grpc from "@grpc/grpc-js";
import { GetPresignedUrlRequest, GetPresignedUrlResponse, MediaServiceClient, MediaUploadedRequest, MediaUploadedResponse } from "@repo/proto/media";
import { Request, Response } from "express";
dotenv.config();

const mediaClient = new MediaServiceClient(
  process.env.MEDIA_SERVICE_PORT || "localhost:50051",
  grpc.credentials.createInsecure()
);

export const generatePresignedUrl = async (req:Request,res:Response) => {
    const {fileName,fileType} = req.query;
    
    if (!fileName || !fileType) {
        return res.status(401).json({success:false,message:"Missing required fields"});
    }

    const getPresignedUrlRequest:GetPresignedUrlRequest = {fileName:fileName as string,fileType: fileType as string};

    mediaClient.getPresignedUrl(getPresignedUrlRequest,async(err:grpc.ServiceError | null,response:GetPresignedUrlResponse)=>{
        if(err){
            res.status(err.code??500).json({success:false,message:err.message});
        } else {
            res.status(200).json({success:true,url:response.url,message:response.message});
        }
    })
};

export const completeUpload = async(req:Request,res:Response) => {
    const {url} = req.body;

    if(!url) {
        return res.status(401).json({success:false,message:"Missing required fields"});
    }

    const mediaUploadedRequest:MediaUploadedRequest = {url};

    mediaClient.mediaUploaded(mediaUploadedRequest,async(err:grpc.ServiceError | null,response:MediaUploadedResponse)=>{
        if(err) {
            res.status(err.code??500).json({success:false,message:err.message});
        } else {
            res.status(201).json({sucess:true,message:response.message});
        }
    })
}
