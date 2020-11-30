'use strict';
const commentModel = require('../Models/commentModel');

const get_comment_by_id = async (req, res) => {
  console.log(`commentController: get_comment_by_id with path param`,
      req.params);
  //Query for comment id --> defined in route
  const comment = await commentModel.getCommentById(req.params.id);
  await res.json(comment);
};

const add_comment = async (req, res) => {
  console.log(`commentController: get_comment_by_id with path param`,
      req.params);
  console.log(`commentController: get_comment_by_id with path body`, req.body);
  let date = new Date();
  date = date.toISOString().split('T')[0] + ' '
      + date.toTimeString().split(' ')[0];

  req.body.date = date;
  req.body.pic_id = req.params.pic_id;
  req.body.user_id = req.user.user_id;
  console.log('req.body after adding', req.body);
  const comment = await commentModel.addComment(req);
  await res.json(comment);
};

module.exports = {
  get_comment_by_id,
  add_comment,
};