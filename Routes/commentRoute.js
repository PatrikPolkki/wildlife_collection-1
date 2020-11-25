'use strict';
//commentRoute
const express = require('express');
const commentController = require('../Controllers/commentController');
const router = express.Router();

router.get('/:id', commentController.get_comment_by_id);

router.post('/:pic_id/:user_id', commentController.add_comment);

module.exports = router;