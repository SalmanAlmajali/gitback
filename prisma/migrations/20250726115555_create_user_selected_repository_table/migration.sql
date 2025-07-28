-- CreateTable
CREATE TABLE "user_selected_repositories" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "githubRepoId" BIGINT NOT NULL,
    "name" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "description" TEXT,
    "htmlUrl" TEXT NOT NULL,
    "private" BOOLEAN NOT NULL,
    "language" TEXT,
    "stargazersCount" INTEGER NOT NULL,
    "forksCount" INTEGER NOT NULL,
    "updatedAtGitHub" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_selected_repositories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_selected_repositories_userId_githubRepoId_key" ON "user_selected_repositories"("userId", "githubRepoId");

-- AddForeignKey
ALTER TABLE "user_selected_repositories" ADD CONSTRAINT "user_selected_repositories_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
