import { UtilService } from './../services/util.service';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  effect,
  inject,
} from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import confetti from 'canvas-confetti';

export interface StreakEvent {
  currentStreak: number;
  longestStreak: number;
  isReset: boolean;
  message?: string;
}

@Component({
  selector: 'app-streak-changed',
  standalone: true,
  imports: [NgClass],
  templateUrl: './streak-changed.html',
  styleUrl: './streak-changed.css',
})
export class StreakChangedComponent {
  @Input() streakEvent: StreakEvent | null = null;
  @Output() closed = new EventEmitter<void>();

  positiveMessageList: string[] = [
    'Szuper, csak így tovább!',
    'Minden nap egy lépés a célod felé!',
    'Kitartásod inspiráló!',
    'Ez már egy szép sorozat!',
    'Ne hagyd abba, fantasztikus vagy!',
    'Minden nap egy új esély a fejlődésre!',
    'A kitartásod csodálatra méltó!',
    'Ez már egy komoly streak!',
    'Minden nap egy új győzelem!',
    'Ne add fel, fantasztikus vagy!',
    'Oh ezaz bébi, nyomjad még tövig!',
  ];

  positiveMessage =
    this.positiveMessageList[
      Math.floor(Math.random() * this.positiveMessageList.length)
    ];

  negativeMessageList: string[] = [
    'Ne aggódj, mindenki hibázik néha!',
    'Minden nap egy új esély a javításra!',
    'Nem baj, a lényeg, hogy újrakezded!',
    'Mindenki elesik néha, a fontos, hogy felállj!',
    'Ne hagyd, hogy egy kis bukás megállítson!',
    'Ez csak egy apró akadály a nagy célod felé!',
    'Mindenki hibázik, a lényeg, hogy tanulj belőle!',
    'Kalapács lesz az agyadban barátom.',
    'Olyan vagy, mint a tavalyi kos',
    'Szívizom-ficamod legyen!',
    'Te nagyon buta vagy!',
    'Nem hiszem el, hogy ezt elrontottad',
    'Ez nagyon ciki, de ne aggódj, újrakezdheted!',
  ];

  negativeMessage =
    this.negativeMessageList[
      Math.floor(Math.random() * this.negativeMessageList.length)
    ];

  private utilService = inject(UtilService);

  visible = signal(true);
  fading = signal(false);

  private hideTimeout: any;
  constructor() {
    effect(() => {
      if (this.streakEvent) {
        this.visible.set(true);

        if (!this.streakEvent.isReset) {
          setTimeout(() => this.shootConfetti(), 200);
        } else {
          setTimeout(() => this.shootSadConfetti(1), 200);
          setTimeout(() => this.shootSadConfetti(-1), 400);
        }

        setTimeout(() => this.hide(), 6500);
      }

      this.hideTimeout = setTimeout(() => this.hide(), 6500);
    });
  }

  hide() {
    if (!this.visible()) return;
    if (this.streakEvent?.isReset) {
      this.utilService.playAudio('Audio/streakFail.mp3');
    } else {
      this.utilService.playAudio('Audio/streakSuccess.mp3');
    }
    clearTimeout(this.hideTimeout);
    this.fading.set(true);

    setTimeout(() => {
      this.visible.set(false);
      this.fading.set(false);
      setTimeout(() => this.closed.emit(), 500);
    }, 4000);
  }

  private shootConfetti() {
    const duration = 3000;
    const end = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 8,
        angle: 90,
        spread: 45,
        origin: { y: 0.6 },
        colors: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96c93d'],
        zIndex: 9999,
      });
    }, 150);
  }

  private shootSadConfetti(driftControl: number) {
    confetti({
      particleCount: 400,
      angle: 90,
      spread: 10,
      startVelocity: 15,
      decay: 0.94,
      gravity: 1,
      drift: driftControl,
      ticks: 200,
      origin: { y: 0.3 },
      colors: ['#6b7280', '#780606', '#374151', '#780606'],
      shapes: ['square'],
      scalar: 0.8,
      zIndex: 9999,
    });
  }
}
