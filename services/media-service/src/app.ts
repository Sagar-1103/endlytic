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
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
dotenv.config();

const rabbitMqUrl = process.env.RABBITMQ_URL || "amqp://localhost";

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
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      ContentType: fileType,
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 120 });

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
    const { fileName, authorId } = call.request;

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
      data: {
        authorId: authorId,
        title: fileName,
      }
    });

    if (!collection) {
      return cb(
        {
          code: grpc.status.NOT_FOUND,
          message: "Collection Found.",
        },
        null
      );
    }

    const message = {
      url: `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`,
      id: collection.id,
      userId: authorId,
    }

    // push the url into the queue to be consumed for indexing 
    amqp.connect(rabbitMqUrl,function(error0,connection){
      if (error0) {
        console.log("RabbitMQ connection error:", error0);
        return cb(
          {
            code: grpc.status.UNAVAILABLE,
            message: "Failed to connect to RabbitMQ.",
          },
          null
        );
      }

      connection.createChannel(function (error1, channel) {
        if (error1) {
          console.error("RabbitMQ channel error:", error1);
          connection.close();
          return cb(
            {
              code: grpc.status.UNAVAILABLE,
              message: "Failed to create RabbitMQ channel.",
            },
            null
          );
        }

        const queue = "collections";

        channel.assertQueue(queue, {
          durable: true,
        });

        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
      });
      setTimeout(() => {
        try {
          connection.close();
        } catch (closeErr) {
          console.warn("Failed to close RabbitMQ connection:", closeErr);
        }
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
    const { collectionId, authorId } = call.request;

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
      where: {
        authorId,
        id: collectionId,
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

    await s3.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: collection.title,
      })
    );

    await prismaClient.collection.delete({
      where: {
        id: collectionId,
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