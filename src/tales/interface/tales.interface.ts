import { Document } from 'mongoose'

export interface Tales extends Document {
  readonly id?: string;
  readonly titulo: string;
  readonly contenido: string;
  readonly dificultad: string;
  readonly genero: string;
  readonly autor: string;
  readonly preguntas: string;
}
