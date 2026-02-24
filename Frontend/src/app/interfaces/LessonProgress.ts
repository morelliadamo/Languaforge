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
  completedAt: string | null;
  createdAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
  lessonCompleted: boolean;
}
