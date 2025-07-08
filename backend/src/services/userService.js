"use strict";

import { StatusCodes } from "http-status-codes";
import ErrorResponse from "~/core/errorResponse";
import { redisClient } from "~/dbs/redis";
import BlockedUser from "~/models/blockedUserSchema ";
import Follow from "~/models/followModel.js";
import highlightModel from "~/models/highlightModel";
import {
  checkUserExist,
  findUserById,
  findUserByIdAndUpdate,
  searchUsersByText,
  findSuggestedUsersToFollow,
  findUserByUsername,
  findUsersFollowing,
} from "~/models/repositories/user.repo";
import cloudinary from "~/utils/cloudinary";
import getDataUri from "~/utils/datauri";

const SENTINEL = "__NONE__";
const TTL_SECONDS = 24 * 60 * 60;

class UserService {
  static getUserProfilePublic = async ({ userId }) => {
    const user = await findUserById({
      id: userId,
      select: [
        "full_name",
        "username",
        "biography",
        "bio_links",
        "profile_pic_url",
        "followers",
        "following",
        "posts",
        "new_highlight",
      ],
    });
    if (!user)
      throw new ErrorResponse(StatusCodes.BAD_REQUEST, "User not registered!");

    if (user.private_account) {
      return {
        fullName: user.full_name,
        username: user.username,
        biography: user.biography,
        bio_links: user.bio_links,
        profilePicture: user.profile_pic_url,
        followers_count: user.followers.length,
        following_count: user.following.length,
        posts_count: user.posts.length,
      };
    }

    let newHighlights = [];
    if (user.new_highlight.length > 0) {
      newHighlights = await highlightModel.find({
        _id: { $in: user.new_highlight },
      });
    }

    return {
      fullName: user.full_name,
      username: user.username,
      biography: user.biography,
      bio_links: user.bio_links,
      profilePicture: user.profile_pic_url,
      followers_count: user.followers.length,
      following_count: user.following.length,
      posts_count: user.posts.length,
      newHighlights,
    };
  };

  static getUserProfile = async ({ otherUserName, userName }) => {
    if (userName === otherUserName) {
      const user = await findUserByUsername({
        username: userName,
        select: [
          "_id",
          "full_name",
          "username",
          "biography",
          "bio_links",
          "profile_pic_url",
          "hd_profile_pic_url",
          "followers",
          "following",
          "postsCount",
          "reelsCount",
          "is_verified",
          "private_account",
          "gender",
          "geoLocation",
        ],
      });

      if (!user) {
        throw new ErrorResponse(
          StatusCodes.BAD_REQUEST,
          "User not registered!"
        );
      }

      return {
        _id: user._id,
        friendshipStatus: null,
        fullName: user.full_name,
        username: user.username,
        biography: user.biography,
        bio_links: user.bio_links,
        profilePicUrl: user.profile_pic_url,
        hdProfilePicUrl: user.hd_profile_pic_url,
        followersCount: user.followers,
        followingCount: user.following,
        postsCount: user.postsCount,
        reelsCount: user.reelsCount,
        isVerified: user.is_verified,
        isPrivate: user.private_account,
        gender: user.gender,
        geoLocation: user.geoLocation,
      };
    }

    const [user, otherUser] = await Promise.all([
      findUserByUsername({
        username: userName,
        select: ["blocked_users"],
      }),
      findUserByUsername({
        username: otherUserName,
        select: [
          "_id",
          "full_name",
          "username",
          "biography",
          "bio_links",
          "profile_pic_url",
          "hd_profile_pic_url",
          "followers",
          "following",
          "postsCount",
          "reelsCount",
          "is_verified",
          "private_account",
          "gender",
          "blocked_users",
        ],
      }),
    ]);

    if (!otherUser) {
      throw new ErrorResponse(StatusCodes.BAD_REQUEST, "User not exist!");
    }

    if (otherUser.blocked_users?.includes(userName)) {
      return {
        fullName: otherUser.full_name,
        username: otherUser.username,
        isBlocked: true,
      };
    }

    if (user.blocked_users?.includes(otherUserName)) {
      return {
        fullName: otherUser.full_name,
        username: otherUser.username,
        blocked: true,
      };
    }

    const [isFollowing, isFollowedBy] = await Promise.all([
      Follow.exists({ user: user?._id, target: otherUser?._id }),
      Follow.exists({ user: otherUser?._id, target: user?._id }),
    ]);

    const response = {
      _id: otherUser._id,
      friendshipStatus: {
        isFollowing: !!isFollowing,
        isFollowedBy: !!isFollowedBy,
        isBlocked: false,
      },
      fullName: otherUser.full_name,
      username: otherUser.username,
      biography: otherUser.biography,
      bio_links: otherUser.bio_links,
      profilePicUrl: otherUser.profile_pic_url,
      hdProfilePicUrl: otherUser.hd_profile_pic_url,
      followersCount: otherUser.followers,
      followingCount: otherUser.following,
      postsCount: otherUser.postsCount,
      reelsCount: otherUser.reelsCount,
      isVerified: otherUser.is_verified,
      isPrivate: otherUser.private_account,
      gender: otherUser.gender,
    };

    if (otherUser.private_account && !isFollowing) {
      return {
        ...response,
        biography: undefined,
        bio_links: undefined,
        postsCount: undefined,
      };
    }

    return response;
  };

