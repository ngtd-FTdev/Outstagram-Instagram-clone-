import { Schema, Types, model } from "mongoose";

const DOCUMENT_NAME = "PostLike";
const COLLECTION_NAME = "post_likes";

const PostLikeSchema = new Schema(
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

PostLikeSchema.index({ post: 1, user: 1 }, { unique: true });

const PostLike = model(DOCUMENT_NAME, PostLikeSchema);

export default PostLike;
