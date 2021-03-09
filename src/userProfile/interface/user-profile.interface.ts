import { Document } from 'mongoose';

export enum SuscriptionState {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}


export interface ProfileUser extends Document {
  // readonly _id: string;
  readonly name: string;
  readonly last_name: string;
  readonly profile_image?: string;
  readonly tales_completed?: string[];
  readonly _user: string;
  readonly suscriptionState: SuscriptionState;
}
