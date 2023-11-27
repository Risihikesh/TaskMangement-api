const Joi = require('joi');

const validateRegister = (data) =>{
    return Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(5).required(),
    }).validate(data);
}

const validateLogin = (data) => {
    return Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(5).required(),
    }).validate(data);
}

const validateTask = (data) => {
    return Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        due_date: Joi.date(),
        assigned_users: Joi.array().items(Joi.string()),
    }).validate(data);
}

module.exports = { validateRegister, validateLogin, validateTask };