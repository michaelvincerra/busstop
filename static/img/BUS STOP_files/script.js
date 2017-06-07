/**
 * Created by michaelevan on 6/2/17.
 */


"use strict";


let map;   // set to global so that other functions can use the map object.





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

    let busStopLoc = new google.maps.LatLng(bus.lat, bus.lng);
    let iconBase = 'static/img/bus.png';

    let stopMarker = new google.maps.Marker({                           // JSON object. key: value pair
    position: busStopLoc,
        title: bus.desc,
        icon: iconBase
    });


    let contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
      '<div id="bodyContent">'+
      '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
      'sandstone rock formation in the southern part of the '+
      'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
      'south west of the nearest large town, Alice Springs; 450&#160;km '+
      '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
      'features of the Uluru - Kata Tjuta National Park. Uluru is '+
      'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
      'Aboriginal people of the area. It has many springs, waterholes, '+
      'rock caves and ancient paintings. Uluru is listed as a World '+
      'Heritage Site.</p>'+
      '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
      'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
      '(last visited June 22, 2009).</p>'+
      '</div>'+
      '</div>';



    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    stopMarker.addListener('click', function() {
        infowindow.open(map, stopMarker);
    });




    // To add the marker to the map, call setMap();
    stopMarker.setMap(map);
}


function addMapLinks(busses) {
    // Adds collection of buses to the map to the table.
    $.each(busses, function (index, bus) {
        // console.log(index, bus);
        populateBus(index, bus);
        addBusStopMarker(bus);
    });
}


function fetcher(position) {                                         // creates new 'item'

    let lat = position.coords.latitude;
    let long = position.coords.longitude;
    console.log(lat,long);

    let request_params = { 'appID': '4E96154581EDC8C3DD6D5EB4A',
                            'll': `${lat},${long}`,
                            'meters': '300',
                            'json': 'true' };
    $.ajax({
    url:'https://developer.trimet.org/ws/V1/stops',   //
    method: 'GET',
    data: request_params,
    success: function(rsp){
        console.log(rsp);
        let buses = rsp.resultSet.location;
        addMapLinks(buses)
    },
    error: function(err){
        console.log(err);
    }
});
}


function initMap(position) {

    let here = {lat: position.coords.latitude, lng: position.coords.longitude};
    // let icon = "/static/"

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
        fetcher(pos);   // 06.06.17: START HERE !
        });

    } else {
      /* geolocation IS NOT available */
      console.log("Geolocation not enabled")
    }
}

$("#slider").slider();



// $('#sub_button').on('click', function(event){
//   // event handler for handling ...
//   event.preventDefault();
// });
