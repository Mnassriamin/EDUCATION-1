const Joi = require('joi');

// Validation pour l'enregistrement
const registerValidation = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        telephone: Joi.string().pattern(/^\d{8}$/).required()
    });
    return schema.validate(data);
};

// Validation pour la connexion
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
    });
    return schema.validate(data);
};

module.exports = { registerValidation, loginValidation };
