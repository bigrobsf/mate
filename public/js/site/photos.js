/* jshint esversion: 6 */
/* jshint devel: true */
/* jshint node: true */
/* jshint browser: true */
/* jshint jquery: true */
'use strict';

let imgToStore;

$(document).ready(() => {
  var fileUploadElement = document.getElementById('file-upload');

  fileUploadElement.addEventListener('change', readFileImage, false);
});


//==============================================================================
// open image from file system
function readFileImage() {
  let canvas = document.getElementById('upload-img');
  let context = canvas.getContext('2d');

  let reader = new FileReader();

  reader.onload = function(event) {
    let imageObj = new Image();

    imageObj.onload = function() {
      context.drawImage(imageObj, 0, 0);

      imgToStore = openImgInCanvas(imageObj.src);
    };

    imageObj.src = event.target.result;
  };

  let fileElement = document.getElementById('file-upload');

  reader.readAsDataURL(fileElement.files[0]);
}

//==============================================================================
// opens retrieved image in Canvas element and converts to Base64 dataURL
function openImgInCanvas(imageURL) {
  let canvas = document.getElementById('upload-img');
  let context = canvas.getContext('2d');

  let imageObj = new Image();
  imageObj.crossOrigin = 'anonymous';

  imageObj.onload = function() {
    canvas.width = imageObj.width;
    canvas.height = imageObj.height;

    context.drawImage(this, 0, 0);
    console.log('dimension check: ', canvas.width, canvas.height, imageObj.width, imageObj.height);
  };

  imageObj.src = imageURL;

  let dataURL = context.canvas.toDataURL('data/jpeg', 1.0);
  console.log('context: ', context.canvas.width, context.canvas.height);

  storeImageData(dataURL, 0, 0);
}

//==============================================================================
// makes POST API to photos route
function storeImageData(dataURL, width, height) {
  let dataURLObj = {
    imageData: dataURL,
    idWidth: width,
    idHeight: height
  };

  $.ajax({
    type: 'POST',
    url: '/photos',
    data: dataURLObj,
    success: console.log('success'),
    error: function(jqXHR, textStatus, err) {
            console.log('text status '+textStatus+', err '+err);
            }
  });

}
