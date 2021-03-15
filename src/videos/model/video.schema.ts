import { Schema } from "mongoose";

export const VideoSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    path: {
        type: String,
        required: true
    },
    img: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})


