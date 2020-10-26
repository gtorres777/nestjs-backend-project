import { Document } from 'mongoose'

export enum SuscriptionState {
  "active",
  "inactive"
}

export interface User extends Document {
  readonly id?: string;
  readonly nickname: string;
  readonly nombre: string;
  readonly apellido: string;
  readonly email: string;
  readonly password: string;
  readonly imagen?: string;
  readonly suscriptionState: SuscriptionState
}

