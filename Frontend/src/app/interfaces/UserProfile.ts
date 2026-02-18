export interface UserProfile {
  id: number;
  username: string;
  email: string;
  roleId: number;
  role: Role;
  isActive: boolean;
  createdAt: string;
  lastLogin: string;
  deleted: boolean;
  deletedAt: string | null;
  anonymized: boolean;
  anonymizedAt: string | null;
  activationToken: string | null;
  passwordHash: string;
  streak: Streak;
  userXCourses: UserXCourse[];
  achievementsOfUser: AchievementOfUser[];
  loginDataList: LoginData[];
  leaderboardList: any[];
  lessonProgresses: any[];
  reviews: any[];
  scores: any[];
}

export interface Streak {
  id: number;
  currentStreak: number;
  longestStreak: number;
  isFrozen: boolean;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
  hibernateLazyInitializer: any;
}

export interface UserXCourse {
  id: number;
  enrolledAt: string;
  completedAt: string | null;
  progress: number;
  course: Course;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  createdAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
  hibernateLazyInitializer: any;
}

export interface AchievementOfUser {
  id: number;
  userId: number;
  achievementId: number;
  achievement: Achievement;
  earnedAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  iconUrl: string;
  createdAt: string;
  isDeleted: boolean;
  deletedAt: string | null;
  hibernateLazyInitializer: any;
}

export interface LoginData {
  id: number;
  userId: number;
  loginTime: string;
  deviceInfo: string | null;
  ipAddress: string | null;
  sessionToken: string | null;
  expiresAt: string | null;
  isAnonymized: boolean;
  anonymizedAt: string | null;
  isDeleted: boolean;
  deletedAt: string | null;
}

export interface UserProfileData {
  currentStreak: number;
  longestStreak: number;
  completedCourses: Course[];
  achievements: Achievement[];
  achievementCount: number;
}
