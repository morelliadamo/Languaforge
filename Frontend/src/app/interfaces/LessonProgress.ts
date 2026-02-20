import { Lesson } from './Lesson';
import { User } from './User';

export interface LessonProgress {
  id: number;
  user: User[];
  userId: number;
  lesson: Lesson[];
  lessonId: number;
  exerciseCount: number;
  completedExercises: number;
  updatedAt: string;
  createdAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
  lessonCompleted: boolean;
  completedAt: string | null;
}
