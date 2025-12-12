import {Unit} from './Unit';

export interface Course {
  id: number;
  units: Unit[];
  title: string;
  description: string;
  createdAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
}
