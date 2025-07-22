// app/api/auth/[...nextauth]/route.ts (for NextAuth.js v4)

// Import your main AuthOptions configuration
import { config as authOptions } from "@/app/lib/auth"; // Renamed to authOptions for clarity

import NextAuth from "next-auth"; // Import NextAuth directly

// Create the NextAuth API route handler
const handler = NextAuth(authOptions);

// Export GET and POST directly from the handler
export { handler as GET, handler as POST };

// If you have PUT, DELETE, etc. methods you want to handle, you would export them similarly:
// export { handler as PUT, handler, as DELETE };