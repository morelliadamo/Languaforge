import { Component } from '@angular/core';

interface FriendActivity {
  name: string;
  action: string;
  time: string;
  avatar: string;
}

@Component({
  selector: 'app-friend-activity',
  standalone: true,
  templateUrl: './friend-activity.component.html',
})
export class FriendActivityComponent {
  activities: FriendActivity[] = [
    {
      name: 'Katalin M.',
      action: 'completed "Advanced Grammar"',
      time: '2h ago',
      avatar: '👩',
    },
    {
      name: 'Péter S.',
      action: 'started "Business English"',
      time: '3h ago',
      avatar: '👦',
    },
    {
      name: 'Anna K.',
      action: 'earned "Streak Master" badge',
      time: '5h ago',
      avatar: '👩',
    },
  ];
}
