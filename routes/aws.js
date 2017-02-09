/* jshint esversion: 6 */
/* jshint devel: true */
/* jshint node: true */
/* jshint browser: true */

"use strict";

const Express = require('express');
const router = Express.Router();
var knex = require('../db/knex');
var bodyParser = require('body-parser');
var multer = require('multer');
var multerS3 = require('multer-s3');
var morgan = require('morgan'); // For logging
// var uuid = require('uuid');
// var passport = require('passport');
var fs = require('fs');

var AWS = require('aws-sdk');
AWS.config.loadFromPath(__dirname+'/../aws-config.json');
var s3 = new AWS.S3();

AWS.config.update({region:'us-west-2'});


// http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html#Credentials_from_Disk
// console.log(AWS.config, 'config')

var upload = multer({
  storage: multerS3({
    limits : { fileSize:3000000 },
    s3: s3,
    bucket: 'mateapp-bigrobsf',
    key: function (req, file, cb) {
      // console.log(file, 'file in multer');
      cb(null, file.originalname); //use Date.now() for unique file keys
    }
  })
});

// assume you already have the S3 Bucket created, and it is called ierg4210-shopxx-photos
var photoBucket = new AWS.S3({params: {Bucket: 'mateapp-bigrobsf'}});

function uploadToS3(file, destFileName, callback) {
  photoBucket
    .upload({
      ACL: 'public-read',
      Body: fs.createReadStream(file.path),
      Key: destFileName.toString(),
      ContentType: 'image/jpeg'
    })
    // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3/ManagedUpload.html#httpUploadProgress-event
    // .on('httpUploadProgress', function(evt) { console.log(evt); })
    // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3/ManagedUpload.html#send-property
    .send(callback);
}

router.post('/', upload.single('file'), function (req, res) {
  console.log(req.file, 'files');
  console.log(req.file.location, 'file location for aws');

  if (!req.file) {
    return res.status(403).send('expect 1 file upload named file1').end();
  }
  var file1 = req.file;
  // this is mainly for user friendliness. this field can be freely tampered by attacker.
  if (!/^image\/(jpe?g|png|gif)$/i.test(file1.mimetype)) {
    return res.status(403).send('expect image file').end();
  }

  var pid = '10000' + parseInt(Math.random() * 10000000);
  var jsonObj = file1;

  res.json({jsonObj});
});

router.get('/', (req, res) => {
  // const s3 = new aws.S3();
  const fileName = req.query['file-name'];
  const fileType = req.query['file-type'];
  const s3Params = {
    Bucket: 'mateapp-bigrobsf',
    Key: fileName,
    Expires: 60000,
    ContentType: fileType,
    ACL: 'public-read'
  };

  s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if(err){
      console.log(err);
      return res.end();
    }
    console.log(data, 'data returned');
    const returnData = {
      signedRequest: data,
      url: `https://mateapp-bigrobsf.s3.amazonaws.com/${fileName}`
    };
    console.log('returned data before json ,', returnData);
    res.json(JSON.stringify(returnData));
    // res.end();
  });
});

module.exports = router;
