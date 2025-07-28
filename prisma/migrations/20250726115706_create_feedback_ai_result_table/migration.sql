-- CreateTable
CREATE TABLE "FeedbackAIResult" (
    "id" TEXT NOT NULL,
    "aiTitle" TEXT,
    "aiSummary" TEXT,
    "stepsToReproduce" TEXT,
    "expectedBehavior" TEXT,
    "modelUsed" TEXT NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "rawResponse" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedbackAIResult_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_feedbackAIResultId_fkey" FOREIGN KEY ("feedbackAIResultId") REFERENCES "FeedbackAIResult"("id") ON DELETE CASCADE ON UPDATE CASCADE;
