import { computed, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AchievementUnlockedDTO } from '../interfaces/AchievementUnlocked';
import { Achievement } from '../interfaces/UserProfile';
import { RxStompService } from './rx-stomp-service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AchievementService {
  private apiUrl = 'http://localhost:8080/achievements';

  private unlockedQueque = new BehaviorSubject<AchievementUnlockedDTO | null>(
    null,
  );
  unlockedObservable = this.unlockedQueque.asObservable();

  earnedAchievements = signal<Achievement[]>([]);

  hasNewUnlock = computed(() => this.unlockedQueque.value !== null);

  constructor(
    private rxStomp: RxStompService,
    private http: HttpClient,
    // private toastr: ToastrService,
  ) {}
}
