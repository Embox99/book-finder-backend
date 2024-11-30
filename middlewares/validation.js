const { Joi, celebrate } = require("celebrate");

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    yearOfBirth: Joi.number().required().messages({
      "any.required": 'The "yearOfBirth" must be filled in',
    }),
    email: Joi.string().email().required().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'the "email" field must be a valid email',
    }),
    password: Joi.string().required().messages({
      "string.empty": 'The "password" field must be filled in',
    }),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'the "email" field must be a valid email',
    }),
    password: Joi.string()
      .required()
      .messages({ "string.empty": 'The "password" field must be filled in' }),
  }),
});

const validateProfileUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    email: Joi.string().email().required().messages({
      "string.empty": 'The "email" field must be filled in',
      "string.email": 'the "email" field must be a valid email',
    }),
  }),
});

const validateBookAction = celebrate({
  body: Joi.object().keys({
    bookId: Joi.string().required().messages({
      "string.empty": 'The "bookId" field must be filled in',
    }),
    title: Joi.string().required().min(1).messages({
      "string.min": 'The minimum length of the "title" field is 1',
      "string.empty": 'The "title" field must be filled in',
    }),
    author: Joi.string().required().messages({
      "string.empty": 'The "author" field must be filled in',
    }),
    description: Joi.string().optional().allow("").messages({
      "string.base": 'The "description" field must be a string',
    }),
    publishedDate: Joi.string().optional().allow("").messages({
      "string.base": 'The "publishedDate" field must be a string',
    }),
    coverImage: Joi.string().uri().optional().allow("").messages({
      "string.uri": 'The "coverImage" field must be a valid URI',
    }),
    isbn: Joi.string().optional().allow("").messages({
      "string.base": 'The "isbn" field must be a string',
    }),
  }),
});

const validateBookId = celebrate({
  params: Joi.object().keys({
    bookId: Joi.string().required().messages({
      "string.empty": 'The "bookId" parameter must be filled in',
    }),
  }),
});

module.exports = {
  validateCreateUser,
  validateLogin,
  validateProfileUpdate,
  validateBookAction,
  validateBookId,
};
