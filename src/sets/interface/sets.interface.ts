import { Document } from 'mongoose';

export interface Sets extends Document {
  readonly id?: string;
  readonly set_name?: string;
  readonly avatar_image: string;
  readonly sets?: string[];
}
