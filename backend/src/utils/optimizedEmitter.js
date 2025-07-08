import { emitMessageToMembers } from '~/services/messagePubSub.js'
import { syncMembersToRedis } from '~/utils/syncMembers.js'
import { addToBloomFilter, checkBloomFilter } from './bloomFilter.js'

const cachedConversations = new Set()

export const emitOptimized = async (conversationId, message) => {
    // if (!cachedConversations.has(conversationId)) {
    const exists = await checkBloomFilter(conversationId)
    if (!exists) {
        await syncMembersToRedis(conversationId)
        await addToBloomFilter(conversationId)
    }
    //     cachedConversations.add(conversationId)
    // }
    await emitMessageToMembers(conversationId, message)
}
