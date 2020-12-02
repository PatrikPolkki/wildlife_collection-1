'use strict';
const pool = require('../Database/db');
const promisePool = pool.promise();

const getLikesById = async (id) => {
  try {
    const [rows] = await promisePool.execute(
        `SELECT * FROM wop_testlikes WHERE pic_id = ?`, [id]);
    return rows;
  } catch (e) {
    console.error('likeMode getLikesById: ', e.message);
  }
};

const createLikesForPic = async (id) => {
  console.log('likeModel createLikes req.body: ', id);
  try {
    //0 to avoid null in the database
    const [rows] = await promisePool.execute(
        'INSERT INTO wop_testlikes (pic_id, likes, dislikes)' +
        'VALUES (?, ?, ?)',
        [
          id,
          0,
          0]);
    console.log('likeModel createLikesForPic: ', rows);
    return rows.insertId;
  } catch (e) {
    console.log('likeModel createLikesForPic error: ', e);
    return 0;
  }
};

const incrementLike = async (id) => {
  try {
    console.log('likeModel incrementLike id: ', id);
    const [rows] = await promisePool.execute(
        `UPDATE wop_testlikes SET likes = likes + 1 WHERE pic_id = ?`,
        [id],
    );
    return rows;
  } catch (err) {
    console.error('likeModel incrementLike: ', err.message);
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

module.exports = {
  getLikesById,
  createLikesForPic,
  incrementLike,
  incrementDislike
}