import { Document } from 'mongoose';

export enum SuscriptionState {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}


export interface ProfileUser extends Document {
  // readonly _id: string;
  readonly nombre: string;
  readonly apellido: string;
  readonly imagen?: string;
  readonly _user: string;
  readonly suscriptionState: SuscriptionState;
}