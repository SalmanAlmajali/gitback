import { Feedback, UserSelectedRepository } from "@prisma/client";

export type FeedbacksTableRow = Feedback & {
    repository: UserSelectedRepository;
};