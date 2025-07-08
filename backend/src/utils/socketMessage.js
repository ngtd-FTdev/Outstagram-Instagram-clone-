import { redisClient } from '~/dbs/redis'
import { io } from '~/sockets'

export const errorMessageRes = async ({ userId, uuid }) => {
    // Kiểm tra kết nối
    const key = `userSockets:${userId}`
    const socketIds = await redisClient.smembers(key)
    // User kết nối trên nhiều thiết bị
    if (socketIds && socketIds.length > 0) {
        socketIds.forEach((socketId) => {
            io.to(socketId).emit('errorMessage', {
                errorMessage: true,
                uuidMessage: uuid,
            })
        })
    }
}
