'use strict'

import { StatusCodes } from 'http-status-codes'
import UserService from '~/services/userService'

const { SuccessResponse } = require('~/core/successResponse')

class UserController {
    getUserProfilePublic = async (req, res, next) => {
        try {
            new SuccessResponse({
                status: StatusCodes.OK,
                message: 'Get profile success!',
                metadata: await UserService.getUserProfile({
                    userId: req.user.userId,
                    otherUserId: req.params.otherUserId,
                }),
                options: {
                    limit: 10,
                },
            }).send(res)
        } catch (error) {
            next(error)
        }
    }

    getUserProfile = async (req, res, next) => {
        try {
            new SuccessResponse({
                status: StatusCodes.OK,
                message: 'Get profile success!',
                metadata: await UserService.getUserProfile({
                    userName: req.user.username,
                    otherUserName: req.params.otherUserId,
                }),
                options: {
                    limit: 10,
                },
            }).send(res)
        } catch (error) {
            next(error)
        }
    }

    editProfilePicture = async (req, res, next) => {
        try {
            new SuccessResponse({
                status: StatusCodes.OK,
                message: 'Update profile picture success!',
                metadata: await UserService.editProfilePicture({
                    userId: req.user.userId,
                    profilePicture: req.file,
                }),
                options: {
                    limit: 10,
                },
            }).send(res)
        } catch (error) {
            next(error)
        }
    }

    editUserProfile = async (req, res, next) => {
        try {
            new SuccessResponse({
                status: StatusCodes.OK,
                message: 'Update user profile success!',
                metadata: await UserService.editUserProfile({
                    userId: req.user.userId,
                    bodyUpdate: req.body,
                }),
                options: {
                    limit: 10,
                },
            }).send(res)
        } catch (error) {
            next(error)
        }
    }

    followUser = async (req, res, next) => {
        try {
            new SuccessResponse({
                status: StatusCodes.OK,
                message: 'Follow user success!',
                metadata: await UserService.followUser({
                    userId: req.user.userId,
                    targetUserId: req.params.targetUserId,
                }),
                options: {
                    limit: 10,
                },
            }).send(res)
        } catch (error) {
            next(error)
        }
    }

    unFollowUser = async (req, res, next) => {
        try {
            new SuccessResponse({
                status: StatusCodes.OK,
                message: 'Unfollow user success!',
                metadata: await UserService.unFollowUser({
                    userId: req.user.userId,
                    targetUserId: req.params.targetUserId,
                }),
                options: {
                    limit: 10,
                },
            }).send(res)
        } catch (error) {
            next(error)
        }
    }

    blockUser = async (req, res, next) => {
        try {
            new SuccessResponse({
                status: StatusCodes.OK,
                message: 'Block user success!',
                metadata: await UserService.blockUser({
                    userId: req.user.userId,
                    targetUserId: req.params.targetUserId,
                }),
                options: {
                    limit: 10,
                },
            }).send(res)
        } catch (error) {
            next(error)
        }
    }

    unBlockUser = async (req, res, next) => {
        try {
            new SuccessResponse({
                status: StatusCodes.OK,
                message: 'Unblock user success!',
                metadata: await UserService.unBlockUser({
                    userId: req.user.userId,
                    targetUserId: req.params.targetUserId,
                }),
                options: {
                    limit: 10,
                },
            }).send(res)
        } catch (error) {
            next(error)
        }
    }

    searchUsers = async (req, res, next) => {
        try {
            const { q, limit } = req.query;
            const searchResults = await UserService.searchUsers({ 
                text: q, 
                limit: limit ? parseInt(limit) : 10 
            });
            
            new SuccessResponse({
                status: StatusCodes.OK,
                message: 'User search success!',
                metadata: searchResults,
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    getSuggestedUsers = async (req, res, next) => {
        try {
            const { limit } = req.query;
            new SuccessResponse({
                status: StatusCodes.OK,
                message: 'Get suggested users success!',
                metadata: await UserService.getSuggestedUsers({ userId: req.user.userId, limit: limit ? parseInt(limit) : 10 }),
            }).send(res);
        } catch (error) {
            next(error);
        }
    }

    getFollowingUsersForConversation = async (req, res, next) => {
        try {
            const { limit } = req.query;
            new SuccessResponse({
                status: StatusCodes.OK,
                message: 'Get following users for conversation success!',
                metadata: await UserService.getFollowingUsersForConversation({ userId: req.user.userId, limit: limit ? parseInt(limit) : 10 }),
            }).send(res);
        } catch (error) {
            next(error);
        }
    }
}

export default new UserController()
