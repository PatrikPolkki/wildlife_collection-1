'use strict';
const pool = require('../Database/db');
const promisePool = pool.promise();

const getAllVideos = async () => {
  try {
    const [rows] = await promisePool.execute(
        'SELECT DISTINCT wop_testuser.name, wop_testuser.lastname, wop_testvideo.description, wop_testvideo.post_date, wop_testvideo.filename, wop_testvideo.video_id, wop_testvideo.user_id \n' +
        ' FROM wop_testuser INNER JOIN wop_testvideo ON wop_testuser.user_id = wop_testvideo.user_id \n' +
        '  ORDER BY wop_testvideo.post_date DESC;');
    return rows;
  } catch (e) {
    console.error('videoModel getAllVideos: ', e.message);
  }
};

const insertVideo = async (req) => {
  console.log('videoModel insertVideo req.body: ', req.body);
  console.log('videoModel insertVideo req.file: ', req.file);
  try {
    const [rows] = await promisePool.execute(
        'INSERT INTO wop_testvideo (user_id, description, filename, post_date)' +
        'VALUES (?, ?, ?, ?)',
        [
          req.body.id,
          req.body.description,
          req.file.filename,
          req.body.postDate,
        ]);
    console.log('videoModel insert: ', rows);
    //Return id of inserted video for further purposes
    return rows.insertId;
  } catch (e) {
    console.log('videoModel insert error: ', e);
    return 0;
  }
};

const getVideoById = async (id) => {
  try {
    console.log('videoModel getVideoById', id);
    const [rows] = await promisePool.execute(
        'SELECT * FROM wop_testvideo WHERE video_id = ?', [id]);
    return rows[0];
  } catch (e) {
    console.error('videoModel getVideoById:', e.message);
  }
};

module.exports = {
  getAllVideos,
  insertVideo,
  getVideoById
};