import { Schema } from 'mongoose'

export const ItemSchema = new Schema({
  title: String,
  price: Number,
  description: String
})