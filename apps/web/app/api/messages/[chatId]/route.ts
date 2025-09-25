import { importJWK, JWTPayload, jwtVerify } from "jose";
import prismaClient from "lib/db";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest,{ params }: { params: Promise<{ chatId: string }> }) {
    const cookieStore = await cookies();
    const tokenFromCookie = cookieStore.get('jwtToken') ?? null;
    let userId;
    const secret = process.env.JWT_SECRET || '';
    const jwk = await importJWK({ k: secret, alg: 'HS256', kty: 'oct' });
    if (!tokenFromCookie) {
        return NextResponse.json({status:409,message:"You are not authenticated"});
    }

    const { payload } = await jwtVerify(tokenFromCookie.value, jwk);
    userId = (payload as JWTPayload).id as string;
    const {chatId} = await params;
    
    if (!chatId) {
        return NextResponse.json({status:401,message:"Missing chat id"});
    }
    
    const messages = await prismaClient.message.findMany({
        where:{
            chatId,
        }
    })
    return NextResponse.json({status:200,messages,message:"Collections fetched successfully"});
}