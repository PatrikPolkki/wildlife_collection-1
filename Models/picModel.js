'use strict';
const pool = require('../Database/db');
const promisePool = pool.promise();

const getAllPics = async () => {
  try {
    const [rows] = await promisePool.execute('SELECT * FROM wop_testpic');
    return rows;
  } catch (e) {
    console.error('picModel getAllPics: ', e.message);
  }
};

const getPicById = async (id) => {
  try {
    // TODO: do the LEFT (or INNER) JOIN to get owner name too.
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
    // TODO: do the LEFT (or INNER) JOIN to get owner name too.
    console.log('picModel getPicsByOwner id:', user_id);
    if (user_id !== null) {
      const [rows] = await promisePool.execute(
          'SELECT * FROM wop_testpic WHERE owner = ?;', [user_id]);
      return rows;
    } else {
      console.log('Not acceptable');
    }
  } catch (e) {
    console.error('picModel getPic error:', e.message);
  }
};

const insertPic = async (req) => {
  console.log('req.body: ', req.body);
  console.log('req.file: ', req.file);
  try {
    const [rows] = await promisePool.execute(
        'INSERT INTO wop_testpic (owner, description, filename, coords, date)' +
        'VALUES (?, ?, ?, ?, ?)',
        [
          req.body.id,
          req.body.description,
          req.file.filename,
          req.body.coords,
          req.body.dateTimeOriginal]);
    console.log('picModel insert: ', rows);
    return rows.insertId;
  } catch (e) {
    console.log('picModel insert error: ', e);
    return 0;
  }
};

module.exports = {
  getAllPics,
  getPicById,
  getPicsByOwner,
  insertPic,
};


