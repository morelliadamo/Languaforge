import {Course} from './Course';
import {User} from './User';

export interface UserCourse {
  id: number;
  course: Course;
  user: User;
  progress: number;
  enrolledAt: string;
  completedAt: string | null;
}
