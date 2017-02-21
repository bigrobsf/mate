#MATE

MATE will be an app for single men who want to meet other single men. It is my response to existing apps that do not allow single men to hide their profiles from guys who are in relationships.

This project currently uses the following techologies:

**Frontend:** JavaScript, jQuery, HTML  
**Backend:** Node.js, Express.js    
**Pages:** EJS  
**CSS:** Materialize  
**Database:** PostgreSQL  
**SQL builder:** Knex.js    
**Version control:** Git, GitHub  
**Location:** NavigatorGeolocation API
**Chat/Messaging:** HTML5 WebSockets API

##Feature List

**Site**
* User only appears on browse page if they have a profile, profile photo, and are logged in
* User can browse photos of and view the profiles of others who are signed in
* Geolocation to display distance away of other users
* Sorts users on browse page by distance
* Responsive design

**User authentication and authorization**
* User can create, update, and delete their account
* User can create, update, and delete their profile
* User can upload, update, and delete photographs
* Edit forms pre-fill text of input elements

**Photos**
* First photo uploaded to account automatically is set as the profile photo
* User can change profile photo
* Photo set as profile photo cannot be deleted

**Chat / Messaging**
* Real-time chat the displays username of sender
* Real-time chatroom for logged in users
* User can view message history
* Message notifications

##What's Next

**Site**
* Implement the app using React and Redux
* Implement the app using React Native
* Promise-fy location function
* Add search capability
* Limit the number of photos to 10

**User authentication and authorization**
* Implement OAUTH to Facebook and use it to validate a relationship status of single
* Require user to be signed in to view non-profile photos of other users

**Chat / messaging**
* Add ability to send photos in messages
* Add emojis?
