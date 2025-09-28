import { importJWK, JWTPayload, jwtVerify } from "jose";
import prismaClient from "lib/db";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
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

    const chats = await prismaClient.chat.findMany({
        where:{
            authorId:userId
        },
        orderBy:{
            updatedAt:"desc",
        }
    });

    return NextResponse.json({status:200,chats,message:"Chats fetched successfully"});
}