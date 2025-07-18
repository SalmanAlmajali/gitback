export type User = {
    id: string;
    name: string;
    email: string;
    githubToken: string | null;
    createdAt: string;
    updatedAt: string;
};

export type UserField = {
    id: string;
    name: string | null;
};
