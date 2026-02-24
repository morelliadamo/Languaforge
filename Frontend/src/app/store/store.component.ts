import { Component, inject } from '@angular/core';
import { StoreItem } from '../interfaces/StoreItem';
import { StoreService } from '../services/store.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { BuyItemComponent } from '../buy-item/buy-item.component';
@Component({
  selector: 'app-store',
  imports: [HeaderComponent, FooterComponent, BuyItemComponent],
  templateUrl: './store.component.html',
  styleUrl: './store.component.css',
})
export class StoreComponent {
  storeItems: StoreItem[] = [];

  private storeService = inject(StoreService);
  buyingItem: boolean = false;
  boughtItem: StoreItem | null = null;

  buy(item: StoreItem) {
    this.boughtItem = item;
    this.buyingItem = true;
  }

  ngOnInit() {
    this.storeService.getStoreItems().subscribe((items) => {
      this.storeItems = items;
    });
  }

  getEmoji(type: string): string {
    const map: Record<string, string> = {
      hearts5: '❤️',
      hearts10: '❤️❤️',
      hearts25: '❤️✨',
      hints5: '💡',
      hints10: '💡💡',
      hints25: '💡✨',
      freeze: '🧊',
      course_slot: '📦',
    };
    return map[type] ?? 'missing icon!';
  }

  getBadge(type: string): string | null {
    const map: Record<string, string> = {
      hearts10: 'NÉPSZERŰ',
      hearts25: 'LEGJOBB AJÁNLAT',
      hints25: 'NÉPSZERŰ',
    };
    return map[type] ?? null;
  }

  getBadgeClass(type: string): string {
    const map: Record<string, string> = {
      hearts10: 'bg-blue-100 text-blue-700',
      hearts25: 'bg-green-100 text-green-700',
      hints25: 'bg-blue-100 text-blue-700',
    };
    return map[type] ?? 'bg-gray-100 text-gray-700';
  }
}
