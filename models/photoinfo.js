'use strict';
/* jshint esversion: 6 */
/* jshint devel: true */
/* jshint node: true */
/* jshint browser: true */

// =============================================================================
// photo class definition - this gets info for showing photos in carousel
var PhotoInfo = class {
  constructor(photoId, imagePath, caption) {
    this.photoId = photoId;
    this.imagePath = imagePath;
    this.caption = caption;
  }
};

module.exports = {
  PhotoInfo: PhotoInfo
};
