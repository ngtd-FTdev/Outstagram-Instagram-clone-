"use strict";

import _ from "lodash";
import { Types } from "mongoose";
import { CONVERSATION_MEMBER_TTL_SECONDS } from "~/constants";
import admin from "~/dbs/firebaseAdmin";
import { redisClient } from "~/dbs/redis";

import userModel from "~/models/userModel";

const db = admin.firestore();

export const getInfoData = ({ filled = [], object = {} }) => {
  return _.pick(object, filled);
};

export const findUserByEmail = async ({
  email,
  select = {
    full_name: 1,
    username: 1,
    email: 1,
    password: 1,
    profile_pic_url: 1,
    hd_profile_pic_url: 1,
    name: 1,
    status: 1,
    roles: 1,
    followers: 1,
    following: 1,
    postsCount: 1,
    is_verified: 1,
    private_account: 1,
  },
}) => {
  return await userModel.findOne({ email }).select(select).lean();
};

export const convertToObjectIdMongodb = (id) => {
  return Types.ObjectId.createFromHexString(id);
};

export const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

export const getUnSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

export const updateNestedObject = (obj) => {
  const final = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      const response = updateNestedObject(obj[key]);
      Object.keys(response).forEach((keyResponse) => {
        final[`${key}.${keyResponse}`] = response[keyResponse];
      });
    } else {
      final[key] = obj[key];
    }
  });
  return final;
};

export const parseCookies = (cookieString) => {
  if (!cookieString) return {};
  return Object.fromEntries(cookieString.split("; ").map((c) => c.split("=")));
};

export const getRecipientTokens = async (userIds) => {
  if (!Array.isArray(userIds) || userIds.length === 0) return [];
  const keys = userIds.map((uid) => `user:tokens:${uid}`);
  const cached = await redisClient.mGet(...keys);

  const tokens = [];
  const missingUserIds = [];

  cached.forEach((entry, i) => {
    if (entry) {
      tokens.push(...JSON.parse(entry));
    } else if (userIds[i]) {
      missingUserIds.push(userIds[i]);
    }
  });

  if (missingUserIds.length > 0) {
    const missingDocs = await Promise.all(
      missingUserIds.map((uid) => db.collection("user_tokens").doc(uid).get())
    );

    for (let i = 0; i < missingDocs.length; i++) {
      const doc = missingDocs[i];
      const uid = missingUserIds[i];
      const tokenMap = doc.exists ? doc.data() || {} : {};
      const userTokens = Object.values(tokenMap);

      if (userTokens.length > 0) {
        tokens.push(...userTokens);
        redisClient.set(
          `user:tokens:${uid}`,
          JSON.stringify(userTokens),
          "EX",
          300
        );
      }
    }
  }

  return tokens;
};

export const addMessageDB = async ({
  groupId,
  senderUserId,
  messageType,
  content,
  gifUrl = null,
  reactions = {},
  replyMessageId = null,
}) => {
  const msgRef = db
    .collection("conversations")
    .doc(groupId)
    .collection("messages")
    .doc();
  const payload = {
    messageId: msgRef.id,
    from: senderUserId,
    timestamp: Date.now(),
    messageType,
    gifUrl,
    replyMessageId,
    reactions,
    ...content,
  };
  await msgRef.set(payload);
  return payload;
};

export async function updateUserConversationsBatch({
  memberIds,
  groupId,
  senderId,
  lastMessage,
  timestamp,
}) {
  const batch = db.batch();

  for (const uid of memberIds) {
    const isSender = uid === senderId;

    const convRef = db
      .collection("user_conversations")
      .doc(uid)
      .collection("groups")
      .doc(groupId);

    batch.set(
      convRef,
      {
        lastTimestamp: timestamp,
        unreadCount: isSender ? 0 : admin.firestore.FieldValue.increment(1),
        conversationMeta: {
          lastMessage,
          updatedAt: timestamp,
        },
      },
      { merge: true }
    );
  }

  await batch.commit();
}

export const generateUnreadUpdates = (recipients, groupId, count) => {
  const updates = {};
  recipients.forEach((uid) => {
    updates[`user_conversations/${uid}/groups/${groupId}`] = {
      lastTimestamp: admin.firestore.FieldValue.serverTimestamp(),
      unreadCount: admin.firestore.FieldValue.increment(count),
    };
  });
  return updates;
};

export const sendSmartNotification = async ({
  groupId,
  messages,
  recipients,
  latestText,
}) => {
  const tokens = await getRecipientTokens(recipients);

  if (!Array.isArray(tokens) || tokens.length === 0) {
    return;
  }

  const notification = {
    title: "Tin nhắn mới",
    // body: latestText
    //   ? `${senderName}: ${latestText}`
    //   : `${senderName} đã gửi ${messages.length} ảnh`,
    body: "Tin nhắn mới!",
  };
  const payload = {
    notification,
    data: {
      groupId,
      latestMessageId: messages[messages.length - 1].messageId,
      senderUserId: messages[0].from,
      messageTypes: [...new Set(messages.map((m) => m.messageType))].join(","),
    },
  };
  await admin.messaging().sendToDevice(tokens, payload);
};

export const buildLastMessagePayload = (msg) => {
  if (!msg) return null;
  console.log("msg::", msg);
  return {
    text: msg.messageType === "text" ? msg.text : "media",
    timestamp: msg.createdAt || Date.now(),
    senderId: msg.from,
    type: msg.messageType,
    id: msg.messageId
  };
};

export const checkMembersForConversation = async ({ groupId, userId }) => {
  const db = admin.firestore();

  // 1. Lấy memberIds từ Redis (cache), fallback Firestore
  const redisKey = `conversation:members:${groupId}`;
  let memberIds;

  const cached = await redisClient.get(redisKey);
  if (cached) {
    memberIds = JSON.parse(cached);
  } else {
    const groupDoc = await db.collection("conversations").doc(groupId).get();
    if (!groupDoc.exists) throw new Error("Conversation not found");

    const membersMap = groupDoc.data()?.members || {};
    memberIds = Object.keys(membersMap);

    await redisClient.set(
      redisKey,
      JSON.stringify(memberIds),
      "EX",
      CONVERSATION_MEMBER_TTL_SECONDS
    );
  }

  if (!memberIds.includes(userId)) {
    throw new Error("Sender is not a member of the conversation");
  }

  return memberIds;
};
