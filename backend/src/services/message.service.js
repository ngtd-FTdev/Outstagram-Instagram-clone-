"use strict";

import { StatusCodes } from "http-status-codes";
import shortUUID from "short-uuid";
import { CONVERSATION_MEMBER_TTL_SECONDS } from "~/constants";
// import { nanoid } from "nanoid";
import ErrorResponse from "~/core/errorResponse";
import admin from "~/dbs/firebaseAdmin";
import { redisClient } from "~/dbs/redis";
import {
  createConversation,
  createMessage,
  getConversationsForSidebar,
  getMessagesByConversationId,
} from "~/models/repositories/message.repo";
import userModel from "~/models/userModel";
import {
  addMessageDB,
  buildLastMessagePayload,
  checkMembersForConversation,
  sendSmartNotification,
} from "~/utils/algorithms";
import cloudinary from "~/utils/cloudinary";
import getDataUri from "~/utils/datauri";
import { emitOptimized } from "~/utils/optimizedEmitter";
import { syncMembersToRedis } from "~/utils/syncMembers";

class MessageService {
  static getConversationsForSidebar = async ({ userId }) => {
    const conversations = await getConversationsForSidebar({ userId });

    return conversations;
  };

  static getMessages = async ({ userId, body }) => {
    const conversations = await getMessagesByConversationId({ userId });

    return conversations;
  };

  static getPositionMessageById = async () => {
    const result = await redisClient.set("hello", "hello world!!");
    return result;
  };

  static createConversation = async ({ userId, members }) => {
    const newConversation = await createConversation({ userId, members });
    await syncMembersToRedis(newConversation._id.toString());

    return newConversation;
  };

  static sendMessage = async ({
    groupId,
    senderUserId,
    text = null,
    gifUrl = null,
    replyMessageId = null,
    files = [],
    audio = null,
    duration = null,
  }) => {
    const db = admin.firestore();
    const now = Date.now();

    let memberIds = await checkMembersForConversation({
      groupId,
      userId: senderUserId,
    });

    const recipients = memberIds.filter((uid) => uid !== senderUserId);
    const messages = [];

    // 2. Nếu có audio (voice message)
    if (audio) {
      const dataUri = getDataUri(audio);
      const uploadRes = await cloudinary.uploader.upload(dataUri, {
        folder: "chat_audio",
        resource_type: "auto",
      });

      const msg = await addMessageDB({
        groupId,
        senderUserId,
        messageType: "voice",
        content: {
          audioUrl: uploadRes.secure_url,
          duration: duration || 0,
        },
        replyMessageId,
        reactions: {
          count: 0,
          emojis: {}, // Format: { "emoji": { "userId": timestamp } }
        },
      });

      console.log("msg::", msg);

      messages.push(msg);
    } else if (text) {
      // 3. Nếu có text
      const msg = await addMessageDB({
        groupId,
        senderUserId,
        messageType: "text",
        content: { text },
        replyMessageId,
        reactions: {
          count: 0,
          emojis: {}, // Format: { "emoji": { "userId": timestamp } }
        },
      });
      messages.push(msg);
    } else if (gifUrl) {
      const msg = await addMessageDB({
        groupId,
        senderUserId,
        messageType: "gif",
        gifUrl: gifUrl,
        replyMessageId,
        reactions: {
          count: 0,
          emojis: {}, // Format: { "emoji": { "userId": timestamp } }
        },
      });
      messages.push(msg);
    }

    // 4. Nếu có files
    if (files.length > 0) {
      for (const file of files) {
        const dataUri = getDataUri(file);
        const uploadRes = await cloudinary.uploader.upload(dataUri, {
          folder: "chat_media",
          resource_type: "auto",
        });

        const mediaType = file.mimetype.startsWith("image/")
          ? "image"
          : "video";

        const msg = await addMessageDB({
          groupId,
          senderUserId,
          messageType: mediaType,
          content: { mediaUrl: uploadRes.secure_url },
          replyMessageId,
          reactions: {
            count: 0,
            emojis: {}, // Format: { "emoji": { "userId": timestamp } }
          },
        });

        messages.push(msg);
      }
    }

    // 5. Batch update Firestore: unreadCount + lastTimestamp
    const batch = db.batch();

    const senderConvRef = db
      .collection("user_conversations")
      .doc(senderUserId)
      .collection("groups")
      .doc(groupId);

    batch.set(
      senderConvRef,
      {
        lastTimestamp: now,
        unreadCount: 0,
        conversationMeta: {
          lastMessage: buildLastMessagePayload(messages[messages.length - 1]),
          updatedAt: now,
        },
      },
      { merge: true }
    );

    for (const uid of recipients) {
      const ref = db
        .collection("user_conversations")
        .doc(uid)
        .collection("groups")
        .doc(groupId);

      batch.set(
        ref,
        {
          lastTimestamp: now,
          unreadCount: admin.firestore.FieldValue.increment(messages.length),
          conversationMeta: {
            lastMessage: buildLastMessagePayload(messages[messages.length - 1]),
            updatedAt: now,
          },
        },
        { merge: true }
      );
    }

    await batch.commit();

    // 6. Gửi thông báo
    if (recipients.length) {
      await sendSmartNotification({
        groupId,
        messages,
        recipients,
        latestText: text,
        replyMessageId,
      });
    }

    return messages;
  };

