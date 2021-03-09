import { Schema, Types } from 'mongoose';

const avatar_normal = 'Avatar1_normal.png';

export const AvatarSchema = new Schema(
  {
    _user: {
      type: Types.ObjectId,
      ref: "User",
      required: true
    },
    avatar_name: {
      type: String,
      required: false,
      default: "Zorro"
    },
    avatar_sets: {
      type: [String],
      required: false,
      default: avatar_normal
    },
    current_style: {
      type: String,
      required: false,
      default: avatar_normal
    }
  },
  { timestamps: true },
);
