"use strict";

import bcrypt from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import crypto from "node:crypto";
import { createTokenPair } from "~/auth/authUtils";
import { HEADER } from "~/constants/HeaderHttpConstants";
import ErrorResponse from "~/core/errorResponse";
import userModel from "~/models/userModel";
import { findUserByEmail, getInfoData } from "~/utils/algorithms";
import KeyTokenService from "./keyTokenService";
import admin from "~/dbs/firebaseAdmin";

class AccessService {
  static signUp = async ({ user, userAgent, res }) => {
    const { fullname, username, email, password } = user;

    const isRegistered = await userModel.findOne({ email }).lean();
    if (isRegistered) {
      throw new ErrorResponse(
        StatusCodes.BAD_REQUEST,
        "User is already registered!"
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = await userModel.create({
      full_name: fullname,
      username,
      email,
      password: passwordHash,
      profile_pic_url: 'https://res.cloudinary.com/dbma8vpob/image/upload/v1750523945/default_avatar_outstagram_kycztu.png'
    });

    if (!newUser) {
      throw new ErrorResponse(
        StatusCodes.INTERNAL_SERVER_ERROR,
        "Failed to create user."
      );
    }

    // Create privateKey, publicKey
    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    });

    const keyStore = await KeyTokenService.createKeyToken({
      userId: newUser._id,
      publicKey,
      userAgent,
    });
    if (!keyStore) {
      throw new ErrorResponse(StatusCodes.BAD_REQUEST, "KeyStore error");
    }

    const tokens = await createTokenPair({
      payload: { userId: newUser._id, email: newUser.email, username: newUser?.username },
      privateKey,
    });

    // Thiết lập cookies cho access token và refresh token
    // Chỉ thiết lập cookies nếu res (response object) được truyền vào
    if (res) {
      // Thiết lập cookie cho refresh token - httpOnly để bảo mật
      res.cookie(HEADER.REFRESHTOKEN, tokens.refreshToken, {
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production", // Chỉ dùng HTTPS trong môi trường production
        sameSite: "strict", // Bảo vệ khỏi CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày - nên khớp với thời hạn của refreshToken
      });

      // Thiết lập cookie cho access token - không httpOnly để JavaScript có thể truy cập
      res.cookie(HEADER.AUTHORIZATION, tokens.accessToken, {
        httpOnly: process.env.NODE_ENV === "production",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 ngày - nên khớp với thời hạn của accessToken
      });
    }

    // Lưu thông tin user vào Firestore
    const db = admin.firestore();
    await db
      .collection("users")
      .doc(newUser._id.toString())
      .set({
        userId: newUser._id.toString(),
        full_name: newUser.full_name,
        username: newUser.username,
        avatar: newUser.profile_pic_url || null,
        is_verify: newUser.is_verified || false,
        createdAt: Date.now(),
      });

    // Tạo token xác thực firebase
    const firebaseToken = await admin
      .auth()
      .createCustomToken(newUser._id.toString());

    return {
      user: getInfoData({
        filled: [
          "_id",
          "full_name",
          "username",
          "profile_pic_url",
          "hd_profile_pic_url",
          "followers",
          "following",
          "postsCount",
          "is_verified",
          "private_account",
        ],
        object: newUser,
      }),
      token: firebaseToken,
    };
  };

  static login = async ({ user, userAgent, res }) => {
    const { email, password } = user;

    const foundUser = await findUserByEmail({ email });
    if (!foundUser)
      throw new ErrorResponse(StatusCodes.BAD_REQUEST, "User not registered!");

    const match = await bcrypt.compare(password, foundUser.password);
    if (!match)
      throw new ErrorResponse(
        StatusCodes.UNAUTHORIZED,
        "Authentication failed"
      );

    // TạoTạo privateKey, publicKey
    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    });

    const { _id: userId } = foundUser;

    const tokens = await createTokenPair({
      payload: { userId, email, username: foundUser?.username },
      privateKey,
    });

    const keyStore = await KeyTokenService.createKeyToken({
      userId: userId,
      refreshToken: tokens.refreshToken,
      publicKey,
      userAgent,
    });
    if (!keyStore) {
      throw new ErrorResponse(StatusCodes.BAD_REQUEST, "KeyStore error");
    }

    // Thiết lập cookies cho access token và refresh token
    // Chỉ thiết lập cookies nếu res (response object) được truyền vào
    if (res) {
      // Thiết lập cookie cho refresh token - httpOnly để bảo mật
      res.cookie(HEADER.REFRESHTOKEN, tokens.refreshToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", // Bảo vệ khỏi CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày - nên khớp với thời hạn của refreshToken
      });

      // Thiết lập cookie cho access token - không httpOnly để JavaScript có thể truy cập
      res.cookie(HEADER.AUTHORIZATION, tokens.accessToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 ngày - nên khớp với thời hạn của accessToken
      });
    }

    // Tạo token xác thực firebase
    const firebaseToken = await admin
      .auth()
      .createCustomToken(userId.toString());

    return {
      user: getInfoData({
        filled: [
          "_id",
          "full_name",
          "username",
          "profile_pic_url",
          "hd_profile_pic_url",
          "followers",
          "following",
          "postsCount",
          "is_verified",
          "private_account",
        ],
        object: foundUser,
      }),
      token: firebaseToken,
    };
  };

  static logout = async ({ keyStore, userAgent, res }) => {
    const delKey = await KeyTokenService.removeKeyToken({
      id: keyStore._id,
      userAgent,
    });

    res.clearCookie(HEADER.REFRESHTOKEN);
    res.clearCookie(HEADER.AUTHORIZATION);

    return delKey;
  };

  static handlerRefreshToken = async ({
    keyStore,
    user,
    refreshToken,
    res,
  }) => {
    const { userId, email } = user;
    if (keyStore.refreshToken !== refreshToken) {
      throw new ErrorResponse(
        StatusCodes.UNAUTHORIZED,
        "User not registered!1"
      );
    }

    const foundUser = await findUserByEmail({ email });
    if (!foundUser)
      throw new ErrorResponse(
        StatusCodes.UNAUTHORIZED,
        "User not registered!2"
      );

    const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 4096,
      publicKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
      privateKeyEncoding: {
        type: "pkcs1",
        format: "pem",
      },
    });

    const tokens = await createTokenPair({
      payload: { userId, email, username: foundUser?.username },
      privateKey,
    });

    await keyStore.updateOne({
      $set: {
        publicKey,
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });

    if (res) {
      // Thiết lập cookie cho refresh token - httpOnly để bảo mật
      res.cookie(HEADER.REFRESHTOKEN, tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict", // Bảo vệ khỏi CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 ngày - nên khớp với thời hạn của refreshToken
      });

      // Thiết lập cookie cho access token - không httpOnly để JavaScript có thể truy cập
      // Tùy chọn: Có thể chọn không lưu accessToken vào cookie nếu muốn lưu trong memory state
      res.cookie(HEADER.AUTHORIZATION, tokens.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1 ngày - nên khớp với thời hạn của accessToken
      });
    }

    return {
      user,
    };
  };

  static changePassword = async ({ userId, oldPassword, newPassword }) => {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new ErrorResponse(StatusCodes.NOT_FOUND, 'User not found');
    }
    // Kiểm tra old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new ErrorResponse(StatusCodes.UNAUTHORIZED, 'Old password is incorrect');
    }
    // Hash new password
    const newPasswordHash = await bcrypt.hash(newPassword, 10);
    user.password = newPasswordHash;
    await user.save();
    return { success: true, message: 'Password changed successfully' };
  };
}

export default AccessService;
