import { Schema } from 'mongoose';
import * as bcrypt from 'mongoose-bcrypt';

export const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      bcrypt: true,
    },
  },
  { timestamps: true },
);

UserSchema.plugin(bcrypt);
