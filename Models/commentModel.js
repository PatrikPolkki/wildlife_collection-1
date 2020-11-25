'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();

const getCommentById = async (id) => {
  try {
    const [rows] = await promisePool.execute(
        `SELECT DISTINCT wop_testuser.name, wop_testuser.lastname, wop_testcomments.comment, wop_testcomments.pic_id, wop_testcomments.date 
        FROM wop_testuser INNER JOIN wop_testcomments ON wop_testuser.user_id = wop_testcomments.user_id 
        WHERE wop_testcomments.pic_id = ?;`, [id]);
    return rows;
  } catch (e) {
    console.error('commentModel getCommentById: ', e.message);
  }
};

const addComment = async (req) => {
  console.log('commentModel addComment req.body: ', req.body);
  try {
    const [rows] = await promisePool.execute(
        'INSERT INTO wop_testcomments (pic_id, user_id, comment, date)' +
        'VALUES (?, ?, ?, ?)',
        [
          //Check this!!
          req.body.pic_id,
          req.body.user_id,
          req.body.comment,
          req.body.date]);
    console.log('commentModel addComment: ', rows);
    return rows.insertId;
  } catch (e) {
    console.log('commentModel addComment error: ', e);
    return 0;
  }
};

module.exports = {
  getCommentById,
  addComment,
};