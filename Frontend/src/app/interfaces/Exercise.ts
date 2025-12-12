export interface Exercise {
  id: number;
  lessonId: number;
  exerciseContent: {
    answers: string[];
    description: string;
    correctAnswer: string;
  };
  exerciseType: string;
  isDeleted: boolean;
  deletedAt: string | null;
  createdAt: string;
}
