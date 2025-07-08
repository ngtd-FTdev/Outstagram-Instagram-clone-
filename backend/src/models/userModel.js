"use strict";

import { Schema, Types, model } from "mongoose";

const DOCUMENT_NAME = "User";
const COLLECTION_NAME = "users";

const userSchema = new Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profile_pic_url: {
      type: String,
      default: null,
    },
    hd_profile_pic_url: {
      type: String,
      default: null,
    },
    profile_pic_url_public: {
      type: String,
      default: null,
    },
    geoLocation: {
      country: {
        type: String,
        default: null,
      },
      city: {
        type: String,
        default: null,
      },
      detailed_address: {
        type: String,
        default: null,
      },
    },
    biography: {
      type: String,
      default: null,
    },
    bio_links: [
      {
        link_type: {
          type: String,
          enum: ["external", "internal", null],
          default: null,
        },
        lynx_url: {
          type: String,
        },
        title: {
          type: String,
        },
        url: {
          type: String,
        },
      },
    ],
    gender: {
      type: String,
      enum: ["male", "female", "secret"],
      default: "secret",
    },
    is_verified: {
      type: Boolean,
      default: false,
    },
    followers: {
      type: Number,
      default: 0,
    },
    following: {
      type: Number,
      default: 0,
    },
    postsCount: {
      type: Number,
      default: 0,
    },
    reelsCount: {
      type: Number,
      default: 0,
    },
    private_account: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

userSchema.index({ email: 1 });
userSchema.index({ full_name: 'text', username: 'text' });

const userModel = model(DOCUMENT_NAME, userSchema);

export default userModel;
