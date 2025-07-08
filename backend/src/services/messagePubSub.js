import { StatusCodes } from 'http-status-codes'
import logger from '~/config/logger'
import ErrorResponse from '~/core/errorResponse'
import { redisClient } from '~/dbs/redis'

// Đường dẫn tới file Lua script
// Lua script để publish message đến các user channel dựa trên danh sách thành viên (set)
const publishScript = `
local conversationKey = KEYS[1]
local message = ARGV[1]
local members = redis.call('SMEMBERS', conversationKey)
for _, memberId in ipairs(members) do
  redis.call('PUBLISH', 'user:' .. memberId, message)
end
return #members
`

let scriptSha = null

// Hàm load script lên Redis và lưu lại SHA
export const loadLuaScript = async () => {
    try {
        scriptSha = await redisClient.sendCommand([
            'SCRIPT',
            'LOAD',
            publishScript,
        ])

        console.log('Lua script loaded!')
    } catch (error) {
        console.error('Error loading Lua script:', error)
        logger.error(`Error loading Lua script: ${error.message}`)
        throw ErrorResponse(StatusCodes.BAD_REQUEST, 'Something went wrong!!')
    }
}

// Hàm publish message tới các thành viên
export const emitMessageToMembers = async (conversationId, message) => {
    if (!scriptSha) {
        await loadLuaScript()
    }
    const key = `conversation:${conversationId}:members`
    try {
        return await redisClient.evalSha(scriptSha, {
            keys: [key],
            arguments: [JSON.stringify(message)],
        })
    } catch (error) {
        if (error.message.includes('NOSCRIPT')) {
            // Xử lý trường hợp script bị mất
            logger.warn('Reloading Lua script...')
            await loadLuaScript()
            return emitMessageToMembers(conversationId, message)
        }
        logger.error('Error executing Lua script:', error)
        throw ErrorResponse(StatusCodes.BAD_REQUEST, 'Something went wrong!!')
    }
}

// Thiết lập Redis Subscriber để lắng nghe message theo pattern user:*
export const setupSubscriber = async (io) => {
    try {
        const subscriber = redisClient.duplicate()
        await subscriber.connect()
        await subscriber.pSubscribe('user:*', (message, channel) => {
            const userId = channel.replace('user:', '')
            io.to(`user:${userId}`).emit('new_message', JSON.parse(message))
        })
        logger.info('Redis subscriber connected')
    } catch (error) {
        logger.error('Failed to setup Redis subscriber:', error)
        process.exit(1)
    }
}
