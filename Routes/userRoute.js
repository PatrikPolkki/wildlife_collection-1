'use strict';
//userRoute
const express = require('express');
const {body} = require('express-validator');
const userController = require('../Controllers/userController');
const router = express.Router();

router.get('/', userController.user_list_get);
/*
router.post('/',
    [
      body('name', 'minimum lenghth 3 characters').isLength({min: 3}),
      body('lastname', 'minimum lenghth 3 characters').isLength({min: 3}),
      body('email', 'is not valid email').isEmail(),
      body('password',
          'minimum length 8 characters, at least one capital letter').
          matches('(?=.*[A-Z]).{8,}'),
    ],
    userController.user_create);
*/
router.get('/:id', userController.user_get_by_id);

router.get('/check/loggeduser', userController.get_user_login);

module.exports = router;