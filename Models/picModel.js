'use strict';
const pool = require('../Database/db');
const promisePool = pool.promise();

//Returns pics by their posting date, aka most recent
const getAllPics = async () => {
  try {
    const [rows] = await promisePool.execute(
        'SELECT DISTINCT wop_testuser.name, wop_testuser.lastname, wop_testpic.description, wop_testpic.coords, wop_testpic.date, wop_testpic.post_date, wop_testpic.filename, wop_testpic.pic_id, wop_testpic.user_id, wop_testpic.mediatype\n' +
        ' FROM wop_testuser \n' +
        '  INNER JOIN wop_testpic ON wop_testuser.user_id = wop_testpic.user_id\n' +
        '   WHERE wop_testpic.mediatype = \'image\' \n' +
        '    ORDER BY wop_testpic.post_date DESC;');
    return rows;
  } catch (e) {
    console.error('picModel getAllPics: ', e.message);
  }
};

//Returns videos by their posting date, aka most recent
const getAllVideos = async () => {
  try {
    const [rows] = await promisePool.execute(
        'SELECT DISTINCT wop_testuser.name, wop_testuser.lastname, wop_testpic.description, wop_testpic.coords, wop_testpic.date, wop_testpic.post_date, wop_testpic.filename, wop_testpic.pic_id, wop_testpic.user_id, wop_testpic.mediatype \n' +
        ' FROM wop_testuser \n' +
        '  INNER JOIN wop_testpic ON wop_testuser.user_id = wop_testpic.user_id \n' +
        '   WHERE wop_testpic.mediatype = \'video\' \n' +
        '    ORDER BY wop_testpic.post_date DESC');
    return rows;
  } catch (e) {
    console.error('picModel getAllPics: ', e.message);
  }
};

// Returns pics by their most liked
const getPicsByMostLikes = async () => {
  try {
    const [rows] = await promisePool.execute(
        'SELECT SUM(likes) AS likes, SUM(dislikes) AS dislikes, l.pic_id, p.description, p.filename, p.coords, p.date, p.post_date, p.mediatype, u.name, u.lastname, p.mediatype\n' +
        ' FROM wop_testlikes l\n' +
        '  INNER JOIN wop_testpic p\n' +
        '   ON l.pic_id = p.pic_id\n' +
        '    INNER JOIN wop_testuser u\n' +
        '     ON p.user_id = u.user_id\n' +
        '       GROUP BY l.pic_id\n' +
        '        ORDER BY likes DESC;');
    return rows;
  } catch (e) {
    console.error('picModel getPicsByMostLikes');
  }
};

const getPicById = async (id) => {
  try {
    console.log('picModel getPicById', id);
    //const [rows] = await promisePool.execute(`SELECT * FROM wop_cat WHERE cat_id = ${id}`);
    const [rows] = await promisePool.execute(
        'SELECT * FROM wop_testpic WHERE pic_id = ?', [id]);
    return rows[0];
  } catch (e) {
    console.error('picModel getPicById:', e.message);
  }
};

const getPicsByOwner = async (user_id) => {
  try {
    console.log('picModel getPicsByOwner id:', user_id);
    if (user_id !== null) {
      const [rows] = await promisePool.execute(
          'SELECT DISTINCT wop_testuser.name, wop_testuser.lastname, wop_testpic.description, wop_testpic.coords, wop_testpic.date, wop_testpic.post_date, wop_testpic.filename, wop_testpic.pic_id, wop_testpic.mediatype \n' +
          ' FROM wop_testuser INNER JOIN wop_testpic ON wop_testuser.user_id = wop_testpic.user_id\n' +
          '  WHERE wop_testuser.user_id = ?\n' +
          '   ORDER BY wop_testpic.post_date DESC;', [user_id]);
      return rows;
    } else {
      console.log('Not acceptable');
    }
  } catch (e) {
    console.error('picModel getPic error:', e.message);
  }
};

// Ordered by most liked
const getPicsBySearch = async (input) => {
  try {
    console.log('picModel getPicsBySearch: ', input);
    const [rows] = await promisePool.execute(
        'SELECT SUM(likes) AS likes, SUM(dislikes) AS dislikes, l.pic_id, p.description, p.filename, p.coords, p.date, p.post_date, u.name, u.lastname, p.mediatype\n' +
        ' FROM wop_testlikes l\n' +
        '  INNER JOIN wop_testpic p\n' +
        '   ON l.pic_id = p.pic_id\n' +
        '    INNER JOIN wop_testuser u\n' +
        '     ON p.user_id = u.user_id\n' +
        '      WHERE p.description\n' +
        '       LIKE ? \n' +
        '        GROUP BY l.pic_id\n' +
        '         ORDER BY likes DESC;', [input]);
    return rows;
  } catch (e) {
    console.error(e.message);
  }
};

const getPicUserId = async (pic_id) => {
  try {
    console.log('getPicUserId');
    const [rows] = await promisePool.execute('SELECT *\n' +
        ' FROM wop_testpic\n' +
        '  WHERE wop_testpic.pic_id = ?;', [pic_id]);
    return rows[0];
  } catch (e) {
    console.error(e.message);
  }
};

const insertPic = async (req) => {
  console.log('req.body: ', req.body);
  console.log('req.file: ', req.file);
  try {
    const [rows] = await promisePool.execute(
        'INSERT INTO wop_testpic (user_id, description, filename, coords, date, post_date, mediatype)' +
        'VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          req.body.id,
          req.body.description,
          req.file.filename,
          req.body.coords,
          req.body.dateTimeOriginal,
          req.body.postDate,
          req.body.mediatype]);
    console.log('picModel insert: ', rows);
    return rows.insertId;
  } catch (e) {
    console.log('picModel insert error: ', e);
    return 0;
  }
};

const deletePic = async (pic_id) => {
  console.log('picModel deletePic pic_id: ', pic_id);
  try {
    const [rows] = await promisePool.execute(
        'DELETE FROM wop_testpic WHERE pic_id = ?', [pic_id]);
    const [rows2] = await promisePool.execute(
        'DELETE FROM wop_testcomments WHERE pic_id = ?', [pic_id]);
    const [rows3] = await promisePool.execute(
        'DELETE FROM wop_testlikes WHERE pic_id = ?', [pic_id]);
    return 'deleted pic and associated likes and comments';
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = {
  getAllPics,
  getAllVideos,
  getPicById,
  getPicsByOwner,
  insertPic,
  getPicsByMostLikes,
  getPicsBySearch,
  getPicUserId,
  deletePic,
};


