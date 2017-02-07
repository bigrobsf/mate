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
router.get('/:id', (req, res) => {
  let targetUser = Number(req.params.id);

  if (req.cookies['/token'] && req.cookies['/token'].split('.')[1] === 'mate') {

    res.render('user-chat');
  } else {
    res.redirect('../token/login');
  }
});


// =============================================================================
// show all chats
router.get('/', (req, res) => {
  res.redirect('/');
});


module.exports = router;
