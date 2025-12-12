import {Component, inject, Input} from '@angular/core';
import {AuthServiceService} from '../services/auth-service.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {

  authService = inject(AuthServiceService);
  router = inject(Router);

  logout(): void {
    this.authService.logout();

    // Verify tokens are removed
    console.log('Access token:', localStorage.getItem('access_token')); // Should be null
    console.log('Refresh token:', localStorage.getItem('refresh_token')); // Should be null

    this.router.navigate(['/login']);
  }
}
