import { Schema } from 'mongoose'


export const AlternativeSchema = new Schema({
  label: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  }
})

export const QuestionSchema = new Schema({
  pregunta: {
    type: String,
    required: true
  },
  alternativa: [AlternativeSchema],
  respuesta_correcta: {
    type: Number,
    required: true
  }
})

export const TalesSchema = new Schema({
  titulo: {
    type: String,
    required: true,
    unique: true
  },
  path:{
    type: String,
    required:true,
    unique: true
  },
  contenido:{
    type: [String],
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
  preguntas: [QuestionSchema]
},{ timestamps: true })
