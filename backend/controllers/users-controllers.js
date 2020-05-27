const { v4: uuid } = require('uuid');

const User = require('../models/user');
const HttpError = require('../models/http-errors');
const { validationCheck } = require('../middleware/validation-middleware');

let DUMMY_USERS = [
  {
    id: 'u1',
    name: 'John',
    email: 'john@example.com',
    password: 'password',
  },
];

exports.getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (error) {
    return next(new HttpError('Fetching users failed, please try again later', 500));
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
    return next(new HttpError('Signing up failed, please try again later', 500));
  }

  if (existingUsers) {
    return next(new HttpError('User already exists, please login instead', 422));
  }

  const createdUser = new User({
    name,
    email,
    password,
    image:
      'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80',
    places: [],
  });
  try {
    await createdUser.save();
  } catch (error) {
    return next(new HttpError('Signing up failed, please try again later', 500));
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

exports.login = async (req, res, next) => {
  try {
    validationCheck(req, 'Invalid inputs passed, please check your data.');
  } catch (error) {
    return next(error);
  }
  const { email, password } = req.body;
  let existingUsers;
  try {
    existingUsers = await User.findOne({ email });
  } catch (error) {
    return next(new HttpError('Login failed, invalid credentials', 401));
  }

  if (!existingUsers || existingUsers.password !== password) {
    return next(new HttpError('Login failed, invalid credentials', 401));
  }

  res.json({ message: 'Logged in!' });
};
