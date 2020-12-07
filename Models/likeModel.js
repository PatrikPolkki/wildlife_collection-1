'use strict';
const pool = require('../Database/db');
const promisePool = pool.promise();

const getLikesById = async (id) => {
  try {
    const [rows] = await promisePool.execute(
        'SELECT SUM(likes) AS likes,\n' +
        '       SUM(dislikes) AS dislikes,\n' +
        '        pic_id\n' +
        'FROM    wop_testlikes\n' +
        'WHERE pic_id = ?\n' +
        'GROUP BY pic_id;', [id]);
    return rows;
  } catch (e) {
    console.error('likeMode getLikesById: ', e.message);
  }
};
/*
const createLikesForPic = async (req, id) => {
  console.log('likeModel createLikes req.body: ', id);
  try {
    //0 to avoid null in the database
    const [rows] = await promisePool.execute(
        'INSERT INTO wop_testlikes (pic_id, likes, dislikes)' +
        'VALUES (?, ?, ?, ?)',
        [
          id,
          0,
          0,
          req.user.user_id]);
    console.log('likeModel createLikesForPic: ', rows);
    return rows.insertId;
  } catch (e) {
    console.log('likeModel createLikesForPic error: ', e);
    return 0;
  }
};
*/
const createUserLike = async (req) => {
  try {
    console.log('likeModel createUserLike id: ', req.body);
    const [rows] = await promisePool.execute(
        `INSERT INTO wop_testlikes (pic_id, likes, dislikes, user_id) 
        VALUES(?, ?, ?, ?)`,
        [
          req.body.pic_id,
          req.body.likes,
          req.body.dislikes,
          req.body.user_id],
    );
    return rows;
  } catch (err) {
    console.error('likeModel createUserLike: ', err.message);
  }
};

const incrementDislike = async (id) => {
  try {
    console.log('likeModel incrementDislike id: ', id);
    const [rows] = await promisePool.execute(
        `UPDATE wop_testlikes SET dislikes = dislikes + 1 WHERE pic_id = ?`,
        [id],
    );
    return rows;
  } catch (err) {
    console.error('likeModel incrementDislike: ', err.message);
  }
};

const likeStatus = async (req, res) => {
  try {
    console.log('likeModel likeStatus :', req.body.user_id, req.body.pic_id);
    const [rows] = await promisePool.execute('SELECT likes, dislikes\n' +
        ' FROM wop_testlikes\n' +
        '  WHERE user_id = ? AND\n' +
        '   pic_id = ?;', [
      req.body.user_id,
      req.body.pic_id]);
    return rows[0];
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = {
  getLikesById,
  //createLikesForPic,
  createUserLike,
  incrementDislike,
  likeStatus
};