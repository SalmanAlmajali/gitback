// app/lib/prisma.ts

import { PrismaClient } from '@prisma/client';

// Declare a global variable for PrismaClient
// This is necessary to prevent multiple instances of PrismaClient in development
// (due to Next.js hot-reloading)
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Initialize the PrismaClient instance
// In development, reuse the existing global instance if it exists.
// In production, create a new instance.
const prisma = global.prisma || new PrismaClient();

// In development, assign the PrismaClient instance to the global variable
// so it's reused across hot reloads.
if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

// Export the PrismaClient instance
export default prisma;