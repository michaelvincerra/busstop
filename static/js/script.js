/**
 * Created by michaelevan on 6/2/17.
 */


"use strict";

let map;

function addMapLinks(busses) {
    // create a table
    // in the table show the links to the bus stops
    // links should lead to the nearest map

    $.each(busses, function (index, bus) {

        var myLatlng = new google.maps.LatLng(-25.363882, 130.044922);
        let x = myLatlng;
        console.log(x);
    });
}

     //
     //
     // $.each(users.results, function(index, user) {   // $each(array, function)... works like enumerate
     //
     //  let picture = user.picture.large;                                     // assign variable to picture
     //  let title = user.name.title;                                          // assign variable to title
     //  let first = user.name.first;                                          // assign variable to first name
     //  let last = user.name.last;                                            // assign variable to last name
     //
     //  let email = user.email;                                               // assign variable to user email
     //  let username = user.login.username;                                   // assign variable to username
     //  let reg_date = user.registered;                                       // assign variable to user registration date
     //  let dob = user.dob;                                                   // assign variable to user date of birth
     //
     //  let $picture = $('<img>').attr('src', `${picture}`);                  // capture jquery variable picture
     //  let $name = $('<div>').text(`Name:  ${title} ${first} ${last}`);      // capture jquery variable tite, first, last
     //  let $email = $('<div>').text(`Email:  ${email}`);                     // capture jquery variable email
     //  let $username = $('<div>').text(`Username:  ${username}`);            // capture jquery variable username
     //  let $reg_date = $('<div>').text(`Registration:  ${reg_date}`);        // capture jquery variable registration date
     //  let $dob = $('<div>').text(`Date of birth:  ${dob}`);                 // capture jquery variable date of birth
     //

//
//       let $my_position = $('<tr>').text(`Coordinates: ${lat} ${long}`);
//
//       $mapLink.append($...);
//       $('#table').append($mapLink);
// }




function fetcher(position) {                                         // creates new 'item'

    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    console.log(lat,long);


    let request_params = { 'appID': '4E96154581EDC8C3DD6D5EB4A',
                            'll': `${lat},${long}`,
                            'meters': '100',
                            'json': 'true' };

    $.ajax({
    url:'https://developer.trimet.org/ws/V1/stops',
    method: 'GET',
    data: request_params,
    success: function(rsp){
        console.log(rsp);
        // position = rsp;
        addMapLinks(rsp.resultSet)
    },
    error: function(err){
        console.log(err);
    }

});
}

$('#sub_button').on('click', function(event){
  // event handler for handling ...
  event.preventDefault();
});


function initMap(position) {
    let here = {lat: position.coords.latitude, lng:position.coords.longitude};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: here
    });
    let marker = new google.maps.Marker({
        position: position,
        map: map
    });
}


function geoLocator() {
    navigator.geolocation.getCurrentPosition(function(position) {
        initMap(position);
        fetcher(position);
    });
}
