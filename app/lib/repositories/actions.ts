'use server';

import postgres from "postgres";
import { mockUpRepositories, mockUpUsers } from "../placeholders-data";
import { RepositoriesTable, RepositoryForm } from "./definitions";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
const ITEMS_PER_PAGE = 10;

// const FormSchema = z.object({
//     id: z.string(),
//     user_id: z.string(),
//     name: z.string(),
//     github_owner: z.string(),
//     github_repo: z.string(),
//     created_at: z.string(),
//     updated_at: z.string(),
// })

// DB RELATED FUNCTION
export async function fetchFilteredRepositories(
    query: string,
    currentPage: number,
) {
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;

    try {
        const repositories = await sql<RepositoriesTable[]>`
            SELECT
                repositories.id,
                repositories.name,
                repositories.github_owner,
                repositories.github_repo,
                repositories.created_at,
                repositories.updated_at,
                users.name AS username,
                users.email
            FROM repositories
            JOIN users ON repositories.user_id = users.id
            WHERE
                users.name ILIKE ${`%${query}%`} OR
                users.email ILIKE ${`%${query}%`} OR
                repositories.name ILIKE ${`%${query}%`} OR
                repositories.github_owner ILIKE ${`%${query}%`} OR
                repositories.github_repo ILIKE ${`%${query}%`}
            ORDER BY repositories.created_at DESC
            LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
            `;
        return repositories
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch repositories.');
    }
}

export async function fetchRepositoryById(id: string) {
    try {
        const repository = await sql<RepositoryForm[]>`
      SELECT
        repositories.id,
        repositories.user_id,
        repositories.name,
        repositories.github_owner,
        repositories.github_repo
      FROM repositories
      WHERE repositories.id = ${id};
    `;

        return repository[0];
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch selected repository.');
    }
}

// LOCAL FILE RELATED FUNCTION WITHOUT API

export async function fetchFilteredRepositoriesFromLocal(
    query: string,
    currentPage: number,
) {
    try {
        console.log(query);
        console.log(currentPage);

        await new Promise((resolve) => setTimeout(resolve, 100));
        const data = mockUpRepositories;

        const repositories = <RepositoriesTable[]>data.map((repository) => {
            const user = mockUpUsers.find(user => user.id === repository.user_id)

            return ({
                ...repository,
                username: user?.name,
                email: user?.email,
            })
        });
        return repositories;
    } catch (error) {
        console.error('Fetch Error:', error);
        throw new Error('Failed to fetch repositories.');
    }
}

export async function fetchRepositoryByIdFromLocal(id: string) {
    try {
        await new Promise((resolve) => setTimeout(resolve, 100));
        const repository = mockUpRepositories.find(repo => repo.id === id);

        return repository;
    } catch (error) {
        console.error('Fetch Error:', error);
        throw new Error('Failed to fetch selected repository.');
    }
}

// LOCAL FILE RELATED FUNCTION WITH API

// export async function fetchFilteredRepositoriesFromAPI(
//     query: string,
//     currentPage: number,
// ) {

//     try {
//         const response = await fetch(`http://localhost:3000/api/repositories?query=${query.toLowerCase()}&currentPage=${currentPage}`, {
//             cache: 'no-store'
//         })
//             .then(res => res.json());

//         const repositories = <RepositoriesTable[]>response.map((repository: Repository) => {
//             const user = mockUpUsers.find(user => user.id === repository.user_id)

//             return ({
//                 ...repository,
//                 username: user?.name,
//                 email: user?.email,
//             })
//         });

//         return repositories;
//     } catch (error) {
//         console.error('Database Error:', error);
//         throw new Error('Failed to fetch repositories.');
//     }
// }

// const CreateRepository = FormSchema.omit({});

// export async function createRepository(formData: FormData) {
//     const repository = CreateRepository.parse({
//         id: randomUUID(),
//         user_id: formData.get('user_id'),
//         name: formData.get('name'),
//         github_owner: formData.get('github_owner'),
//         github_repo: formData.get('github_repo'),
//         created_at: new Date().toISOString(),
//         updated_at: new Date().toISOString(),
//     })

//     try {
//         await fetch('http://localhost:3000/api/repositories', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(repository)
//         }).then(res => res.json());
//     } catch (error) {
//         return {
//             message: 'Database Error: Failed to Create Invoice.',
//         };
//     }

//     revalidatePath('/dashboard/repositories');
//     redirect('/dashboard/repositories');
// }

// const UpdateRepository = FormSchema.omit({ id: true, created_at: true});

// export async function updateRepository(id: string, formData: FormData) {
//     const repository = UpdateRepository.parse({
//         user_id: formData.get('user_id'),
//         name: formData.get('name'),
//         github_owner: formData.get('github_owner'),
//         github_repo: formData.get('github_repo'),
//         updated_at: new Date().toISOString(),
//     })

//     try {
//         await fetch(`http://localhost:3000/api/repositories/${id}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(repository)
//         }).then(res => res.json());
//     } catch (error) {
//         return {
//             message: 'Database Error: Failed to Update Invoice.',
//         };
//     }

//     revalidatePath('/dashboard/repositories');
//     redirect('/dashboard/repositories');
// }