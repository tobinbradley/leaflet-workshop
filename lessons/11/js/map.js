// Add map
var map = L.map('map').setView([35.784, -78.636], 10);

// Add base tiles to the map
L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
maxZoom: 18
}).addTo(map);

// Color ramp
function getColor(d) {
	return d > 4000 ? '#800026' :
		d > 3000  ? '#BD0026' :
		d > 2000  ? '#E31A1C' :
		d > 1000  ? '#FC4E2A' :
		d > 500   ? '#FD8D3C' :
		d > 200   ? '#FEB24C' :
		d > 100   ? '#FED976' :
					'#FFEDA0';
}

// style features
function style(feature) {
	return {
		fillColor: getColor(feature.properties.density),
		weight: 2,
		opacity: 1,
		color: 'white',
		dashArray: '3',
		fillOpacity: 0.7
	};
}

// interact with features
function highlightFeature(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 5,
		color: '#666',
		dashArray: '',
		fillOpacity: 0.7
	});

	if (!L.Browser.ie && !L.Browser.opera) {
		layer.bringToFront();
	}
	info.update(layer.feature.properties);
}
function resetHighlight(e) {
	geojson.resetStyle(e.target);
	info.update();
}
function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}

// Add GeoJSON
var geojson = L.geoJson(tracts, {
	style: style,
	onEachFeature: onEachFeature
}).addTo(map);

// add info control
var info = L.control();

info.onAdd = function (map) {
	this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
	this.update();
	return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
	this._div.innerHTML = '<h4>Population Density</h4>' +  (props ?
		'<b>' + props.NAMELSAD10 + '</b><br />' + props.density + ' people / mi<sup>2</sup>' +
		'<br>' + props.DP0010001 + ' people'
		: 'Hover over a tract');
};

info.addTo(map);
