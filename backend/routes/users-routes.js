const { Router } = require('express');

const { checkSignUp } = require('../middleware/validation-middleware');
const usersController = require('../controllers/users-controllers');

const router = Router();

router.get('/', usersController.getUsers);

router.post('/signup', checkSignUp, usersController.signup);

router.post('/login', usersController.login);

module.exports = router;
