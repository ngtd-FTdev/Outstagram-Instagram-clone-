"use strict";

import { Schema, Types, model } from "mongoose";

const DOCUMENT_NAME = "PostSave";
const COLLECTION_NAME = "post_saves";

const postSaveSchema = new Schema(
  {
    post: {
      type: Types.ObjectId,
      ref: "Post",
      required: true,
    },
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

postSaveSchema.index({ post: 1, user: 1 }, { unique: true });

const postSaveModel = model(DOCUMENT_NAME, postSaveSchema);

export default postSaveModel;
