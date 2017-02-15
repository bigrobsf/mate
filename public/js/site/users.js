/* jshint esversion: 6 */
/* jshint devel: true */
/* jshint node: true */
/* jshint browser: true */
/* jshint jquery: true */
'use strict';

// enables profile update button after changes to these fields in form
$(document).ready(() => {
  var lNameElement = document.getElementById('lastName');
  var fNameElement = document.getElementById('firstName');
  var uNameElement = document.getElementById('userName');
  var emailElement = document.getElementById('email');
  var pw1Element = document.getElementById('password1');

  fNameElement.addEventListener('input', () => {
    console.log($('#firstName').val().length);
    if ($('#firstName').val().length > 0) {
      $('#update-user-btn').removeClass('disabled');
    }
  });

  lNameElement.addEventListener('input', () => {
    console.log($('#lastName').val().length);
    if ($('#lastName').val().length > 0) {
      $('#update-user-btn').removeClass('disabled');
    }
  });

  uNameElement.addEventListener('input', () => {
    console.log($('#userName').val().length);
    if ($('#userName').val().length > 0) {
      $('#update-user-btn').removeClass('disabled');
    }
  });

  emailElement.addEventListener('input', () => {
    console.log($('#email').val().length);
    if ($('#email').val().length > 0) {
      $('#update-user-btn').removeClass('disabled');
    }
  });

  pw1Element.addEventListener('input', () => {
    console.log($('#password1').val().length);
    if ($('#password1').val().length > 0) {
      $('#update-user-btn').removeClass('disabled');
    }
  });


});
