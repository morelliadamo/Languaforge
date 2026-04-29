import { computed, inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, filter, map, Subject, tap } from 'rxjs';
import { AchievementUnlockedDTO } from '../interfaces/AchievementUnlocked';
import { Achievement } from '../interfaces/UserProfile';
import { RxStompService } from './rx-stomp-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { AuthServiceService } from './auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class AchievementService {
  private apiUrl = 'http://localhost:8080/userXachievements';
  private apiUrl2 = 'http://localhost:8080/achievements';

  private unlockedQueue = new BehaviorSubject<AchievementUnlockedDTO | null>(
    null,
  );

  private unlockedSignal = signal<AchievementUnlockedDTO | null>(null);

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
  }

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

  loadUnearnedAchievements(userId: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.get<Achievement[]>(
      `${this.apiUrl}/user/${userId}/unearned`,
      {
        headers,
      },
    );
  }

  createUserXAchievement(userId: number, achievementId: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<any>(
      `${this.apiUrl}/createUserXAchievement`,
      { userId, achievementId },
      { headers },
    );
  }

  hardDeleteUserXAchievement(id: number) {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.delete<void>(
      `${this.apiUrl}/hardDeleteUserXAchievement/${id}`,
      { headers },
    );
  }

  clearNewUnlock() {
    this.unlockedQueue.next(null);
  }

  getAllAchievements() {
    const token = localStorage.getItem('access-token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(`${this.apiUrl2}/`, { headers });
  }

  softDeleteAchievement(id: number) {
    const token = localStorage.getItem('access-token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.patch<Achievement>(
      `${this.apiUrl2}/softDeleteAchievement/${id}`,
      null,
      { headers },
    );
  }

  restoreAchievement(id: number) {
    const token = localStorage.getItem('access-token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.patch<Achievement>(
      `${this.apiUrl2}/restoreAchievement/${id}`,
      null,
      { headers },
    );
  }

  updateAchievement(id: number, body: Achievement) {
    const token = localStorage.getItem('access-token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<Achievement>(
      `${this.apiUrl2}/updateAchievement/${id}`,
      body,
      { headers },
    );
  }

  createAchievement(body: Achievement) {
    const token = localStorage.getItem('access-token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http.post<Achievement>(
      `${this.apiUrl2}/createAchievement`,
      body,
      { headers },
    );
  }
}
