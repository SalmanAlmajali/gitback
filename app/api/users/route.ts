import { mockUpUsers } from "@/app/lib/placeholders-data";

export async function GET(request: Request) {
    const users = mockUpUsers;

    return new Response(JSON.stringify(users), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        },
    });
}