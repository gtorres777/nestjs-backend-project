import { Schema, Types } from 'mongoose';

const imagen: string =
  'https://cdn.pixabay.com/photo/2015/03/26/09/47/sky-690293__340.jpg';

export const ProfileUserSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true,
    },
    apellido: {
      type: String,
      required: true,
    },

    imagen: {
      type: String,
      required: false,
      default: imagen,
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