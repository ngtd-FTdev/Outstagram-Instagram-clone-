"use strict";

import { StatusCodes } from "http-status-codes";
import ErrorResponse from "~/core/errorResponse";
import { createStreamCall, generateStreamToken, leaveStreamCall } from "~/services/getStreamService";

const { CREATED, SuccessResponse } = require("~/core/successResponse");

class GetStreamController {
  generateStreamToken = async (req, res, next) => {
    try {
      const userId = req?.user?.userId;
      if (!userId)
        throw new ErrorResponse(StatusCodes.BAD_REQUEST, "No user Id");

      new CREATED({
        status: StatusCodes.CREATED,
        message: "get token success!",
        metadata: await generateStreamToken({
          userId: userId,
        }),
        options: {
          limit: 10,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  createStreamCall = async (req, res, next) => {
    try {
      const userId = req?.user?.userId;
      if (!userId)
        throw new ErrorResponse(StatusCodes.BAD_REQUEST, "No user Id");
      const { groupId, type } = req.body;

      new CREATED({
        status: StatusCodes.CREATED,
        message: "create call success!",
        metadata: await createStreamCall({
          groupId,
          callerId: userId,
          type,
        }),
        options: {
          limit: 10,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  leaveStreamCall = async (req, res, next) => {
    try {
      const userId = req?.user?.userId;
      if (!userId)
        throw new ErrorResponse(StatusCodes.BAD_REQUEST, "No user Id");

      new CREATED({
        status: StatusCodes.CREATED,
        message: "create call success!",
        metadata: await leaveStreamCall({
          callId: req.params.callId,
          userId,
        }),
        options: {
          limit: 10,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}

export default new GetStreamController();
