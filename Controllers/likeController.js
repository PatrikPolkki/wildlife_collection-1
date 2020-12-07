'use strict';
const likeModel = require('../Models/likeModel');

// Uses picture ID
const get_likes_by_id = async (req, res) => {
  console.log(`likeController: get_likes_by_id with path param`, req.params);
  const like = await likeModel.getLikesById(req.params.id);
  await res.json(like);
};
/*
// Uses picture ID
const create_likes = async (req, res) => {
  //here we will create a interaction with data coming from req
  console.log('likeContoller create_likes req.params: ', req.params);
  await likeModel.createLikesForPic(req.params.id);
};
*/
// Create like or dislike for user for a picture
const create_user_like = async (req, res) => {
  try {
    // Backend check that a user cannot post multiple likes in any possible way
    req.body.pic_id = req.params.id;
    req.body.user_id = req.user.user_id;
    const status = await likeModel.likeStatus(req);
    console.log('likeController: like_status', status);

    // User hasn't liked or disliked before
    if (status === undefined) {
      if (req.path.includes('incrementlike')) {
        req.body.likes = 1;
        req.body.dislikes = 0;
      } else {
        req.body.dislikes = 1;
        req.body.likes = 0;
      }
      console.log(req.body);
      const updatedLike = await likeModel.createUserLike(req);
      await res.json(updatedLike);
    } else {
      console.log('User has already liked');
      res.send('response: Already liked');
    }
  } catch (e) {
    console.error(e.message);
  }
};

// Uses picture ID
const increment_dislike = async (req, res) => {
  console.log('likeController: increment_dislike with path param ', req.params);
  const updatedDislike = await likeModel.incrementDislike(req.params.id);
  await res.json(updatedDislike);
};

// For frontend to check if the user has liked the picture or not
const like_status = async (req, res) => {
  try {
    req.body.pic_id = req.params.pic_id;
    req.body.user_id = req.user.user_id;
    const status = await likeModel.likeStatus(req);
    console.log('likeController: like_status', status);

    if (status == undefined) {
      await res.status(200).send({'result': false});
    } else if (status.likes == 1 || status.dislikes == 1) {
      await res.status(200).send({'result': true});
    } else {
      await res.status(200).send({'result': false});
    }
  } catch (e) {
    console.error(e.message);
  }
};

module.exports = {
  get_likes_by_id,
  //create_likes,
  create_user_like,
  increment_dislike,
  like_status,
};