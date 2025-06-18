const Joi = require('joi'); 

const registerSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    age: Joi.number().integer().min(0).max(120).required(),
    gender: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(100).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(3).max(100).required(),
});


module.exports = {
    registerSchema,
    loginSchema
};
