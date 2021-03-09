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
  question_id: {
    type: Number,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  alternative: [AlternativeSchema],
  correct_answer: {
    type: Number,
    required: true
  }
})

export const TalesSchema = new Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  cover_page:{
    type: String,
    required:true,
    unique: true
  },
  content:{
    type: [String],
    required: true,
  },
  difficulty:{
    type:String,
    required:true
  },
  gender:{
    type:String,
    required: true
  },
  author:{
    type:String,
    required: true
  },
  questions: [QuestionSchema]
},{ timestamps: true })
