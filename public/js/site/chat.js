/* jshint esversion: 6 */
/* jshint node: true */
/* jshint browser: true */

'use strict'; // optional

let host = location.origin.replace(/^http/, 'ws');
if (host === 'ws://localhost:3007') host = 'ws://localhost:3001';
// console.log(host);

window.onload = function() {
  let messageField = document.getElementById('message-area');
  let messageList = document.getElementById('message-log');
  let socketStatus = document.getElementById('status');

  let closeBtn = document.getElementById('close');
  let openBtn = document.getElementById('open');
  let sendBtn = document.getElementById('send');

  let curUserId = Number(document.getElementById('cur-user-id').textContent);
  let targetUserId = Number(document.getElementById('target-user-id').textContent);
  let curUserName = document.getElementById('cur-user-name').textContent;

  console.log('users: ', curUserId, targetUserId, curUserName);

  // Creates a new WebSocket connection, which will fire the open connection event
  let socket = new WebSocket(host, 'mate-protocol');
  let clientKey = '';

  // Set connection status on form to Connected
  socket.onopen = function(event) {
    socketStatus.innerHTML = 'Connected.';
    socketStatus.className = 'open';
    console.log(socketStatus.innerHTML);
  };

  // Listens for incoming data. When a message is received, the message
  // event is sent to this function
  socket.onmessage = function(event) {
    let msg = JSON.parse(event.data);
    console.log('message from server: ', msg);
    let time = new Date(msg.date);
    let timeStr = time.toLocaleTimeString();

    // switch statement to easily add additional functions based on message type
    switch(msg.type) {
      case 'id':
        clientKey = msg.clientKey;
        console.log('clientKey received from server');
        break;
      case 'message':
        var newItem = document.createElement('li');
        var text = '<span>' + msg.curUserName + ': ' + timeStr + '</span>' + msg.text;

        newItem.className = 'received';
        newItem.innerHTML = text;

        messageList.insertBefore(newItem, messageList.childNodes[0]);
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
    socketStatus.className = 'closed';
  };

  // Close the WebSocket connection when the Disconnect button is clicked
  closeBtn.onclick = function(event) {
    event.preventDefault();

    socket.close();

    return false;
  };

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
      let msg = createMsgObj(message, clientKey, curUserId, targetUserId, curUserName);
      console.log('message to server: ', msg);

      // put ajax call to post message to database here

      socket.send(JSON.stringify(msg));

      var newItem = document.createElement('li');
      var textnode = document.createTextNode(message);

      newItem.className = 'sent right-align';
      newItem.appendChild(textnode);

      messageList.insertBefore(newItem, messageList.childNodes[0]);

      messageField.value = '';
      messageField.focus();
    }

    return false;
  }
};

// =============================================================================
// construct message object
function createMsgObj(message, clientKey, curUserId, targetUserId, curUserName) {
  let msg = {
    type: 'message',
    msgId: createMsgId(),
    text: message,
    curUserId: curUserId,
    curUserName: curUserName,
    targetUserId: targetUserId,
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
