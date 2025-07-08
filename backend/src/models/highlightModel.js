'use strict'

import { Schema, Types, model } from 'mongoose'

const DOCUMENT_NAME = 'Highlight'
const COLLECTION_NAME = 'highlights'

const highlightSchema = new Schema(
    {
        caption: {
            type: String,
            required: true,
        },
        image_video: {
            type: [String],
            required: true,
        },
        author: {
            type: Types.ObjectId,
            required: true,
            ref: 'User',
        },
        likes: {
            type: [Types.ObjectId],
            default: [],
        },
        likes_hidden: {
            type: Boolean,
            default: false,
        },
        comments: {
            type: Number,
            default: 0,
        },
        comments_disable: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

const highlightModel = model(DOCUMENT_NAME, highlightSchema)

export default highlightModel
