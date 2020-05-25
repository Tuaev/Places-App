const { check, validationResult } = require('express-validator');
const HttpError = require('../models/http-errors');

exports.validationCheck = (req, errorMessage) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(errorMessage, 422);
  }
};

// PLACES
exports.checkPlace = [
  check('title').not().isEmpty(),
  check('description').isLength({ min: 5 }),
  check('address').not().isEmpty(),
];

// USERS
exports.checkSignUp = [
  check('name').not().isEmpty(),
  check('email').normalizeEmail().isEmail(),
  check('password').isLength({ min: 7 }),
];
