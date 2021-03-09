import { Schema, Types } from 'mongoose';

export const OutfitSchema = new Schema(
  {
    outfit_image: {
      type: String,
      required: true,
    },
    outfit_name: {
      type: String,
      required: true,
    },
    type:{
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    }
  },
  { timestamps: true },
);
