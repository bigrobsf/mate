/* jshint esversion: 6 */
/* jshint node: true */
/* jshint browser: true */
/* jshint jquery: true */

'use strict'; // optional

let host = location.origin.replace(/^http/, 'ws');

window.onload = function() {
  $('#chatroom-tab').addClass('active');

  let messageField = document.getElementById('message-area');
  let chatroomList = document.getElementById('chatroom-log');
  let socketStatus = document.getElementById('status');

  // let closeBtn = document.getElementById('close');
  let openBtn = document.getElementById('open');
  let sendBtn = document.getElementById('send');

  let curUserId = Number(document.getElementById('cur-user-id').textContent);
  let curUserName = document.getElementById('cur-user-name').textContent;

  // console.log('users: ', curUserId, targetUserId, curUserName);

  // Creates a new WebSocket connection, which will fire the open connection event
  let socket = new WebSocket(host, 'mate-protocol');
  let clientKey = '';

  // Set connection status on form to Connected
  socket.onopen = function(event) {
    socketStatus.innerHTML = 'Connected.';
    socketStatus.className = 'open';
    openBtn.className = 'disabled';
    console.log(socketStatus.innerHTML);
  };

  // Listens for incoming data. When a message is received, the message
  // event is sent to this function
  socket.onmessage = function(event) {
    let msg = JSON.parse(event.data);
    // console.log('message from server: ', msg);
    let time = new Date(msg.date);
    let timeStr = time.toLocaleTimeString();

    // switch statement to easily add additional functions based on message type
    switch(msg.type) {
      case 'id':
        clientKey = msg.clientKey;
        break;

      case 'message':
        var newItem = document.createElement('li');
        var text = '<span>' + msg.curUserName + ': ' + timeStr + '</span>' + msg.text;

        newItem.className = 'received';
        newItem.innerHTML = text;

        chatroomList.insertBefore(newItem, chatroomList.childNodes[0]);
        break;
    }
  };

  // Handles errors. In this case it simply logs them
  socket.onerror = function(error) {
    console.log('WebSocket Error: ' + error);
  };

  // Set connection status on form to Disconnected
  socket.onclose = function(event) {
    socketStatus.innerHTML = 'Disconnected from WebSocket.';
    openBtn.className = 'connect';
    socketStatus.className = 'closed';
  };

  // Close the WebSocket connection when the Disconnect button is clicked
  // closeBtn.onclick = function(event) {
  //   event.preventDefault();
  //
  //   socket.close();
  //
  //   return false;
  // };

  // Reload the browser window when the Connect button is clicked
  openBtn.onclick = function(event) {
    window.location.reload(true);
  };

  // Calls the sendMessage function if the send button is clicked
  sendBtn.onclick = function(event) {
    sendMessage();
  };

  // Calls the sendMessage function if the enter key is pressed
  document.querySelector('#message-area').addEventListener('keypress', function(event) {
    event.stopPropagation();

    if(event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault();

      sendMessage();

      return false;
    }
  });

  // =============================================================================
  // sends message to server
  function sendMessage() {
    let message = messageField.value;

    if (message.length > 0) {
      let msg = createMsgObj(message, clientKey, curUserId, curUserName);
      console.log('message to server: ', msg);

      let conversation = {
        user_id1: msg.curUserId,
        user_id2: msg.targetUserId,
        message: msg.text.trim()
      };

      // console.log('conversation', conversation);/

      socket.send(JSON.stringify(msg));

      var newItem = document.createElement('li');
      var textnode = document.createTextNode(message);

      newItem.className = 'sent right-align';
      newItem.appendChild(textnode);

      chatroomList.insertBefore(newItem, chatroomList.childNodes[0]);

      messageField.value = '';
      messageField.focus();
    }

    return false;
  }
};

// =============================================================================
// construct message object
function createMsgObj(message, clientKey, curUserId, curUserName) {
  let msg = {
    type: 'message',
    msgId: createMsgId(),
    text: message,
    curUserId: curUserId,
    curUserName: curUserName,
    clientKey: clientKey,
    date: Date.now()
  };

  return msg;
}

// =============================================================================
// use closure to create and increment counter for message ID
var createMsgId = (function() {
  var counter = 0;
  return function() {
    return counter++;
  };
})();



// end
