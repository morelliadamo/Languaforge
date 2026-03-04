export interface UserAsFriendSearchResultDTO {
  id: number;
  username: string;
  email: string;
  avatarUrl: string | null;
  isAlreadyFriend: boolean | null;
  isRequestSentToThem: boolean | null;
  isRequestReceivedFromThem: boolean | null;
}
