const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateEmail = (value, helpers) => {
  if (validator.isEmail(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateId = (value, helpers) => {
  if (validator.isHexadecimal(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    yearOfBirth: Joi.string().required().messages({
      "string.empty": 'The "yearOfBirth" must be filled in',
    }),
    email: Joi.string().required().custom(validateEmail).messages({
      "string.empty": 'The "email" field must be filled in',
      "string.uri": 'the "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().custom(validateEmail).messages({
      "string.empty": 'The "email" field must be filled in',
      "string.uri": 'the "email" field must be a valid email',
    }),
    password: Joi.string()
      .required()
      .messages({ "string.empty": 'The "password" field must be filled in' }),
  }),
});

const validateUserId = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().length(24).required().custom(validateId).messages({
      "string.uri": "Must be a hexadecimal value length of 24 characters",
    }),
  }),
});

const validateProfileUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).message({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    email: Joi.string().required().custom(validateEmail).messages({
      "string.empty": 'The "email" field must be filled in',
      "string.uri": 'the "email" field must be a valid email',
    }),
  }),
});

module.exports = {
  validateCreateUser,
  validateLogin,
  validateUserId,
  validateProfileUpdate,
};
