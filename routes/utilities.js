/* jshint esversion: 6 */
/* jshint devel: true */
/* jshint node: true */
/* jshint browser: true */
/* jshint jquery: true */

$(document).ready(() => {
  let makeProfileInfoBtn = document.getElementById('make-profile-btn');
  makeProfileInfoBtn.addEventListener('click', makeProfile);

  let editProfileInfoBtn = document.getElementById('edit-profile-btn');
  editProfileInfoBtn.addEventListener('click', editProfile);
});

function makeProfile(event) {
  getValues();

}

function editProfile(event) {


}

function getValues(event) {
  let makeProfileForm = document.getElementById('make-profile');
  let values = makeProfileForm.querySelectorAll('input, select');
  console.log(values);

  // let overviewText = document.getElementById("overview").value;
  // let lookingForText = document.getElementById("looking-for").value;
  // let interestsText = document.getElementById("interests").value;

  // collect the info from form
}
