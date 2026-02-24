import { StoreItem } from './StoreItem';
import { User } from './User';

export interface UserXItem {
  id: number | null;
  userId: number;
  user: User | null;
  itemId: number;
  item: StoreItem | null;
  amount: number;
  emoji: string | null;
  label: string | null;
}

export interface UserXItemInventory {
  id: number | null;
  userId: number;
  itemId: number;
  amount: number;
  emoji: string | null;
  label: string | null;
}
