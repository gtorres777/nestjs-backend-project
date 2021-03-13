import { Document } from 'mongoose';

export enum SuscriptionState {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface TalesCompleted extends Document {
  readonly tale_id: string;
  readonly answered_correctly: string;
  readonly answered_incorrectly: string;
  readonly times_read?: number;
}

export interface ProfileUser extends Document {
  // readonly _id: string;
  readonly name: string;
  readonly profile_image?: string;
  readonly favorite_tales?: string[];
  readonly tales_completed?: TalesCompleted[];
  readonly _user: string;
  readonly suscriptionState: SuscriptionState;
}
