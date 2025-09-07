import * as grpc from "@grpc/grpc-js";
import {
  GetPresignedUrlRequest,
  GetPresignedUrlResponse,
  MediaUploadedRequest,
  MediaUploadedResponse,
} from "@repo/proto/media";

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

    const response: GetPresignedUrlResponse = {
      message: "Presigned url generated successfully",
      url: "https://endlytic.vercel.app",
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
    const { url } = call.request;

    if (!url) {
      return cb(
        {
          code: grpc.status.INVALID_ARGUMENT,
          message: "Missing required fields.",
        },
        null
      );
    }

    // push the url into the queue to be consumed for indexing 

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
