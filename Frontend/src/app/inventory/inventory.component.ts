import { StoreItem } from './../interfaces/StoreItem';
import { Component, inject, DestroyRef } from '@angular/core';
import { StoreService } from '../services/store.service';
import { AuthServiceService } from '../services/auth-service.service';
import { UserXItem, UserXItemInventory } from '../interfaces/UserXItem';
import { User } from '../interfaces/User';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-inventory',
  imports: [],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css',
})
export class InventoryComponent {
  inventoryOpen = false;

  loaded = false;

  items: UserXItemInventory[] = [];

  private storeService = inject(StoreService);
  private authService = inject(AuthServiceService);

  private router = inject(Router);

  private destroyRef = inject(DestroyRef);

  get currentRoute(): string {
    return this.router.url;
  }

  numberOfHearts: number = 0;
  numberOfHints: number = 0;
  numberOfFreezes: number = 0;
  numberOfCourseSlots: number = 0;

  heartsChangedBy: number | null = null;
  hintsChangedBy: number | null = null;
  freezesChangedBy: number | null = null;
  courseSlotsChangedBy: number | null = null;

  ngOnInit() {
    const userId = Number(this.authService.getCurrentUserId());
    if (!userId) return;

    this.storeService.getUserItems(userId).subscribe({
      next: (items) => {
        console.log('items: ' + items);
        for (const i of items) {
          console.log(i);

          const uxi: UserXItemInventory = {
            id: i.id,
            itemId: i.itemId,
            userId: i.userId,
            amount: i.amount,
            emoji: this.getEmoji(i.storeItem.type),
            label: this.getLabel(i.storeItem.type),
          };
          this.items.push(uxi);

          switch (i.itemId) {
            case 1:
              this.numberOfHearts += i.amount;
              break;
            case 2:
              this.numberOfHints += i.amount;
              break;
            case 3:
              this.numberOfFreezes += i.amount;
              break;
            case 4:
              this.numberOfCourseSlots += i.amount;
              break;
          }
        }

        this.loaded = true;

        console.log(this.items);
        console.log(this.numberOfHearts);
      },
      error: (err) => {
        console.error('Failed to load inventory:', err);
        this.loaded = true;
      },
    });

    this.storeService.itemChanged
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(({ type, changedBy }) => {
        let target: keyof this | null = null;
        switch (type) {
          case 'hearts':
            this.numberOfHearts += changedBy;
            this.flashChangedBy('hearts', changedBy);
            break;
          case 'hints':
            this.numberOfHints += changedBy;
            this.flashChangedBy('hints', changedBy);
            break;
          case 'freezes':
            this.numberOfFreezes += changedBy;
            this.flashChangedBy('freezes', changedBy);
            break;
          case 'course_slots':
            this.numberOfCourseSlots += changedBy;
            this.flashChangedBy('courseSlots', changedBy);
            break;
        }
      });
  }

  private flashChangedByTimers: Record<string, any> = {};
  flashChangedBy(
    item: 'hearts' | 'hints' | 'freezes' | 'courseSlots',
    delta: number,
  ) {
    const key = (item + 'ChangedBy') as keyof this;
    clearTimeout(this.flashChangedByTimers[item]);
    (this as any)[key] = delta;
    this.flashChangedByTimers[item] = setTimeout(
      () => ((this as any)[key] = null),
      1500,
    );
  }

  getEmoji(type: string): string {
    const map: Record<string, string> = {
      hearts5: '❤️',
      hearts10: '❤️',
      hearts25: '❤️',
      hints5: '💡',
      hints10: '💡',
      hints25: '💡',
      freeze: '🧊',
      course_slot: '📦',
      hearts1: '❤️',
      hints1: '💡',
    };
    return map[type] || '';
  }

  getLabel(type: string): string {
    const map: Record<string, string> = {
      hearts5: 'Szív',
      hearts1: 'Szív',
      hearts10: 'Szív',
      hearts25: 'Szív',
      hints5: 'Tipp',
      hints1: 'Tipp',
      hints10: 'Tipp',
      hints25: 'Tipp',
      freeze: 'Fagyasztás',
      course_slot: 'Kurzushely',
    };
    return map[type] || '';
  }

  getAmount(type: string): number {
    const map: Record<string, number> = {
      hearts5: 5,
      hearts10: 10,
      hearts25: 25,
      hints5: 5,
      hints10: 10,
      hints25: 25,
      freeze: 1,
      course_slot: 1,
    };
    return map[type] || 0;
  }
}
