import { computed, inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, filter, map, Subject, tap } from 'rxjs';
import { AchievementUnlockedDTO } from '../interfaces/AchievementUnlocked';
import { Achievement } from '../interfaces/UserProfile';
import { RxStompService } from './rx-stomp-service';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class AchievementService {
  private apiUrl = 'http://localhost:8080/userXachievements';

  private unlockedQueue = new BehaviorSubject<AchievementUnlockedDTO | null>(
    null,
  );

  private unlockedSignal = signal<AchievementUnlockedDTO | null>(null);

  // Public read-only signal
  unlocked = this.unlockedSignal.asReadonly();

  earnedAchievements = signal<Achievement[]>([]);

  hasNewUnlock = computed(() => this.unlockedQueue.value !== null);
  private authService = inject(AuthServiceService);

  constructor(
    private rxStomp: RxStompService,
    private http: HttpClient,
    private toastr: ToastrService,
  ) {
    this.connectWebSocket();
    this.loadEarnedAchievements();
  }

  // private connectWebSocket() {
  //   this.rxStomp
  //     .watch('user/topic/achievements/unlocked')
  //     .pipe(
  //       map((message) => JSON.parse(message.body) as AchievementUnlockedDTO),
  //       filter((achievement) => !!achievement?.id),
  //     )
  //     .subscribe((unlocked) => {
  //       this.handleNewUnlock(unlocked);
  //     });
  // }
  private connectWebSocket() {
    this.rxStomp
      .watch('/topic/achievements/unlocked')
      .pipe(
        map((message) => {
          console.log('RAW MESSAGE BODY:', message.body);
          return JSON.parse(message.body);
        }),
        tap((parsed) => console.log('PARSED:', parsed)),
        map((parsed) => parsed as AchievementUnlockedDTO),
      )
      .subscribe((unlocked) => {
        console.log('SUBSCRIBE TRIGGERED:', unlocked);
        this.handleNewUnlock(unlocked);
      });
  }

  private handleNewUnlock(unlocked: AchievementUnlockedDTO) {
    // Update your signal so the component reacts
    this.unlockedSignal.set(unlocked);

    // Optional: keep the queue if you want
    this.unlockedQueue.next(unlocked);

    // Auto-clear after 8s
    setTimeout(() => this.unlockedSignal.set(null), 8000);
    setTimeout(() => this.unlockedQueue.next(null), 8000);

    // Load earned achievements
    this.loadEarnedAchievements();

    // Remove toastr if you no longer want it
    // this.toastr.success(...);
  }
  // private handleNewUnlock(unlocked: AchievementUnlockedDTO) {
  //   this.unlockedQueue.next(unlocked);
  //   setTimeout(() => this.unlockedQueue.next(null), 8000);

  //   this.toastr.success(
  //     // unlocked.description || 'Szép munka! Egy új Teljesítményt értél el!',
  //     // `Feloldott Teljesítmény: ${unlocked.name}`,
  //     // {
  //     //   timeOut: 8000,
  //     //   positionClass: 'toast-top-center',
  //     //   progressBar: true,
  //     //   closeButton: true,
  //     //   tapToDismiss: false,
  //     //   enableHtml: true,
  //     // },
  //     unlocked.description || 'Szép munka! Egy új Teljesítményt értél el!',
  //     `Feloldott Teljesítmény: ${unlocked.name}`,
  //     {
  //       enableHtml: true,
  //       html: `<div style="display: flex; align-items: center;"><img src="${unlocked.iconUrl}" alt="${unlocked.name}" style="width: 24px; height: 24px; margin-right: 8px;">${unlocked.description}</div>`,
  //     },
  //   );
  //   this.loadEarnedAchievements();
  // }

  private loadEarnedAchievements() {
    this.http
      .get<
        Achievement[]
      >(`${this.apiUrl}/user/${Number(this.authService.getCurrentUserId())}`)
      .subscribe({
        next: (achievements) => {
          this.earnedAchievements.set(achievements);
        },
        error: (err) => {
          console.error('Failed to load earned achievements', err);
        },
      });
  }

  clearNewUnlock() {
    this.unlockedQueue.next(null);
  }

  debugTriggerFakeUnlock() {
    const fakeUnlock: AchievementUnlockedDTO = {
      id: 1,
      name: 'Első Lépések',
      description: 'Teljesítetted az első leckédet!',
      iconUrl: 'https://example.com/icons/first_steps.png',
      earnedAt: new Date().toISOString(),
    };

    this.handleNewUnlock(fakeUnlock);
  }
}
