'use strict';
//likeRoute
const express = require('express');
const likeController = require('../Controllers/likeController');
const router = express.Router();

//router.post('/:id', likeController.create_likes);

router.get('/:id', likeController.get_likes_by_id);

router.post('/incrementlike/:id', likeController.create_user_like);

router.post('/incrementdislike/:id', likeController.create_user_like);

router.get('/likestatus/:pic_id', likeController.like_status);

module.exports = router;