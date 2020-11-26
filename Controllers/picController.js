'use strict';

const picModel = require('../Models/picModel');
const {validationResult} = require('express-validator');
const ImageMeta = require('../utils/imageMeta');
const {makeThumbnail} = require('../Utils/resize');

const pic_list_get = async (req, res) => {
  const pics = await picModel.getAllPics();
  await res.json(pics);
};

const pic_list_get_by_most_likes = async (req, res) => {
  const pics = await picModel.getPicsByMostLikes();
  await res.json(pics);
}

const pic_list_get_by_search = async (req, res) => {
  const input = '%' + req.params.input + '%';
  console.log(input);
  const pics = await picModel.getPicsBySearch(input)
  await res.json(pics);
}

const pic_create = async (req, res) => {
  //here we will create a pic with data coming from req
  console.log('picContoller pic_create', req.body, req.file, req.params.id);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('validation', errors.array());
    return res.status(400).json({errors: errors.array()});
  }

  //Add path params as part of body
  req.body.id = req.params.id;

  //get gps coordinates from image
  const coords = await ImageMeta.getCoordinates(req.file.path);
  console.log('coords', coords);
  req.body.coords = coords;

  //get timestamp from image
  const dateTimeOriginal = await ImageMeta.getDateTimeOriginal(req.file.path);
  console.log('dateTimeOriginal', dateTimeOriginal);
  req.body.dateTimeOriginal = dateTimeOriginal;

  //get post_date = current time
  let date = new Date();
  date = date.toISOString().split('T')[0] + ' '
      + date.toTimeString().split(' ')[0];
  req.body.postDate = date;

  //const id = await picModel.insertPic(req);     //Returns an ID aswell
  const id = await picModel.insertPic(req);
  //Query for pic..
  const pic = await picModel.getPicById(id);
  //...then send it
  res.send(pic);
};

//Used to create thumbnails with sharp --> resize.js
const make_thumbnail = async (req, res, next) => {
  try {
    const ready = await makeThumbnail({width: 250, height: 250}, req.file.path,
        './thumbnails/' + req.file.filename);
    if (ready) {
      console.log('make_thumbnail', ready);
      next();
    }
  } catch (e) {
    //return res.status(400).json({errors: e.message});
    next();
  }
};

const pic_get_by_owner = async (req, res) => {
  console.log(`picController: http get pic with path param`, req.params);  //params -> id
  const pic = await picModel.getPicsByOwner(req.params.user_id);
  await res.json(pic);
};

module.exports = {
  pic_list_get,
  pic_create,
  make_thumbnail,
  pic_get_by_owner,
  pic_list_get_by_most_likes,
  pic_list_get_by_search
};