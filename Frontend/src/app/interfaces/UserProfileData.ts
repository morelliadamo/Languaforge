// export interface Achievement {
//   id: number;
//   name: string;
//   description: string;
//   iconUrl: string;
//   createdAt: string;
//   isDeleted: boolean;
//   deletedAt: string | null;
// }

import { Course, Achievement } from './UserProfile';

// export interface AchievementOfUser {
//   id: number;
//   userId: number;
//   achievement: Achievement;
//   achievementId: number;
//   earnedAt: string;
//   isDeleted: boolean;
//   deletedAt: string | null;
// }

// export interface Streak {
//   id: number;
//   currentStreak: number;
//   longestStreak: number;
//   isFrozen: boolean;
//   updatedAt: string;
//   isDeleted: boolean;
//   deletedAt: string | null;
// }

// export interface Course {
//   id: number;
//   title: string;
//   description: string;
//   createdAt: string;
//   isDeleted: boolean;
//   deletedAt: string | null;
// }

// export interface UserXCourse {
//   id: number;
//   enrolledAt: string;
//   completedAt: string | null;
//   progress: number;
//   course: Course;
// }

// export interface Role {
//   id: number;
//   name: string;
//   description: string;
//   createdAt: string;
//   isDeleted: boolean;
//   deletedAt: string | null;
// }

// export interface UserProfileData {
//   id: number;
//   username: string;
//   email: string;
//   achievementsOfUser: AchievementOfUser[];
//   streak: Streak;
//   userXCourses: UserXCourse[];
//   role: Role;
//   roleId: number;
//   isActive: boolean;
//   createdAt: string;
//   lastLogin: string;
//   deleted: boolean;
//   deletedAt: string | null;
//   anonymized: boolean;
//   anonymizedAt: string | null;
// }

export interface UserProfileData {
  currentStreak: number;
  longestStreak: number;
  completedCourses: Course[];
  achievements: Achievement[];
  achievementCount: number;
  avatarUrl: string | null;
  bio: string | null;
  username: string;
}
