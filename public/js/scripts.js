/* jshint esversion: 6 */
/* jshint devel: true */
/* jshint node: true */
/* jshint browser: true */
/* jshint jquery: true */
'use strict';

$(document).ready(() => {
  // materialize components
  $('select').material_select();
  $('.carousel').carousel({nowrap: false});
  $('.button-collapse').sideNav({
    menuWidth: 200
  });

  // login status elements
  let joinElement = document.getElementById('join');
  let loginElement = document.getElementById('login');
  let accountElement = document.getElementById('account');
  let profileElement = document.getElementById('profile');
  let logoutElement = document.getElementById('logout');

  let joinMobileElement = document.getElementById('join-mobile');
  let loginMobileElement = document.getElementById('login-mobile');
  let accountMobileElement = document.getElementById('account-mobile');
  let profileMobileElement = document.getElementById('profile-mobile');
  let logoutMobileElement = document.getElementById('logout-mobile');

  // ===========================================================================
  // code to display and fade out splash screen
  let displayedSplash = sessionStorage.getItem('displayedSplash');

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

      sessionStorage.setItem('displayedSplash', 'true');
    }, 2000);
  }


  // ===========================================================================
  // get login status to enable / disable login / account links in navbar
  let tokenStatus = {
    status: status
  };

  $.ajax({
    type: 'GET',
    url: '/token',
    data: tokenStatus,
    success: function(responseText, status) {
      setNavItemStatus(responseText);
    },
    error: function(jqXHR, textStatus, err) {
            console.log('text status ' + textStatus + ', err ' + err);
            }
  });

  function setNavItemStatus (loggedIn) {
    console.log('logged in? ', loggedIn);

    if (loggedIn) {
      joinElement.setAttribute('class', 'disabled');
      loginElement.setAttribute('class', 'disabled');

      joinMobileElement.setAttribute('class', 'disabled');
      loginMobileElement.setAttribute('class', 'disabled');

      if (accountElement.hasAttribute('class')) {
        accountElement.removeAttribute('class');
      }

      if (profileElement.hasAttribute('class')) {
        profileElement.removeAttribute('class');
      }

      if (logoutElement.hasAttribute('class')) {
        logoutElement.removeAttribute('class');
      }

      if (accountMobileElement.hasAttribute('class')) {
        accountMobileElement.removeAttribute('class');
      }

      if (profileMobileElement.hasAttribute('class')) {
        profileMobileElement.removeAttribute('class');
      }

      if (logoutMobileElement.hasAttribute('class')) {
        logoutMobileElement.removeAttribute('class');
      }
    } else {
      accountElement.setAttribute('class', 'disabled');
      profileElement.setAttribute('class', 'disabled');
      logoutElement.setAttribute('class', 'disabled');

      accountMobileElement.setAttribute('class', 'disabled');
      profileMobileElement.setAttribute('class', 'disabled');
      logoutMobileElement.setAttribute('class', 'disabled');

      if (joinElement.hasAttribute('class')) {
        joinElement.removeAttribute('class');
      }

      if (loginElement.hasAttribute('class')) {
        loginElement.removeAttribute('class');
      }

      if (joinMobileElement.hasAttribute('class')) {
        joinMobileElement.removeAttribute('class');
      }

      if (loginMobileElement.hasAttribute('class')) {
        loginMobileElement.removeAttribute('class');
      }
    }
  }

  // ===========================================================================
  // set message notification
  let messageStatus = {
    status: status
  };

  $.ajax({
    type: 'GET',
    url: '/users/message',
    data: messageStatus,
    success: function(responseText, status) {
      if (responseText === true) setNewMsgStatus(responseText);
    },
    error: function(jqXHR, textStatus, err) {
            console.log('text status ' + textStatus + ', err ' + err);
            }
  });

  function setNewMsgStatus(msg) {
    console.log('message? ', msg);
    $('#msg-tab').addClass('msg-notify');
  }

});
