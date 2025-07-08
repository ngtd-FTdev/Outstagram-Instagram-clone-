"use strict";

import { StatusCodes } from "http-status-codes";
import { SuccessResponse } from "~/core/successResponse";
import PostService from "~/services/postService";

class PostController {
  getListPosts = async (req, res, next) => {
    try {
      new SuccessResponse({
        status: StatusCodes.OK,
        message: "get list posts success!",
        metadata: await PostService.getListPosts({
          userId: req.user.userId,
          page: req.query.page,
        }),
        options: {
          limit: 10,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  getListPostsForExplore = async (req, res, next) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      new SuccessResponse({
        status: StatusCodes.OK,
        message: "get list posts success!",
        metadata: await PostService.getListPostsForExplore({
          userId: req.user.userId,
          page: req.query.page,
          firstPostId: req.query.firstPostId,
          lastPostId: req.query.lastPostId,
          limit,
        }),
        options: {
          limit: 10,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
  getListReels = async (req, res, next) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      new SuccessResponse({
        status: StatusCodes.OK,
        message: "get list reels success!",
        metadata: await PostService.getListReels({
          userId: req.user.userId,
          page: req.query.page,
          firstPostId: req.query.firstPostId,
          lastPostId: req.query.lastPostId,
          limit,
        }),
        options: {
          limit: 10,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  getPost = async (req, res, next) => {
    try {
      new SuccessResponse({
        status: StatusCodes.OK,
        message: "get posts success!",
        metadata: await PostService.getPost({
          id: req.params.postId,
          userId: req.user.userId,
        }),
        options: {
          limit: 10,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  createPost = async (req, res, next) => {
    try {
      new SuccessResponse({
        status: StatusCodes.OK,
        message: "Create post success!",
        metadata: await PostService.createPost({
          userId: req.user.userId,
          bodyPost: JSON.parse(req.body.postData),
          arrayFiles: req.files,
        }),
        options: {
          limit: 10,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  createReel = async (req, res, next) => {
    try {
      new SuccessResponse({
        status: StatusCodes.OK,
        message: "Create reel success!",
        metadata: await PostService.createReel({
          userId: req.user.userId,
          bodyPost: JSON.parse(req.body.postData),
          arrayFiles: req.files,
        }),
        options: {
          limit: 10,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  updatePost = async (req, res, next) => {
    try {
      new SuccessResponse({
        status: StatusCodes.OK,
        message: "Update post success!",
        metadata: await PostService.updatePost({
          userId: req.user.userId,
          postId: req.params.postId,
          bodyPost: req.body,
        }),
        options: {
          limit: 10,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  deletePost = async (req, res, next) => {
    try {
      new SuccessResponse({
        status: StatusCodes.OK,
        message: "Delete post success!",
        metadata: await PostService.deletePost({
          userId: req.user.userId,
          postId: req.params.postId,
        }),
        options: {
          limit: 10,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  likePost = async (req, res, next) => {
    try {
      new SuccessResponse({
        status: StatusCodes.OK,
        message: "Like post success!",
        metadata: await PostService.likePost({
          userId: req.user.userId,
          postId: req.params.postId,
        }),
        options: {
          limit: 10,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  savePost = async (req, res, next) => {
    try {
      new SuccessResponse({
        status: StatusCodes.OK,
        message: "Save post success!",
        metadata: await PostService.savePost({
          userId: req.user.userId,
          postId: req.params.postId,
        }),
        options: {
          limit: 10,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  getLikesPost = async (req, res, next) => {
    try {
      new SuccessResponse({
        status: StatusCodes.OK,
        message: "Get likes post success!",
        metadata: await PostService.getLikesPost({
          postId: req.params.postId,
          page: req.query.page,
          limit: req.query.limit,
        }),
        options: {
          limit: 10,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  commentPost = async (req, res, next) => {
    try {
      new SuccessResponse({
        status: StatusCodes.OK,
        message: "Comment post success!",
        metadata: await PostService.commentPost({
          userId: req.user.userId,
          postId: req.params.postId,
          bodyComment: req.body,
        }),
        options: {
          limit: 10,
        },
      }).send(res);
    } catch (error) {
      console.error("Comment error:", error);
      next(error);
    }
  };

  likeComment = async (req, res, next) => {
    try {
      new SuccessResponse({
        status: StatusCodes.OK,
        message: "Like comment success!",
        metadata: await PostService.likeComment({
          userId: req.user.userId,
          commentId: req.params.commentId,
        }),
        options: {
          limit: 10,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  getLikesComment = async (req, res, next) => {
    try {
      new SuccessResponse({
        status: StatusCodes.OK,
        message: "Get likes comment success!",
        metadata: await PostService.getLikesComment({
          commentId: req.params.commentId,
          page: req.query.page,
          limit: req.query.limit,
        }),
        options: {
          limit: 10,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  getComments = async (req, res, next) => {
    try {
      const rawParent = req.query.parentId;
      const parentId = rawParent && rawParent !== "null" ? rawParent : null

      new SuccessResponse({
        status: StatusCodes.OK,
        message: "Get comments success!",
        metadata: await PostService.getComments({
          postId: req.params.postId,
          parentId: parentId,
          page: req.query.page,
          limit: req.query.limit,
          userId: req.user.userId,
        }),
        options: {
          limit: 10,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  getRandomPosts = async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      new SuccessResponse({
        status: StatusCodes.OK,
        message: "get random posts success!",
        metadata: await PostService.getRandomPosts({
          userId: req.user.userId,
          limit,
        }),
        options: {
          limit,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  getListPosts2 = async (req, res, next) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      new SuccessResponse({
        status: StatusCodes.OK,
        message: "get list posts2 success!",
        metadata: await PostService.getListPosts2({
          userId: req.user.userId,
          page: req.query.page,
          firstPostId: req.query.firstPostId,
          lastPostId: req.query.lastPostId,
          limit,
        }),
        options: {
          limit,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  getPostsByUsername = async (req, res, next) => {
    try {
      const username = req.params.username;
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit) : 12;
      const lastPostId = req.query.lastPostId;
      new SuccessResponse({
        status: StatusCodes.OK,
        message: "Get posts by username with paging success!",
        metadata: await PostService.getPostsByUsername({
          usernameSearch: username,
          userName: req.user.username,
          userId: req.user.userId,
          page,
          limit,
          lastPostId,
        }),
        options: {
          limit,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  getReelByUsername = async (req, res, next) => {
    try {
      const username = req.params.username;
      const page = req.query.page ? parseInt(req.query.page) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit) : 12;
      const lastPostId = req.query.lastPostId;
      new SuccessResponse({
        status: StatusCodes.OK,
        message: "Get reels by username with paging success!",
        metadata: await PostService.getReelByUsername({
          usernameSearch: username,
          userName: req.user.username,
          userId: req.user.userId,
          page,
          limit,
          lastPostId,
        }),
        options: {
          limit,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };
}

export default new PostController();
