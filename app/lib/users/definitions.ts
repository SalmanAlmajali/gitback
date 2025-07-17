export type User = {
    id: string;
    name: string;
    email: string;
    github_token: string | null;
    created_at: string;
    updated_at: string;
};

export type UserField = {
    id: string;
    name: string;
};