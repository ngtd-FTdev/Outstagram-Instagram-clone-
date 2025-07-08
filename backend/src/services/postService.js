"use strict";

import { StatusCodes } from "http-status-codes";
import ErrorResponse from "~/core/errorResponse";
import postModel from "~/models/postModel";
import PostLike from "~/models/postLikeModel";
import PostSave from "~/models/postSaveModel";
import {
  deletePost,
  findListPostsByUserId,
  findPostById,
  likePostRepo,
  updatePost,
  savePostRepo,
  commentPostRepo,
  getCommentsByPostId,
  likeCommentByUserId,
  getLikesCommentByCommentId,
  getLikesPostByPostId,
  checkPostExist,
  findListPostsForExplore,
  findListReels,
  findRandomPosts,
  findPostsByUsernameWithPaging,
  findReelsByUsernameWithPaging,
} from "~/models/repositories/post.repo";
import { findUserById } from "~/models/repositories/user.repo";
import { convertToObjectIdMongodb } from "~/utils/algorithms";
import likeCommentModel from "~/models/likeCommentModel";
import userModel from "~/models/userModel";
import { processAndUploadMedia } from "~/utils/mediaHandler";
import { redisClient } from "~/dbs/redis";
import BlockedUser from "~/models/blockedUserSchema ";
import Follow from "~/models/followModel.js";
import { ObjectId } from "mongodb";

class PostService {
  static createPost = async ({ userId, bodyPost, arrayFiles }) => {
    // Xử lý và upload media, trả về mảng URI
    const arrayFilesUri = await processAndUploadMedia({ arrayFiles, bodyPost });
  
    bodyPost.author = convertToObjectIdMongodb(userId);
    bodyPost.media = arrayFilesUri;
    bodyPost.randomNumber = Math.random();
  
    let isReel = false;
  
    // Nếu chỉ có 1 file và là video => gán type = 'reel'
    if (
      arrayFiles.length === 1 &&
      arrayFiles[0].mimetype.startsWith("video/")
    ) {
      bodyPost.type = "reel";
      isReel = true;
    }
  
    // Tạo bài viết mới
    const post = await postModel.create(
      [bodyPost]
      // { session }
    );
  
    // Cập nhật số lượng bài viết cho user
    const updateFields = { $inc: { postsCount: 1 } };
  
    // Nếu là reel thì tăng thêm reelsCount
    if (isReel) {
      updateFields.$inc.reelsCount = 1;
    }
  
    await userModel.updateOne(
      { _id: userId },
      updateFields
      // { session }
    );
  
    //   await session.commitTransaction();
    //   session.endSession();
  
    return post[0]; // Vì postModel.create([...]) trả về mảng
  
    // } catch (error) {
    //   await session.abortTransaction();
    //   session.endSession();
    //   throw error;
    // }
  };

  static updatePost = async ({ userId, postId, bodyPost }) => {
    const post = await findPostById({ id: postId });
    if (!post)
      throw new ErrorResponse(StatusCodes.NOT_FOUND, "Post not found!");

    if (post.author.toString() !== userId)
      throw new ErrorResponse(
        StatusCodes.FORBIDDEN,
        "You do not have permission to update this post!"
      );

    if (bodyPost.caption) {
      bodyPost.caption_is_edited = true;
    }

    const updatedPost = await updatePost({
      userId,
      postId,
      bodyPost,
      unSelect: ["__v"],
    });

    return updatedPost;
  };

  static deletePost = async ({ userId, postId }) => {
    const post = await findPostById({ id: postId });
    if (!post)
      throw new ErrorResponse(StatusCodes.NOT_FOUND, "Post not found!");

    if (post.author?._id.toString() !== userId)
      throw new ErrorResponse(
        StatusCodes.FORBIDDEN,
        "You do not have permission to delete this post!"
      );

    return await deletePost({ postId, userId });
  };

