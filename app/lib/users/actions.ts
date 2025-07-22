// app/lib/users/actions.ts (or app/actions.ts)
import bcrypt from "bcryptjs";
import * as z from "zod"; // For validation
import prisma from "@/app/lib/prisma";
import { signIn } from "next-auth/react";

// Zod schema for validating signup form data
const SignUpUserFormSchema = z.object({
    name: z.string().min(1, "Name is required."),
    email: z.string().email("Invalid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."), // Plaintext password from form
});

// Server Action for user registration (signup)
export async function createUser(formData: FormData) {
    // Validate form data using Zod
    const parsed = SignUpUserFormSchema.safeParse({
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if (!parsed.success) {
        return { error: parsed.error.issues.map(issue => issue.message).join(', ') };
    }

    const { name, email, password: plaintextPassword } = parsed.data; // Extract validated data

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { error: 'User with this email already exists.' };
        }

        // Hash the password before storing it
        const hashedPasswordForStorage = await bcrypt.hash(plaintextPassword, 10);

        // Create the new user in the database
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                hashedPassword: hashedPasswordForStorage,
            },
        });

        // Optional: Automatically log in the user after successful registration
        // Use the server-side signIn, passing the original plaintext password
        await signIn('credentials', {
            email,
            password: plaintextPassword,
            redirect: false, // Don't redirect immediately; let the client component handle it
        });

        return { success: true, user: newUser };
    } catch (error) {
        console.error("Server-side signup error:", error);
        return { error: 'Failed to register user. Please try again.' };
    }
}

// Server Action for direct user authentication (login)
export async function authenticate(
    prevState: string | undefined, // For use with useFormState (if applicable)
    formData: FormData
) {
    try {
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        // Use the server-side signIn function to authenticate
        await signIn('credentials', {
            redirect: false, // Don't redirect immediately
            email,
            password,
        });

        return { success: true }; // Indicate success
    } catch (error) {
        console.error("Authentication error:", error);
        // Handle specific authentication errors if needed
        return 'Invalid Credentials.'; // Generic error message for security
    }
}

// Server Action for GitHub sign-in
export async function gitHubSignIn() {
    try {
        await signIn('github'); // Initiates the GitHub OAuth flow on the server
    } catch (error) {
        console.error("GitHub sign-in error:", error);
        return { error: "Failed to sign in with GitHub." };
    }
}