import { Document } from 'mongoose';

export interface Videos extends Document {
    readonly title: string
    readonly path: string
    readonly img: string

}