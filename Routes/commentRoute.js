'use strict';
//commentRoute
const express = require('express');
const commentController = require('../Controllers/commentController');
const {body} = require('express-validator');
const english = require('naughty-words/en.json')
const router = express.Router();

router.get('/:id', commentController.get_comments_by_pic_id);

router.get('/commentuserid/:comment_id', commentController.get_comment_user_id);

router.delete('/delete/:comment_id', commentController.comment_delete);

router.post('/:pic_id',
    [
      body('comment',
          'must be at least three characters long and not contain bad words!').
          isLength({min: 3}).not().contains(english),
          //isLength({min: 3}).not().isIn(['ass', '123', 'god']),
    ],
    commentController.add_comment);

module.exports = router;