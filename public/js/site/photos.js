/* jshint esversion: 6 */
/* jshint devel: true */
/* jshint node: true */
/* jshint browser: true */
/* jshint jquery: true */
'use strict';

$(document).ready(() => {
  var captionElement = document.getElementById('caption');
  var pfElement = document.getElementById('profileFlag');
  var fileUploadElement = document.getElementById('file-upload');

  captionElement.addEventListener('input', () => {
    console.log($('#caption').val().length);
    if ($('#caption').val().length > 0) {
      $('#update-photo-btn').removeClass('disabled');
    } else {
      $('#update-photo-btn').addClass('disabled');
    }
  });

  pfElement.addEventListener('change', () => {
    $('#update-photo-btn').removeClass('disabled');
  });

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

      openImgInCanvas(imageObj.src);
    };

    imageObj.src = event.target.result;
  };

  let fileElement = document.getElementById('file-upload');

  reader.readAsDataURL(fileElement.files[0]);
}

//==============================================================================
// opens retrieved image in HTML Canvas element
function openImgInCanvas(imageURL) {
  let canvas = document.getElementById('upload-img');
  let context = canvas.getContext('2d');

  let imageObj = new Image();
  imageObj.crossOrigin = 'anonymous';

  imageObj.onload = function() {
    canvas.width = imageObj.width;
    canvas.height = imageObj.height;
    context.drawImage(this, 0, 0);
  };

  imageObj.src = imageURL;

  let dataURL = context.canvas.toDataURL('data/jpeg', 1.0);
  console.log('toDataURL: ', dataURL);
  return dataURL;
}
