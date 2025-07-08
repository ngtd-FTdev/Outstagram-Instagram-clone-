"use strict";

import express from "express";
import multer from "multer";
import { authentication } from "~/auth/authUtils";
import PostController from "~/controllers/postController";
import PostValidation from "~/validations/postValidation";

const uploadCreatePost = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: 10,
    fileSize: 13 * 1024 ** 2,
  },
  fileFilter: (req, file, cb) => {
    // chỉ chấp nhận đúng fieldname kiểu post_file_<id>
    if (!/^post_file_[\w-]+$/.test(file.fieldname)) {
      return cb(
        new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname),
        false
      );
    }
    // chỉ chấp nhận mimetype image/ hoặc video/
    if (
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/")
    ) {
      return cb(null, true);
    }
    return cb(new Error("Chỉ hỗ trợ upload ảnh hoặc video!"), false);
  },
});

const router = express.Router();

router.use(authentication);

router.post(
  "/createPost",
  uploadCreatePost.any(),
  PostValidation.createPost,
  PostController.createPost
);

router.get("/getPost/:postId", PostController.getPost);

router.get("/getListPosts", PostController.getListPosts);

router.get("/getListPostsForExplore", PostController.getListPostsForExplore);

router.patch(
  "/updatePost/:postId",
  PostValidation.updatePost,
  PostController.updatePost
);

router.delete("/deletePost/:postId", PostController.deletePost);

router.post("/likePost/:postId", PostValidation.likePost, PostController.likePost);

router.get("/getLikesPost/:postId", PostController.getLikesPost);

router.post("/savePost/:postId", PostValidation.savePost, PostController.savePost);

router.get("/getComments/:postId", PostController.getComments);

router.post("/likeComment/:commentId", PostValidation.likeComment, PostController.likeComment);

router.post("/commentPost/:postId", PostValidation.commentPost, PostController.commentPost);

router.get("/getLikesComment/:commentId", PostController.getLikesComment);

router.get("/getListReels", PostController.getListReels);

router.get("/explore", PostController.getRandomPosts);

router.get("/getListPosts2", PostController.getListPosts2);

router.get("/getPostsByUsername/:username", PostController.getPostsByUsername);

router.get("/getReelByUsername/:username", PostController.getReelByUsername);

export const postRoute = router;
