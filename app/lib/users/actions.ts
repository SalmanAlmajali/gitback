'use server';

import bcrypt from "bcryptjs";
import * as z from "zod";
import prisma from "@/app/lib/prisma";
import { CustomResponse } from "../definitions";

const SignUpUserFormSchema = z.object({
    name: z.string().min(1, "Name is required."),
    email: z.string().email("Invalid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
});

export async function createUser(formData: FormData): Promise<CustomResponse> {
    const parsed = SignUpUserFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!parsed.success) {
        return { success: false, error: parsed.error.issues.map(issue => issue.message).join(', ') };
    }

    const { name, email, password: plaintextPassword } = parsed.data;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { success: false, error: 'User with this email already exists.' };
        }

        const hashedPasswordForStorage = await bcrypt.hash(plaintextPassword, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                hashedPassword: hashedPasswordForStorage,
            },
        });

        return { success: true, message: "You're all set! Your account is ready to use." };
    } catch (error) {
        console.error("Server-side signup error:", error);
        return { success: false, error: 'Failed to register user. Please try again.' };
    }
}
