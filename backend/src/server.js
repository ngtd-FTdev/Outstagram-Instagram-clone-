'use strict'

import 'dotenv/config'
import express from 'express'

import compression from 'compression'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { corsOptions } from './config/cors'
import env from './config/environment'
import instanceMongodb from './dbs/connectMongoDB'
import { connectRedis } from './dbs/redis'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'
import { APIs_V1 } from './routes/v1'
import { app, server, startSocket } from './sockets'

// check health render
app.use((req, res, next) => {
    if (req.url === '/healthz') {
        return res.status(200).send('OK') // Trả về 200 cho health check
    }
    next()
})

// init middlewares
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(
    express.urlencoded({
        extended: true,
    })
)

const hostname = 'localhost'
const port = 5000

// init db
instanceMongodb

// connect redis
connectRedis()

startSocket()

// init routes
app.use('/v1', APIs_V1)

// handling error
app.use(errorHandlingMiddleware)

if (env.BUILD_MODE === 'pro') {
    server.listen(process.env.PORT, () => {
        // eslint-disable-next-line no-console
        console.log(`Server started successfully!!`)
    })
} else {
    server.listen(port, hostname, () => {
        // eslint-disable-next-line no-console
        console.log(`Server started at http://${hostname}:${port}/`)
    })
}
