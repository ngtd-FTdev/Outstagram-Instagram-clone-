'use strict'

import { Server } from 'socket.io'
import { authenticationSocket } from '~/auth/authUtils'
import { redisClient } from '~/dbs/redis'
import { setupSubscriber } from '~/services/messagePubSub'
import { WHITELIST_DOMAINS } from '~/utils/constants'

import express from 'express'
import http from 'http'

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
    pingInterval: 10000,
    pingTimeout: 5000,
    cors: { origin: WHITELIST_DOMAINS, methods: ['GET', 'POST'] },
})

export const startSocket = () => {
    io.use(authenticationSocket)
    io.on('connection', async (socket) => {
        console.log(`User connected: (${socket.id})`)

        // const userId = socket.handshake.user[HEADER.CLIENT_ID]

        // redisClient.sadd(`userSockets:${userId}`, socket.id)
        // console.log('object')

        socket.on('disconnect', () => {
            console.log(
                `User disconnected: ${socket.user.username} (${socket.id})`
            )
        })
    })

    setupSubscriber(io)
}

export { app, io, server }
