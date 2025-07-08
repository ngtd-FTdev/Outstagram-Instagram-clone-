'use strict'

import { Schema, Types, model } from 'mongoose'

const DOCUMENT_NAME = 'LikeComment'
const COLLECTION_NAME = 'like_comments'

const likeCommentSchema = new Schema(
    {
        comment_id: {
            type: Types.ObjectId,
            ref: 'Comment',
            required: true,
        },
        user_id: {
            type: Types.ObjectId,
            ref: 'User',
            required: true,
        }
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

likeCommentSchema.index({ comment_id: 1, user_id: 1 }, { unique: true })
likeCommentSchema.index({ comment_id: 1 }, { unique: true })

const likeCommentModel = model(DOCUMENT_NAME, likeCommentSchema)

export default likeCommentModel
