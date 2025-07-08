'use strict'

import { Schema, Types, model } from 'mongoose'

const DOCUMENT_NAME = 'Message'
const COLLECTION_NAME = 'messages'

const messageSchema = new Schema(
    {
        sender_id: {
            type: Types.ObjectId,
            required: true,
            ref: 'User',
        },
        receiver_id: {
            type: Types.ObjectId,
            required: true,
            ref: 'User',
        },
        message: {
            type: String,
            required: true,
        },
        seen: {
            type: [Types.ObjectId],
            default: [],
            ref: 'User',
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

const messageModel = model(DOCUMENT_NAME, messageSchema)

export default messageModel
