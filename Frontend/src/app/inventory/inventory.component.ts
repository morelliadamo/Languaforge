import { StoreItem } from './../interfaces/StoreItem';
import { Component, inject } from '@angular/core';
import { StoreService } from '../services/store.service';
import { AuthServiceService } from '../services/auth-service.service';
import { UserXItem, UserXItemInventory } from '../interfaces/UserXItem';
import { User } from '../interfaces/User';
import {Router} from '@angular/router';

@Component({
  selector: 'app-inventory',
  imports: [],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css',
})
export class InventoryComponent {


  loaded = false;

  items: UserXItemInventory[] = [];

  private storeService = inject(StoreService);
  private authService = inject(AuthServiceService);
  private router = inject(Router);


  get currentRoute(): string {
    return this.router.url;
  }


  numberOfHearts: number = 0;
  numberOfHints: number = 0;
  numberOfFreezes: number = 0;
  numberOfCourseSlots: number = 0;

  ngOnInit() {


    const userId = Number(this.authService.getCurrentUserId());
    if (!userId) return;

    this.storeService.getUserItems(userId).subscribe({
      next: (items) => {
        console.log("items: "+items);
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



          switch (i.itemId){
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
      hints1: '💡'
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
