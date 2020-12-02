'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();

const getAllUsers = async () => {
  try {
    const [rows] = await promisePool.execute('SELECT * FROM wop_testuser');
    return rows;
  } catch (e) {
    console.error('userModel getAllUsers: ', e.message);
  }
};

const getUser = async (id) => {
  try {
    const [rows] = await promisePool.execute(
        `SELECT * FROM wop_testuser WHERE user_id = ?`, [id]);
    return rows[0];
  } catch (e) {
    console.error('userModel getUser: ', e.message);
  }
};

const insertUser = async (req) => {
  console.log('userModel req.body: ', req.body);
  try {
    const [rows] = await promisePool.execute(
        'INSERT INTO wop_testuser (name, lastname, email, password, admin)' +
        'VALUES (?, ?, ?, ?, ?)',
        [
          req.body.name,
          req.body.lastname,
          req.body.email,
          req.body.password,
          req.body.admin]);
    console.log('userModel insert: ', rows);
    return rows.insertId;
  } catch (e) {
    console.log('userModel insert error: ', e);
    return 0;
  }
};

const getUserLogin = async (params) => {
  try {
    console.log('getUserLogin', params);
    const [rows] = await promisePool.execute(
        'SELECT * FROM wop_testuser WHERE email = ?;',
        params);
    return rows;
  } catch (e) {
    console.log('error', e.message);
  }
};

module.exports = {
  getAllUsers,
  getUser,
  getUserLogin,
  insertUser,
};