/* jshint esversion: 6 */
/* jshint devel: true */
/* jshint node: true */
/* jshint browser: true */

const express = require('express');
var knex = require('../db/knex');
const bcrypt = require('bcrypt-as-promised');
const { camelizeKeys, decamelizeKeys } = require('humps');
const router = express.Router();

// =============================================================================
// show input form for new user
router.get('/new', function(req, res) {
  res.render('signup');
});

// =============================================================================
// GET - check message status
router.get('/message', (req, res, next) => {
  if (req.cookies['/token'] && req.cookies['/token'].split('.')[1] === 'mate') {
    let userId = Number(req.cookies['/token'].split('.')[0]);

    knex('users').select('message')
    .where('id', userId)
    .then((result) => {
      console.log('message check result', result);
      if (result.length > 0) result = result[0].message;
      else result = false;

      res.status(200).json(result);
    });

  } else {
    res.redirect('../token/login');
  }
});

// =============================================================================
// PUT - set message status to false
router.put('/message', (req, res, next) => {
  if (req.cookies['/token'] && req.cookies['/token'].split('.')[1] === 'mate') {
    let userId = Number(req.cookies['/token'].split('.')[0]);

    knex('users')
    .where('id', userId)
    .where('message', true)
    .update({message: false})
    .then(() => {
      console.log('users.message test has been set to false');
    });

  } else {
    res.redirect('../token/login');
  }
});

// =============================================================================
// POST new user
router.post('/', (req, res) => {

  const password = req.body.password1;

  bcrypt.hash(password, 12)
    .then((hashed) => {

      let newUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        userName: req.body.userName,
        email: req.body.email,
        hashedPassword: hashed
      };

      return knex('users')
        .insert(decamelizeKeys(newUser), ['id', 'first_name', 'last_name', 'user_name', 'email']);
    })
    .then((row) => {
      const user = camelizeKeys(row[0]);

      delete user.createdAt;
      delete user.updatedAt;
      delete user.hashedPassword;

      res.render('confirm-user', {
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        email: user.email,
        pwStatus: 'Saved',
        status: 'Added',
        message: 'Now, login and select Profile to create a profile!'
      });
    }).catch(err => {
      console.log('POST ERROR: ', err);
      res.status(400).send(err);
    });
});

// =============================================================================
// show account update page for current user
router.get('/update', (req, res) => {

  if (req.cookies['/token'] && req.cookies['/token'].split('.')[1] === 'mate') {
    let userId = Number(req.cookies['/token'].split('.')[0]);

    knex.select('id', 'first_name', 'last_name', 'user_name', 'email')
    .from('users').where('id', userId)
    .then((user) => {
      user = camelizeKeys(user[0]);

      if (user) {
        res.render('edit-user', {
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName,
             email: user.email
        });
      }
    });

  } else {

    res.redirect('../token/login');
  }
});

// =============================================================================
// PUT - update user record
router.put('/', (req, res) => {
  let userId = Number(req.cookies['/token'].split('.')[0]);
  let passwordUpdated = false;

  knex('users')
    .where('id', userId).first()
    .then((user) => {
      if(user) {

        const { firstName, lastName, userName, email, password1 } = req.body;
        const updateUser = {};

        if (firstName) updateUser.firstName = firstName;
        if (lastName) updateUser.lastName = lastName;
        if (userName) updateUser.userName = userName;
        if (email) updateUser.email = email;
        if (password1) {
          bcrypt.hash(password1, 12)
            .then((hashed) => {
              updateUser.hashedPassword = hashed;
              passwordUpdated = true;
            });
        }

        return knex('users')
          .update(decamelizeKeys(updateUser), '*')
          .where('id', userId);

      } else {
        throw new Error('User Not Found');
      }
    })
    .then((row) => {

      const user = camelizeKeys(row[0]);

      delete user.createdAt;
      delete user.updatedAt;
      delete user.hashedPassword;

      res.render('confirm-user', {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        userName: user.userName || '',
        email: user.email || '',
        pwStatus: passwordUpdated ? 'Updated' : 'Unchanged',
        status: 'Updated',
        message: ''
      });
    })
    .catch((err) => {
      console.log('PUT ERROR: ', err);
      res.status(400).send(err);
    });
});

// =============================================================================
// DELETE user record
router.delete('/', (req, res) => {
  if (req.cookies['/token'].split('.')[1] === 'mate') {
    let userId = Number(req.cookies['/token'].split('.')[0]);
    let deletedUser;

    knex('users')
      .where('id', userId).first()
      .then((user) => {
        console.log('DELETE ROUTE: ', user);
        if (user) {
          res.clearCookie('/token', { path: '/', httpOnly: true });

          deletedUser = user;

          return knex('users')
            .del().where('id', userId);
        } else {
          throw new Error('User Not Found');
        }
      })
      .then(() => {

        const user = camelizeKeys(deletedUser);

        delete user.createdAt;
        delete user.updatedAt;
        delete user.hashedPassword;

        res.render('confirm-user', {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          userName: user.userName || '',
          email: user.email || '',
          pwStatus: 'Deleted',
          status: 'Deleted',
          message: 'We are sorry to see you leave!'
        });
      })
      .catch((err) => {
        console.log('PUT ERROR: ', err);
        res.status(400).send(err);
      });
  } else res.redirect('../');
});


module.exports = router;
