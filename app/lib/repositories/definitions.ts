export type Repository = {
    id: string;
    user_id: string;
    name: string;
    github_owner: string;
    github_repo: string;
    created_at: string;
    updated_at: string;
};

export type RepositoriesTable = {
    id: string;
    user_id: string;
    name: string;
    github_owner: string;
    github_repo: string;
    created_at: string;
    updated_at: string;
    username: string;
    email: string;
};

export type RepositoryForm = {
    id: string;
    user_id: string;
    name: string;
    github_owner: string;
    github_repo: string;
};