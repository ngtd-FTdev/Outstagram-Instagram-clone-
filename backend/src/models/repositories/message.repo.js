import { StatusCodes } from 'http-status-codes'
import ErrorResponse from '~/core/errorResponse'
import {
    convertToObjectIdMongodb,
    getSelectData,
    getUnSelectData,
} from '~/utils/algorithms'
import { errorMessageRes } from '~/utils/socketMessage'
import conversationModel from '../conversation.model'
import messageModel from '../message.model'

export const getConversationsForSidebar = async ({
    userId,
    select,
    unSelect,
    limit = 15,
}) => {
    const filter = {
        members: convertToObjectIdMongodb(userId),
        hasMessages: true,
    }

    const conversations = await conversationModel
        .find(filter)
        .sort({ updatedAt: -1 })
        .limit(limit)
        .select(getSelectData(select))
        .select(getUnSelectData(unSelect))
        .populate('members', '_id username profile_pic_url')
        .lean()

    return conversations
}

export const getConversationById = async ({
    conversationId,
    select,
    unSelect,
}) => {
    const filter = {
        _id: convertToObjectIdMongodb(conversationId),
    }

    const conversation = await conversationModel
        .findOne(filter)
        .select(getSelectData(select))
        .select(getUnSelectData(unSelect))
        .populate('members', '_id username profile_pic_url')
        .lean()

    return conversation
}

export const getMessagesByConversationId = async ({
    conversationId,
    select,
    unSelect,
    limit = 15,
    lastMessageId,
}) => {
    const filter = { conversation: convertToObjectIdMongodb(conversationId) }

    if (lastMessageId) {
        filter._id = { $lt: convertToObjectIdMongodb(lastMessageId) }
    }

    const conversation = await messageModel
        .find(filter)
        .sort({ updatedAt: -1 })
        .limit(limit)
        .select(getSelectData(select))
        .select(getUnSelectData(unSelect))
        .populate('reply', '_id type message media media_url updatedAt')
        .lean()

    return conversation
}

export const getMessageById = async ({
    conversationId,
    messageId,
    select,
    unSelect,
}) => {
    const filter = {
        _id: convertToObjectIdMongodb(messageId),
        conversation: convertToObjectIdMongodb(conversationId),
    }

    const conversation = await messageModel
        .find(filter)
        .sort({ updatedAt: -1 })
        .select(getSelectData(select))
        .select(getUnSelectData(unSelect))
        .populate('sender_id', 'full_name username profile_pic_url')
        .populate('reply', '_id type message media media_url updatedAt')
        .lean()

    return conversation
}

export const getLatestMessage = async ({
    conversationId,
    select,
    unSelect,
}) => {
    const message = await messageModel
        .find({ conversation: convertToObjectIdMongodb(conversationId) })
        .sort({ updatedAt: -1 })
        .select(getSelectData(select))
        .select(getUnSelectData(unSelect))
        .populate('sender_id', 'full_name username profile_pic_url')
        .populate('reply', '_id type message media media_url updatedAt')
        .lean()

    return message
}

export const getPositionMessageById = async ({
    conversationId,
    messageId,
    select,
    unSelect,
    messageBefore = 8,
    messageAfter = 8,
}) => {
    const convId = convertToObjectIdMongodb(conversationId)
    const msgId = convertToObjectIdMongodb(messageId)

    // Lấy tin nhắn mục tiêu
    const targetMessage = await messageModel
        .findOne({
            _id: msgId,
            conversation: convId,
        })
        .select(getSelectData(select))
        .select(getUnSelectData(unSelect))
        .populate('reply', '_id type message media media_url updatedAt')
        .lean()

    if (!targetMessage) {
        return []
    }

    // Tạo bộ lọc cho tin nhắn trước và sau
    const beforeFilter = {
        conversation: convId,
        $or: [
            { updatedAt: { $gt: targetMessage.updatedAt } },
            {
                updatedAt: targetMessage.updatedAt,
                _id: { $gt: targetMessage._id },
            },
        ],
    }

    const afterFilter = {
        conversation: convId,
        $or: [
            { updatedAt: { $lt: targetMessage.updatedAt } },
            {
                updatedAt: targetMessage.updatedAt,
                _id: { $lt: targetMessage._id },
            },
        ],
    }

    // Lấy tin nhắn trước và sau song song
    const [beforeMessages, afterMessages] = await Promise.all([
        messageModel
            .find(beforeFilter)
            .sort({ updatedAt: -1, _id: -1 })
            .limit(messageBefore)
            .select(getSelectData(select))
            .select(getUnSelectData(unSelect))
            .populate('reply', '_id type message media media_url updatedAt')
            .lean(),
        messageModel
            .find(afterFilter)
            .sort({ updatedAt: -1, _id: -1 })
            .limit(messageAfter)
            .select(getSelectData(select))
            .select(getUnSelectData(unSelect))
            .populate('reply', '_id type message media media_url updatedAt')
            .lean(),
    ])

    return [...beforeMessages, targetMessage, ...afterMessages]
}

export const createConversation = async ({ userId, members }) => {
    // Kiểm tra đầu vào
    if (!userId || !members || !Array.isArray(members)) {
        throw new ErrorResponse(
            StatusCodes.BAD_REQUEST,
            'Something went wrong!!!'
        )
    }

    // Nếu userId chưa có trong mảng members thì thêm vào
    if (!members.includes(userId)) {
        members.push(userId)
    }
    // Sắp xếp members để tránh trùng lặp do thứ tự
    const sortedMembers = [...members]
        .sort((a, b) => a.toString().localeCompare(b.toString()))
        .map((m) => convertToObjectIdMongodb(m))

    // Kiểm tra conversation đã tồn tại chưa
    const existingConversation = await conversationModel.findOne({
        members: sortedMembers,
    })

    if (existingConversation) return existingConversation

    // Tạo conversation mới
    const newConversation = await conversationModel.create({
        members: sortedMembers,
        admin_conversation: [userId], // Mặc định user tạo là admin
    })

    return newConversation
}

export const createMessage = async ({
    userId,
    conversationId,
    dataMessage,
    uuid,
}) => {
    const targetConversation = await conversationModel
        .findById(conversationId)
        .select('hasMessages members')

    if (!targetConversation.members?.includes(userId)) {
        throw new ErrorResponse(
            StatusCodes.FORBIDDEN,
            'Something went wrong!!!'
        )
    }

    try {
        const newMessage = await messageModel.create({
            sender: convertToObjectIdMongodb(userId),
            conversation: convertToObjectIdMongodb(conversationId),
            ...dataMessage,
        })

        // Kiểm tra nếu conversation chưa có tin nhắn nào (hasMessages = false)
        if (!targetConversation.hasMessages) {
            // Cập nhật hasMessages thành true
            await conversationModel.findByIdAndUpdate(conversationId, {
                hasMessages: true,
            })
        }

        newMessage.uuid = uuid
        return newMessage
    } catch (error) {
        return { errorMessage: true, uuid }
    }
}
