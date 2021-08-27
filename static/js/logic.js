
// GeoJSON data sources
var earthquakesURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"
var tectonicplatesURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

// Map layers
var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: API_KEY
});

var grayMap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
});

var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: API_KEY
});

var map = L.map( "map", {
    center: [15, -10],
    zoom: 2,
    layers: [satelliteMap, grayMap, outdoors]
});

var baseMaps = {
    "Satellite Map": satelliteMap,
    "Grayscale Map": grayMap,
    "Outdoors Map": outdoors
};

var earthquakes = new L.layerGroup();
var tectonicplates = new L.layerGroup();

var overlayMaps = {
    "Earthquakes": earthquakes,
    "Tectonic Plates": tectonicplates
};

L.control.layers( baseMaps, overlayMaps, {
    collapsed: true
}).addTo( map);


d3.json( earthquakesURL).then( function( earthquakeData) {

    
    function markerSize( magnitude) {
        if (magnitude === 0) {
        return 1;
        }
        return magnitude * 4;
    }

    function chooseColor( depth) {
        switch( true) {
            case depth > 90:
                return "red";
            case depth > 70:
                return "orangered";
            case depth > 50:
                return "orange";
            case depth > 30:
                return "gold";
            case depth > 10:
                return "yellow";
            default:
                return "lightgreen";
        }
    }

    function stylize( feature) {
        return {
            fillColor: chooseColor( feature.geometry.coordinates[2]),
            fillOpacity: 0.5,
            color: "black",
            radius: markerSize( feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    L.geoJson( earthquakeData, {
        pointToLayer: function( feature, latlng) {
            return L.circleMarker( latlng);
        },
        style: stylize,
        onEachFeature: function( feature, layer) {
            layer.bindPopup( "<h3>Location: " + feature.properties.place + "</h3><hr><p>Date: "
            + new Date( feature.properties.time) + "</p><hr><p>Magnitude: " + feature.properties.mag + "</p>");
        }
    }).addTo( earthquakes);   
    earthquakes.addTo( map);  

    d3.json( tectonicplatesURL).then( function( platesData) {
        L.geoJson(platesData, {
            color: "orange",
            weight: 2
        }).addTo( tectonicplates);  
        tectonicplates.addTo(map);  
    });


});