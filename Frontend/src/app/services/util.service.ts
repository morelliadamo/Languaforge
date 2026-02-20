import { Injectable } from '@angular/core';
import { LessonProgress } from '../interfaces/LessonProgress';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  stringToColor(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    const h = Math.abs(hash) % 360;
    const s = 75 + (Math.abs(hash >> 8) % 16);
    const l = 55 + (Math.abs(hash >> 12) % 16);

    return `hsl(${h}, ${s}%, ${l}%)`;
  }

  aggregateLessonProgressByDate(
    lessonProgresses: LessonProgress[],
  ): Map<string, number> {
    const activityMap = new Map<string, number>();

    lessonProgresses.forEach((progress) => {
      if (progress.updatedAt) {
        const updateDate = this.formatDate(new Date(progress.updatedAt));
        activityMap.set(updateDate, (activityMap.get(updateDate) || 0) + 1);
      }

      if (progress.completedAt && progress.lessonCompleted) {
        const completionDate = this.formatDate(new Date(progress.completedAt));
        const updateDate = progress.updatedAt
          ? this.formatDate(new Date(progress.updatedAt))
          : null;
        if (completionDate !== updateDate) {
          activityMap.set(
            completionDate,
            (activityMap.get(completionDate) || 0) + 1,
          );
        }
      }
    });

    return activityMap;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
