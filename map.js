mapboxgl.accessToken = 'pk.eyJ1IjoiYWRhbXZvc2J1cmdoIiwiYSI6ImNrOGE5MDhudzAzcHozbW82cTRnY201ZWEifQ.SyIq-l5sw9Ew6mGRLgfp1w';
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/adamvosburgh/ck8kdeddo0ke91hofrmgvut1t',
    zoom: 10,
    center: [-74, 40.725],
    maxZoom: 15,
    minZoom: 8,
    maxBounds: [[-74.45, 40.45],[-73.55,41]]
});

map.on('load', function () {
    var layers = map.getStyle(). layers;
    var firstSymbolId;

    for(var i = 0; i < layers.length; i++){
        if (layers[i].type === 'symbol'){
            firstSymbolId = layers[i].id;
            break;
        }
    }

    map.addLayer({
        'id': 'turnstileData',
        'type': 'circle',
        'source': {
            'type': 'geojson',
            'data': 'data/turnstileData.geojson'
        },
        'paint': {
            'circle-color': ['interpolate', ['linear'], ['get', 'ENTRIES_DIFF'],
                -1, '#ff4400',
                -0.7, '#ffba31',
                -0.4, '#ffffff'],
            'circle-stroke-color': '#4d4d4d',
            'circle-stroke-width': 0.5,
            'circle-radius': ['interpolate', ['exponential', 2], ['zoom'],
            10, ['interpolate', ['linear'], ['get', 'ENTRIES_DIFF'],
                -1, 10,
                -0.4, 1],
            15, ['interpolate', ['linear'], ['get', 'ENTRIES_DIFF'],
                -1, 25,
                -0.4, 12],
            ]
            
        }
    }, firstSymbolId);

    map.addLayer({
        'id': 'medianIncome',
        'type': 'fill',
        'source': {
            'type': 'geojson',
            'data': 'data/medianIncome.geojson'
        },
        'paint': {
            'fill-color': ['step', ['get', 'MHHI'],
                '#ffffff',
                20000, '#ccedf5',
                50000, '#99daea',
                75000, '#66c7e0',
                100000, '#33b5d5',
                150000, '#00a2ca'],
            'fill-opacity': ['case', ['==',['get', 'MHHI'], null],0, 0.65] 
           //'fill-opacity': ['case', ['==', ['get', 'MHHI'], null], 0, 0.65]
        }
    }, 'waterway-shadow');
});

map.on('click', 'turnstileData', function(e){
    var entriesDiff = e.features[0].properties.ENTRIES_DIFF;
    var entries_06 = e.features[0].properties.ENTRIES_06;
    var entries_20 = e.features[0].properties.ENTRIES_20;
    var stationName = e.features[0].properties.stationName;

    new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML('<h4>' + stationName + '</h4>'
        + '<p><b>Friday, March 6th:</b> ' + entries_06 + ' entries<br>'
        + '<b>Friday, March 20th:</b> ' + entries_20 + ' entries<br>'
        + '<b>Change:</b> ' + Math.round(entriesDiff * 1000) / 10 + '%</p>')
        .addTo(map);
});
// Change the cursor to a pointer when the mouse is over the turnstileData layer.
map.on('mouseenter', 'turnstileData', function () {
    map.getCanvas().style.cursor = 'pointer';
});
// Change it back to a pointer when it leaves.
map.on('mouseleave', 'turnstileData', function () {
    map.getCanvas().style.cursor = '';
});