'use strict';

const picModel = require('../Models/picModel');
const {validationResult} = require('express-validator');
const ImageMeta = require('../Utils/imageMeta');
const {makeThumbnail} = require('../Utils/resize');
const fs = require('fs');

const pic_list_get = async (req, res) => {
  const pics = await picModel.getAllPics();
  await res.json(pics);
};

const video_list_get = async (req, res) => {
  const pics = await picModel.getAllVideos();
  await res.json(pics);
};

const pic_list_get_by_most_likes = async (req, res) => {
  const pics = await picModel.getPicsByMostLikes();
  await res.json(pics);
};

const pic_list_get_by_search = async (req, res) => {
  const input = '%' + req.params.input + '%';
  console.log(input);
  const pics = await picModel.getPicsBySearch(input);
  await res.json(pics);
};

const pic_create = async (req, res) => {
  //here we will create a pic with data coming from req
  //console.log('picContoller pic_create', req.body, req.file, req.params.id);
  console.log('req.file: ', req.file);

  // Check if validation was passed without errors.
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Error happened in pic validation: ', errors.array());

    // Delete the pic which is tried to be uploaded

    fs.unlink(`Thumbnails/${req.file.filename}`, err => {
      if (err) throw err;
      console.log(
          `Removing Thumbnails/${req.file.filename} because of error in validation.`);
    });

    return res.status(400).json({errors: errors.array()});
  }

  //Add jwt payload user_id as part of body
  req.body.id = req.user.user_id;

  // Check if the image has any exifData
  const isExifdata = await ImageMeta.checkExifdata(req.file.path);
  console.log(isExifdata);

  if (isExifdata) {
    //get gps coordinates from image
    if (req.file.mimetype === 'image/jpeg') {
      const coords = await ImageMeta.getCoordinates(req.file.path);
      console.log('coords', coords);
      req.body.coords = coords;
    } else {
      req.body.coords = null;
    }

    //get timestamp from image
    if (req.file.mimetype === 'image/jpeg') {
      const dateTimeOriginal = await ImageMeta.getDateTimeOriginal(
          req.file.path);
      console.log('dateTimeOriginal', dateTimeOriginal);
      req.body.dateTimeOriginal = dateTimeOriginal;
    } else {
      req.body.dateTimeOriginal = null;
    }
  } else {
    req.body.coords = null;
    req.body.dateTimeOriginal = null;
  }
  //get post_date = current time
  let date = new Date();
  date = date.toISOString().split('T')[0] + ' '
      + date.toTimeString().split(' ')[0];
  req.body.postDate = date;

  if (req.file.mimetype.includes('image')) {
    req.body.mediatype = 'image';
  } else {
    req.body.mediatype = 'video';
  }

  // Delete Uploaded file from machine if it is image, only Thumbnails are used anyways and now exif data is exctracted too.
  // Videos will be kept
  if (req.file.mimetype.includes('image')) {
    try {
      fs.unlink(`Uploads/${req.file.filename}`, err => {
        if (err) throw err;
        console.log(`Removing Uploads/${req.file.filename}`);
      });
    } catch (e) {
      console.log(e.message);
    }
  }

  // Insert pic
  const id = await picModel.insertPic(req);
  //Query for pic..
  const pic = await picModel.getPicById(id);
  //...then send it
  res.send(pic);
};

//Used to create thumbnails with sharp --> resize.js
const make_thumbnail = async (req, res, next) => {
  console.log('make_thumbnail req.file.mimetype: ', req.file.mimetype);
  //If the posted media is image and not video, create thumbnail and resize
  if (req.file.mimetype.includes('image')) {
    try {
      const ready = await makeThumbnail({width: 800, height: 800},
          req.file.path,
          './Thumbnails/' + req.file.filename);
      if (ready) {
        console.log('make_thumbnail', ready);
        next();
      }
    } catch (e) {
      //return res.status(400).json({errors: e.message});
      next();
    }
  } else {
    next();
  }
};

const pic_get_by_owner = async (req, res) => {
  console.log(`picController: http get pic with path param`, req.params);  //params -> id
  const pic = await picModel.getPicsByOwner(req.user.user_id);
  await res.json(pic);
};

// Send true if user is the owner of picture else send false
const get_pic_user_id = async (req, res) => {
  const picOwner = await picModel.getPicUserId(req.params.pic_id);
  if (picOwner.user_id == req.user.user_id || req.user.admin == 1) {
    await res.status(200).send({'result': true});
  } else {
    await res.status(200).send({'result': false});
  }
};

const pic_delete = async (req, res) => {
  // Check user_id of the pic (=owner)
  const picOwner = await picModel.getPicUserId(req.params.pic_id);
  console.log('picOwner info, is there filename?: ', picOwner);

  // Delete files from the machine too
  fs.unlink(`Thumbnails/${picOwner.filename}`, err => {
    if (err) throw err;
    console.log(`Removing Thumbnails/${picOwner.filename}`);
  });

  if (picOwner.user_id == req.user.user_id || req.user.admin == 1) {
    const picDeleted = await picModel.deletePic(req.params.pic_id);
    await res.json(picDeleted);
  }
};

module.exports = {
  pic_list_get,
  pic_create,
  make_thumbnail,
  pic_get_by_owner,
  pic_list_get_by_most_likes,
  pic_list_get_by_search,
  get_pic_user_id,
  pic_delete,
  video_list_get,
};
