// const Joi =
// require("joi");



// const registerSchema =
// Joi.object({

// name:
// Joi.string()
// .min(3)
// .required(),


// email:
// Joi.string()
// .email()
// .required(),


// password:
// Joi.string()
// .min(6)
// .required()

// });



// module.exports={
// registerSchema
// };


//practice for each part
     //part 8:
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
        }),

    role: Joi.string()
        .valid("user", "admin")
        .optional()

});

module.exports = { registerSchema };