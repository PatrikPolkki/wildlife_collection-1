'use strict';
//root routes (example with get, post and put)
const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
  console.log('rootRoute: root route with req:', req.query);
  //res.send(`Hello world <a href="cat">Click</a><br>
  //with test is ${req.query.test} and fsun is ${req.query.more}`);
  //res.sendFile('index.html', { root: '.' });
  //res.send(`<h1>Hello Index page</h1>`);
  res.render('index.html')
});

router.post('/', (req, res) => {
  console.log('rootRoute: / route with post', req.body);
  res.send('Hello root route with http post');
});

router.put('/', (req, res) => {
  console.log('rootRoute: http put');
  res.send('http put on root route');
});

router.delete('/', (req, res) => {
  console.log('rootRoute: http delete');
  res.send('http delete on root route');
});

module.exports = router;