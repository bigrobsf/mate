/* jshint esversion: 6 */
/* jshint devel: true */
/* jshint node: true */
/* jshint browser: true */
/* jshint jquery: true */
'use strict';

uploadcare.openPanel('#uploader-placeholder', null, {
  crop: "1024x1024",
  imagesOnly: true
}).done(function(file) {
  file.promise().done((fileInfo) => {
    console.log(fileInfo.cdnUrl);
    storeImageData(fileInfo.cdnUrl);
  });
});

//==============================================================================
// makes POST API to photos route
function storeImageData(fileInfo) {
  let imgInfoObj = {
    imagePath: fileInfo
  };

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
  let target = window.location.protocol + '//' + window.location.host + '/photos/show/' + userId;

  window.location = target;
}
