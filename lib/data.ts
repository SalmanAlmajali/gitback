import postgres from "postgres";
import { RepositoriesTable, RepositoryForm } from "./definitions";
import { mockUpRepositories, mockUpUsers } from "./placeholders-data";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });
const ITEMS_PER_PAGE = 10;

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

export async function fetchFilteredRepositoriesFromLocal(
	query: string,
	currentPage: number,
) {
	try {
		await new Promise((resolve) => setTimeout(resolve, 100));
		const data = mockUpRepositories;

		const repositories = data.map((repository) => {
			const user = mockUpUsers.find(user => user.id === repository.user_id)

			console.log({ ...repository });

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