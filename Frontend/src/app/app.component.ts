import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { RegisterPageComponent } from './register-page/register-page.component';
import { AchievementUnlocked } from './achievement-unlocked/achievement-unlocked';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HomepageComponent,
    RegisterPageComponent,
    AchievementUnlocked,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'Frontend';
}
