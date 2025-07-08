'use strict'

import express from 'express'
import { authentication } from '~/auth/authUtils'
import UserController from '~/controllers/userController'
import multer from 'multer'
import UserValidation from '~/validations/userValidation'
const upload = multer({ storage: multer.memoryStorage() })

const router = express.Router()

router.get('/profile/:otherUserId/public', UserController.getUserProfile)

router.use(authentication)

router.get('/profile/:otherUserId', UserController.getUserProfile)
router.patch(
    '/profile/editProfilePic',
    upload.single('avatar'),
    UserValidation.editProfilePicture,
    UserController.editProfilePicture
)
router.patch('/profile/editProfile', UserValidation.editProfile, UserController.editUserProfile)
router.patch('/followUser/:targetUserId', UserValidation.followUser, UserController.followUser)
router.patch('/unFollowUser/:targetUserId', UserValidation.unFollowUser, UserController.unFollowUser)
router.patch('/blockUser/:targetUserId', UserValidation.blockUser, UserController.blockUser)
router.patch('/unblockUser/:targetUserId', UserValidation.unBlockUser, UserController.unBlockUser)
router.get('/search', UserController.searchUsers)
router.get('/suggested', UserController.getSuggestedUsers)
router.get('/following/conversation', UserController.getFollowingUsersForConversation)

export const userRoute = router
