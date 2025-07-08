"use strict";

import {
  convertToObjectIdMongodb,
  getSelectData,
  getUnSelectData,
} from "~/utils/algorithms";
import userModel from "../userModel";
import BlockedUser from "../blockedUserSchema .js";
import Follow from "../followModel.js.js";

export const findUserById = async ({ id, select, unSelect }) => {
  const optionSelect = select
    ? getSelectData(select)
    : getUnSelectData(unSelect);
  const found = await userModel
    .findById(convertToObjectIdMongodb(id))
    .select(optionSelect);
  return found;
};

export const checkUserExist = async ({ id }) => {
  const found = await userModel.exists({ _id: convertToObjectIdMongodb(id) });
  return found;
};

export const findUserByIdAndUpdate = async ({
  id,
  bodyUpdate,
  select,
  unSelect,
}) => {
  const optionSelect = select
    ? getSelectData(select)
    : getUnSelectData(unSelect);

  return await userModel
    .findByIdAndUpdate(id, bodyUpdate, { new: true })
    .select(optionSelect)
    .lean();
};

export const searchUsersByText = async ({ text, limit = 10 }) => {
  if (!text || text.trim().length === 0) return [];

  const searchText = text.trim();
  const regex = new RegExp(searchText, 'i'); // Tìm kiếm không phân biệt hoa thường

  // Tìm trước bằng regex
  const usersByRegex = await userModel.find({
    $or: [
      { full_name: regex },
      { username: regex }
    ]
  })
  .limit(limit)
  .select("_id full_name username profile_pic_url is_verified")
  .lean();

  // Nếu đã đủ số lượng kết quả thì trả về luôn
  if (usersByRegex.length >= limit) {
    return usersByRegex;
  }

  // Nếu chưa đủ, bổ sung kết quả bằng text search
  const remainingLimit = limit - usersByRegex.length;

  const usersByText = await userModel.find(
    { 
      $text: { $search: searchText },
      _id: { $nin: usersByRegex.map(u => u._id) } // Tránh trùng
    },
    { score: { $meta: "textScore" } }
  )
  .sort({ score: { $meta: "textScore" } })
  .limit(remainingLimit)
  .select("_id full_name username profile_pic_url is_verified")
  .lean();

  return [...usersByRegex, ...usersByText];
};

export const findSuggestedUsersToFollow = async ({
  userId,
  limit = 10,
  select,
  unSelect,
}) => {
  const myObjectId = convertToObjectIdMongodb(userId);

  const optionSelect = select
    ? getSelectData(select)
    : getUnSelectData(unSelect);

  const pipeline = [
    { $match: { _id: { $ne: myObjectId } } },
    {
      $lookup: {
        from: "follows",
        let: { userId: myObjectId, targetId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$user", "$$userId"] },
                  { $eq: ["$target", "$$targetId"] },
                ],
              },
            },
          },
        ],
        as: "followed",
      },
    },
    {
      $lookup: {
        from: "blocked_users",
        let: { userId: myObjectId, blockedId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$user", "$$userId"] },
                  { $eq: ["$blocked", "$$blockedId"] },
                ],
              },
            },
          },
        ],
        as: "iBlocked",
      },
    },
    {
      $lookup: {
        from: "blocked_users",
        let: { userId: myObjectId, blockedId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$user", "$$blockedId"] },
                  { $eq: ["$blocked", "$$userId"] },
                ],
              },
            },
          },
        ],
        as: "blockedMe",
      },
    },
    {
      $match: {
        $expr: {
          $and: [
            { $not: [{ $first: "$followed" }] },
            { $not: [{ $first: "$iBlocked" }] },
            { $not: [{ $first: "$blockedMe" }] }
          ]
        }
      }
    },
    { $project: optionSelect },
    { $limit: limit },
  ];

  try {
    return await userModel.aggregate(pipeline);
  } catch (error) {
    console.error("Error in findSuggestedUsersToFollow:", error);
    throw new Error("Cannot find users");
  }
};

export const findUserByUsername = async ({ username, select, unSelect }) => {
  const optionSelect = select
    ? getSelectData(select)
    : getUnSelectData(unSelect);
  const found = await userModel
    .findOne({ username })
    .select(optionSelect);
  return found;
};

export const findUsersFollowing = async ({ userId, limit = 10, select = '_id full_name username profile_pic_url is_verified' }) => {
  const followingDocs = await Follow.find({ user: convertToObjectIdMongodb(userId) })
    .select('target -_id')
    .limit(limit)
    .lean();
  const followingIds = followingDocs.map((doc) => doc.target);
  if (followingIds.length === 0) return [];
  const optionSelect = select ? getSelectData(select) : undefined;
  return userModel.find({ _id: { $in: followingIds } })
    .select(optionSelect)
    .lean();
};
