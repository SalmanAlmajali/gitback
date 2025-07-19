import { Repository } from "./repositories/definitions";
import { User } from "./users/definitions";

export const mockUpUsers: User[] = [
    {
        id: 'c56a27b5-487a-4e2e-8d39-973dc5031d68',
        name: 'Salman Al Majali',
        email: 'undermod007@gmail.com',
        githubToken: null,
        createdAt: '2025-07-12 13:07:52.410016',
        updatedAt: '2025-07-12 13:07:52.410016',
    },
];

export const mockUpRepositories: Repository[] = [
    {
        id: "a5cf801c-d47c-4280-b1f6-75869dfa2e85",
        userId: "c56a27b5-487a-4e2e-8d39-973dc5031d68",
        name: "Nextjs Dashboard",
        githubOwner: "SalmanAlmajali",
        githubRepo: "nextjs-dashboard",
        createdAt: "2025-07-16T13:10:07.272Z",
        updatedAt: "2025-07-16T13:10:07.272Z",
    },
];