import grpc from "@grpc/grpc-js";

const GrpcError = async(err:any)=>{
    let httpStatus;
switch (err.code) {
    case grpc.status.INVALID_ARGUMENT:
    httpStatus = 400;
    break;
    case grpc.status.ALREADY_EXISTS:
    httpStatus = 409;
    break;
    case grpc.status.INTERNAL:
    default:
    httpStatus = 500;
    break;
}
const response = {statusCode:httpStatus,message:err.message.split(": ")[1]};
return response;
}

export {GrpcError};