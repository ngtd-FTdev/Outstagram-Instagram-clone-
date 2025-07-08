import { redisClient } from '~/dbs/redis'

const BLOOM_KEY = 'conversation_bloom_filter'

export const checkBloomFilter = async (conversationId) => {
    return await redisClient.bf.exists(BLOOM_KEY, conversationId)
}

export const addToBloomFilter = async (conversationId) => {
    await redisClient.bf.add(BLOOM_KEY, conversationId)
}
