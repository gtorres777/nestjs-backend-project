import { Document } from 'mongoose';

export interface Avatar extends Document {
  readonly id?: string;
  readonly _user?: string;
  readonly avatar_name?: string;
  readonly avatar_sets?: string[];
  readonly current_style?: string;
}
