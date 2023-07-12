const express = require('express');
const userController = require('./../controller/viewController');

const router = express.Router();
router
  .get('/login', userController.login)
  .get('/signup', userController.signup)
  .get('/', userController.chatApp)


module.exports = router;