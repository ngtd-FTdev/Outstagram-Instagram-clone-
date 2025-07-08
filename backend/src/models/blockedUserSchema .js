import { Schema, Types, model } from "mongoose";

const DOCUMENT_NAME = "BlockedUser";
const COLLECTION_NAME = "blocked_users";

const blockedUserSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    blocked: {
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

blockedUserSchema.index({ user: 1, blocked: 1 }, { unique: true });

const BlockedUser = model(DOCUMENT_NAME, blockedUserSchema);
export default BlockedUser;
