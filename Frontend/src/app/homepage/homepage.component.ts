import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { WelcomeDivComponent } from '../welcome-div/welcome-div.component';
import { CardComponent } from '../card/card.component';
import { FooterComponent } from '../footer/footer.component';
import { FriendActivityComponent } from '../friend-activity/friend-activity.component';
@Component({
  selector: 'app-homepage',
  imports: [
    HeaderComponent,
    WelcomeDivComponent,
    CardComponent,
    FooterComponent,
    FriendActivityComponent,
  ],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css',
})
export class HomepageComponent {}
