import { getGrpcServer, startGrpcServer } from "./grpc";
import  { MediaServiceService } from "@repo/proto/media";
import { collectionQuery } from "./app";

const server=getGrpcServer();

const queryServices = {
   collectionQuery
}
server.addService(MediaServiceService,queryServices);
startGrpcServer();