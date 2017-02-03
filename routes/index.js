/* jshint esversion: 6 */
/* jshint devel: true */
/* jshint node: true */
/* jshint browser: true */
'use strict';

const boom  = require('boom');
const express = require('express');
const bcrypt = require('bcrypt-as-promised');
const { camelizeKeys, decamelizeKeys } = require('humps');
var knex = require('../db/knex');
const router = express.Router();

// =============================================================================
// show home page
router.get('/', function(req, res) {
  if (req.cookies['/token']) {
    res.render('index', {loggedIn: true});
  } else {
    res.render('index', {loggedIn: false});
  }
});

// =============================================================================
// show about page
router.get('/site/about', function(req, res) {
  res.render('about');
});

// =============================================================================
// show contact page
router.get('/site/contact', function(req, res) {
  res.render('contact');
});

module.exports = router;
