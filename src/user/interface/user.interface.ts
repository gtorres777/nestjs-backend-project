import { Document } from 'mongoose';

export interface User extends Document {
  readonly name?: string;
  readonly email?: string;
  password?: string;
  verifyPassword?: (string) => Promise<boolean>;
}
