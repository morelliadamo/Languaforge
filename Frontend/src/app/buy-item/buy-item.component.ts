import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { StoreItem } from '../interfaces/StoreItem';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthServiceService } from '../services/auth-service.service';

@Component({
  selector: 'app-buy-item',
  imports: [],
  templateUrl: './buy-item.component.html',
  styleUrl: './buy-item.component.css',
})
export class BuyItemComponent {
  @Input() item: StoreItem | null = null;
  @Output() close = new EventEmitter<void>();

  private http = inject(HttpClient);
  private authService = inject(AuthServiceService);

  purchasing = false;
  purchaseSuccess = false;
  purchaseError = '';

  getEmoji(type: string): string {
    const map: Record<string, string> = {
      hearts5: '❤️',
      hearts10: '❤️❤️',
      hearts25: '❤️✨',
      hints5: '💡',
      hints10: '💡💡',
      hints25: '💡✨',
      freeze: '🧊',
      course_slot: '📚📦',
    };
    return map[type] ?? '🛒';
  }

  onBackdropClick() {
    if (!this.purchasing) {
      this.close.emit();
    }
  }

  confirmPurchase() {
    if (!this.item || this.purchasing) return;
    this.purchasing = true;
    this.purchaseError = '';

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const userId = this.authService.getCurrentUserId();

    this.http
      .post(
        `http://localhost:8080/userXitems/createUserXItem`,
        { itemId: this.item.id, userId: Number(userId) },
        { headers },
      )
      .subscribe({
        next: () => {
          this.purchasing = false;
          this.purchaseSuccess = true;
        },
        error: (err) => {
          this.purchasing = false;
          this.purchaseError =
            err.error?.message ?? 'Hiba történt a vásárlás során.';
        },
      });
  }
}
