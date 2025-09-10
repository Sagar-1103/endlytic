import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { importJWK, JWTPayload, jwtVerify } from "jose";
dotenv.config();

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export {};


export const authenticate = async(req:Request,res:Response,next:NextFunction) => {
    try {
        const token = req.cookies?.accessToken || req.body?.token || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
          return res.status(401).json({success:false,message:"Unauthorized request"});
        }

        const secret = process.env.JWT_SECRET as string;

        if (!secret) {
          return res.status(500).json({success:false,message:"JWT_SECRET is not defined"});
        }

        const jwk = await importJWK({ k: secret, alg: 'HS256', kty: 'oct' });
        const { payload:decoded } = await jwtVerify(token, jwk);

        if (!decoded || !(decoded as JWTPayload).id) {
          return res.status(401).json({success:false,message:"Invalid Token"});
        }
        
        req.userId = (decoded as JWTPayload).id as string;
        next();
    } catch (error:any) {
        return res.status(401).json({success:false,message:error?.message || "Invalid Token"});
    }
}