import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { authConfig } from './auth.config';
import { prisma } from './app/lib/prisma';

export const { auth, handlers, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma), // Connects NextAuth to your Prisma database
    session: {
        strategy: 'jwt', // Use JWT for session management
    },
    ...authConfig,
});
