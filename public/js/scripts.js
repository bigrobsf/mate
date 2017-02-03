/* jshint esversion: 6 */
/* jshint devel: true */
/* jshint node: true */
/* jshint browser: true */
/* jshint jquery: true */
'use strict';

$(document).ready(function() {
  $('select').material_select();
  $('.button-collapse').sideNav({
    menuWidth: 200
  });

  let displayedSplash = localStorage.getItem('displayedSplash');

  if (!displayedSplash) {
    $.fn.center = function () {
      this.css('position','absolute');
      this.css('top', Math.max(0, (
        ($(window).height() - $(this).outerHeight()) / 2) +
        $(window).scrollTop()) + 'px'
      );
      this.css('left', Math.max(0, (
        ($(window).width() - $(this).outerWidth()) / 2) +
        $(window).scrollLeft()) + 'px'
      );
      return this;
    };

    $('#overlay').show();
    $('#overlay-content').show().center();

    setTimeout(function(){
      $('#overlay').fadeOut();

      localStorage.setItem('displayedSplash', 'true');
    }, 2000);
  }

  let enableSplashElement = document.getElementById('clear-splash');
  enableSplashElement.addEventListener('mousedown', enableSplash);

  function enableSplash() {
    localStorage.removeItem('displayedSplash');
    console.log('Splash flag cleared.');
  }
});