  static editProfilePicture = async ({ userId, profilePicture }) => {
    if (!profilePicture)
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        "Invalid profile picture!"
      );

    if (!profilePicture.mimetype.startsWith("image/")) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        "Invalid profile picture!"
      );
    }

    const fileUri = getDataUri(profilePicture);

    const uploadResult = await cloudinary.uploader.upload(fileUri, {
      folder: "instagram/image_picture_profile",
      resource_type: "auto",
    });

    console.log("uploadResult::", uploadResult);

    const user = await findUserByIdAndUpdate({
      id: userId,
      bodyUpdate: {
        profile_pic_url: uploadResult?.url,
        hd_profile_pic_url: uploadResult?.url,
        profile_pic_url_public: uploadResult.public_id,
      },
      select: [
        "profile_pic_url",
        "hd_profile_pic_url",
        "profile_pic_url_public",
      ],
    });

    // Đồng bộ avatar lên Firebase Firestore
    try {
      const admin = (await import("~/dbs/firebaseAdmin")).default;
      const db = admin.firestore();
      await db.collection("users").doc(userId).set(
        {
          avatar: uploadResult?.url,
        },
        { merge: true }
      );
    } catch (err) {
      console.error("Failed to sync avatar to Firebase:", err);
    }

    return {
      profilePicUrl: user.profile_pic_url,
      hdProfilePicUrl: user.hd_profile_pic_url,
    };
  };

  static editUserProfile = async ({ userId, bodyUpdate }) => {
    const { biography, bio_links, gender } = bodyUpdate;

    const user = await findUserByIdAndUpdate({
      id: userId,
      bodyUpdate: {
        bio_links,
        biography,
        gender,
      },
      select: ["biography", "bio_links", "gender"],
    });

    return {
      biography: user.biography,
      bio_links: user.bio_links,
      gender: user.gender,
    };
  };

  static followUser = async ({ userId, targetUserId }) => {
    if (userId === targetUserId) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        "Không thể tự follow chính mình"
      );
    }

    const [user, target] = await Promise.all([
      checkUserExist({ id: userId }),
      checkUserExist({ id: targetUserId }),
    ]);

    if (!user || !target) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        "Người dùng không tồn tại"
      );
    }

    try {
      await Follow.create({ user: userId, target: targetUserId });

      // Tăng số lượng follow/followers
      await Promise.all([
        findUserByIdAndUpdate({
          id: userId,
          bodyUpdate: { $inc: { following: 1 } },
        }),
        findUserByIdAndUpdate({
          id: targetUserId,
          bodyUpdate: { $inc: { followers: 1 } },
        }),
      ]);

      return { success: true, message: "Đã follow người dùng" };
    } catch (err) {
      if (err.code === 11000) {
        throw new ErrorResponse(
          StatusCodes.CONFLICT,
          "Đã follow người này rồi"
        );
      }
      throw new ErrorResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Có lỗi xảy ra"
      );
    }
  };

  static unFollowUser = async ({ userId, targetUserId }) => {
    if (userId === targetUserId) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        "Không thể unfollow chính mình"
      );
    }

    const res = await Follow.deleteOne({ user: userId, target: targetUserId });

    if (res.deletedCount === 0) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        "Bạn chưa từng follow người này"
      );
    }

    await Promise.all([
      findUserByIdAndUpdate({
        id: userId,
        bodyUpdate: { $inc: { following: -1 } },
      }),
      findUserByIdAndUpdate({
        id: targetUserId,
        bodyUpdate: { $inc: { followers: -1 } },
      }),
    ]);

    return { success: true, message: "Đã unfollow người dùng" };
  };

  static blockUser = async ({ userId, blockedId }) => {
    if (userId === blockedId) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        "Không thể block chính mình"
      );
    }

    // Kiểm tra user và target existence
    const [user, target] = await Promise.all([
      checkUserExist({ id: userId }),
      checkUserExist({ id: blockedId }),
    ]);
    if (!user)
      throw new ErrorResponse(StatusCodes.BAD_REQUEST, "Invalid request!");
    if (!target)
      throw new ErrorResponse(StatusCodes.BAD_REQUEST, "User not found!");

    // Tạo record block (unique index sẽ bảo vệ duplicate)
    await BlockedUser.create({ user: userId, blocked: blockedId });

    // Cập nhật Redis cache
    const key = `blocked:${userId}`;
    const members = await redisClient.smembers(key);

    if (members.includes(SENTINEL)) {
      // Trước đó cache đã ghi sentinel → xóa sentinel, thêm real id
      await redisClient.del(key);
      await redisClient.sadd(key, blockedId.toString());
    } else {
      // Bình thường, chỉ thêm id mới
      await redisClient.sadd(key, blockedId.toString());
    }
    await redisClient.expire(key, TTL_SECONDS);

    return {
      success: true,
      message: "User blocked successfully",
    };
  };

  static unBlockUser = async ({ userId, blockedId }) => {
    const res = await BlockedUser.deleteOne({
      user: userId,
      blocked: blockedId,
    });
    if (res.deletedCount === 0) {
      throw new ErrorResponse(
        StatusCodes.NOT_FOUND,
        "Block record không tồn tại"
      );
    }

    // Cập nhật Redis cache
    const key = `blocked:${userId}`;
    await redisClient.srem(key, blockedId.toString());

    const remain = await redisClient.smembers(key);
    if (remain.length === 0) {
      await redisClient.sadd(key, SENTINEL);
    }
    await redisClient.expire(key, TTL_SECONDS);

    return {
      success: true,
      message: "User unblocked successfully",
    };
  };

  static searchUsers = async ({ text, limit }) => {
    if (!text || text.trim().length === 0) {
      return [];
    }

    const searchText = text.trim();

    const searchResults = await searchUsersByText({ text: searchText, limit });

    const enhancedResults = searchResults.map((user) => ({
      _id: user._id,
      username: user.username,
      full_name: user.full_name,
      profile_pic_url: user.profile_pic_url,
      is_verified: user.is_verified,
    }));

    return enhancedResults;
  };

  static getSuggestedUsers = async ({ userId, limit = 10 }) => {
    const select = [
      "_id",
      "username",
      "full_name",
      "profile_pic_url",
      "is_verified",
    ];

    const users = await findSuggestedUsersToFollow({ userId, limit, select });
    return users.map((user) => ({ ...user, isFollowingAuthor: false }));
  };

  static getFollowingUsersForConversation = async ({ userId, limit = 10 }) => {
    const select = [
      '_id',
      'username',
      'full_name',
      'profile_pic_url',
      'is_verified',
    ];
    const users = await findUsersFollowing({ userId, limit, select });
    return users;
  };
}

export default UserService;
