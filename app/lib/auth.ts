// app/lib/auth.ts
import NextAuth, { DefaultSession, AuthOptions } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import prisma from '@/app/lib/prisma'; // Assuming your Prisma client instance

// Extend NextAuth types to include custom fields like 'id' and 'hashedPassword'
declare module "next-auth" {
    interface Session {
        accessToken?: string;
        user: {
            id: string;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        hashedPassword?: string | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        accessToken?: string;
    }
}

export const config: AuthOptions = {
    adapter: PrismaAdapter(prisma), // Connects NextAuth to your Prisma database
    providers: [
        GitHub({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
            authorization: { params: { scope: 'repo user' } },
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Please enter your email and password.');
                }
                const user = await prisma.user.findUnique({ where: { email: credentials.email } });
                console.log(user);

                if (!user || !user.hashedPassword) {
                    throw new Error('Invalid credentials.');
                }
                const isValidPassword = await bcrypt.compare(credentials.password, user.hashedPassword);
                if (!isValidPassword) {
                    throw new Error('Invalid credentials.');
                }
                // Return the user object if authentication is successful
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                };
            },
        }),
    ],
    session: {
        strategy: 'jwt', // Use JWT for session management
    },
    pages: {
        signIn: '/auth/login', // Custom sign-in page
    },
    callbacks: {
        // Adjust JWT token with user ID and GitHub access token
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
            }
            if (account?.provider === 'github' && account.access_token) {
                token.accessToken = account.access_token;
            }
            return token;
        },
        // Adjust session object with user ID and access token
        async session({ session, token }) {
            if (token.id) {
                session.user.id = token.id;
            }
            if (token.accessToken) {
                session.accessToken = token.accessToken;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET, // Environment variable for JWT signing
};

// Export the NextAuth.js handlers and functions for server-side use
export const { handlers, auth, signIn, signOut } = NextAuth(config);
