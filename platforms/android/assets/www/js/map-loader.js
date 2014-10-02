// JavaScript Document

var map; //to hold map object
var marker; // to hold marker
function initializeMap() {//sets map options and creat map object
	// set tsc coordinate
	var tsc = new google.maps.LatLng(23.732751, 90.395673);
	// centering map option
	var mapOptions = {
		center: tsc,
		zoom: 17,
		mapTypeControl: false,
		streetViewControl: true,
		panControl: false,
		zoomControl: true,
		zoomControlOptions: {
			style: google.maps.ZoomControlStyle.SMALL,
			position: google.maps.ControlPosition.RIGHT_BOTTOM
		}
	};
	// creat a map object with given options on div with id 'map-canvas'
	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	// creating initial marker
	marker = new google.maps.Marker({
	  position: tsc,
	  title: 'TSC'
	});
}