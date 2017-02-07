/* jshint esversion: 6 */
/* jshint devel: true */
/* jshint node: true */
/* jshint browser: true */
/* jshint jquery: true */
'use strict';

$(document).ready(() => {
  var captionElement = document.getElementById('caption');
  var pfElement = document.getElementById('profile-flag');

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
});
