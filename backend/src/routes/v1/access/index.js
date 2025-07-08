'use strict'

import express from 'express'
import { authentication } from '~/auth/authUtils'
import AccessController from '~/controllers/accessController.js'
import AccessValidation from '~/validations/accessValidation'

const router = express.Router()

router.post('/user/signup', AccessValidation.signUp, AccessController.signUp)
router.post('/user/login', AccessValidation.login, AccessController.login)

router.use(authentication)
router.post('/user/checkAuth', AccessController.CheckAuth)

router.post('/user/logout', AccessController.logout)
router.post('/user/handlerRefreshToken', AccessController.handlerRefreshToken)

router.post('/user/changePassword', AccessValidation.changePassword, AccessController.changePassword)

export const accessRoute = router
