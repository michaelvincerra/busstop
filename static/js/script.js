/**
 * Created by michaelevan on 6/2/17.
 */


"use strict";






navigator.geolocation.getCurrentPosition(function(position) {
  console.log(position.coords.latitude, position.coords.longitude);
});


function initMap() {
var uluru = {lat: -25.363, lng: 131.044};
var map = new google.maps.Map(document.getElementById('map'), {
  zoom: 4,
  center: uluru
});
var marker = new google.maps.Marker({
  position: uluru,
  map: map
});
}






// function addData(users)  {
//
//   $.each(users.results, function(index, user) {   // $each(array, function)... works like enumerate
//
//       let picture = user.picture.large;
//       let title = user.name.title;
//       let first = user.name.first;
//       let last = user.name.last;
//
//       let email = user.email;
//       let username = user.login.username;
//       let reg_date = user.registered;
//       let dob = user.dob;
//
//       let $picture = $('<img>').attr('src', `${picture}`);
//       let $name = $('<div>').text(`Name:  ${title} ${first} ${last}`);
//       let $email = $('<div>').text(`Email:  ${email}`);
//       let $username = $('<div>').text(`Username:  ${username}`);
//       let $reg_date = $('<div>').text(`Registration:  ${reg_date}`);
//       let $dob = $('<div>').text(`Date of birth:  ${dob}`);
//
//       let $pictureBox = $('<div>', {'class':'picturebox'});
//       let $frameBox = $('<div>', {'class': 'framebox'});
//       let $textBox = $('<div>', {'class': 'textbox'}).append($name, $email, $username, $reg_date, $dob);
//       let $newBox = $('<article>', {'class': 'item box'});
//
//       $pictureBox.append($picture);
//       $frameBox.append($pictureBox, $textBox);
//       $newBox.append($frameBox);
//       $('#row2').append($newBox);
//   });
// }
//
//
function fetcher() {                                         // creates new 'item'

    let data;

    $.ajax({
    url:'https://developer.trimet.org/ws/V1/stops',
    method: 'GET',
    data: { 'appID': '4E96154581EDC8C3DD6D5EB4A',
            'll': '-122.674731, 45.502257',
            'meters': '100',
            'json': 'true' },

    success: function(rsp){
        console.log(rsp);
        data = rsp;
        // addData(rsp)
    },
    error: function(err){
        console.log(err);
    }
});


}

$('#sub_button').on('click', function(event){
  // event handler for handling ...
  event.preventDefault();
  fetcher();
});
