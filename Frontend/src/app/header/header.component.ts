import {Component, inject, Input} from '@angular/core';
import {AuthServiceService} from '../services/auth-service.service';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    NgIf
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {

  authService = inject(AuthServiceService);
  router = inject(Router);

  isLoggedIn: boolean = this.authService.isLoggedIn();


  logout(): void {
    this.authService.logout();

    this.router.navigate(['/login']);
  }
}
