'use strict';
//likeRoute for not logged user
const express = require('express');
const likeController = require('../Controllers/likeController');
const router = express.Router();

router.post('/:id', likeController.create_likes);

router.get('/:id', likeController.get_likes_by_id);

module.exports = router;