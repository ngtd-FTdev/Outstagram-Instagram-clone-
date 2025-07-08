'use strict'

import Joi from 'joi'

class AccessValidation {
    static login = async (req, res, next) => {
        const correctCondition = Joi.object({
            email: Joi.string().email().message({
                'string.email': 'Email must be a valid email',
                'string.empty': "Email can't be empty!!",
            }),
            password: Joi.string().min(6).empty('').required().messages({
                'any.required': 'Password is required!!',
                'string.empty': "Password can't be empty!!",
                'string.min': 'Password must be at least 6 characters long',
            }),
        })

        try {
            await correctCondition.validateAsync(req.body, {
                abortEarly: false,
            })
            next()
        } catch (error) {
            next(error)
        }
    }

    static signUp = async (req, res, next) => {
        const correctCondition = Joi.object({
            fullname: Joi.string().max(100).required().messages({
                'any.required': 'Name is required!!',
                'string.empty': "Name can't be empty!!",
                'string.max': 'Name must be at most 100 characters long!!',
            }),
            username: Joi.string()
                .pattern(/^[a-zA-Z0-9_]+$/)
                .min(3)
                .max(50)
                .required()
                .messages({
                    'any.required': 'User name is required!!',
                    'string.empty': "User name can't be empty!!",
                    'string.min':
                        'User name must be at least 3 characters long!!',
                    'string.max':
                        'User name must be at most 50 characters long!!',
                    'string.pattern.base':
                        'User name can only contain letters, numbers, and underscores!!',
                }),
            email: Joi.string().email().empty('').required().messages({
                'any.required': 'Email is required!!',
                'string.email': 'Email must be a valid email',
                'string.empty': "Email can't be empty!!",
            }),
            password: Joi.string()
                .pattern(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,100}$/
                )
                .required()
                .messages({
                    'any.required': 'Password is required!!',
                    'string.empty': "Password can't be empty!!",
                    'string.pattern.base':
                        'Password must be 6-100 characters long, and include at least one uppercase letter, one lowercase letter, one special character, and one number!!',
                }),
        })

        try {
            await correctCondition.validateAsync(req.body, {
                abortEarly: false,
            })
            next()
        } catch (error) {
            next(error)
        }
    }

    static changePassword = async (req, res, next) => {
        const schema = Joi.object({
            oldPassword: Joi.string().required().messages({
                'any.required': 'Old password is required!',
                'string.empty': "Old password can't be empty!",
            }),
            newPassword: Joi.string()
                .pattern(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,100}$/
                )
                .required()
                .messages({
                    'any.required': 'New password is required!',
                    'string.empty': "New password can't be empty!",
                    'string.pattern.base':
                        'New password must be 6-100 characters long, and include at least one uppercase letter, one lowercase letter, one special character, and one number!',
                }),
        });
        try {
            await schema.validateAsync(req.body, { abortEarly: false });
            next();
        } catch (error) {
            next(error);
        }
    }
}

export default AccessValidation
