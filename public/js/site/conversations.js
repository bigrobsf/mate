/* jshint esversion: 6 */
/* jshint node: true */
/* jshint browser: true */
/* jshint jquery: true */

'use strict'; // optional

window.onload = function() {
  let history = document.getElementById('message-history');

  setMsgStatusFalse();
};

//==============================================================================
// makes POST to users route
function setMsgStatusFalse() {
  let messageStatus = {
    status: false
  };

  $.ajax({
    type: 'PUT',
    url: '/users/message',
    data: messageStatus,
    success: function(responseText, status) {
      setReadMsgStatus(responseText);
    },
    error: function(jqXHR, textStatus, err) {
            console.log('text status ' + textStatus + ', err ' + err);
            }
  });

}

function setReadMsgStatus(msg) {
  console.log('message? ', msg);
  $('#msg-tab').removeClass('msg-notify');
}

// end
