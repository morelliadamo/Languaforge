import {
  AchievementOfUser,
  LoginData,
  Streak,
  UserXCourse,
} from './UserProfile';

export interface User {
  id: number;
  username: string;
  email: string;
  roleId: number;
  avatarUrl: string | null | undefined;
  bio: string | null;
  createdAt?: string;
  lastLogin?: string;
  deleted?: boolean;
  deletedAt?: string | null;
  isActive?: boolean;
  role?: any;
  achievementsOfUser?: null | AchievementOfUser[];
  streak?: Streak | null;
  userXCourses?: UserXCourse[];
  loginDataList?: LoginData[];
  leaderboardList?: any[];
  lessonProgresses?: any[];
  reviews?: any[];
  scores?: any[];
}
