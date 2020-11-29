'use strict';
//root routes (example with get, post and put)
const express = require('express');
const router = express.Router();


const session = require('express-session');
/*
router.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {maxAge: 60 * 1000},
}));*/


router.post('/:id', (req, res) => {
  console.log('cookieRoute req.params: ', req.params);
  res.cookie('loggedUser', req.params.id).send('cookie logged user set with value req.params.id');
});
/*
router.post('/:id', (req, res) => {
  console.log('cookieroute get for delete', req.params);
  res.setHeader('set-cookie', 'loggedUser=; max-age=0');
})
*/
module.exports = router;