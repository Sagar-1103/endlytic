'use server'

// app/api/auth/signup/route.ts
import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import prismaClient from "lib/db"

export async function signUp(values: { email: string; password: string; }) {
    const { email, password } = values

    const existingUser = await prismaClient.user.findUnique({
        where: { email },
    })

    if (existingUser) {
        return { error: "User already exists." };
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    try {
        const user = await prismaClient.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        })

        return { success: true };
    } catch (error) {
        return { error: "Error creating user." };
    }
}
