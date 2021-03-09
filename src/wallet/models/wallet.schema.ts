import { Schema, Types } from 'mongoose';

export const WalletSchema = new Schema(
  {
    _user: {
      type: Types.ObjectId,
      ref: "User",
      required: true
    },
    total_coins:{
      type: Number,
      required: false,
      default: 0,
    }
  },
  { timestamps: true },
);
