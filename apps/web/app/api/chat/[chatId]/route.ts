import { importJWK, JWTPayload, jwtVerify } from "jose";
import prismaClient from "lib/db";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function getAuthUserId() {
    const cookieStore = await cookies();
    const tokenFromCookie = cookieStore.get('jwtToken') ?? null;
    if (!tokenFromCookie) return null;

    const secret = process.env.JWT_SECRET || '';
    const jwk = await importJWK({ k: secret, alg: 'HS256', kty: 'oct' });
    const { payload } = await jwtVerify(tokenFromCookie.value, jwk);
    return (payload as JWTPayload).id as string;
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ chatId: string }> }) {
    const userId = await getAuthUserId();
    if (!userId) {
        return NextResponse.json({ status: 409, message: "You are not authenticated" });
    }

    const { chatId } = await params;

    if (!chatId) {
        return NextResponse.json({ status: 401, message: "Missing chat id" });
    }

    const deletedChat = await prismaClient.chat.delete({
        where: {
            id: chatId,
            authorId: userId,
        }
    })

    return NextResponse.json({ status: 200, deletedChat, message: "Collections fetched successfully" });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ chatId: string }> }) {
    const userId = await getAuthUserId();
    if (!userId) {
        return NextResponse.json({ status: 409, message: "You are not authenticated" });
    }

    const { chatId } = await params;
    if (!chatId) {
        return NextResponse.json({ status: 401, message: "Missing chat id" });
    }

    const body = await request.json();
    const { title } = body;

    if (!title || typeof title !== "string" || !title.trim()) {
        return NextResponse.json({ status: 400, message: "Title is required" });
    }

    const updatedChat = await prismaClient.chat.update({
        where: {
            id: chatId,
            authorId: userId,
        },
        data: {
            title: title.trim(),
        },
    });

    return NextResponse.json({ status: 200, updatedChat, message: "Chat title updated successfully" });
}