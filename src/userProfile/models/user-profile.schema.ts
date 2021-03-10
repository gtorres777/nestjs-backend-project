import { Schema, Types } from 'mongoose';

const imagen: string =
  'https://cdn.pixabay.com/photo/2015/03/26/09/47/sky-690293__340.jpg';


export const TalesCompletedSchema = new Schema({
  answered_correctly: {
    type: String,
    required: true
  },
  answered_incorrectly: {
    type: String,
    required: true
  },

},
  { timestamps: true },
)

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
    favorite_tales: {
      type: [String],
      required: false
    },
    tales_completed: [TalesCompletedSchema],
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
