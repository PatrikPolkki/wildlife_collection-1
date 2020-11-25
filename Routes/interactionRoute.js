'use strict';
//interactionRoute
const express = require('express');
const interactionController = require('../Controllers/interactionController');
const router = express.Router();

router.get('/:id', interactionController.get_interaction_by_id);

router.put('/like/:id', interactionController.increment_like);

router.post('/:id', interactionController.create_interaction);

router.put('/comment/:id', interactionController.add_comment);

module.exports = router;
