"use strict";

import Joi from "joi";

class PostValidation {
  static createPost = async (req, res, next) => {
    const FileSchema = Joi.object({
      mimetype: Joi.string()
        .valid(
          "image/jpeg",
          "image/png",
          "image/gif",
          "video/mp4",
          "video/mpeg"
        )
        .required()
        .messages({
          "any.required": "The field mimetype is required.", // Thông báo khi trường mimetype bị thiếu
          "any.only":
            "Invalid mimetype. Accepted formats are: image/jpeg, image/png, image/gif, video/mp4, video/mpeg.", // Thông báo khi mimetype không nằm trong danh sách cho phép
        }),
    });
    const schema = Joi.array()
      .items(FileSchema)
      .min(1)
      .max(10)
      .required()
      .messages({
        "array.base": "Files must be an array of objects.", // Thông báo khi không phải là mảng
        "array.empty": "Files cannot be an empty array.", // Thông báo khi mảng trống
        "array.min": "At least one file must be provided.", // Thông báo khi không đủ số lượng file tối thiểu
        "array.max": "A maximum of 10 files can be uploaded.", // Thông báo khi vượt quá số lượng file tối đa
        "any.required": "Files field is required.", // Thông báo khi trường files bị thiếu
      });

    const filteredFiles = req.files?.map((file) => ({
      mimetype: file.mimetype,
    }));

    const mediaMetadataItemSchema = Joi.object({
      type: Joi.string().valid("image", "video").required().messages({
        "any.only": 'type phải là "image" hoặc "video".',
        "any.required": "type là bắt buộc.",
      }),
      mediaUrl: Joi.string().uri().required().messages({
        "string.uri": "mediaUrl phải là một URI hợp lệ.",
        "any.required": "mediaUrl là bắt buộc.",
      }),
      cropSettings: Joi.object().optional(),
      edit: Joi.object().optional(),
      thumbnail: Joi.string().allow("").optional(),
    });

    const BodySchema = Joi.object({
      caption: Joi.string().allow("").optional(),
      collaborators: Joi.array()
        .items(
          Joi.string().messages({
            "string.base": "Each collaborator must be a string.",
          })
        )
        .messages({
          "array.base": "Collaborators must be an array.",
          "array.includes": "Each collaborator must be a valid string.",
        }),
      location: Joi.string().allow(""),
      mediaMetadata: Joi.object()
        .pattern(
          // chỉ nhận những key là chữ số đơn 0–9
          /^[0-9]$/,
          mediaMetadataItemSchema
        )
        .max(10)
        .required()
        .messages({
          "object.base":
            'mediaMetadata phải là một object với keys từ "0" đến "9".',
          "object.pattern.match":
            "Các key trong mediaMetadata chỉ được là số từ 0 đến 9.",
          "object.max": "Chỉ tối đa 10 mục trong mediaMetadata (index 0–9).",
          "any.required": "mediaMetadata là bắt buộc.",
        }),
      likes_hidden: Joi.boolean(),
      aspectRatio: Joi.number().required(),
      comments_disable: Joi.boolean(),
      allowed_commenter_type: Joi.string()
        .valid("everyone", "friends", "followers", "no_one", "custom")
        .messages({
          "any.only":
            "allowed_commenter_type must be one of the following values: everyone, friends, followers, no_one, custom.", // Thông báo khi giá trị không hợp lệ
        }),
      feed_post_reshare_disabled: Joi.boolean().messages({
        "boolean.base":
          "The value for feed post reshare disable must be a boolean.", // Thông báo khi giá trị không phải boolean
        "boolean.empty":
          "The value for feed post reshare disable cannot be empty.", // Thông báo khi giá trị trống
      }),
    });

    try {
      await schema.validateAsync(filteredFiles, {
        abortEarly: false,
      });
      await BodySchema.validateAsync(JSON.parse(req.body.postData), {
        abortEarly: false,
      });

      next();
    } catch (error) {
      next(error);
    }
  };

  static updatePost = async (req, res, next) => {
    const correctCondition = Joi.object({
      caption: Joi.string(),
      aspectRatio: Joi.number().required(),
      collaborators: Joi.array()
        .items(
          Joi.string().messages({
            "string.base": "Each collaborator must be a string.",
          })
        )
        .messages({
          "array.base": "Collaborators must be an array.",
          "array.includes": "Each collaborator must be a valid string.",
        }),
      likes_hidden: Joi.boolean()
        .messages({
          "boolean.base": "The value for likes hidden must be a boolean.",
        })
        .required(),
      comments_disable: Joi.boolean()
        .messages({
          "boolean.base": "The value for comments disable must be a boolean.",
        })
        .required(),
      allowed_commenter_type: Joi.string()
        .valid("everyone", "friends", "followers", "no_one", "custom")
        .messages({
          "any.only":
            "allowed_commenter_type must be one of the following values: everyone, friends, followers, no_one, custom.", // Thông báo khi giá trị không hợp lệ
        }),
      feed_post_reshare_disabled: Joi.boolean().messages({
        "boolean.base":
          "The value for feed post reshare disable must be boolean.",
      }),
    });

    try {
      await correctCondition.validateAsync(req.body, {
        abortEarly: false,
      });
      next();
    } catch (error) {
      next(error);
    }
  };

  static commentPost = async (req, res, next) => {
    const schema = Joi.object({
      text: Joi.string().min(1).required().messages({
        'any.required': 'Text is required!',
        'string.empty': 'Text cannot be empty!',
        'string.min': 'Text must not be empty!',
      }),
      parentId: Joi.string().allow(null, '').optional(),
    });
    try {
      await schema.validateAsync(req.body, { abortEarly: false });
      next();
    } catch (error) {
      next(error);
    }
  };

  static likePost = async (req, res, next) => {
    const schema = Joi.object({
      postId: Joi.string().required().messages({
        'any.required': 'postId is required!',
        'string.empty': 'postId cannot be empty!',
      }),
    });
    try {
      await schema.validateAsync({ postId: req.params.postId }, { abortEarly: false });
      next();
    } catch (error) {
      next(error);
    }
  };

  static savePost = async (req, res, next) => {
    const schema = Joi.object({
      postId: Joi.string().required().messages({
        'any.required': 'postId is required!',
        'string.empty': 'postId cannot be empty!',
      }),
    });
    try {
      await schema.validateAsync({ postId: req.params.postId }, { abortEarly: false });
      next();
    } catch (error) {
      next(error);
    }
  };

  static likeComment = async (req, res, next) => {
    const schema = Joi.object({
      commentId: Joi.string().required().messages({
        'any.required': 'commentId is required!',
        'string.empty': 'commentId cannot be empty!',
      }),
    });
    try {
      await schema.validateAsync({ commentId: req.params.commentId }, { abortEarly: false });
      next();
    } catch (error) {
      next(error);
    }
  };
}

export default PostValidation;
