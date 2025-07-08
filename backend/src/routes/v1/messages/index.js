"use strict";

import express from "express";
import multer from "multer";
import { authentication } from "~/auth/authUtils";
import MessageController from "~/controllers/messageController";
import MessageValidation from '~/validations/messageValidation';

const uploadMediaChat = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 10, // max 10 file
    fileSize: 13 * 1024 ** 2, // mỗi file tối đa 13MB
  },
  fileFilter: (req, file, cb) => {
    // Chấp nhận field 'audio' cho voice messages
    if (file.fieldname === 'audio') {
      if (file.mimetype.startsWith('audio/')) {
        return cb(null, true);
      }
      return cb(new Error('Voice message phải là file audio!'), false);
    }
    
    // Chấp nhận các field khác cho media
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/")
    ) {
      return cb(null, true);
    }
    return cb(new Error("Chỉ hỗ trợ upload ảnh hoặc video!"), false);
  },
});

const router = express.Router();

router.post(
  "/createGroupConversation",
  MessageValidation.createGroupConversation,
  MessageController.createGroupConversation
);

router.use(authentication);

router.post(
  "/sendMessage/:conversationId",
  uploadMediaChat.fields([
    { name: "files", maxCount: 10 },
    { name: "audio", maxCount: 1 },
  ]),
  MessageValidation.sendMessage,
  MessageController.sendMessage
);

router.post(
  "/toggleReaction",
  MessageValidation.toggleReaction,
  MessageController.toggleReaction
);

router.get(
  "/getConversationsForSidebar",
  MessageController.getConversationsForSidebar
);
router.get("/getConversation/:conversationId", MessageController.getMessages);

router.get(
  "/getPositionMessage/:messageId",
  MessageController.getPositionMessageById
);

router.get("/getUserDataForConversations", MessageController.getUserDataForConversations)

export const messageRouter = router;
