import prismaClient from "lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
    const session = await getServerSession();
    if (!session?.user) {
        return NextResponse.json({status:409,message:"You are not authenticated"});
    }

    const collections = await prismaClient.collection.findMany({
        where:{
            authorId:session.user.id
        }
    });

    return NextResponse.json({status:200,collections,message:"Collections fetched successfully"});
}