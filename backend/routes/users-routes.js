const express = require('express');

const { checkSignUp } = require('../middleware/validation-middleware');
const fileUpload = require('../middleware/file-upload');
const usersController = require('../controllers/users-controllers');

const router = express.Router();

router.get('/', usersController.getUsers);

router.post('/signup', fileUpload.single('image'), checkSignUp, usersController.signup);

router.post('/login', usersController.login);

module.exports = router;
