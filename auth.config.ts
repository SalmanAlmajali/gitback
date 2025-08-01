import { AuthError, type DefaultSession, type NextAuthConfig } from 'next-auth';
import bcrypt from 'bcryptjs';
import GitHub from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from './app/lib/prisma';
import { JWT } from "next-auth/jwt";
import z from 'zod';

declare module "next-auth" {
    interface Session {
        accessToken?: string;
        user: {
            id: string
        } & DefaultSession["user"]
    }

    interface User {
        githubAccessToken?: string | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string;
        accessToken?: string;
    }
}

export const authConfig: NextAuthConfig = {
    providers: [
        GitHub({
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
            authorization: { params: { scope: 'repo user read:user user:email' } },
        }),
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials) => {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await prisma.user.findUnique({ where: { email } });

                    if (!user || !user.hashedPassword) {
                        return null;
                    }

                    const isValidPassword = await bcrypt.compare(password, user.hashedPassword);

                    if (!isValidPassword) {
                        return null;
                    }

                    const githubAccount = await prisma.account.findFirst({
                        where: {
                            userId: user.id,
                            provider: 'github',
                        },
                    });

                    return {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        githubAccessToken: githubAccount?.access_token,
                    };
                }
                return null;
            },
        }),
    ],
    pages: {
        signIn: '/auth/sign-in',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false;
            } else if (isLoggedIn) {
                return Response.redirect(new URL('/dashboard', nextUrl));
            }
            return true;
        },
        async jwt({ token, user, account }) {
            console.log('account', account);
            if (user) {
                token.id = user.id;

                if (user.githubAccessToken) {
                    token.accessToken = user.githubAccessToken;
                }
            }

            if (account?.provider === 'github') {
                token.accessToken = account.access_token;
            }

            return token;
        },
        async session({ session, token }) {
            if (token.id) {
                session.user.id = token.id;
            }
            if (token.accessToken) {
                session.accessToken = token.accessToken;
            }
            return session;
        }
    },
    events: {
        linkAccount: async ({ user, profile }) => {
            try {
                await prisma.user.update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        image: profile.image,
                    }
                });
            } catch (error) {
                console.error("Failed to update user in linkAccount:", error);
                throw new Error("Failed to update user after linking account.");
            }
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;