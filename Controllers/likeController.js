'use strict';
const likeModel = require('../Models/likeModel');

// Uses picture ID
const get_likes_by_id = async (req, res) => {
  console.log(`likeController: get_likes_by_id with path param`, req.params);
  const like = await likeModel.getLikesById(req.params.id);
  await res.json(like);
};

// Uses picture ID
const create_likes = async (req, res) => {
  //here we will create a interaction with data coming from req
  console.log('likeContoller create_likes req.params: ', req.params);
  await likeModel.createLikesForPic(req.params.id);
};

// Uses picture ID
const increment_like = async (req, res) => {
  console.log('likeController: increment_like with path param ', req.params);
  const updatedLike = await likeModel.incrementLike(req.params.id)
  await res.json(updatedLike);
}

// Uses picture ID
const increment_dislike = async (req, res) => {
  console.log('likeController: increment_dislike with path param ', req.params);
  const updatedDislike = await likeModel.incrementDislike(req.params.id)
  await res.json(updatedDislike);
}

module.exports = {
  get_likes_by_id,
  create_likes,
  increment_like,
  increment_dislike
}