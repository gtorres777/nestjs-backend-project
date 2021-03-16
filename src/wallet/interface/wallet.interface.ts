import { Document } from 'mongoose';

export interface Wallet extends Document {
  readonly _user: string;
  total_coins: number;
}
