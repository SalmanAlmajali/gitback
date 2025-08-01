import { Feedback, FeedbackImage, UserSelectedRepository } from "@prisma/client";

export type FeedbacksTableRow = Feedback & {
    repository: UserSelectedRepository;
};

export type FeedbackWithImages = Feedback & { images: FeedbackImage[] } & { repository: UserSelectedRepository };