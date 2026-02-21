export interface User {
  id: number;
  username: string;
  email: string;
  roleId: number;
  avatarUrl: string | null | undefined;
  bio: string | null;
}
