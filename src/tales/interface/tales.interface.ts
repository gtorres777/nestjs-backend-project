import { Document } from 'mongoose'

export interface Question extends Document {
  readonly pregunta: string;
  readonly alternativa: Alternative[];
  readonly respuesta_correcta: number;
}

export interface Alternative extends Document {
  readonly label: string;
  readonly value: number;
}

export interface Tales extends Document {
  readonly id?: string;
  readonly titulo: string;
  readonly contenido: string[];
  readonly dificultad: string;
  readonly genero: string;
  readonly autor: string;
  readonly preguntas: Question[];
}
