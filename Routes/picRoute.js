'use strict';
//userRoute
const express = require('express');
const picController = require('../Controllers/picController');
const {body} = require('express-validator');
const router = express.Router();
const multer = require('multer');

//Prevent multer for saving wrong file types
const fileFilter = (req, file, cb) => {
  console.log(`fileFilter: ${file.mimetype}`);
  if (!file.mimetype.includes('image')) {
    return cb(null, false, new Error('not an image'));
  } else {
    cb(null, true);
  }
};

const upload = multer({dest: 'Uploads/', fileFilter});

const injectFile = (req, res, next) => {
  if (req.file) {
    req.body.type = req.file.mimetype;
  }
  console.log('inject', req.body);
  next();
};

router.get('/', picController.pic_list_get);

router.get('/mostlikes', picController.pic_list_get_by_most_likes)
/*
router.route('/')
    //.get(picController.pic_list_get)
    .post(
    upload.single('pic'),
    picController.make_thumbnail,
    injectFile,
    [
      body('owner', 'must be at least 3 characters long').isLength({min: 1}),
      body('description', 'must be at least a character long').
          isLength({min: 1}),
      body('type', 'not image').contains('image'),
    ],
    picController.pic_create);
*/

router.route('/:id')
    //.get(picController.pic_list_get)
    .post(
        upload.single('pic'),
        picController.make_thumbnail,
        injectFile,
        [
          body('description', 'must be at least a character long').
              isLength({min: 1}),
          body('type', 'not image').contains('image'),
        ],
        picController.pic_create);


router.route('/:user_id').get(picController.pic_get_by_owner);

module.exports = router;