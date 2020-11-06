import { Document } from 'mongoose';

export enum SuscriptionState {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface User extends Document {
  readonly email: string;
  readonly password: string;
  verifyPassword: (string) => Promise<boolean>;
}

export interface ProfileUser extends Document {
  // readonly _id: string;
  readonly nombre: string;
  readonly apellido: string;
  readonly imagen?: string;
  readonly _user: string;
  readonly suscriptionState: SuscriptionState;
}
