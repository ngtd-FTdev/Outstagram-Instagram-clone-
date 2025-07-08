import { createClient } from 'redis'
import env from '~/config/environment'
import logger from '~/config/logger'
import { loadLuaScript } from '~/services/messagePubSub'

const { redis: redisConfig } = env

const redisClient = createClient({
    username: redisConfig.username,
    password: redisConfig.password,
    socket: {
        host: redisConfig.host,
        port: redisConfig.port,
        reconnectStrategy: (attempts) => {
            const delay = Math.min(attempts ** 2 * 100, 5000)
            logger.warn(
                `Redis reconnecting attempt ${attempts}, next try in ${delay}ms`
            )
            return delay
        },
        keepAlive: 10000,
    },
    pingInterval: 60000,
})

const connectRedis = async () => {
    try {
        await redisClient.connect()
        logger.info('Redis client connected')
        await loadLuaScript()
    } catch (error) {
        logger.error(`Redis connection error: ${error.message}`)
        process.exit(1)
    }
}

redisClient.on('error', (err) => {
    logger.error(`Redis error: ${err.message}`)
})

export { connectRedis, redisClient }
