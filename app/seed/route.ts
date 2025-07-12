import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

async function migrateTable(props: {
    tableName: string,
    query: string,
}) {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(props.tableName)) {
        throw new Error('Invalid table name');
    }

    const cleanedQuery = props.query.replace(/,\s*$/, '');

    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS ${props.tableName} (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      ${cleanedQuery},
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export async function GET() {
    try {
        await sql.begin(() => [
            migrateTable({
                tableName: 'users',
                query: `
                    name VARCHAR(100),
                    email VARCHAR(150) UNIQUE NOT NULL,
                    github_token TEXT,
                `
            }),
            migrateTable({
                tableName: 'repositories',
                query: `
                    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                    name VARCHAR(100) NOT NULL,
                    github_owner VARCHAR(100) NOT NULL,
                    github_repo VARCHAR(100) NOT NULL,
                `
            }),
            migrateTable({
                tableName: 'feedback_issues',
                query: `
                    repository_id UUID REFERENCES repositories(id) ON DELETE CASCADE,
                    title TEXT NOT NULL,
                    description TEXT,
                    type VARCHAR(50) CHECK (type IN ('bug', 'feature', 'other')) DEFAULT 'other',
                    github_issue_number INT,
                    github_url TEXT,
                    synced BOOLEAN DEFAULT FALSE,
                    created_by VARCHAR(100),
                `
            }),
            migrateTable({
                tableName: 'ai_feedback_logs',
                query: `
                    feedback_issue_id UUID REFERENCES feedback_issues(id) ON DELETE CASCADE,
                    ai_summary TEXT,
                    ai_tags TEXT,
                    processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                `
            }),
        ]);

        return Response.json({ message: 'Database seeded successfully' });
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
}

// Table Structure

// -- 1. Users table
// CREATE TABLE users (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     name VARCHAR(100),
//     email VARCHAR(150) UNIQUE NOT NULL,
//     github_token TEXT,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// -- 2. Repositories table
// CREATE TABLE repositories (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
//     name VARCHAR(100) NOT NULL,
//     github_owner VARCHAR(100) NOT NULL,
//     github_repo VARCHAR(100) NOT NULL,
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// -- 3. Feedback issues table
// CREATE TABLE feedback_issues (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     repository_id UUID REFERENCES repositories(id) ON DELETE CASCADE,
//     title TEXT NOT NULL,
//     description TEXT,
//     type VARCHAR(50) CHECK (type IN ('bug', 'feature', 'other')) DEFAULT 'other',
//     github_issue_number INT,
//     github_url TEXT,
//     synced BOOLEAN DEFAULT FALSE,
//     created_by VARCHAR(100),
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// -- 4. AI feedback logs table (optional)
// CREATE TABLE ai_feedback_logs (
//     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//     feedback_issue_id UUID REFERENCES feedback_issues(id) ON DELETE CASCADE,
//     ai_summary TEXT,
//     ai_tags TEXT,
//     processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );
