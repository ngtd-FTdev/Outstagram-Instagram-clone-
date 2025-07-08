import {
  convertToObjectIdMongodb,
  getSelectData,
  getUnSelectData,
} from "~/utils/algorithms";
import postModel from "../postModel";
import PostLike from "../postLikeModel";
import PostSave from "../postSaveModel";
import commentModel from "../commentModel";
import likeCommentModel from "../likeCommentModel";
import userModel from "../userModel";

export const updatePost = async ({
  userId,
  postId,
  bodyPost,
  select,
  unSelect,
}) => {
  const optionSelect = select
    ? getSelectData(select)
    : getUnSelectData(unSelect);

  const query = {
      _id: convertToObjectIdMongodb(postId),
      author: convertToObjectIdMongodb(userId),
    },
    options = { new: true };

  return await postModel
    .findOneAndUpdate(query, bodyPost, options)
    .select(optionSelect);
};

export const findPostById = async ({ id, select, unSelect }) => {
  const optionSelect = select
    ? getSelectData(select)
    : getUnSelectData(unSelect);
  return await postModel
    .findById(convertToObjectIdMongodb(id))
    .select(optionSelect)
    .populate("author", "username full_name profile_pic_url")
    .populate("collaborators", "username full_name profile_pic_url");
};

export const checkPostExist = async ({ id }) => {
  return await postModel.exists({
    _id: convertToObjectIdMongodb(id),
  });
};

export const findListPostsByUserId = async ({
  ids,
  select,
  unSelect,
  limit,
  page,
}) => {
  if (ids.length === 0) {
    return null;
  }

  const skip = (page - 1) * limit;

  const optionSelect = select
    ? getSelectData(select)
    : getUnSelectData(unSelect);
  return await postModel
    .find({
      author: { $in: ids },
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .select(optionSelect)
    .limit(limit)
    .populate(
      "author",
      "username full_name profile_pic_url postsCount following followers is_verified private_account"
    )
    .populate("collaborators", "username full_name profile_pic_url");
};

export const findListPostsForExplore = async ({
  select,
  unSelect,
  limit,
  page,
}) => {
  const skip = (page - 1) * limit;

  const optionSelect = select
    ? getSelectData(select)
    : getUnSelectData(unSelect);
  return await postModel
    .find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .select(optionSelect)
    .limit(limit)
    .populate(
      "author",
      "username full_name profile_pic_url postsCount following followers is_verified private_account"
    )
    .populate("collaborators", "username full_name profile_pic_url");
};

export const getAllPosts = async ({ page, limit }) => {
  const skip = (page - 1) * limit;

  return await postModel
    .find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("author", "username profile_pic_url")
    .populate("collaborators", "username profile_pic_url");
};

export const deletePost = async ({ postId, userId }) => {
  return await postModel.deleteOne({
    _id: convertToObjectIdMongodb(postId),
    author: convertToObjectIdMongodb(userId),
  });
};

export const likePostRepo = async ({ postId, userId }) => {
  const existingLike = await PostLike.exists({
    post: convertToObjectIdMongodb(postId),
    user: convertToObjectIdMongodb(userId),
  });

  if (existingLike) {
    await PostLike.deleteOne({
      post: convertToObjectIdMongodb(postId),
      user: convertToObjectIdMongodb(userId),
    });

    return await postModel.updateOne(
      { _id: convertToObjectIdMongodb(postId) },
      { $inc: { likes: -1 } }
    );
  } else {
    await PostLike.create({
      post: convertToObjectIdMongodb(postId),
      user: convertToObjectIdMongodb(userId),
    });

    return await postModel.updateOne(
      { _id: convertToObjectIdMongodb(postId) },
      { $inc: { likes: 1 } }
    );
  }
};

export const getLikesPostByPostId = async ({ postId, page, limit }) => {
  const skip = (page - 1) * limit;

  return await PostLike.find({ post: convertToObjectIdMongodb(postId) })
    .skip(skip)
    .limit(limit)
    .populate("user", "full_name username profile_pic_url");
};

export const savePostRepo = async ({ postId, userId }) => {
  const existingSave = await PostSave.exists({
    post: convertToObjectIdMongodb(postId),
    user: convertToObjectIdMongodb(userId),
  });

  if (existingSave) {
    // If post is already saved, unsave it
    await PostSave.deleteOne({
      post: convertToObjectIdMongodb(postId),
      user: convertToObjectIdMongodb(userId),
    });
    return { saved: false };
  } else {
    // Save the post
    await PostSave.create({
      post: convertToObjectIdMongodb(postId),
      user: convertToObjectIdMongodb(userId),
    });
    return { saved: true };
  }
};

// export const commentPostRepo = async ({ postId, userId, text, parentId }) => {
//   if (parentId) {
//     const parentComment = await commentModel.exists({
//       _id: convertToObjectIdMongodb(parentId),
//     });
//     if (!parentComment) {
//       throw new Error("Parent comment not found");
//     }

//     const comment = await commentModel.create({
//       text,
//       comment_parent: convertToObjectIdMongodb(parentId),
//       post: convertToObjectIdMongodb(postId),
//       user: convertToObjectIdMongodb(userId),
//     });

//     await postModel.updateOne(
//       { _id: convertToObjectIdMongodb(postId) },
//       { $inc: { comments: 1 } }
//     );

//     await commentModel.updateOne(
//       { _id: convertToObjectIdMongodb(parentId) },
//       { $inc: { comments_child: 1 } }
//     );

//     return comment;
//   }

//   return await commentModel.create({
//     text,
//     post: convertToObjectIdMongodb(postId),
//     user: convertToObjectIdMongodb(userId),
//   });
// };

export const commentPostRepo = async ({ postId, userId, text, parentId }) => {
  // const session = await mongoose.startSession();
  // session.startTransaction();
  // try {
  // 1. Chuyển ObjectId 1 lần
  const _postId = convertToObjectIdMongodb(postId);
  const _userId = convertToObjectIdMongodb(userId);
  const ops = [];
  const commentData = { text, post: _postId, user: _userId };

  // 2. Nếu có parent, gắn vào và push việc tăng counter child
  if (parentId) {
    const _parentId = convertToObjectIdMongodb(parentId);
    commentData.comment_parent = _parentId;
    ops.push({
      updateOne: {
        filter: { _id: _parentId },
        update: { $inc: { comments_child: 1 } },
      },
    });
  }

  // 3. Tạo comment
  const [comment] = await commentModel.create(
    [commentData]
    // { session }
  );

  // 4. Luôn tăng counter post
  ops.push({
    updateOne: {
      filter: { _id: _postId },
      update: { $inc: { comments: 1 } },
    },
  });

  // 5. Chạy batch và kiểm tra kết quả
  const bulkRes = await commentModel.bulkWrite(
    ops
    // { session }
  );
  // Nếu có op nào không matched, nMatched < ops.length
  if (bulkRes.nMatched < ops.length) {
    throw new Error("Some update ops did not match any documents");
  }

  return comment;
  //   await session.commitTransaction();
  //   return comment;
  // } catch (err) {
  //   await session.abortTransaction();
  //   throw err;
  // } finally {
  //   session.endSession();
  // }
};

export const getCommentsByPostId = async ({
  postId,
  parentId,
  page,
  limit,
}) => {
  const skip = (page - 1) * limit;

  if (parentId) {
    return await commentModel
      .find({ post: postId, comment_parent: parentId })
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: 1 })
      .populate(
        "user",
        "full_name username profile_pic_url is_verified postsCount private_account following followers"
      );
  }
  return await commentModel
    .find({ post: postId, comment_parent: null })
    .limit(limit)
    .skip(skip)
    .sort({ likes: -1 })
    .populate(
      "user",
      "full_name username profile_pic_url is_verified postsCount private_account following followers"
    );
};

export const existingLikeCommentByUserId = async ({ commentId, userId }) => {
  const existingLike = await likeCommentModel.exists({
    comment_id: convertToObjectIdMongodb(commentId),
    user_id: convertToObjectIdMongodb(userId),
  });

  return existingLike;
};

export const getLikesCommentByCommentId = async ({
  commentId,
  page,
  limit,
}) => {
  const skip = (page - 1) * limit;

  const likes = await likeCommentModel
    .find({
      comment_id: convertToObjectIdMongodb(commentId),
    })
    .limit(limit)
    .skip(skip)
    .populate("user", "full_name username profile_pic_url");

  return likes;
};

export const likeCommentByUserId = async ({ commentId, userId }) => {
  const existingLike = await existingLikeCommentByUserId({ commentId, userId });
  if (existingLike) {
    await likeCommentModel.deleteOne({
      comment_id: convertToObjectIdMongodb(commentId),
      user_id: convertToObjectIdMongodb(userId),
    });
    return await commentModel.updateOne(
      { _id: convertToObjectIdMongodb(commentId) },
      { $inc: { likes: -1 } }
    );
  } else {
    await likeCommentModel.create({
      comment_id: convertToObjectIdMongodb(commentId),
      user_id: convertToObjectIdMongodb(userId),
    });
    return await commentModel.updateOne(
      { _id: convertToObjectIdMongodb(commentId) },
      { $inc: { likes: 1 } }
    );
  }
};

export const findListReels = async ({ select, unSelect, limit, page }) => {
  const skip = (page - 1) * limit;
  const optionSelect = select
    ? getSelectData(select)
    : getUnSelectData(unSelect);
  return await postModel
    .find({ type: 'reel' })
    .sort({ createdAt: -1 })
    .skip(skip)
    .select(optionSelect)
    .limit(limit)
    .populate(
      "author",
      "username full_name profile_pic_url postsCount following followers is_verified private_account"
    )
    .populate("collaborators", "username full_name profile_pic_url");
};

export const findRandomPosts = async ({ limit = 1 }) => {
  const queryNumber = Math.random();
  let posts = await postModel.find({ randomNumber: { $gte: queryNumber } }).limit(limit);
  if (!posts || posts.length === 0) {
    posts = await postModel.find({ randomNumber: { $lte: queryNumber } }).limit(limit);
  }
  return posts;
};

export const findPostsByUsernameWithPaging = async ({ username, page = 1, limit = 12, lastPostId }) => {
  const user = await userModel.findOne({ username }).lean();
  if (!user) return [];
  const query = { author: user._id };
  if (lastPostId) {
    query._id = { $lt: convertToObjectIdMongodb(lastPostId) };
  }
  const skip = (!lastPostId && page > 1) ? (page - 1) * limit : 0;
  return await postModel
    .find(query)
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .populate(
      "author",
      "_id username full_name profile_pic_url postsCount following followers is_verified private_account"
    )
    .lean();
};

export const findReelsByUsernameWithPaging = async ({ username, page = 1, limit = 12, lastPostId }) => {
  const user = await userModel.findOne({ username }).lean();
  if (!user) return [];
  const query = { author: user._id, type: 'reel' };
  if (lastPostId) {
    query._id = { $lt: convertToObjectIdMongodb(lastPostId) };
  }
  const skip = (!lastPostId && page > 1) ? (page - 1) * limit : 0;
  return await postModel
    .find(query)
    .sort({ _id: -1 })
    .skip(skip)
    .limit(limit)
    .populate(
      "author",
      "_id username full_name profile_pic_url postsCount following followers is_verified private_account"
    )
    .lean();
};
