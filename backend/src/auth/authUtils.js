'use strict'

const JWT = require('jsonwebtoken')
import { StatusCodes } from 'http-status-codes'
import crypto from 'node:crypto'
import { HEADER } from '~/constants/HeaderHttpConstants'
import ErrorResponse from '~/core/errorResponse'
import KeyTokenService from '~/services/keyTokenService'
import { parseCookies } from '~/utils/algorithms'

export const createTokenPair = async ({ payload, privateKey }) => {
    try {
        const accessToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '2 days',
        })

        const refreshToken = await JWT.sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '7 days',
        })

        return { accessToken, refreshToken }
    } catch (error) {
        return error
    }
}

export const authentication = async (req, res, next) => {
    try {
        const userId = req.headers[HEADER.CLIENT_ID]
        if (!userId)
            throw new ErrorResponse(
                StatusCodes.UNAUTHORIZED,
                'Invalid Request!1'
            )

        const userAgent = req.headers['user-agent']
        if (!userAgent)
            throw new ErrorResponse(
                StatusCodes.UNAUTHORIZED,
                'Invalid Request!2'
            )

        const keyStore = await KeyTokenService.findKeyToken(userId, userAgent)
        if (!keyStore)
            throw new ErrorResponse(
                StatusCodes.NOT_FOUND,
                'Not found keyStore!'
            )

        const publicKeyObject = crypto.createPublicKey(keyStore.publicKey)

        if (req.cookies[HEADER.REFRESHTOKEN]) {
            try {
                const refreshToken = req.cookies[HEADER.REFRESHTOKEN]

                if (keyStore.refreshTokensUsed?.includes(refreshToken)) {
                    await KeyTokenService.deleteKeyById(userId)
                    throw new ErrorResponse(
                        StatusCodes.FORBIDDEN,
                        'Something wrong happened!! Please re-login'
                    )
                }

                const decodeUser = JWT.verify(refreshToken, publicKeyObject)

                if (userId !== decodeUser.userId)
                    throw new ErrorResponse(
                        StatusCodes.UNAUTHORIZED,
                        'Invalid Request!3'
                    )
                req.keyStore = keyStore
                req.user = decodeUser
                req.refreshToken = refreshToken

                return next()
            } catch (error) {
                return next(error)
            }
        }

        const accessToken = req.cookies[HEADER.AUTHORIZATION]
        if (!accessToken)
            throw new ErrorResponse(
                StatusCodes.UNAUTHORIZED,
                'Invalid Request!4'
            )

        const decodeUser = JWT.verify(accessToken, publicKeyObject)
        if (userId !== decodeUser.userId)
            throw new ErrorResponse(
                StatusCodes.UNAUTHORIZED,
                'Invalid Request!5'
            )

        req.keyStore = keyStore
        req.user = decodeUser
        return next()
    } catch (error) {
        return next(error)
    }
}

export const authenticationSocket = async (socket, next) => {
    try {
        const userId = socket.handshake.auth[HEADER.CLIENT_ID]
        if (!userId)
            throw new ErrorResponse(
                StatusCodes.UNAUTHORIZED,
                'Invalid Request!'
            )

        const userAgent = socket.handshake.headers['user-agent']
        if (!userAgent)
            throw new ErrorResponse(
                StatusCodes.UNAUTHORIZED,
                'Invalid Request!'
            )

        const keyStore = await KeyTokenService.findKeyToken(userId, userAgent)
        if (!keyStore)
            throw new ErrorResponse(
                StatusCodes.NOT_FOUND,
                'Not found keyStore!'
            )

        const publicKeyObject = crypto.createPublicKey(keyStore.publicKey)

        const cookies = parseCookies(socket.handshake.headers.cookie)
        // console.log('cookies::', cookies)
        const accessToken = cookies[HEADER.AUTHORIZATION]
        if (!accessToken)
            throw new ErrorResponse(
                StatusCodes.UNAUTHORIZED,
                'Invalid Request!'
            )

        const decodeUser = JWT.verify(accessToken, publicKeyObject)
        if (userId !== decodeUser.userId)
            throw new ErrorResponse(
                StatusCodes.UNAUTHORIZED,
                'Invalid Request!'
            )

        socket.keyStore = keyStore
        socket.user = decodeUser
        next()
    } catch (error) {
        return next(error)
    }
}
