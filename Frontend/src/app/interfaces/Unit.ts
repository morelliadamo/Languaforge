import {Lesson} from './Lesson';

export interface Unit {
  id: number;
  courseId: number;
  lessons: Lesson[];
  title: string;
  orderIndex: number;
  createdAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
}
