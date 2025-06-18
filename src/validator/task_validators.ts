import Joi from 'joi';

const taskSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().min(3).max(500).required(),
    completed: Joi.boolean().optional(),
});


module.exports = {
    taskSchema
};
