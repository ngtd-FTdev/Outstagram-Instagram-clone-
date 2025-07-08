import { Schema, Types, model } from 'mongoose';

const DOCUMENT_NAME = 'Follow';
const COLLECTION_NAME = 'follows';

const followSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
    target: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

followSchema.index({ user: 1, target: 1 }, { unique: true });
followSchema.index({ target: 1 });

const Follow = model(DOCUMENT_NAME, followSchema);
export default Follow;
