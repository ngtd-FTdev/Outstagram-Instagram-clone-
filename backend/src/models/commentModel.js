'use strict'

import { Schema, Types, model } from 'mongoose'

const DOCUMENT_NAME = 'Comment'
const COLLECTION_NAME = 'comments'

const commentSchema = new Schema(
    {
        post: {
            type: Types.ObjectId,
            required: true,
        },
        user: {
            type: Types.ObjectId,
            ref: 'User',
            required: true,
        },
        comment_parent: {
            type: Types.ObjectId,
            default: null,
        },
        comments_child: {
            type: Number,
            default: 0,
        },
        text: {
            type: String,
            required: true,
        },
        // media: {
        //     type: Array,
        //     default: [],
        // },
        likes: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

commentSchema.index({})

const commentModel = model(DOCUMENT_NAME, commentSchema)

export default commentModel
