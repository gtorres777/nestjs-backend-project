import { Schema } from 'mongoose'

export const TalesSchema = new Schema({
  titulo: {
    type: String,
    required: true,
    unique: true
  },
  contenido:{
    type: String,
    required: true,
  },
  dificultad:{
    type:String,
    required:true
  },
  genero:{
    type:String,
    required: true
  },
  autor:{
    type:String,
    required: true
  },
  preguntas:{
    type:String,
    required: true
  }
},{ timestamps: true })
