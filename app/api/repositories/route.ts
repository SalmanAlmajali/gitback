import { mockUpUsers } from "@/app/lib/placeholders-data";
import { Repository } from "@/app/lib/repositories/definitions";
import { randomUUID } from "crypto";
import { NextRequest } from "next/server";

let mockUpRepositories: Repository[] = [
    {
        id: "a5cf801c-d47c-4280-b1f6-75869dfa2e85",
        user_id: "c56a27b5-487a-4e2e-8d39-973dc5031d68",
        name: "Nextjs Dashboard",
        github_owner: "SalmanAlmajali",
        github_repo: "nextjs-dashboard",
        created_at: "2025-07-16T13:10:07.272Z",
        updated_at: "2025-07-16T13:10:07.272Z",
    },
]

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';

    const userMap = new Map(mockUpUsers.map(user => [user.id, user]));

    const repositories = mockUpRepositories
        .filter((repository: Repository) => {
            const user = userMap.get(repository.user_id);

            return (
                repository.name.toLowerCase().includes(search) ||
                repository.github_owner.toLowerCase().includes(search) ||
                repository.github_repo.toLowerCase().includes(search) ||
                user?.name.toLowerCase().includes(search) ||
                user?.email.toLowerCase().includes(search)
            );
        })
        .map((repository: Repository) => {
            const user = userMap.get(repository.user_id);

            return {
                ...repository,
                username: user?.name,
                email: user?.email,
            };
        });

    return new Response(JSON.stringify(repositories), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        },
    });
}

export async function POST(request: Request) {
    const body = await request.json();
    const { user_id, name, github_owner, github_repo } = body;

    if (!user_id) return new Response(JSON.stringify({ error: 'User is required' }), { status: 400 });
    if (!name) return new Response(JSON.stringify({ error: 'Name is required' }), { status: 400 });
    if (!github_owner) return new Response(JSON.stringify({ error: 'Github Owner is required' }), { status: 400 });
    if (!github_repo) return new Response(JSON.stringify({ error: 'Github Repository is required' }), { status: 400 });

    const date = new Date();

    const newRepository = {
        id: randomUUID(),
        user_id,
        name,
        github_owner,
        github_repo,
        created_at: date.toISOString(),
        updated_at: date.toISOString(),
    };

    mockUpRepositories.push(newRepository);

    return new Response(JSON.stringify(body), {
        status: 201,
        headers: {
            'Content-Type': 'application/json'
        },
    });
}

export async function PUT(request: NextRequest) {
    const body = await request.json();
    const { id, ...updates } = body;

    const index = mockUpRepositories.findIndex(r => r.id === id);
    if (index === -1) return Response.json({ message: 'Not found' }, { status: 404 });

    console.log("index" + index);


    mockUpRepositories[index] = {
        ...mockUpRepositories[index],
        ...updates,
        updated_at: new Date().toISOString(),
    };

    return new Response(JSON.stringify(mockUpRepositories[index]), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        },
    });
}

export async function DELETE(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const idx = mockUpRepositories.findIndex(r => r.id === id);
    if (idx === -1) {
        return new Response(JSON.stringify({ error: 'Repository not found' }), { status: 404 });
    }
    const [deleted] = mockUpRepositories.splice(idx, 1);
    return new Response(JSON.stringify(deleted), { status: 200 });
}