import { Document } from 'mongoose'

export interface Question extends Document {
  readonly question_id: number;
  readonly question: string;
  readonly alternative: Alternative[];
  readonly correct_answer: number;
}

export interface Alternative extends Document {
  readonly label: string;
  readonly value: number;
}

export interface Tales extends Document {
  readonly id?: string;
  readonly title: string;
  readonly cover_page: string;
  readonly content: string[];
  readonly difficulty: string;
  readonly gender: string;
  readonly author: string;
  readonly questions: Question[];
  readonly times_read?: boolean
}


export interface BasePagination<T> {
  data: T;
  currentPage: number;
  lastPage: number;
  perPage: number;
}
