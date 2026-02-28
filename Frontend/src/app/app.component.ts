import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { AchievementUnlocked } from './achievement-unlocked/achievement-unlocked';
import { StreakService } from './services/streak-service';
import { AuthServiceService } from './services/auth-service.service';
import { StreakChangedComponent } from './streak-changed/streak-changed';
import { Streak } from './interfaces/UserProfile';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AchievementUnlocked, StreakChangedComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Frontend';
  private streakService = inject(StreakService);
  private authService = inject(AuthServiceService);
  streak: Streak | null = null;

  showStreakMessageSad: boolean = false;
  showStreakMessageHappy: boolean = false;

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.streakService
        .fixStreakByUserId(this.authService.getCurrentUserId()!)
        .subscribe({
          next: (streak) => {
            this.streak = streak;
            console.log('Streak fixed/updated:', streak);
            if (streak.currentStreak == 0) {
              this.showStreakMessageSad = true;
            }
          },
          error: (error) => {
            console.error('Error fixing/updating streak:', error);
          },
        });
    }
  }
}
