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
        avatar_conversation: {
            type: String,
            default: null,
        },
        background_conversation: {
            type: String,
            default: null,
        },
        message_requests: {
            type: Boolean,
            default: false,
        },
        hidden_requests: {
            type: Boolean,
            default: false,
        },
        members: [
            {
                type: Types.ObjectId,
                ref: 'User',
            },
        ],
        admin_conversation: {
            type: [Types.ObjectId],
            ref: 'User',
        },
        hasMessages: {
            type: Boolean,
            default: false,
        },
        seen: [
            {
                user_id: {
                    type: Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                message_id: {
                    type: Types.ObjectId,
                    ref: 'Message',
                    required: true,
                },
            },
        ],
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

conversationSchema.index({ members: 1, updatedAt: -1 })

const conversationModel = model(DOCUMENT_NAME, conversationSchema)

export default conversationModel
