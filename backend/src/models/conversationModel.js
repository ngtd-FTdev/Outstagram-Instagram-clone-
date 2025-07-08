'use strict'

import { Schema, Types, model } from 'mongoose'

const DOCUMENT_NAME = 'Conversation'
const COLLECTION_NAME = 'conversations'

const conversationSchema = new Schema(
    {
        name_conversation: {
            type: String,
            default: null,
        },
        participants: [
            {
                type: Types.ObjectId,
                ref: 'User',
            },
        ],
        messages: [
            {
                type: Types.ObjectId,
                ref: 'Message',
            },
        ],
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

const conversationModel = model(DOCUMENT_NAME, conversationSchema)

export default conversationModel
