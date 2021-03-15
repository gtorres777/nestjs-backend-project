import { Document } from 'mongoose';

export enum SuscriptionState {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface VideoReference extends Document {
  readonly _videoId: string
  readonly date: Date,
  state: SuscriptionState
}

export interface TalesCompleted extends Document {
  readonly tale_id: string;
  readonly answered_correctly: string;
  readonly answered_incorrectly: string;
  times_read?: number;
}

export interface ProfileUser extends Document {
  // readonly _id: string;
  readonly name: string;
  readonly profile_image?: string;
  readonly favorite_tales?: string[];
  readonly tales_completed?: TalesCompleted[];
  readonly _user: string;
  readonly suscriptionState: SuscriptionState;
  user_videos: VideoReference[]
}
