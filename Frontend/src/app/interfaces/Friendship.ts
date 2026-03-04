export interface Friendship {
  id: number;
  user1Id: number;
  user2Id: number;
  status: 'pending' | 'accepted' | 'rejected';

  user1Name: null | string;
  user2Name: null | string;
}
