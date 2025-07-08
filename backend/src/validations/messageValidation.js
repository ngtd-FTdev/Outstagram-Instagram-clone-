import Joi from 'joi';

class MessageValidation {
    static createGroupConversation = async (req, res, next) => {
        const schema = Joi.object({
            groupId: Joi.string().messages({
                'string.empty': 'groupId cannot be empty!',
            }),
            memberIds: Joi.array().items(Joi.string()).min(1).required().messages({
                'any.required': 'memberIds is required!',
                'array.base': 'memberIds must be an array!',
                'array.min': 'memberIds must have at least 1 member!',
            }),
        });
        try {
            await schema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error) {
            next(error);
        }
    };

    static sendMessage = async (req, res, next) => {
        const schema = Joi.object({
            text: Joi.string().allow('').max(2000),
            type: Joi.string().valid('text', 'image', 'video', 'voice', 'gif').messages({
                'any.only': 'type must be one of text, image, video, voice, gif!',
            }),
            duration: Joi.number().min(0).when('type', { is: 'voice', then: Joi.required() }),
            replyMessageId: Joi.string().allow(null, ''),
            gifUrl: Joi.string().uri().allow(null, ''),
        });
        try {
            await schema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error) {
            next(error);
        }
    };

    static toggleReaction = async (req, res, next) => {
        const schema = Joi.object({
            conversationId: Joi.string().required().messages({
                'any.required': 'conversationId is required!',
                'string.empty': 'conversationId cannot be empty!',
            }),
            messageId: Joi.string().required().messages({
                'any.required': 'messageId is required!',
                'string.empty': 'messageId cannot be empty!',
            }),
            emoji: Joi.string().required().messages({
                'any.required': 'emoji is required!',
                'string.empty': 'emoji cannot be empty!',
            }),
            isAdd: Joi.boolean().required().messages({
                'any.required': 'isAdd is required!',
            }),
        });
        try {
            await schema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error) {
            next(error);
        }
    };
}

export default MessageValidation; 