import { Document } from 'mongoose';

export enum ListOfSet {
  DEFAULT = "DEFAULT",
  TUXEDO = "TUXEDO",
  COWBOY = "COWBOY",
  ASTRONAUT = "ASTRONAUT"
}

export interface Avatar extends Document {
  readonly id?: string;
  readonly _user?: string;
  readonly avatar_name?: string;
  readonly avatar_sets?: ListOfSet[];
  readonly current_style?: ListOfSet;
}

