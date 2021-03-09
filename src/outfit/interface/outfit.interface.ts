import { Document } from 'mongoose';

export interface Outfit extends Document {
  readonly id?: string;
  readonly outfit_image: string;
  readonly outfit_name: string;
  readonly type?: string;
  readonly price: number;
}
