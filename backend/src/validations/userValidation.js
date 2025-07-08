import Joi from 'joi';

class UserValidation {
    static editProfile = async (req, res, next) => {
        const schema = Joi.object({
            biography: Joi.string().allow('').optional(),
            bio_links: Joi.array().items(Joi.string().uri()).optional(),
            gender: Joi.string().valid('male', 'female', 'other', '').optional(),
        });
        try {
            await schema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error) {
            next(error);
        }
    };

    static editProfilePicture = async (req, res, next) => {
        if (!req.file) {
            return next(new Error('Avatar file is required!'));
        }
        if (!req.file.mimetype.startsWith('image/')) {
            return next(new Error('Avatar must be an image!'));
        }
        next();
    };

    static followUser = async (req, res, next) => {
        const schema = Joi.object({
            targetUserId: Joi.string().required().messages({
                'any.required': 'targetUserId is required!',
                'string.empty': 'targetUserId cannot be empty!',
            }),
        });
        try {
            await schema.validateAsync({ targetUserId: req.params.targetUserId }, { abortEarly: false });
            next();
        } catch (error) {
            next(error);
        }
    };

    static unFollowUser = UserValidation.followUser;
    static blockUser = UserValidation.followUser;
    static unBlockUser = UserValidation.followUser;
}

export default UserValidation; 