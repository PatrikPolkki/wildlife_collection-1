'use strict';
const interactionModel = require('../Models/interactionModel');
const {validationResult} = require('express-validator');

const get_interaction_by_id = async (req, res) => {
  console.log(`interactionController: http get interaction with path param`, req.params);
  const interaction = await interactionModel.getInteractionById(req.params.id);
  await res.json(interaction);
};


const create_interaction = async (req, res) => {
  //here we will create a interaction with data coming from req
  console.log('interactionContoller create_interaction req.params: ', req.params);
  await interactionModel.createInteraction(req.params.id);
};


const increment_like = async (req, res) => {
  console.log('interactionController: increment_like with path param ', req.params);
  const updatedLike = await interactionModel.incrementLike(req.params.id)
  await res.json(updatedLike);
}

const add_comment = async (req, res) => {
  console.log('interactionController: add_comment req.body', req.body);
  console.log('interactionController: add_comment with path param ', req.params);
  const toBeAdded = [req.body.comment, req.params.id]
  console.log(toBeAdded);
  const updateComments = await interactionModel.addComment(toBeAdded);
  await res.json(updateComments);
}

module.exports = {
  get_interaction_by_id,
  create_interaction,
  increment_like,
  add_comment
};