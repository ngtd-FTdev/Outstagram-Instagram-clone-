'use strict'

const dev = {
    BUILD_MODE: process.env.NODE_ENV || 'dev',
    MONGODB_URI: process.env.MONGODB_URI_DEV || 'mongodb://localhost:27017/',
    DATABASE_NAME: process.env.DATABASE_NAME_DEV || 'test',
    redis: {
        username: process.env.REDIS_USERNAME || 'default',
        password: process.env.REDIS_PASSWORD || '123456123456',
        host: process.env.REDIS_HOST || 'redis://localhost:...',
        port: process.env.REDIS_PORT || 11835,
    },
}

const pro = {
    BUILD_MODE: process.env.NODE_ENV || 'dev',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/',
    DATABASE_NAME: process.env.DATABASE_NAME || 'test',
    redis: {
        username: process.env.REDIS_USERNAME || 'default',
        password: process.env.REDIS_PASSWORD || '123456123456',
        host: process.env.REDIS_HOST || 'redis://localhost:...',
        port: process.env.REDIS_PORT || 11835,
    },
}

const NODE_ENV = process.env.NODE_ENV || 'dev'
const config = { dev, pro }
const env = config[NODE_ENV]

export default env
