'use strict';

const express = require('express');
const videoController = require('../Controllers/videoController');
const {body} = require('express-validator');
const router = express.Router();
const multer = require('multer');

//Prevent multer for saving wrong file types
const fileFilter = (req, file, cb) => {
  console.log(`fileFilter: ${file.mimetype}`);
  if (!file.mimetype.includes('video')) {
    return cb(null, false, new Error('not a video'));
  } else {
    cb(null, true);
  }
};

const upload = multer({dest: 'Videos/', fileFilter});

const injectFile = (req, res, next) => {
  if (req.file) {
    req.body.type = req.file.mimetype;
  }
  console.log('inject', req.body);
  next();
};

router.get('/', videoController.video_list_get);

router.route('/').post(
    upload.single('video'),
    injectFile,
    [
      body('description', 'must be at least a character long').
          isLength({min: 1}),
      body('type', 'not image').contains('video'),
    ],
    videoController.video_create);

module.exports = router;