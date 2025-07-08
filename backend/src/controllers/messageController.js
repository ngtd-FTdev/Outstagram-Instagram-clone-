"use strict";

import { StatusCodes } from "http-status-codes";
import ErrorResponse from "~/core/errorResponse";
import MessageService from "~/services/message.service";

const { CREATED, SuccessResponse } = require("~/core/successResponse");

class MessageController {
  getConversationsForSidebar = async (req, res, next) => {
    try {
      new CREATED({
        status: StatusCodes.CREATED,
        message: "Get conversations success!",
        metadata: await MessageService.getConversationsForSidebar({
          userId: req.user.userId,
        }),
        options: {
          limit: 10,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  getMessages = async (req, res, next) => {
    try {
      new CREATED({
        status: StatusCodes.CREATED,
        message: "Get conversations success!",
        metadata: await MessageService.getMessages({
          userId: req.user.userId,
          conversationId: req.params.conversationId,
          body: req.body,
        }),
        options: {
          limit: 10,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  getPositionMessageById = async (req, res, next) => {
    try {
      new CREATED({
        status: StatusCodes.CREATED,
        message: "Get conversations success!",
        metadata: await MessageService.getPositionMessageById({
          userId: req.user.userId,
          conversationId: req.params.messageId,
        }),
        options: {
          limit: 10,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  createConversation = async (req, res, next) => {
    try {
      new CREATED({
        status: StatusCodes.CREATED,
        message: "Get conversations success!",
        metadata: await MessageService.sendMessage({
          userId: req.user.userId,
          members: req.body.members,
        }),
        options: {
          limit: 10,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  sendMessage = async (req, res, next) => {
    try {
      const { text, type, duration, replyMessageId, gifUrl } = req.body;

      const files = req.files?.files || []; // Get files from req.files instead of req.body
      const audio = req.files?.audio?.[0] || null;

      new CREATED({
        status: StatusCodes.CREATED,
        message: "Send message success!",
        metadata: await MessageService.sendMessage({
          groupId: req.params.conversationId,
          senderUserId: req.user.userId,
          text,
          replyMessageId,
          gifUrl,
          files: type === "voice" ? [] : files,
          audio: type === "voice" ? audio : null,
          duration: type === "voice" ? duration : null,
        }),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  createGroupConversation = async (req, res, next) => {
    try {
      const { groupId, memberIds } = req.body;

      new CREATED({
        status: StatusCodes.CREATED,
        message: "Send message success!",
        metadata: await MessageService.createGroupConversation({
          groupId,
          memberIds,
        }),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  getUserDataForConversations = async (req, res, next) => {
    const ids = (req.query.ids || "").split(",").filter(Boolean);

    try {
      new CREATED({
        status: StatusCodes.CREATED,
        message: "Send message success!",
        metadata: await MessageService.getUserDataForConversations({
          ids,
        }),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  toggleReaction = async (req, res, next) => {
    try {
      const { conversationId, messageId, emoji, isAdd } = req.body;
      console.log('req.body::', req.body);
      const userId = req.user.userId;
      new CREATED({
        status: StatusCodes.CREATED,
        message: isAdd ? "Add reaction success!" : "Remove reaction success!",
        metadata: await MessageService.toggleReaction({
          conversationId,
          messageId,
          userId,
          emoji,
          isAdd,
        }),
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}

export default new MessageController();
