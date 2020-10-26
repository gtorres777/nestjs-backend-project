import { Schema } from 'mongoose'

export const UserSchema = new Schema({
  nickname: {
    type: String,
    required: true,
    unique: true
  },
  nombre: {
    type: String,
    required: true,
  },
  apellido: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  imagen: {
    type: String,
    required: false,
    default: "data:image/png;base64,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"
  },
  suscription_state: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive"
  }
  
}, { timestamps: true})