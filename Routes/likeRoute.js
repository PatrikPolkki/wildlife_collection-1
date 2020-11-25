'use strict';
//likeRoute
const express = require('express');
const likeController = require('../Controllers/likeController');
const router = express.Router();

router.post('/:id', likeController.create_likes);

router.get('/:id', likeController.get_likes_by_id);

router.put('/incrementlike/:id', likeController.increment_like);

router.put('/incrementdislike/:id', likeController.increment_dislike);

module.exports = router;