import logger from '~/config/logger'
import { redisClient } from '~/dbs/redis'

export const getCache = async (key) => {
    try {
        const data = await redisClient.get(key)
        return data ? JSON.parse(data) : null
    } catch (error) {
        logger.error(`Get cache error: ${error.message}`)
        return null
    }
}

export const setCache = async (key, data, ttl = 3600) => {
    try {
        await redisClient.set(key, JSON.stringify(data), { EX: ttl })
        return true
    } catch (error) {
        logger.error(`Set cache error: ${error.message}`)
        return false
    }
}

export const deleteCache = async (key) => {
    try {
        if (key.includes('*')) {
            const keys = await redisClient.keys(key)
            if (keys.length > 0) {
                await redisClient.del(keys)
            }
        } else {
            await redisClient.del(key)
        }
        return true
    } catch (error) {
        logger.error(`Delete cache error: ${error.message}`)
        return false
    }
}

export const clearCache = async () => {
    try {
        await redisClient.flushDb()
        return true
    } catch (error) {
        logger.error(`Clear cache error: ${error.message}`)
        return false
    }
}
