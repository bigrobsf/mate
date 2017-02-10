/* jshint esversion: 6 */
/* jshint devel: true */
/* jshint node: true */
/* jshint browser: true */
/* jshint jquery: true */
'use strict';

uploadcare.openDialog(null, {
  crop: "free",
  imagesOnly: true
}).done(function(file) {
  file.promise().done(function(fileInfo){
    storeImageData(fileInfo.cdnUrl);
  });
});

//==============================================================================
//makes POST API to photos route
function storeImageData(fileInfo) {
  let imgInfoObj = {
    imagePath: fileInfo
  };

  $.ajax({
    type: 'POST',
    url: '/photos',
    data: imgInfoObj,
    success: console.log('success'),
    error: function(jqXHR, textStatus, err) {
            console.log('text status '+textStatus+', err '+err);
            }
  });

}
