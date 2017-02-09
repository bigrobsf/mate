/* jshint esversion: 6 */
/* jshint devel: true */
/* jshint node: true */
/* jshint browser: true */
'use strict';

const myURL = 'http://localhost:3007';

function handlePhotoEntry(file) {
  var url = aws(file)
    .then((data) => {
      var name = data.jsonObj.key;
      var type = data.jsonObj.mimetype;
      var awsPhotoPath = `https://s3.amazonaws.com/mateapp-bigrobsf/${name}`;

      console.log(name, type, awsPhotoPath);

      var pathElement = document.getElementById('aws-img-path');
      pathElement.setAttribute('value', awsPhotoPath);

      console.log('results from aws: ', name, type, awsPhotoPath);
  }).catch((err)=> {
    console.log(err);
  });
}

function _handleImageChange(event) {
  event.preventDefault();

  let reader = new FileReader();
  let file = event.target.files[0];

  handlePhotoEntry(file);
}


function aws(obj) {
  const REQUEST_URL = `${myURL}/aws`;
  var myHeaders = new Headers();
  var jsonObj = JSON.stringify(obj);
  console.log('aws function obj: ', obj);

  var formData = new FormData();
  formData.append("file", obj);

  myHeaders.append('Access-Control-Request-Method', 'POST');
  myHeaders.append('Access-Control-Allow-Origin', '*');
  myHeaders.append('Accept', 'application/json');

  var myInit = { method: 'POST',
             body: formData,
             headers: myHeaders,
             mode: 'cors',
             cache: 'default' };

  return fetch(REQUEST_URL, myInit)
    .then((forJSON)=>{
      return forJSON.json();
    })
    .then((data)=>{
      console.log('this is the aws: ', data);
      return data;
    }).catch(function(err) {
      console.log('Fetch Error :-S', err);
    });
}
