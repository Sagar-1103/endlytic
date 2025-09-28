import * as grpc from "@grpc/grpc-js";
import { s3, BUCKET_NAME } from "./config/aws";
import {
  DeleteCollectionRequest,
  DeleteCollectionResponse,
  GetPresignedUrlRequest,
  GetPresignedUrlResponse,
  MediaUploadedRequest,
  MediaUploadedResponse,
} from "@repo/proto/media";
import prismaClient from "@repo/db/client";
import amqp from "amqplib/callback_api";
import dotenv from "dotenv";
dotenv.config();

export const getPresignedUrl = async (
  call: grpc.ServerUnaryCall<GetPresignedUrlRequest, GetPresignedUrlResponse>,
  cb: grpc.sendUnaryData<GetPresignedUrlResponse>
) => {
  try {
    const { fileName, fileType } = call.request;

    if (!fileName || !fileType) {
      return cb(
        {
          code: grpc.status.INVALID_ARGUMENT,
          message: "Missing required fields",
        },
        null
      );
    }

    // Generate the presigned url.
     const url = await s3.getSignedUrlPromise("putObject", {
        Bucket: BUCKET_NAME,
        Key: fileName,
        ContentType: fileType,
        Expires: 120, 
      });

    const response: GetPresignedUrlResponse = {
      message: "Presigned url generated successfully",
      url: url,
    };

    return cb(null, response);
  } catch (error: any) {
    console.error("Error generating presigned url.", error);
    return cb({
      code: grpc.status.INTERNAL,
      message: "Internal Server Error: " + error.message,
    });
  }
};

export const mediaUploaded = async (
  call: grpc.ServerUnaryCall<MediaUploadedRequest, MediaUploadedResponse>,
  cb: grpc.sendUnaryData<MediaUploadedResponse>
) => {
  try {
    const { fileName,authorId } = call.request;

    if (!fileName || !authorId) {
      return cb(
        {
          code: grpc.status.INVALID_ARGUMENT,
          message: "Missing required fields.",
        },
        null
      );
    }

    const collection = await prismaClient.collection.create({
      data:{
        authorId:authorId,
        title:fileName,
      }
    })

    // push the url into the queue to be consumed for indexing 
    amqp.connect("amqp://localhost",function(error0,connection){
      if(error0){
        throw error0;
      }

      connection.createChannel(function(erro1,channel){
        if(erro1){
          throw erro1;
        }

        const queue = "collections";
        const message = {
          url:`https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`,
          id:collection.id,
          userId:authorId,
        }

        channel.assertQueue(queue,{
          durable:true,
        });

        channel.sendToQueue(queue,Buffer.from(JSON.stringify(message)),{persistent:true});
        // console.log(" [x] Sent '%s'", message);
      });
      setTimeout(() => {
        connection.close();
      }, 500);
    })

    const response: MediaUploadedResponse = {
      message: "Media status updated",
    };

    return cb(null, response);
  } catch (error: any) {
    console.error("Error getting uploaded media status.", error);
    return cb({
      code: grpc.status.INTERNAL,
      message: "Internal Server Error: " + error.message,
    });
  }
};


export const deleteCollection = async (
  call: grpc.ServerUnaryCall<DeleteCollectionRequest, DeleteCollectionResponse>,
  cb: grpc.sendUnaryData<DeleteCollectionResponse>
) => {
  try {
    const { collectionId,authorId } = call.request;

    if (!authorId || !collectionId) {
      return cb(
        {
          code: grpc.status.INVALID_ARGUMENT,
          message: "Missing required fields.",
        },
        null
      );
    }

    const collection = await prismaClient.collection.findUnique({
      where:{
        authorId,
        id:collectionId,
      }
    })

    if (!collection) {
      return cb(
        {
          code: grpc.status.NOT_FOUND,
          message: "Collection not found",
        },
        null
      );
    }

    await s3.deleteObject({
        Bucket:BUCKET_NAME,
        Key:collection.title,
    }).promise();

    await prismaClient.collection.delete({
      where:{
        id:collectionId,
      }
    });

    const response: DeleteCollectionResponse = {
      message: "Collection deleted successfully",
      collection,
    };

    return cb(null, response);
  } catch (error: any) {
    console.error("Error deleting collection.", error);
    return cb({
      code: grpc.status.INTERNAL,
      message: "Internal Server Error: " + error.message,
    });
  }
};