  static createGroupConversation = async ({ memberIds }) => {
    if (memberIds.length <= 1) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        "MemberIds is required and must be at least 2"
      );
    }

    const db = admin.firestore();
    const now = Date.now();
    const translator = shortUUID();
    const groupId = translator.new();

    // 1. Validate userIds + lấy tên user để sinh tên nhóm
    const validUsers = await userModel
      .find({ _id: { $in: memberIds } })
      .select("_id full_name username profile_pic_url is_verified");

    const validUserIds = validUsers.map((u) => u._id.toString());
    if (validUserIds.length !== memberIds.length) {
      throw new Error("Invalid userIds");
    }

    const isOneToOne = validUserIds.length === 2;
    const sortedIds = isOneToOne ? [...validUserIds].sort() : null;

    // 2. Check existing 1:1 conversation
    if (isOneToOne) {
      const convQuery = db
        .collection("conversations")
        .where("memberCount", "==", 2)
        .where("sortedMembers", "==", sortedIds)
        .limit(1);

      const snapshot = await convQuery.get();
      if (!snapshot.empty) {
        const existingConv = snapshot.docs[0];
        return {
          groupId: existingConv.id,
          members: Object.keys(existingConv.data().members),
          createdAt: existingConv.data().createdAt,
          updatedAt: existingConv.data().updatedAt,
          existing: true,
        };
      }
    }

    // 3. Sinh tên nhóm tự động (nếu là group nhiều hơn 2 người)
    let groupType = "one_to_one";
    if (!isOneToOne) {
      groupType = "group";
    }

    // 4. Tạo membersObj
    const membersObj = Object.fromEntries(
      validUserIds.map((uid) => [uid, true])
    );

    // 5. Tạo transaction ghi dữ liệu Firestore
    const result = await db.runTransaction(async (transaction) => {
      const convRef = db.collection("conversations").doc(groupId);

      const readStatus = Object.fromEntries(
        validUserIds.map((uid) => [uid, null])
      );

      const conversationData = {
        members: membersObj,
        memberCount: validUserIds.length,
        createdAt: now,
        updatedAt: now,
        groupName: null,
        groupType,
        groupAvatar: null,
        readStatus,
      };

      if (isOneToOne) {
        conversationData.sortedMembers = sortedIds;
        conversationData.groupName = null;
      }

      transaction.set(convRef, conversationData);

      for (const uid of validUserIds) {
        const userConvRef = db
          .collection("user_conversations")
          .doc(uid)
          .collection("groups")
          .doc(groupId);

        transaction.set(userConvRef, {
          lastTimestamp: now,
          unreadCount: 0,
          conversationMeta: {
            groupId,
            memberIds: validUserIds,
            createdAt: now,
            updatedAt: now,
            lastMessage: null,
            seenMessageId: null,
            groupName: null,
            groupAvatar: null,
            groupType,
          },
        });
      }

      return {
        groupId,
        members: validUserIds,
        createdAt: now,
        groupName: null,
      };
    });

    return result;
  };

  static updateMessage = async ({
    userId,
    messageId,
    conversationId,
    dataMessage,
    fileMedias,
  }) => {
    dataMessage.type = "text";
    if (fileMedias && fileMedias?.length > 0) {
      const uploadReponse = await Promise.all(
        fileMedias.map(async (obj) => {
          const file = await cloudinary.uploader.upload(getDataUri(obj), {
            folder: "instagram/media_messages",
            resource_type: "auto",
          });
          return file.secure_url;
        })
      );

      dataMessage.media_url = uploadReponse || [];
      dataMessage.type = "media";
      if (fileMedias[0].mimetype.startsWith("image/")) {
        dataMessage.media = "image";
      } else if (fileMedias[0].mimetype.startsWith("video/")) {
        dataMessage.media = "video";
      } else {
        throw new ErrorResponse(StatusCodes.BAD_REQUEST, "Invalid media file");
      }
    }

    const newMessage = await createMessage({
      conversationId,
      userId,
      dataMessage,
    });

    await emitOptimized(conversationId, newMessage);

    return newMessage;
  };

  static getUserDataForConversations = async ({ ids }) => {
    if (!ids || ids.length === 0) return [];

    const result = [];
    const missingIds = [];

    const redisKeys = ids.map((id) => `user:chat:${id}`);
    const cachedValues = await redisClient.mGet(...redisKeys);

    cachedValues.forEach((val, index) => {
      if (val) {
        result.push(JSON.parse(val));
      } else {
        const missingId = ids[index];
        if (missingId) missingIds.push(missingId);
      }
    });

    if (missingIds.length > 0) {
      const users = await userModel
        .find({ _id: { $in: missingIds } })
        .select("_id full_name username profile_pic_url is_verified");

      await Promise.all(
        users.map((user) => {
          const userData = {
            userId: user._id.toString(),
            full_name: user.full_name,
            username: user.username,
            avatar: user.profile_pic_url_public,
            isVerified: user.is_verified,
          };

          result.push(userData);

          return redisClient.set(
            `user:chat:${userData.userId}`,
            JSON.stringify(userData),
            "EX",
            86400
          );
        })
      );
    }

    return result;
  };

  static toggleReaction = async ({ conversationId, messageId, userId, emoji, isAdd }) => {
    const db = admin.firestore();
    const now = Date.now();

    // Validate input parameters
    if (!conversationId || !messageId || !userId || !emoji) {
      throw new Error("Missing required parameters: conversationId, messageId, userId, emoji");
    }

    const messageRef = db
      .collection("conversations")
      .doc(conversationId)
      .collection("messages")
      .doc(messageId);

    await db.runTransaction(async (transaction) => {
      const messageDoc = await transaction.get(messageRef);
      if (!messageDoc.exists) {
        throw new Error("Message not found");
      }

      const messageData = messageDoc.data();
      const reactions = messageData.reactions || { count: 0, emojis: [] };
      
      // Đảm bảo emojis là array
      if (!Array.isArray(reactions.emojis)) {
        reactions.emojis = [];
      }

      if (isAdd) {
        // Thêm reaction mới
        const existingReactionIndex = reactions.emojis.findIndex(item => item[userId]);
        if (existingReactionIndex === -1) {
          // Chưa có reaction của user này, thêm mới
          const newReaction = {};
          newReaction[userId] = emoji;
          reactions.emojis.push(newReaction);
          reactions.count++;
        } else {
          // Đã có reaction, cập nhật emoji
          reactions.emojis[existingReactionIndex][userId] = emoji;
        }
      } else {
        // Xóa reaction
        const existingReactionIndex = reactions.emojis.findIndex(item => item[userId]);
        if (existingReactionIndex !== -1) {
          reactions.emojis.splice(existingReactionIndex, 1);
          reactions.count--;
        }
      }

      transaction.update(messageRef, { reactions });
    });

    return {
      conversationId,
      messageId,
      userId,
      emoji,
      isAdd,
    };
  };

  static getMessageReactions = async (messageId) => {
    const db = admin.firestore();

    const reactionsSnapshot = await db
      .collection("message_reactions")
      .where("messageId", "==", messageId)
      .get();

    // Nhóm reactions theo emoji
    const reactionsByEmoji = {};
    reactionsSnapshot.forEach((doc) => {
      const data = doc.data();
      if (!reactionsByEmoji[data.emoji]) {
        reactionsByEmoji[data.emoji] = [];
      }
      reactionsByEmoji[data.emoji].push({
        userId: data.userId,
        createdAt: data.createdAt,
      });
    });

    return reactionsByEmoji;
  };
}

export default MessageService;
