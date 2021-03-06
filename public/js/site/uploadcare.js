/* jshint esversion: 6 */
/* jshint devel: true */
/* jshint node: true */
/* jshint browser: true */
/* jshint jquery: true */
'use strict';

// upload care panel
uploadcare.openPanel('#uploader-placeholder', null, {
  crop: "1024x1024",
  imagesOnly: true
}).done(function(file) {
  file.promise().done((fileInfo) => {
    console.log(fileInfo.cdnUrl);
    storeImageData(fileInfo.cdnUrl);
  });
});

// set add photo tab to active
$('#photo-tab').addClass('active');


//==============================================================================
// makes POST API to photos route
function storeImageData(fileInfo) {
  let imgInfoObj = {
    imagePath: fileInfo
  };

  console.log('in uploadcare.js imagePath: ', fileInfo);

  $.ajax({
    type: 'POST',
    url: '/photos',
    data: imgInfoObj,
    success: redirectUserProfile(),
    error: function(jqXHR, textStatus, err) {
            console.log('text status ' + textStatus + ', err ' + err);
            }
  });

}

//==============================================================================
// redirect to user photos
function redirectUserProfile() {
  let userId = document.getElementById('cur-user').textContent;
  let target = window.location.protocol + '//' + window.location.host +'/photos/show/' + userId;
  console.log(target);
  window.location = target;
}
