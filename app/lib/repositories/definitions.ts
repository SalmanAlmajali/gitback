import { UserSelectedRepository } from "@prisma/client";
import { User } from "../users/definitions";

export type Repository = {
    id: string;
    userId: string;
    name: string;
    githubOwner: string;
    githubRepo: string;
    createdAt: string;
    updatedAt: string;
} | null;

export type RepositoryColumnKey =
    | 'id'
    | 'name'
    | 'githubOwner'
    | 'githubRepo'
    | 'createdAt'
    | 'updatedAt'
    | 'user'
    | 'email';

export type RepositoriesTable = {
    id: string;
    userId: string;
    name: string;
    githubOwner: string;
    githubRepo: string;
    createdAt: string;
    updatedAt: string;
    user: User;
    [key: string]: any;
};

export type RepositoriesTableRow = UserSelectedRepository & {
  user?: User;
};

export type RepositoryForm = {
    id: string;
    userId: string;
    name: string;
    githubOwner: string;
    githubRepo: string;
} | null;