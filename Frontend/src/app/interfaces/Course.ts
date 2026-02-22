import { Unit } from './Unit';

export interface Course {
  id: number;
  title: string;
  description: string;
  difficulty: number | string | null;
  createdAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
  units: Unit[];
  color: string | null;
  progress: number;
  reviews: any[] | null;
}
