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
    id: Joi.string().required().messages({
      "string.empty": 'The "id" field must be filled in',
    }),
    etag: Joi.string().optional().allow("").messages({
      "string.base": 'The "etag" field must be a string',
    }),
    volumeInfo: Joi.object()
      .keys({
        title: Joi.string().required().min(1).messages({
          "string.min": 'The minimum length of the "title" field is 1',
          "string.empty": 'The "title" field must be filled in',
        }),
        authors: Joi.array().items(Joi.string().required()).messages({
          "string.empty": "Each author must be a string",
        }),
        description: Joi.string().optional().allow("").messages({
          "string.base": 'The "description" field must be a string',
        }),
        publishedDate: Joi.string().optional().allow("").messages({
          "string.base": 'The "publishedDate" field must be a string',
        }),
        imageLinks: Joi.object()
          .keys({
            thumbnail: Joi.string().uri().optional().allow("").messages({
              "string.uri": 'The "thumbnail" field must be a valid URI',
            }),
          })
          .optional(),
        industryIdentifiers: Joi.array()
          .items(
            Joi.object()
              .keys({
                type: Joi.string().optional().allow("").messages({
                  "string.base": 'The "type" field must be a string',
                }),
                identifier: Joi.string().optional().allow("").messages({
                  "string.base": 'The "identifier" field must be a string',
                }),
              })
              .unknown(false),
          )
          .optional(),
      })
      .required(),
  }),
});

const validateBookId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().messages({
      "string.empty": 'The "id" parameter must be filled in',
    }),
  }),
});

const validateGoal = celebrate({
  body: Joi.object().keys({
    goal: Joi.number().required().messages({
      "number.base": '"goal" must be a number',
    }),
  }),
});

module.exports = {
  validateCreateUser,
  validateLogin,
  validateProfileUpdate,
  validateBookAction,
  validateBookId,
  validateGoal,
};
