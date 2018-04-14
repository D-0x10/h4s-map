mapboxgl.accessToken = 'pk.eyJ1IjoibWFyY3VzcmV0dGlnIiwiYSI6ImNqZnozMTVkdDJlbTUyd3FqNmxqMG5idXEifQ.rM9pDvg9gOFxvOixQ_GCcA';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v9',
  center: [18.0686, 63.3293],
  zoom: 4
});

var data = {
  type: "geojson",
  data: 'https://h4s-api.herokuapp.com/api/accidents/2017',
  cluster: true,
  clusterMaxZoom: 5, // Max zoom to cluster points on
  clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
}

map.on('load', function() {
  map.addSource("collisions", data);
  map.addLayer({
    id: 'clustered',
    type: 'circle',
    source: 'collisions',
    filter: ["has", "point_count"],
    paint: {
        "circle-color": [
            "step",
            ["get", "point_count"],
            "#7CB9E8",
            100,
            "#7CB9E8",
            500,
            "#7CB9E8",
            750,
            "#7CB9E8"
        ],
        "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            100,
            30,
            500,
            40,
            750,
            50
        ]
    }
  }, 'admin-2-boundaries-dispute');

  map.addLayer({
    id: "unclustered",
    type: "circle",
    source: "collisions",
    filter: ["!has", "point_count"],
    paint: {
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['number', ['get', 'involvedSize']],
        1, 5,
        10, 20
      ],
      'circle-color': [
        'interpolate',
        ['linear'],
        ['number', ['get', 'intensity']],
        0, '#ADB9C9',
        1, '#9DBF15',
        2, '#FF9947',
        3, '#D1335B',
        4, '#000000'
      ],
      'circle-opacity': 0.8
    }, 
  }, 'admin-2-boundaries-dispute');

  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "collisions",
    filter: ["has", "point_count"],
    layout: {
        "text-field": "{point_count_abbreviated}",
        "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
        "text-size": 12
    }
});
});

map.on('click', 'unclustered', function (e) {
  console.log(e)
  var props = e.features[0].properties;
  document.getElementById('infoType').innerHTML = accidentTypes[props.accidentType];
  document.getElementById('infoInvlovedCount').innerHTML = props.involvedSize;
  document.getElementById('infoLightCondition').innerHTML = props.lightCondition;
  document.getElementById('infoLocationType').innerHTML = locationTypes[props.locationType];
  document.getElementById('infoRoadCondition').innerHTML = props.roadCondition;
  document.getElementById('infoLightCondition').innerHTML = lightConditions[props.lightCondition];
  document.getElementById('infoWeather').innerHTML = weathers[props.weather];
});

map.on('click', 'clustered', function (e) {
  console.log(e)
});

slider.oninput = function() {
  console.log(this.value)
  var label = document.getElementById('label');
  var month = parseInt(this.value);
  if (month == 0) {
    map.setFilter('unclustered', undefined);
    label.innerText = labels[0];
    return;
  }
  var filters = ['==', 'month', month];
  label.innerText = labels[month];
  map.setFilter('unclustered', filters);
}