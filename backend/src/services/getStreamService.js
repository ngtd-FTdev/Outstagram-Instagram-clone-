import { StreamClient } from "@stream-io/node-sdk";
import { StatusCodes } from "http-status-codes";
import ErrorResponse from "~/core/errorResponse";
import {
  addMessageDB,
  buildLastMessagePayload,
  checkMembersForConversation,
  updateUserConversationsBatch,
} from "~/utils/algorithms";
import shortUUID from "short-uuid";

const apiKey = process.env.PUBLIC_GETSTREAM_API_KEY;
const apiSecret = process.env.GETSTREAM_SECRET_KEY;

if (!apiKey || !apiSecret) {
  throw new Error("Missing Stream API credentials.");
}

// ✅ Khởi tạo một StreamClient dùng chung
const streamClient = new StreamClient(apiKey, apiSecret);

export async function generateStreamToken({ userId }) {
  if (!userId) {
    throw new ErrorResponse(StatusCodes.BAD_REQUEST, "User ID is required");
  }

  const validity = 60 * 60; // 1 giờ

  return streamClient.generateUserToken({
    user_id: userId,
    validity_in_seconds: validity,
  });
}

export async function createStreamCall({
  groupId,
  callerId,
  description = "Instant calling",
  type = "default",
}) {
  const otherMemberIds = await checkMembersForConversation({
    groupId,
    userId: callerId,
  });

  const members = otherMemberIds.map((id) => ({ user_id: id }));
  const callId = shortUUID().generate();

  const call = streamClient.video.call(type, callId);

  const response = await call.getOrCreate({
    ring: true,
    settings: {
      ring: {
        incoming_call_timeout_ms: 30000,
        auto_cancel_timeout_ms: 30000,
        missed_call_timeout_ms: 30000,
      },
    },
    data: {
      created_by_id: callerId,
      starts_at: new Date().toISOString(),
      members,
      custom: { description, chatId: groupId },
    },
  });

  const timestamp = Date.now();

  if (response && response.call) {
    const systemCallMessage = await addMessageDB({
      groupId,
      senderUserId: callerId,
      messageType: "system_call",
      content: {
        text: "started an audio call",
        type,
      },
    });

    updateUserConversationsBatch({
      memberIds: [...otherMemberIds, callerId],
      groupId,
      senderId: callerId,
      lastMessage: buildLastMessagePayload(systemCallMessage),
      timestamp,
    });

    return {
      success: true,
      callId,
      type,
    };
  } else {
    throw new Error("Failed to create call - no response received");
  }
}

export async function leaveStreamCall({ callId, userId }) {
  try {
    const call = streamClient.video.call("default", callId);
    await call.get();
    await call.updateCallMembers({ remove_members: [userId] });
    return { left: true };
  } catch (error) {
    console.error(`User ${userId} failed to leave call ${callId}:`, error);
    return { left: false, error: error.message };
  }
}
