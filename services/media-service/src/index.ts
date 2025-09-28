import { deleteCollection, getPresignedUrl, mediaUploaded } from "./app";
import { getGrpcServer, startGrpcServer } from "./grpc";
import  { MediaServiceService } from "@repo/proto/media";

const server = getGrpcServer();

const mediaServices = {
    getPresignedUrl,
    mediaUploaded,
    deleteCollection,
}
server.addService(MediaServiceService,mediaServices);
startGrpcServer();
