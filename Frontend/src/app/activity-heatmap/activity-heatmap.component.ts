import { Component, inject, OnInit } from '@angular/core';
import { LessonProgressService } from '../services/lesson-progress.service';
import { UtilService } from '../services/util.service';

interface HeatmapDay {
  date: Date;
  count: number;
  dateString: string;
}

interface HeatmapWeek {
  weekIndex: number;
  days: HeatmapDay[];
}

interface HeatmapMonth {
  name: string;
  startWeek: number;
  endWeek: number;
  index: number;
}

@Component({
  selector: 'app-activity-heatmap',
  imports: [],
  templateUrl: './activity-heatmap.component.html',
  styleUrl: './activity-heatmap.component.css',
})
export class ActivityHeatmapComponent implements OnInit {
  private lessonProgressService = inject(LessonProgressService);
  private utilService = inject(UtilService);

  heatmapData: HeatmapWeek[] = [];
  heatmapMonths: HeatmapMonth[] = [];
  weekDays: string[] = ['Hé', 'Ke', 'Sze', 'Csü', 'Pé', 'Szo', 'Va'];
  activityData: Map<string, number> = new Map();

  ngOnInit(): void {
    this.generateHeatmapStructure();
    this.loadActivityData();
  }

  generateHeatmapStructure(): void {
    const weeks: HeatmapWeek[] = [];
    const months: HeatmapMonth[] = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setFullYear(startDate.getFullYear() - 1);

    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    let currentDate = new Date(startDate);
    let weekIndex = 0;
    let currentMonth = -1;
    let monthStartWeek = 0;

    while (currentDate <= today) {
      const week: HeatmapDay[] = [];

      for (let i = 0; i < 7; i++) {
        const dateString = this.formatDate(currentDate);
        const count = this.activityData.get(dateString) || 0;

        week.push({
          date: new Date(currentDate),
          count: count,
          dateString: dateString,
        });

        const month = currentDate.getMonth();
        if (month !== currentMonth) {
          if (currentMonth !== -1) {
            months.push({
              name: this.getMonthName(currentMonth),
              startWeek: monthStartWeek,
              endWeek: weekIndex - 1,
              index: currentMonth,
            });
          }
          currentMonth = month;
          monthStartWeek = weekIndex;
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      weeks.push({
        weekIndex: weekIndex,
        days: week,
      });

      weekIndex++;
    }

    if (currentMonth !== -1) {
      months.push({
        name: this.getMonthName(currentMonth),
        startWeek: monthStartWeek,
        endWeek: weekIndex - 1,
        index: currentMonth,
      });
    }

    this.heatmapData = weeks;
    this.heatmapMonths = months;
  }

  loadActivityData(): void {
    const userId = Number(localStorage.getItem('user_id'));

    this.lessonProgressService.loadLessonProgressesByUserId(userId).subscribe({
      next: (lessonProgresses) => {
        this.activityData =
          this.utilService.aggregateLessonProgressByDate(lessonProgresses);
        this.generateHeatmapStructure();
      },
      error: (error) => {
        console.error('Error loading lesson progress data:', error);
      },
    });
  }

  formatDate(date: Date): string {
    return this.utilService.formatDate(date);
  }

  getMonthName(monthIndex: number): string {
    const months = [
      'Jan',
      'Feb',
      'Már',
      'Ápr',
      'Máj',
      'Jún',
      'Júl',
      'Aug',
      'Szep',
      'Okt',
      'Nov',
      'Dec',
    ];
    return months[monthIndex];
  }

  getHeatmapCellClass(count: number): string {
    if (count === 0) {
      return 'bg-gray-100 border border-gray-200';
    } else if (count <= 2) {
      return 'bg-sky-200';
    } else if (count <= 5) {
      return 'bg-sky-400';
    } else if (count <= 10) {
      return 'bg-sky-600';
    } else {
      return 'bg-sky-800';
    }
  }

  getHeatmapTooltip(day: HeatmapDay): string {
    const dateStr = day.date.toLocaleDateString('hu-HU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    if (day.count === 0) {
      return `${dateStr}: Nincs aktivitás`;
    } else if (day.count === 1) {
      return `${dateStr}: 1 tevékenység`;
    } else {
      return `${dateStr}: ${day.count} tevékenység`;
    }
  }

  getTotalActivityCount(): number {
    let total = 0;
    this.activityData.forEach((count) => {
      total += count;
    });
    return total;
  }

  isFirstWeekOfMonth(weekIndex: number): boolean {
    return this.heatmapMonths.some((month) => month.startWeek === weekIndex);
  }

  getMonthForWeek(weekIndex: number): string {
    const month = this.heatmapMonths.find(
      (month) => month.startWeek === weekIndex,
    );
    return month ? month.name : '';
  }
}
