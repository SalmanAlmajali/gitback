-- CreateEnum
CREATE TYPE "IssueType" AS ENUM ('bug', 'feature', 'other');

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100),
    "email" VARCHAR(150) NOT NULL,
    "github_token" TEXT,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Repository" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "github_owner" VARCHAR(100) NOT NULL,
    "github_repo" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Repository_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackIssue" (
    "id" UUID NOT NULL,
    "repository_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "IssueType" NOT NULL DEFAULT 'other',
    "github_issue_number" INTEGER,
    "github_url" TEXT,
    "synced" BOOLEAN NOT NULL DEFAULT false,
    "created_by" VARCHAR(100),
    "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedbackIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIFeedbackLog" (
    "id" UUID NOT NULL,
    "feedback_issue_id" UUID NOT NULL,
    "ai_summary" TEXT,
    "ai_tags" TEXT,
    "processed_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIFeedbackLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Repository" ADD CONSTRAINT "Repository_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackIssue" ADD CONSTRAINT "FeedbackIssue_repository_id_fkey" FOREIGN KEY ("repository_id") REFERENCES "Repository"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIFeedbackLog" ADD CONSTRAINT "AIFeedbackLog_feedback_issue_id_fkey" FOREIGN KEY ("feedback_issue_id") REFERENCES "FeedbackIssue"("id") ON DELETE CASCADE ON UPDATE CASCADE;
