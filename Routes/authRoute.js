'use strict';
const express = require('express');
const router = express.Router();
const authController = require('../Controllers/authController');
const {body} = require('express-validator');

router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/register',
    [
      body('name', 'minimum lenghth 3 characters').isLength({min: 3}),
      body('lastname', 'minimum lenghth 3 characters').isLength({min: 3}),
      body('email', 'is not valid email').isEmail(),
      body('password',
          'minimum length 8 characters, at least one capital letter').
          matches('(?=.*[A-Z]).{8,}'),
    ],
    authController.user_create_post,
    authController.login
);

module.exports = router;