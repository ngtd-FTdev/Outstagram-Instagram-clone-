'use strict'

import { Types } from 'mongoose'
import keyTokenModel from '~/models/keyTokenModel'

class KeyTokenService {
    static createKeyToken = async ({
        userId,
        publicKey,
        refreshToken,
        userAgent,
    }) => {
        try {
            const filter = { user: userId, user_agent: userAgent },
                update = {
                    publicKey,
                    refreshTokensUsed: [],
                    refreshToken,
                },
                options = {
                    upsert: true,
                    new: true,
                }

            const tokens = await keyTokenModel.findOneAndUpdate(
                filter,
                update,
                options
            )

            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }

    static removeKeyToken = async ({ id, userAgent }) => {
        return await keyTokenModel
            .deleteOne({ _id: id, user_agent: userAgent })
            .lean()
    }

    static findKeyToken = async (userId, userAgent) => {
        return await keyTokenModel.findOne({
            user: Types.ObjectId.createFromHexString(userId),
            user_agent: userAgent,
        })
    }

    static deleteKeyById = async (userId) => {
        return await keyTokenModel
            .findOneAndDelete({
                user: Types.ObjectId.createFromHexString(userId),
            })
            .lean()
    }
}

export default KeyTokenService
