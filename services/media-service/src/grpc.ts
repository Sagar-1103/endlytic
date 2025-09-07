import * as grpc from "@grpc/grpc-js";

const server = new grpc.Server();

export const getGrpcServer = () => {
    return server;
}

export const startGrpcServer = () => {
    server.bindAsync("0.0.0.0:50051",grpc.ServerCredentials.createInsecure(),(error,port)=>{
        if(error) {
            console.error("gRPC Server Error:", error);
            return;
        } else {
            console.log(`Media service running at 127.0.0.1:${port}`);
        }
    })
}