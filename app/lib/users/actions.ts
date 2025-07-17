import { User, UserField } from "./definitions";

export async function fetchUsersFromAPI() {

    try {
        const response = await fetch(`http://localhost:3000/api/users`)
            .then(res => res.json())

        const repositories = <UserField[]>response.map((user: User) => {
            return user;
        });

        return repositories;
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch repositories.');
    }
}