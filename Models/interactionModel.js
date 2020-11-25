'use strict';
const pool = require('../database/db');
const promisePool = pool.promise();

const getInteractionById = async (id) => {
  try {
    const [rows] = await promisePool.execute(
        `SELECT * FROM wop_testinteractions WHERE interaction_id = ?`, [id]);
    return rows;
  } catch (e) {
    console.error('interactionModel getInteraction: ', e.message);
  }
};

const createInteraction = async (id) => {
  console.log('interactionModel createInteraction req.body: ', id);
  try {
    //0 and '' to avoid null in the database --> incrementing likes and adding comments works
    const [rows] = await promisePool.execute(
        'INSERT INTO wop_testinteractions (interaction_id, likes, comments)' +
        'VALUES (?, ?, ?)',
        [
          id,
          0,
          '']);
    console.log('interactionModel insert: ', rows);
    return rows.insertId;
  } catch (e) {
    console.log('picModel insert error: ', e);
    return 0;
  }
};

const incrementLike = async (id) => {
  try {
    console.log('interactionModel incrementLike id: ', id);
    const [rows] = await promisePool.execute(
        `UPDATE wop_testinteractions SET likes = likes + 1 WHERE interaction_id = ?`,
        [id],
    );
    return rows;
  } catch (err) {
    console.error('interactionModel incrementLike: ', err.message);
  }
};

const addComment = async (req) => {
  try {
    console.log('interactionModel addComment req: ', req);
    const [rows] = await promisePool.execute(
        'UPDATE wop_testinteractions SET comments = CONCAT(comments, ?) WHERE interaction_id = ?;',
        [
          req[0],
          req[1]],
    );
    return rows;
  } catch (err) {
    console.error('interactionModel addComment');
  }
};

module.exports = {
  getInteractionById,
  incrementLike,
  createInteraction,
  addComment,
};