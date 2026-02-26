import { Component, inject } from '@angular/core';
import { AuthServiceService } from '../services/auth-service.service';
import { Router, RouterLink } from '@angular/router';
import { InventoryComponent } from '../inventory/inventory.component';
import { AchievementUnlocked } from '../achievement-unlocked/achievement-unlocked';

@Component({
  selector: 'app-header',
  imports: [RouterLink, InventoryComponent, AchievementUnlocked],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  authService = inject(AuthServiceService);
  router = inject(Router);

  isLoggedIn: boolean = this.authService.isLoggedIn();
  sidebarOpen: boolean = false;

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.closeSidebar();
    this.router.navigate(['/login']);
  }
}
