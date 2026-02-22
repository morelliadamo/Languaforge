import { Exercise } from './Exercise';

export interface Lesson {
  id: number;
  courseId: number;
  title: string;
  orderIndex: number;
  createdAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
  exercises: Exercise[];
  type: string | null;
}
