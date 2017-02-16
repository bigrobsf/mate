#MATE

MATE will be an app for single men who want to meet other single men. It is my response to existing apps that do not allow single men to hide their profiles from guys who are in relationships.

This project currently uses the following techologies:

**Frontend:** JavaScript, jQuery, HTML
**Backend:** Node.js, Express.js, Knex.js
**Pages:** EJS
**CSS:** Materialize
**Database:** PostgreSQL
**Version control:** Git, GitHub
**API:** Google Maps Geolocation
**Chat:** WebSockets 

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
* First photo uploded to account automatically is set as the profile photo
* User can change profile photo
* Photo set as profile photo cannot be deleted

**Chat / Messaging**
* Real-time chat the displays username of sender
* User can view message history

##What's Next

**Features**
* Implement OAUTH to Facebook and use it to validate a relationship status of single
* Add search capability
* Require user to be signed in to view non-profile photos of other users
* Implement private chat
* Create a chat room for logged in users
* Add ability to send photos in messages
* Add message notifications
* Limit the number of photos to 10

**Implementation**
* Implement the app using React and Redux
* Implement the app using React Native
