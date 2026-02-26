import confetti from 'canvas-confetti';
import { Component, effect, inject, signal } from '@angular/core';
import { AchievementService } from '../services/achievement.service';
import { AchievementUnlockedDTO } from '../interfaces/AchievementUnlocked';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-achievement-unlocked',
  imports: [DatePipe],
  templateUrl: './achievement-unlocked.html',
  styleUrl: './achievement-unlocked.css',
})
export class AchievementUnlocked {
  private achievementService = inject(AchievementService);
  currentUnlock = signal<AchievementUnlockedDTO | null>(null);

  constructor() {
    //   effect(() => {
    //     const unlock = this.achievementService.unlocked();
    //     if (unlock) {
    //       this.currentUnlock.set(unlock);

    //       setTimeout(() => {
    //         this.shootConfetti();
    //       }, 0);

    //       setTimeout(() => {
    //         if (this.currentUnlock() === unlock) {
    //           this.hide();
    //         }
    //       }, 6000);
    //     }
    //   });
    // }
    effect(() => {
      const unlock = this.achievementService.unlocked();
      if (unlock) {
        this.currentUnlock.set(unlock);

        // Confetti
        setTimeout(() => this.shootConfetti(), 0);

        // Auto-hide after 6s
        setTimeout(() => {
          if (this.currentUnlock() === unlock) {
            this.hide();
          }
        }, 6000);
      }
    });
  }

  hide() {
    this.currentUnlock.set(null);
    this.achievementService.clearNewUnlock();
  }

  private shootConfetti() {
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > animationEnd) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        zIndex: 9999,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        zIndex: 9999,
      });
    }, 200);
  }
}
