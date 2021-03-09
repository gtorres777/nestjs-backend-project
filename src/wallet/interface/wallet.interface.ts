import { Document } from 'mongoose';

export interface Wallet extends Document {
  readonly id?: string;
  readonly _user: string;
  readonly total_coins: number;
}
