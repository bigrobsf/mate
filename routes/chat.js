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
// show chat with single user
router.get('/', (req, res) => {
  res.render('user-chat');
});


// =============================================================================
// show all chats
router.get('/chats', (req, res) => {
  res.render('all-chats');
});


module.exports = router;
