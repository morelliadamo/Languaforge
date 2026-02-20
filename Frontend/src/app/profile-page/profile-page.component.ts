import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-profile-page',
  imports: [HeaderComponent, FooterComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css',
})
export class ProfilePageComponent {
  isEditing = false;

  profile = {
    name: 'Katalin Magyar',
    email: 'katalin@example.com',
    bio: 'Passionate English learner from Budapest hu | Currently working on improving my business English skills.',
    avatar: 'https://i.pravatar.cc/150?img=47', // placeholder avatar
    streak: 7,
    badges: 12,
    friends: 4,
  };

  toggleEdit() {
    this.isEditing = !this.isEditing;
  }

  onAvatarChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.profile.avatar = reader.result as string;
    };
    reader.readAsDataURL(input.files[0]);
  }

  saveChanges() {
    this.isEditing = false;
  }
}
