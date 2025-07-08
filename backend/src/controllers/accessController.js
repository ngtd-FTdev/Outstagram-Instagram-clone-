'use strict'

import { StatusCodes } from 'http-status-codes'
import AccessService from '~/services/accessService'

const { CREATED, SuccessResponse } = require('~/core/successResponse')

class AccessController {
    signUp = async (req, res, next) => {
        try {
            new CREATED({
                status: StatusCodes.CREATED,
                message: 'Registered success!',
                metadata: await AccessService.signUp({
                    user: req.body,
                    userAgent: req.headers['user-agent'],
                    res,
                }),
                options: {
                    limit: 10,
                },
            }).send(res)
        } catch (error) {
            next(error)
        }
    }

    login = async (req, res, next) => {
        try {
            new SuccessResponse({
                status: StatusCodes.OK,
                message: 'Login success!',
                metadata: await AccessService.login({
                    user: req.body,
                    userAgent: req.headers['user-agent'],
                    res,
                }),
            }).send(res)
        } catch (error) {
            next(error)
        }
    }

    logout = async (req, res, next) => {
        try {
            new SuccessResponse({
                status: StatusCodes.OK,
                message: 'Logout success!',
                metadata: await AccessService.logout({
                    keyStore: req.keyStore,
                    userAgent: req.headers['user-agent'],
                    res,
                }),
            }).send(res)
        } catch (error) {
            next(error)
        }
    }

    handlerRefreshToken = async (req, res, next) => {
        try {
            new SuccessResponse({
                status: StatusCodes.OK,
                message: 'Got token success!',
                metadata: await AccessService.handlerRefreshToken({
                    keyStore: req.keyStore,
                    user: req.user,
                    refreshToken: req.refreshToken,
                    userAgent: req.headers['user-agent'],
                    res,
                }),
            }).send(res)
        } catch (error) {
            next(error)
        }
    }

    CheckAuth = async (req, res, next) => {
        try {
            new SuccessResponse({
                status: StatusCodes.OK,
                message: 'Check auth success!',
                metadata: {},
            }).send(res)
        } catch (error) {
            next(error)
        }
    }

    changePassword = async (req, res, next) => {
        try {
            const { oldPassword, newPassword } = req.body;
            const result = await AccessService.changePassword({
                userId: req.user.userId,
                oldPassword,
                newPassword,
            });
            new SuccessResponse({
                status: StatusCodes.OK,
                message: 'Password changed successfully!',
                metadata: result,
            }).send(res);
        } catch (error) {
            next(error);
        }
    }
}

export default new AccessController()
