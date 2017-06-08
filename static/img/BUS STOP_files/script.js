/**
 * Created by michaelevan on 6/2/17.
 */


"use strict";

// TODO:
// Create href to connect bus schedules to their locid.
// Create 'contentString' relative to the bus's locid.
// Integrate a Google street view into maps.

let map;    // set to global so that other functions can use the map object.
let stopMarkers =  new Array();      // empty array; set to global.

function populateBus(index, bus) {
        // <tr>
        //   <th scope="row">1</th>
        //   <td>99</td>
        //   <td>42</td>
        //   <td>SW Corbett</td>
        // </tr>
        let busStopIndex = $('<th>', {'class':'row'}).text(index+1);
        let busLocID = $('<td>').text(bus.locid);
        let busStopDesc = $('<td>').text(bus.desc);
        let busHeading = $('<tr>').text(bus.dir);

        let busStopRow = $('<tr>').append(busStopIndex, busLocID, busHeading,busStopDesc);
        jQuery('#buses').append(busStopRow);
}


function addBusStopMarker(bus) {

    let busStopLoc = new google.maps.LatLng(bus.lat, bus.lng);   // should this line be removed ?
    let iconBase = 'static/img/bus.png';
    let stopMarker = new google.maps.Marker({                           // JSON object. key:value pair
        position: busStopLoc,
        title: bus.desc,
        icon: iconBase
    });


      // $.each(bus.resultSet, function(index, bus) {   // $each(array, function)... works like enumerate
      // let contentString = bus.locid;
      // let $contentString = $('<div>').text(${contentString}`);



    let contentString = '<div id="content">' +
        '<div id="siteNotice">' +
        '</div>' +
        '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
        '<div id="bodyContent">' +
        '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
        'sandstone rock formation in the southern part of the ' +
        'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) ' +
        'south west of the nearest large town, Alice Springs; 450&#160;km ' +
        '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major ' +
        'features of the Uluru - Kata Tjuta National Park. Uluru is ' +
        'sacred to the Pitjantjatjara and Yankunytjatjara, the ' +
        'Aboriginal people of the area. It has many springs, waterholes, ' +
        'rock caves and ancient paintings. Uluru is listed as a World ' +
        'Heritage Site.</p>' +
        '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
        'https://en.wikipedia.org/w/index.php?title=Uluru</a> ' +
        '(last visited June 22, 2009).</p>' +
        '</div>' +
        '</div>';
        
    let infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    stopMarker.addListener('click', function () {
        infowindow.open(map, stopMarker);
    });

    stopMarkers.push(stopMarker);   //  Push the stopMarker to the markers array ; 06.07.17
    stopMarker.setMap(map);         //  Add  the marker to the map, call setMap();
}


function addMapLinks(busses) {
    // Adds collection of buses to the map to the table.
    $.each(busses, function (index, busStop) {
        // console.log(index, bus);
        populateBus(index, busStop);
        addBusStopMarker(busStop);
    });
}


function fetcher(position, meters) {

    if (typeof meters === 'undefined'){
        let meters = '300';
    }

    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    console.log(lat,long);

    let request_params = { 'appID': '4E96154581EDC8C3DD6D5EB4A',
                            'll': `${lat},${long}`,
                            'meters': meters,
                            'json': 'true' };
    $.ajax({
    url:'https://developer.trimet.org/ws/V1/stops',   //
    method: 'GET',
    data: request_params,
    success: function(rsp){
        console.log(rsp);
        let buses = rsp.resultSet.location;
        clearAll();
        addMapLinks(buses);
    },
    error: function(err){
        console.log(err);
    }
});
}


function initMap(position) {

    let here = {lat: position.coords.latitude, lng: position.coords.longitude};
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: here,
        // icon: icon
    });

    let marker = new google.maps.Marker({
        position: here,
        map: map
    });
}


function getPosition() {

    if ("geolocation" in navigator) {
     /* geolocation is available */
    console.log("Geolocation Enabled");

    navigator.geolocation.getCurrentPosition(function(pos) {
        let here = {lat: pos.coords.latitude, lng: pos.coords.longitude};
        console.log(here);
        initMap(pos);
        fetcher(pos);
        });
    } else {
      /* geolocation IS NOT available */
      console.log("Geolocation not enabled")
    }
}


/////////////////////////////////////////////////////////////////////////////////////  Clearing Logic

function setMapOnAll(map) {
    // Sets the map on all markers in the array.
    // See: https://developers.google.com/maps/documentation/javascript/examples/marker-remove
    $.each(stopMarkers, function(index, stopMarker) {
        stopMarker.setMap(map);
    });
}

function clearMarkers() {
    // Removes the markers from the map, but keeps them in the array.
    // See: https://developers.google.com/maps/documentation/javascript/examples/marker-remove
    setMapOnAll(null);
}

function showMarkers() {
    // Shows any markers currently in the array.
    // See: https://developers.google.com/maps/documentation/javascript/examples/marker-remove
    setMapOnAll(map);
}

function deleteMarkers() {
    // Deletes all markers in the array by removing references to them.
    clearMarkers();
    stopMarkers = [];
}

function clearTable() {
    $('#buses').empty();
    // clears records from table
    // addBusStopMarker(bus);
    // setMapOnAll(null);
}

function clearAll(){
    // clear markers on map
    clearMarkers();
    // clear the table
    clearTable();
}

/////////////////////////////////////////////////////////////////////////////////////


function updateStops(event, ui){
    console.log('Moved slider');

    navigator.geolocation.getCurrentPosition(function(position) {
        fetcher(position, ui.value);
    });
    // navigator.geolocation.getCurrentPosition(function(pos) {
    //     let loc = {lat: pos.coords.latitude, lng: pos.coords.longitude};
    //     let meters = ui.value;
    //     fetcher(loc, meters);
    // });


}

$(function () {
    let handle = $("#custom-handle");
    $("#slider").slider({
        min: 100,
        max: 1500,
        value: 100,
        step: 25,

        create: function () {
            handle.text($(this).slider("value"));
        },
        slide: function (event, ui) {
            handle.text(`${ui.value}m`);    // ui.value is the value of the current location.
        },
        stop: updateStops

    });
});



// 06.07.17: TEST
//     if () {
//         stopMarker.setMap(null);
//     } else {
//
//     }
//
// }

// 06.07.17: TEST
// stopMarker.addListener('click', function deleteMarkers() {
// clearMarkers();
// stopMarker = [];
//  });


// $('#sub_button').on('click', function(event){
//   // event handler for handling ...
//   event.preventDefault();
// });
