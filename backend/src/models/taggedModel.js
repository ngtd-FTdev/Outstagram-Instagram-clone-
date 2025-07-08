'use strict'

import { Schema, Types, model } from 'mongoose'

const DOCUMENT_NAME = 'Tagged'
const COLLECTION_NAME = 'tagged'

const taggedSchema = new Schema(
    {
        post_id: {
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

taggedSchema.index({ post_id: 1, user_id: 1 }, { unique: true })
taggedSchema.index({ post_id: 1 })

const taggedModel = model(DOCUMENT_NAME, taggedSchema)

export default taggedModel
