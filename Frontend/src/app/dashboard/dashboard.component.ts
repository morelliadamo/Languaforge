import { Component } from '@angular/core';
import { FriendActivityComponent } from '../friend-activity/friend-activity.component';
import { CardComponent } from '../card/card.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    FriendActivityComponent,
    CardComponent,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {}
