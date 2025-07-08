'use strict'

import { Schema, Types, model } from 'mongoose'

const DOCUMENT_NAME = 'Message'
const COLLECTION_NAME = 'messages'

const messageSchema = new Schema(
    {
        sender: {
            type: Types.ObjectId,
            ref: 'User',
            required: function () {
                return this.type !== 'system'
            },
        },
        conversation: {
            type: Types.ObjectId,
            required: true,
            ref: 'Conversation',
        },
        type: {
            type: String,
            enum: ['text', 'media', 'system'],
            required: true,
        },
        message: {
            type: String,
            required: function () {
                return this.type !== 'system' // Tin nhắn hệ thống có thể không cần nội dung
            },
            default: null,
        },
        media: {
            type: String,
            enum: ['image', 'video'],
            default: null,
        },
        media_url: {
            type: [String],
            default: [],
        },
        reply: {
            type: Types.ObjectId,
            ref: 'Message',
            default: null,
        },
        reacts: [
            {
                user_id: {
                    type: Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                emoji: {
                    type: String,
                    required: true,
                },
            },
        ],
        forward_message: {
            type: Boolean,
            default: false,
        },
        system_type: {
            type: String,
            enum: ['user_joined', 'user_left', 'name_changed', 'other'],
            default: null,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

messageSchema.index({ conversation_id: 1 })

const messageModel = model(DOCUMENT_NAME, messageSchema)

export default messageModel
