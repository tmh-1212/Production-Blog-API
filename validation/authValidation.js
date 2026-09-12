const Joi = require("joi");

const registerSchema = Joi.object({

    name: Joi.string()
        .trim()
        .min(3)
        .max(50)
        .required()
        .messages({
            "string.empty": "Name is required",
            "string.min": "Name must be at least 3 characters"
        }),

    email: Joi.string()
        .trim()
        .email()
        .required()
        .messages({
            "string.email": "Please enter a valid email",
            "string.empty": "Email is required"
        }),

    password: Joi.string()
        .min(8)
        .max(30)
        .required()
        .messages({
            "string.min": "Password must be at least 8 characters",
            "string.empty": "Password is required"
        })
});

const loginSchema = Joi.object({

    email: Joi.string()
        .trim()
        .email()
        .required()
        .messages({
            "string.email": "Please enter a valid email",
            "string.empty": "Email is required"
        }),

    password: Joi.string()
        .required()
        .messages({
            "string.empty": "Password is required"
        })
});

const forgotPasswordSchema = Joi.object({

    email: Joi.string()
        .trim()
        .email()
        .required()
        .messages({
            "string.email": "Please enter a valid email",
            "string.empty": "Email is required"
        })
});

const resetPasswordSchema = Joi.object({

    password: Joi.string()
        .min(8)
        .max(30)
        .required()
        .messages({
            "string.min": "Password must be at least 8 characters",
            "string.empty": "Password is required"
        })
});

const refreshTokenSchema = Joi.object({

    refreshToken: Joi.string()
        .trim()
        .required()
        .messages({
            "string.empty": "Refresh token is required"
        })
});

module.exports = {
    registerSchema,
    loginSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    refreshTokenSchema
};
