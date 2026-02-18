export interface Friendship {
  id: number;
  user1_id: number;
  user2_id: number;
  status: 'pending' | 'accepted' | 'rejected';

  user1_name: null | string;
  user2_name: null | string;
}
