const { v4: uuid } = require('uuid');
const HttpError = require('../models/http-errors');

let DUMMY_USERS = [
  {
    id: 'u1',
    name: 'John',
    email: 'john@example.com',
    password: 'password',
  },
];

exports.getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};

exports.signup = (req, res, next) => {
  const { name, email, password } = req.body;
  const hasUser = DUMMY_USERS.find((user) => user.email === email);

  if (hasUser) {
    throw new HttpError('Could not create user, email already exists', 422);
  }

  const createdUser = {
    id: uuid(),
    name,
    email,
    password,
  };

  DUMMY_USERS.push(createdUser);

  res.status(201).json({ user: createdUser });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((user) => user.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError('Email or Password is incorrect', 401);
  }

  res.json({ message: 'Logged in!' });
};
