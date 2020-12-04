'use strict';
const videoModel = require('../Models/videoModel');
const {validationResult} = require('express-validator');

const video_list_get = async (req, res) => {
  const videos = await videoModel.getAllVideos();
  await res.json(videos);
};

const video_create = async (req, res) => {
  //here we will create a video with data coming from req
  //console.log('videoContoller video_create', req.body, req.file, req.params.id);
  console.log('videoController req.file: ', req.file);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('videoController validation: ', errors.array());
    return res.status(400).json({errors: errors.array()});
  }

  //Add jwt payload user_id as part of body
  req.body.id = req.user.user_id;

  //get post_date = current time
  let date = new Date();
  date = date.toISOString().split('T')[0] + ' '
      + date.toTimeString().split(' ')[0];
  req.body.postDate = date;

  //Returns an ID aswell
  const id = await videoModel.insertVideo(req);
  //Query for video..
  const video = await videoModel.getVideoById(id);
  //...then send it
  res.send(video);
};

module.exports = {
  video_list_get,
  video_create
}