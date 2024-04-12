const joi = require('joi')

const validation = joi.object({
    firstName: joi.string().required().trim().min(3)
    .regex(/^[a-zA-Z\s]*$/, 'letters and spaces only')
    .messages({
      'string.base': 'Full name must be a string',
      'string.empty': 'Full name cannot be empty',
      'string.min': 'Full name must have at least 3 characters',
      'string.max': 'Full name must have at most 8 characters',
      'string.pattern.base': 'Full name must contain letters and spaces only'
    }),
    lastName: joi.string().required().trim().min(2)
    .regex(/^[a-zA-Z\s]*$/, 'letters and spaces only')
    .messages({
      'string.base': 'last name must be a string',
      'string.empty': 'last name cannot be empty',
      'string.min': 'last name must have at least 2 characters',
      'string.max': 'last name must have at most 8 characters',
      'string.pattern.base': 'last name must contain letters and spaces only'
    }),
    email: joi.string().email({ tlds: { allow: false } }).required().trim().messages({
              'string.empty': 'Email cannot be empty',
              'any.required': 'Email is required',
            }),

    password:joi.string().min(8)
    .alphanum()
    .required()
    .messages({
      'string.base': 'Password must be a string',
      'string.empty': 'Password cannot be empty',
      'string.min': `Password should have at least 8 characters`,
      'string.max': `Password should have at most 15 characters`,
      'string.alphanum': 'Password must only contain alphanumeric characters'
    }),
    //pattern(new RegExp ('^[a-zA-Z0-9]{3,30}$')),
    // confirmPassword:joi.string().pattern(new RegExp ('^[a-zA-Z0-9]{3,30}$')),
    // confirmPassword:joi.string().valid(joi.ref("password")).required()
})


module.exports = validation