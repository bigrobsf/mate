/* jshint esversion: 6 */
/* jshint devel: true */
/* jshint node: true */
/* jshint browser: true */
/* jshint jquery: true */
'use strict';

$(document).ready(() => {

  var bdElement = document.getElementById('edit-birthdate');
  var heightElement = document.getElementById('edit-height');
  var weightElement = document.getElementById('edit-weight');
  var ethnicElement = document.getElementById('edit-ethnicity');
  var overviewElement = document.getElementById('edit-overview');
  var lookForElement = document.getElementById('edit-looking-for');
  var interestsElement = document.getElementById('edit-interests');
  var hometownElement = document.getElementById('edit-hometown');

  bdElement.addEventListener('change', () => {
    $('#update-profile-btn').removeClass('disabled');
  });

  heightElement.addEventListener('input', () => {
    $('#update-profile-btn').removeClass('disabled');
  });

  weightElement.addEventListener('input', () => {
    $('#update-profile-btn').removeClass('disabled');
  });

  ethnicElement.addEventListener('input', () => {
    $('#update-profile-btn').removeClass('disabled');
  });

  overviewElement.addEventListener('input', () => {
    $('#update-profile-btn').removeClass('disabled');
  });

  lookForElement.addEventListener('input', () => {
    $('#update-profile-btn').removeClass('disabled');
  });

  interestsElement.addEventListener('input', () => {
    $('#update-profile-btn').removeClass('disabled');
  });

  hometownElement.addEventListener('input', () => {
    $('#update-profile-btn').removeClass('disabled');
  });

});
