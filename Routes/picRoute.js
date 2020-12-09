'use strict';
//userRoute
const express = require('express');
const picController = require('../Controllers/picController');
const {body} = require('express-validator');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const english = require('naughty-words/en.json')


//Prevent multer for saving wrong file types
const fileFilter = (req, file, cb) => {
  console.log(`fileFilter: ${file.mimetype}`);
  if (!file.mimetype.includes('image')) {
    return cb(null, false, new Error('not an image'));
  } else {
    cb(null, true);
  }
};

const fileFilter2 = (req, file, cb) => {
  console.log(`filefilter2: ${file.mimetype}`);
  if (file.mimetype.includes('image') || file.mimetype.includes('video')) {
    return cb(null, true);
  } else {
    return cb(null, false, new Error('not an image or video'));
  }
};

const upload = multer({dest: 'Uploads/', fileFilter2});

const injectFile = (req, res, next) => {
  console.log('injectFile req.file: ', req.file);
  if (req.file) {
    req.body.type = req.file.mimetype;
  }
  console.log('inject', req.body);
  next();
};

router.get('/pics', picController.pic_list_get);

router.get('/videos', picController.video_list_get);

router.get('/mostlikes', picController.pic_list_get_by_most_likes);

router.get('/search/:input', picController.pic_list_get_by_search);

router.get('/picuserid/:pic_id', picController.get_pic_user_id);

router.delete('/delete/:pic_id', picController.pic_delete);

router.route('/')
    //.get(picController.pic_list_get)
    .post(
        upload.single('pic'),
        picController.make_thumbnail,
        injectFile,
        [
          body('description', 'must be at least three characters long and not contain bad words!').
              isLength({min: 3}).not().isIn(english),
          //body('type', 'not image or video').contains('image'),
          body('type', 'not image or video').matches('(?=video|image)'),
        ],
        picController.pic_create);

router.route('/userpics').get(picController.pic_get_by_owner);

module.exports = router;