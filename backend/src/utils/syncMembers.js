import logger from '~/config/logger.js'
import { redisClient } from '~/dbs/redis.js'
import conversationModel from '~/models/conversation.model'

export const syncMembersToRedis = async (conversationId) => {
    try {
        const conv = await conversationModel.findById(conversationId).lean()
        if (!conv) throw new Error('Conversation not found')

        const tempKey = `temp:conversation:${conversationId}:members`
        const finalKey = `conversation:${conversationId}:members`

        const multi = redisClient
            .multi()
            .del(tempKey)
            .sAdd(tempKey, conv.members.map(String))
            .rename(tempKey, finalKey)

        await multi.exec()
    } catch (error) {
        logger.error(`Sync members failed: ${error.message}`)
        throw error
    }
}
