'use strict'

import express from 'express'
import { authentication } from '~/auth/authUtils'
import GetStreamController from '~/controllers/getStreamController'
import GetStreamValidation from '~/validations/getStreamValidation'

const router = express.Router()

router.use(authentication)
router.get('/getToken', GetStreamController.generateStreamToken)
router.post('/createCall', GetStreamValidation.createCall, GetStreamController.createStreamCall)
router.post('/leaveCall', GetStreamValidation.leaveCall, GetStreamController.leaveStreamCall)

export const getStreamRoute = router
