'use strict';
//User controller
const userModel = require('../Models/userModel');
const {validationResult} = require('express-validator');


const user_list_get = async (req, res) => {
  const users = await userModel.getAllUsers();
  await res.json(users);
};

const user_get_by_id = async (req, res) => {
  console.log(`userRoute: http get user with path param`, req.params);
  const user = await userModel.getUser(req.params.id);
  await res.json(user);
};

const user_create = async (req, res) => {
  //res.send('Create a user here!');
  console.log('userController user_create: ', req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors: errors.array()});
  }
  await userModel.insertUser(req);
  //const user = await userModel.getUser(id);
  //res.send(user);
};

const check_username = async (req, res) => {
  res.json({'name': req.user.name, 'lastname': req.user.lastname});
}

module.exports = {
  user_list_get,
  user_get_by_id,
  user_create,
  check_username
}