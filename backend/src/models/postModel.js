'use strict'

import { Schema, Types, model } from 'mongoose'

const DOCUMENT_NAME = 'Post'
const COLLECTION_NAME = 'posts'

const postSchema = new Schema(
    {
        caption: {
            type: String,
            default: '',
        },
        type: {
            type: String,
            enum: ['post', 'reel'],
            default: 'post',
        },
        media: [{
            type: {
                type: String,
                enum: ['image', 'video'],
                default: 'image',
            },
            url_media: {
                type: String,
                required: true,
            },
            thumbnail: {
                type: String,
            },
        }],
        author: {
            type: Types.ObjectId,
            required: true,
            ref: 'User',
        },
        location: {
            type: String,
            default: '',
        },
        collaborators: [
            {
                type: Types.ObjectId,
                ref: 'User',
            },
        ],
        likes: {
            type: Number,
            default: 0,
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
        allowed_commenter_type: {
            type: String,
            enum: ['everyone', 'friends', 'followers', 'no_one', 'custom'],
            default: 'everyone',
        },
        caption_is_edited: {
            type: Boolean,
            default: false,
        },
        feed_post_reshare_disabled: {
            type: Boolean,
            default: false,
        },
        randomNumber: {
            type: Number,
            default: () => Math.random(),
            index: true,
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    }
)

postSchema.index({ author: 1, createdAt: -1 })
postSchema.index({ randomNumber: 1 })

const postModel = model(DOCUMENT_NAME, postSchema)

export default postModel
