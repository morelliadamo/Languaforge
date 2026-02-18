export interface Achievement {
  id: number;
  name: string;
  description: string;
  iconUrl: string;
  createdAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
}
