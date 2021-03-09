import { Schema, Types } from 'mongoose';

const imagen: string =
  'https://cdn.pixabay.com/photo/2015/03/26/09/47/sky-690293__340.jpg';

export const ProfileUserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },

    profile_image: {
      type: String,
      required: false,
      default: imagen,
    },
    tales_completed: {
      type: [String],
      required: false
    },
    suscription_state: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE'],
      default: 'INACTIVE',
    },
    _user: {
      type: Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true },
);
