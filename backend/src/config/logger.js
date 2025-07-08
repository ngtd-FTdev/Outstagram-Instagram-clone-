import axios from 'axios'
import fs from 'fs'
import path from 'path'
import winston from 'winston'
import env from './environment'

// Tạo thư mục logs nếu chưa tồn tại
if (!fs.existsSync('logs')) {
    fs.mkdirSync('logs')
}

const { combine, timestamp, printf, colorize, errors } = winston.format

const consoleFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`
})

const discordFormat = printf(({ level, message, timestamp, stack }) => {
    return (
        `**${level.toUpperCase()}** - ${timestamp}\n` +
        `\`\`\`${stack || message}\`\`\``
    )
})

class DiscordTransport extends winston.Transport {
    constructor(opts) {
        super(opts)
        this.webhookUrl = opts.webhookUrl
        this.level = opts.level || 'error'
        this.rateLimit = opts.rateLimit || 1000 // 1 giây
        this.lastSend = 0
    }

    log(info, callback) {
        const sendMessage = async () => {
            try {
                const now = Date.now()
                const delay = Math.max(
                    0,
                    this.rateLimit - (now - this.lastSend)
                )
                await new Promise((resolve) => setTimeout(resolve, delay))

                const formattedMessage = discordFormat.transform(info)
                const message = {
                    content: formattedMessage.message,
                    embeds: [
                        {
                            color: this.getColorByLevel(info.level),
                            fields: [
                                {
                                    name: 'Level',
                                    value: info.level.toUpperCase(),
                                    inline: true,
                                },
                                {
                                    name: 'Timestamp',
                                    value: info.timestamp,
                                    inline: true,
                                },
                                {
                                    name: 'Message',
                                    value: `\`\`\`${
                                        info.stack || info.message
                                    }\`\`\``,
                                },
                            ],
                        },
                    ],
                }

                // await axios.post(this.webhookUrl, message)
                this.lastSend = Date.now()
            } catch (error) {
                console.error(
                    'Discord Webhook Error:',
                    error.response?.data || error.message
                )
            } finally {
                if (typeof callback === 'function') callback()
            }
        }

        setImmediate(sendMessage)
    }

    getColorByLevel(level) {
        const colors = {
            error: 0xff0000,
            warn: 0xffa500,
            info: 0x00ff00,
            debug: 0x7289da,
        }
        return colors[level] || 0x808080
    }
}

// Cấu hình transports
const getTransports = () => {
    const transports = []

    // Console transport
    transports.push(
        new winston.transports.Console({
            format: combine(
                colorize(),
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                errors({ stack: true }),
                consoleFormat
            ),
        })
    )

    if (env.BUILD_MODE === 'pro') {
        // Discord transport
        // if (env.DISCORD_WEBHOOK_URL) {
        //     transports.push(
        //         new DiscordTransport({
        //             webhookUrl: env.DISCORD_WEBHOOK_URL,
        //             level: 'error',
        //             format: combine(
        //                 timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        //                 errors({ stack: true }),
        //                 discordFormat
        //             ),
        //             handleExceptions: true,
        //         })
        //     )
        // }

        transports.push(
            new winston.transports.File({
                filename: path.join(process.cwd(), 'logs/combined.log'),
                format: combine(
                    timestamp(),
                    errors({ stack: true }),
                    consoleFormat
                ),
            }),
            new winston.transports.File({
                filename: path.join(process.cwd(), 'logs/errors.log'),
                level: 'error',
                format: combine(
                    timestamp(),
                    errors({ stack: true }),
                    consoleFormat
                ),
            })
        )
    }

    return transports
}

// Khởi tạo logger
const logger = winston.createLogger({
    level: env.BUILD_MODE === 'dev' ? 'debug' : 'info',
    transports: getTransports(),
    exitOnError: false,
})

logger.on('error', (err) => {
    console.error('Winston logging error:', err)
})

logger.exceptions.handle(
    new winston.transports.File({
        filename: path.join(process.cwd(), 'logs/exceptions.log'),
    })
)

process.on('exit', () => {
    console.log('Closing Winston Logger...')
    logger.end()
})

export default logger
