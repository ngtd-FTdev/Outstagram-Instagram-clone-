import Joi from 'joi';

class GetStreamValidation {
    static createCall = async (req, res, next) => {
        const schema = Joi.object({
            groupId: Joi.string().required().messages({
                'any.required': 'groupId is required!',
                'string.empty': 'groupId cannot be empty!',
            }),
            type: Joi.string().valid('audio', 'video').messages({
                'any.only': 'type must be either audio or video!',
                'string.empty': 'type cannot be empty!',
            }),
        });
        try {
            await schema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error) {
            next(error);
        }
    };

    static leaveCall = async (req, res, next) => {
        const schema = Joi.object({
            callId: Joi.string().required().messages({
                'any.required': 'callId is required!',
                'string.empty': 'callId cannot be empty!',
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

export default GetStreamValidation; 