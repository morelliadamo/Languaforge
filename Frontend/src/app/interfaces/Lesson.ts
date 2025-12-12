import {Exercise} from './Exercise';

export interface Lesson {
  id: number;
  exercises: Exercise[];
  unitId: number;
  title: string;
  orderIndex: number;
  createdAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
}