  static getPost = async ({ id, userId }) => {
    const user = await findUserById({ id: userId });
    if (!user)
      throw new ErrorResponse(StatusCodes.BAD_REQUEST, "Invalid request!");

    const post = await findPostById({ id });
    if (!post) {
      throw new ErrorResponse(StatusCodes.NOT_FOUND, "Post not found");
    }

    // Get user's likes and saves for this post
    const [isLiked, isSaved, isFollowing] = await Promise.all([
      PostLike.exists({
        post: convertToObjectIdMongodb(id),
        user: convertToObjectIdMongodb(userId),
      }),
      PostSave.exists({
        post: convertToObjectIdMongodb(id),
        user: convertToObjectIdMongodb(userId),
      }),
      Follow.exists({
        user: convertToObjectIdMongodb(userId),
        target: post.author,
      }).then(Boolean),
    ]);

    const postObj = post.toObject();
    postObj.isLiked = isLiked;
    postObj.isSaved = isSaved;
    if (postObj.author && typeof postObj.author === 'object') {
      postObj.author.isFollowingAuthor = isFollowing;
    } else {
      postObj.author = { _id: postObj.author, isFollowingAuthor: isFollowing };
    }

    return postObj;
  };

  static getListPosts = async ({
    userId,
    page = 1,
    firstPostId,
    lastPostId,
    limit = 20,
  }) => {
    const user = await findUserById({ id: userId });
    if (!user) {
      throw new ErrorResponse(StatusCodes.BAD_REQUEST, "Yêu cầu không hợp lệ");
    }

    // Validate ObjectIds
    if (firstPostId && !ObjectId.isValid(firstPostId)) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        "firstPostId không hợp lệ"
      );
    }
    if (lastPostId && !ObjectId.isValid(lastPostId)) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        "lastPostId không hợp lệ"
      );
    }

    const redisKey = `blocked:${userId}`;
    const SENTINEL = "__NONE__";

    // 1) Lấy danh sách user bị chặn từ cache hoặc DB
    let blockedIds;
    const exists = await redisClient.exists(redisKey);
    if (exists) {
      const members = await redisClient.sMembers(redisKey);
      blockedIds = members.includes(SENTINEL) ? [] : members;
    } else {
      const docs = await BlockedUser.find({ user: userId })
        .select("blocked -_id")
        .lean();
      blockedIds = docs.map((d) => d.blocked.toString());
      await redisClient.sAdd(
        redisKey,
        ...(blockedIds.length > 0 ? blockedIds : [SENTINEL])
      );
      await redisClient.expire(redisKey, 86400);
    }

    // 2) Lấy danh sách người đang follow (bao gồm chính mình)
    const followingDocs = await Follow.find({
      user: convertToObjectIdMongodb(userId),
    })
      .select("target -_id")
      .lean();
    const followingIds = followingDocs.map((doc) => doc.target.toString());
    const rawIds = [...new Set([...followingIds, userId.toString()])];
    const validIds = rawIds.filter((id) => !blockedIds.includes(id));

    // 3) Xây dựng điều kiện truy vấn bài post
    const query = {
      author: { $in: validIds.map(convertToObjectIdMongodb) },
    };
    if (firstPostId && lastPostId) {
      query._id = {
        $gt: convertToObjectIdMongodb(firstPostId),
        $lt: convertToObjectIdMongodb(lastPostId),
      };
    } else if (firstPostId) {
      query._id = { $gt: convertToObjectIdMongodb(firstPostId) };
    } else if (lastPostId) {
      query._id = { $lt: convertToObjectIdMongodb(lastPostId) };
    } else if (!firstPostId && !lastPostId && page > 1) {
      // Nếu không có phân trang theo id và page > 1 thì trả về rỗng
      return {
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          hasNextPage: false,
        },
      };
    }

    // 4) Lấy danh sách bài post (mới nhất trước)
    const listPosts = await postModel
      .find(query)
      .sort({ _id: -1 })
      .limit(limit)
      .populate(
        "author",
        "username full_name profile_pic_url postsCount following followers is_verified private_account"
      )
      .lean();

      console.log('listPosts::', listPosts);

    const hasNextPage = listPosts.length === limit;
    const postIds = listPosts.map((post) => post._id.toString());

    // 5) Lấy thông tin like, save, following
    const [userLikes, userSaves] = await Promise.all([
      PostLike.find({
        post: { $in: postIds },
        user: convertToObjectIdMongodb(userId),
      }).lean(),
      PostSave.find({
        post: { $in: postIds },
        user: convertToObjectIdMongodb(userId),
      }).lean(),
    ]);
    const likedSet = new Set(userLikes.map((l) => l.post.toString()));
    const savedSet = new Set(userSaves.map((s) => s.post.toString()));
    const followingSet = new Set(followingIds);

    // 6) Chuẩn hóa dữ liệu trả về
    const data = listPosts.map((post) => {
      let author = post.author;
      let authorId = author?._id?.toString() || author?.toString();
      if (typeof author === 'object' && author !== null) {
        author = { ...author, isFollowingAuthor: followingSet.has(authorId) };
      } else {
        author = { _id: authorId, isFollowingAuthor: followingSet.has(authorId) };
      }
      return {
        ...post,
        author,
        isLiked: likedSet.has(post._id.toString()),
        isSaved: savedSet.has(post._id.toString()),
      };
    });

    return {
      data,
      pagination: {
        page,
        limit,
        total: data.length,
        hasNextPage,
      },
    };
  };

  static getListPostsForExplore = async ({ userId, page = 1, firstPostId, lastPostId }) => {
    const redisKey = `blocked:${userId}`;
    const SENTINEL = "__NONE__";

    // 1) Kiểm tra cache
    const exists = await redisClient.exists(redisKey);

    let blockedIds;
    if (exists) {
      const members = await redisClient.sMembers(redisKey);
      blockedIds = members.includes(SENTINEL) ? [] : members;
    } else {
      const docs = await BlockedUser.find({ user: userId })
        .select("blocked -_id")
        .lean();
      blockedIds = docs.map((d) => d.blocked.toString());
      await redisClient.sAdd(
        redisKey,
        blockedIds.length > 0 ? blockedIds : SENTINEL
      );
      await redisClient.expire(redisKey, 86400);
    }

    // 2) Điều kiện phân trang
    let query = {};
    if (firstPostId && lastPostId) {
      query._id = {
        $gt: convertToObjectIdMongodb(firstPostId),
        $lt: convertToObjectIdMongodb(lastPostId),
      };
    } else if (firstPostId) {
      query._id = { $gt: convertToObjectIdMongodb(firstPostId) };
    } else if (lastPostId) {
      query._id = { $lt: convertToObjectIdMongodb(lastPostId) };
    } else if (!firstPostId && !lastPostId && page > 1) {
      return {
        data: [],
        pagination: {
          page,
          limit: 10,
          total: 0,
        },
      };
    }

    // 3) Lấy danh sách bài post
    const listPosts = await findListPostsForExplore({
      page,
      limit: 10,
      query,
    });

    const postIds = listPosts.map((post) => post._id.toString());

    // 4) Check isLiked, isSaved, isFollowingAuthor
    const [userLikes, userSaves, userFollowings] = await Promise.all([
      PostLike.find({
        post: { $in: postIds },
        user: convertToObjectIdMongodb(userId),
      }).lean(),
      PostSave.find({
        post: { $in: postIds },
        user: convertToObjectIdMongodb(userId),
      }).lean(),
      Follow.find({
        user: convertToObjectIdMongodb(userId),
        target: { $in: listPosts.map((post) => post.author) },
      }).lean(),
    ]);

    const likedSet = new Set(userLikes.map((l) => l.post.toString()));
    const savedSet = new Set(userSaves.map((s) => s.post.toString()));
    const followingSet = new Set(userFollowings.map((f) => f.target.toString()));

    const data = listPosts.map((post) => {
      const plain = post.toObject ? post.toObject() : post;
      let author = plain.author;
      let authorId = author?._id?.toString() || author?.toString();
      if (typeof author === 'object' && author !== null) {
        author = { ...author, isFollowingAuthor: followingSet.has(authorId) };
      } else {
        author = { _id: authorId, isFollowingAuthor: followingSet.has(authorId) };
      }
      return {
        ...plain,
        author,
        isLiked: likedSet.has(post._id.toString()),
        isSaved: savedSet.has(post._id.toString()),
      };
    });

    return {
      data,
      pagination: {
        page,
        limit: 10,
        total: data.length,
      },
    };
  };

  static likePost = async ({ userId, postId }) => {
    return await likePostRepo({ postId, userId });
  };

  static getLikesPost = async ({ postId, page, limit }) => {
    return await getLikesPostByPostId({ postId, page, limit });
  };

  static savePost = async ({ userId, postId }) => {
    return await savePostRepo({ postId, userId });
  };

  static commentPost = async ({ userId, postId, bodyComment }) => {
    const { text, parentId = null } = bodyComment;

    const postExist = await checkPostExist({ id: postId });
    if (!postExist)
      throw new ErrorResponse(StatusCodes.NOT_FOUND, "Post not found!");

    const comment = await commentPostRepo({
      postId,
      userId,
      text,
      parentId,
    });

    await postModel.updateOne({ _id: postId }, { $inc: { comments: 1 } });

    return comment;
  };

  static getComments = async ({
    postId,
    parentId,
    page,
    limit = 12,
    userId,
  }) => {
    const comments = await getCommentsByPostId({
      postId,
      parentId,
      page,
      limit,
    });

    const commentIds = comments.map((c) => c._id);

    const userLikes = await likeCommentModel
      .find({
        comment_id: { $in: commentIds },
        user_id: convertToObjectIdMongodb(userId),
      })
      .lean();

    const likedCommentIds = new Set(
      userLikes.map((like) => like.comment_id.toString())
    );

    const data = comments.map((comment) => ({
      ...comment.toObject(),
      isLiked: likedCommentIds.has(comment._id.toString()),
    }));

    return {
      data,
      pagination: {
        page,
        total: comments.length,
      },
    };
  };

  static likeComment = async ({ userId, commentId }) => {
    return await likeCommentByUserId({ commentId, userId });
  };

  static getLikesComment = async ({ commentId, page, limit }) => {
    return await getLikesCommentByCommentId({ commentId, page, limit });
  };

  static getListReels = async ({ userId, page = 1, firstPostId, lastPostId }) => {
    // 1) Điều kiện phân trang
    let query = {};
    if (firstPostId && lastPostId) {
      query._id = {
        $gt: convertToObjectIdMongodb(firstPostId),
        $lt: convertToObjectIdMongodb(lastPostId),
      };
    } else if (firstPostId) {
      query._id = { $gt: convertToObjectIdMongodb(firstPostId) };
    } else if (lastPostId) {
      query._id = { $lt: convertToObjectIdMongodb(lastPostId) };
    } else if (!firstPostId && !lastPostId && page > 1) {
      return {
        data: [],
        pagination: {
          page,
          limit: 10,
          total: 0,
        },
      };
    }

    // 2) Lấy danh sách bài post type 'reel'
    const listReels = await findListReels({
      page,
      limit: 10,
      query,
    });

    const postIds = listReels.map((post) => post._id.toString());

    // 3) Check isLiked, isSaved, isFollowingAuthor
    const [userLikes, userSaves, userFollowings] = await Promise.all([
      PostLike.find({
        post: { $in: postIds },
        user: convertToObjectIdMongodb(userId),
      }).lean(),
      PostSave.find({
        post: { $in: postIds },
        user: convertToObjectIdMongodb(userId),
      }).lean(),
      Follow.find({
        user: convertToObjectIdMongodb(userId),
        target: { $in: listReels.map((post) => post.author) },
      }).lean(),
    ]);

    const likedSet = new Set(userLikes.map((l) => l.post.toString()));
    const savedSet = new Set(userSaves.map((s) => s.post.toString()));
    const followingSet = new Set(userFollowings.map((f) => f.target.toString()));

    const data = listReels.map((post) => {
      const plain = post.toObject ? post.toObject() : post;
      let author = plain.author;
      let authorId = author?._id?.toString() || author?.toString();
      if (typeof author === 'object' && author !== null) {
        author = { ...author, isFollowingAuthor: followingSet.has(authorId) };
      } else {
        author = { _id: authorId, isFollowingAuthor: followingSet.has(authorId) };
      }
      return {
        ...plain,
        author,
        isLiked: likedSet.has(post._id.toString()),
        isSaved: savedSet.has(post._id.toString()),
      };
    });

    return {
      data,
      pagination: {
        page,
        limit: 10,
        total: data.length,
      },
    };
  };

  static getRandomPosts = async ({ userId, limit = 10 }) => {
    // Lấy các bài post ngẫu nhiên
    const posts = await findRandomPosts({ limit });
    // Có thể bổ sung logic kiểm tra like/save nếu cần
    return posts;
  };

  static getListPosts2 = async ({
    userId,
    firstPostId,
    lastPostId,
    limit = 20,
    page = 1,
  }) => {
    // 1. Xác thực user
    const user = await findUserById({ id: userId });
    if (!user)
      throw new ErrorResponse(StatusCodes.BAD_REQUEST, "Invalid userId");

    // 2. Lấy danh sách blockedIds từ Redis hoặc DB
    const redisKey = `blocked:${userId}`;
    const SENTINEL = "__NONE__";
    let blockedIds;
    const exists = await redisClient.exists(redisKey);
    if (exists) {
      const members = await redisClient.sMembers(redisKey);
      blockedIds = members.includes(SENTINEL) ? [] : members;
    } else {
      const docs = await BlockedUser.find({ user: userId })
        .select("blocked -_id")
        .lean();
      blockedIds = docs.map((d) => d.blocked.toString());
      await redisClient.sAdd(
        redisKey,
        ...(blockedIds.length > 0 ? blockedIds : [SENTINEL])
      );
      await redisClient.expire(redisKey, 86400);
    }

    // 3. Lấy danh sách followingIds (bao gồm chính mình)
    const followingDocs = await Follow.find({
      user: convertToObjectIdMongodb(userId),
    })
      .select("target -_id")
      .lean();
    const followingIds = followingDocs.map((doc) => doc.target.toString());
    followingIds.push(userId.toString());

    console.log('followingDocs::', followingDocs);

    // 4. Điều kiện phân trang
    let queryConditions = [];

    if (firstPostId && lastPostId) {
      queryConditions.push({
        $or: [
          { _id: { $gt: convertToObjectIdMongodb(firstPostId) } },
          { _id: { $lt: convertToObjectIdMongodb(lastPostId) } },
        ],
      });
    } else if (firstPostId) {
      queryConditions.push({
        _id: { $gt: convertToObjectIdMongodb(firstPostId) },
      });
    } else if (lastPostId) {
      queryConditions.push({
        _id: { $lt: convertToObjectIdMongodb(lastPostId) },
      });
    } else if (!firstPostId && !lastPostId && page > 1) {
      return {
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
        },
      };
    }

    // 5. Truy vấn song song
    const [followPosts, suggestedPosts] = await Promise.all([
      postModel
        .find({
          $and: [
            { author: { $in: followingIds.map(convertToObjectIdMongodb) } },
            ...queryConditions,
          ],
        })
        .sort({ _id: -1 })
        .limit(limit * 2)
        .populate(
          "author",
          "username full_name profile_pic_url postsCount following followers is_verified private_account"
        )
        .lean(),

      postModel
        .find({
          $and: [
            {
              author: {
                $nin: [...blockedIds, ...followingIds].map(
                  convertToObjectIdMongodb
                ),
              },
            },
            ...queryConditions,
          ],
        })
        .sort({ _id: -1 })
        .limit(limit * 2)
        .populate(
          "author",
          "username full_name profile_pic_url postsCount following followers is_verified private_account"
        )
        .lean(),
    ]);

    // 6. Trộn xen kẽ 1:1
    const mixedPosts = [];
    let i = 0,
      j = 0;
    while (
      mixedPosts.length < limit &&
      (i < followPosts.length || j < suggestedPosts.length)
    ) {
      if (i < followPosts.length) mixedPosts.push(followPosts[i++]);
      if (mixedPosts.length < limit && j < suggestedPosts.length)
        mixedPosts.push(suggestedPosts[j++]);
    }

    const postIds = mixedPosts.map((post) => post._id.toString());

    // 7. Lấy thông tin phụ
    const [userLikes, userSaves] = await Promise.all([
      PostLike.find({
        post: { $in: postIds },
        user: convertToObjectIdMongodb(userId),
      }).lean(),
      PostSave.find({
        post: { $in: postIds },
        user: convertToObjectIdMongodb(userId),
      }).lean(),
    ]);
    const likedSet = new Set(userLikes.map((l) => l.post.toString()));
    const savedSet = new Set(userSaves.map((s) => s.post.toString()));
    const followingSet = new Set(followingIds);

    // 8. Chuẩn hóa kết quả
    const data = mixedPosts.map((post) => {
      let author = post.author;
      let authorId = author?._id?.toString() || author?.toString();
      if (typeof author === 'object' && author !== null) {
        author = { ...author, isFollowingAuthor: followingSet.has(authorId) };
      } else {
        author = { _id: authorId, isFollowingAuthor: followingSet.has(authorId) };
      }
      return {
        ...post,
        author,
        isLiked: likedSet.has(post._id.toString()),
        isSaved: savedSet.has(post._id.toString()),
      };
    });

    return {
      data,
      pagination: {
        page,
        limit,
        total: data.length,
      },
    };
  };

  static getPostsByUsername = async ({ usernameSearch, userName, userId, page = 1, limit = 12, lastPostId }) => {
    const posts = await findPostsByUsernameWithPaging({ username: usernameSearch, page, limit, lastPostId });
    const postIds = posts.map(post => post._id.toString());

    // Lấy trạng thái like/save
    const [userLikes, userSaves] = await Promise.all([
      PostLike.find({
        post: { $in: postIds },
        user: convertToObjectIdMongodb(userId),
      }).lean(),
      PostSave.find({
        post: { $in: postIds },
        user: convertToObjectIdMongodb(userId),
      }).lean(),
    ]);
    const likedSet = new Set(userLikes.map(l => l.post.toString()));
    const savedSet = new Set(userSaves.map(s => s.post.toString()));

    let isFollowingAuthor = null;
    if (usernameSearch !== userName && posts.length > 0) {
      // Lấy _id của author
      const authorId = posts[0]?.author?._id?.toString();
      if (authorId) {
        const follow = await Follow.exists({
          user: convertToObjectIdMongodb(userId),
          target: convertToObjectIdMongodb(authorId),
        });
        isFollowingAuthor = !!follow;
      }
    }

    const data = posts.map(post => {
      let author = post.author;
      let authorId = author?._id?.toString() || author?.toString();
      let isFollow = usernameSearch === userName ? null : isFollowingAuthor;
      if (typeof author === 'object' && author !== null) {
        author = { ...author, isFollowingAuthor: isFollow };
      } else {
        author = { _id: authorId, isFollowingAuthor: isFollow };
      }
      return {
        ...post,
        author,
        isLiked: likedSet.has(post._id.toString()),
        isSaved: savedSet.has(post._id.toString()),
      };
    });

    return {
      data,
      pagination: {
        page,
        limit,
        total: posts.length,
        hasNextPage: posts.length === limit,
      },
    };
  };

  static getReelByUsername = async ({ usernameSearch, userName, userId, page = 1, limit = 12, lastPostId }) => {
    // Lấy các bài post có type là 'reel' của user
    const posts = await findReelsByUsernameWithPaging({ username: usernameSearch, page, limit, lastPostId });
    const postIds = posts.map(post => post._id.toString());

    // Lấy trạng thái like/save
    const [userLikes, userSaves] = await Promise.all([
      PostLike.find({
        post: { $in: postIds },
        user: convertToObjectIdMongodb(userId),
      }).lean(),
      PostSave.find({
        post: { $in: postIds },
        user: convertToObjectIdMongodb(userId),
      }).lean(),
    ]);
    const likedSet = new Set(userLikes.map(l => l.post.toString()));
    const savedSet = new Set(userSaves.map(s => s.post.toString()));

    let isFollowingAuthor = null;
    if (usernameSearch !== userName && posts.length > 0) {
      // Lấy _id của author
      const authorId = posts[0]?.author?._id?.toString();
      if (authorId) {
        const follow = await Follow.exists({
          user: convertToObjectIdMongodb(userId),
          target: convertToObjectIdMongodb(authorId),
        });
        isFollowingAuthor = !!follow;
      }
    }

    const data = posts.map(post => {
      let author = post.author;
      let authorId = author?._id?.toString() || author?.toString();
      let isFollow = usernameSearch === userName ? null : isFollowingAuthor;
      if (typeof author === 'object' && author !== null) {
        author = { ...author, isFollowingAuthor: isFollow };
      } else {
        author = { _id: authorId, isFollowingAuthor: isFollow };
      }
      return {
        ...post,
        author,
        isLiked: likedSet.has(post._id.toString()),
        isSaved: savedSet.has(post._id.toString()),
      };
    });

    return {
      data,
      pagination: {
        page,
        limit,
        total: posts.length,
        hasNextPage: posts.length === limit,
      },
    };
  };
}

export default PostService;
