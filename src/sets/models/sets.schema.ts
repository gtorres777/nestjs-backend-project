import { Schema, Types } from 'mongoose';

export const SetsSchema = new Schema(
  {
    set_name: {
      type: String,
      required: false,
      default: "normal_set"
    },
    avatar_image: {
      type: String,
      required: true
    },
    sets: {
      type: [String],
      required: false
    }
  },
  { timestamps: true },
);
