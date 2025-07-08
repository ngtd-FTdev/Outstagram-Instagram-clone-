'use strict'

import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { accessRoute } from './access'
import { messageRouter } from './messages'
import { postRoute } from './post'
import { userRoute } from './user'
import { getStreamRoute } from './getStream'

const router = express.Router()

router.get('/', (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'APIs v1 are ready to use.' })
})

router.use('/api/access', accessRoute)
router.use('/api/stream', getStreamRoute)
router.use('/api/user', userRoute)
router.use('/api/post', postRoute)
router.use('/api/messages', messageRouter)

export const APIs_V1 = router
