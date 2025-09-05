import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    const cookieStore = await cookies();
    const tokenFromCookie = cookieStore.get('jwtToken') ?? null;
    const tokenFromNextAuth = await getToken({req,secret: process.env.AUTH_SECRET })
    
    return NextResponse.json({t1:tokenFromCookie,t2:tokenFromNextAuth});
}