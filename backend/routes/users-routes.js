const { Router } = require('express');

const { checkSignUp, checkLogin } = require('../middleware/validation-middleware');
const usersController = require('../controllers/users-controllers');

const router = Router();

router.get('/', usersController.getUsers);

router.post('/signup', checkSignUp, usersController.signup);

router.post('/login', checkLogin, usersController.login);

module.exports = router;
