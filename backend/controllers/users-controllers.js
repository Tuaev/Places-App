const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const User = require('../models/user');
const HttpError = require('../models/http-errors');
const { validationCheck } = require('../middleware/validation-middleware');

exports.getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (error) {
    return next(new HttpError('Fetching users failed, please try again later.', 500));
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

exports.signup = async (req, res, next) => {
  try {
    validationCheck(req, 'Invalid inputs passed, please check your data.');
  } catch (error) {
    return next(error);
  }

  const { name, email, password } = req.body;
  let existingUsers;

  try {
    existingUsers = await User.findOne({ email });
  } catch (error) {
    return next(new HttpError('Signing up failed, please try again later.', 500));
  }

  if (existingUsers) {
    return next(new HttpError('User already exists, please login instead.', 422));
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    return next(new HttpError('Could not create user, please try again.', 500));
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    image: req.file.path,
    places: [],
  });

  try {
    await createdUser.save();
  } catch (error) {
    return next(new HttpError('Signing up failed, please try again later', 500));
  }

  let token;
  try {
    token = jwt.sign({ userId: createdUser.id, email: createdUser.email }, process.env.JWT_SECRET, {
      expiresIn: '5d',
    });
  } catch (error) {
    return next(new HttpError('Signing up failed, please try again later', 500));
  }

  res.status(201).json({ userId: createdUser.id, email: createdUser.email, token });
};

exports.login = async (req, res, next) => {
  try {
    validationCheck(req, 'Invalid inputs passed, please check your data.');
  } catch (error) {
    return next(error);
  }
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    return next(new HttpError('Login failed, invalid credentials.', 401));
  }

  if (!existingUser) {
    return next(new HttpError('Login failed, invalid credentials.', 401));
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (error) {
    return next(new HttpError('Login failed, please check your credentials and try again.', 500));
  }

  if (!isValidPassword) {
    return next(new HttpError('Login failed, invalid credentials', 403));
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_SECRET,
      {
        expiresIn: '5d',
      }
    );
  } catch (error) {
    return next(new HttpError('Login failed, please try again later', 500));
  }

  res.json({ message: 'Logged in!', userId: existingUser.id, email: existingUser.email, token });
};
