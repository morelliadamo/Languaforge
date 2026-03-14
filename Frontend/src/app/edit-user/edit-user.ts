import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoginData } from '../interfaces/UserProfile';

@Component({
  selector: 'app-edit-user',
  imports: [],
  templateUrl: './edit-user.html',
  styleUrl: './edit-user.css',
})
export class EditUser {
  @Input() user!: LoginData;
  @Output() close = new EventEmitter<void>();

  onBackdropClick() {
    this.close.emit();
  }

  onAvatarError(event: Event) {
    (event.target as HTMLImageElement).src =
      'https://ui-avatars.com/api/?name=' +
      encodeURIComponent(this.user.user.username) +
      '&background=e0f2fe&color=0284c7&size=128';
  }
}
