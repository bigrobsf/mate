'use strict';
/* jshint esversion: 6 */
/* jshint devel: true */
/* jshint node: true */
/* jshint browser: true */

const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');
const PORT = process.env.PORT || 3007;

app.disable('x-powered-by');

const pg = require('pg');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const users = require('./routes/users.js');
const profiles = require('./routes/profiles.js');
const token = require('./routes/token.js');
const index = require('./routes/index.js');
const photos = require('./routes/photos.js');
const chat = require('./routes/chat.js');

var https_redirect = (req, res, next) => {
    if (process.env.NODE_ENV === 'production') {
        if (req.headers['x-forwarded-proto'] != 'https') {
            return res.redirect('https://' + req.headers.host + req.url);
        } else {
            return next();
        }
    } else {
        return next();
    }
};

app.use(https_redirect);

app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));
app.use(methodOverride('_method'));
app.use(cookieParser());

app.use(express.static(__dirname + '/public'));
app.use('/users', users);
app.use('/profiles', profiles);
app.use('/token', token);
app.use('/', index);
app.use('/photos', photos);
app.use('/chat', chat);

app.set('view engine', 'ejs');
app.set('views', [path.join(__dirname, 'views/users/'),
                  path.join(__dirname, 'views/profiles/'),
                  path.join(__dirname, 'views/photos/'),
                  path.join(__dirname, 'views/chat/'),
                  path.join(__dirname, 'views/site/')]);


// =============================================================================
// spin up the FTL
const httpServer = app.listen(PORT, () => {
  console.log(`MATE server is running on port ${PORT}`);
});

module.exports = {
  app: app,
  httpServer: httpServer
};
