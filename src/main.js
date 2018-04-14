mapboxgl.accessToken = 'pk.eyJ1IjoibWFyY3VzcmV0dGlnIiwiYSI6ImNqZnozMTVkdDJlbTUyd3FqNmxqMG5idXEifQ.rM9pDvg9gOFxvOixQ_GCcA';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v9',
  center: [18.0686, 59.3293],
  zoom: 3
});

map.on('load', function() {
  map.addLayer({
    id: 'collisions',
    type: 'circle',
    source: {
      type: 'geojson',
      data: 'https://h4s-api.herokuapp.com/api/accidents/2017'
    },
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
    }
  }, 'admin-2-boundaries-dispute');
});

map.on('click', 'collisions', function (e) {
  var props = e.features[0].properties;
  document.getElementById('infoType').innerHTML = accidentTypes[props.accidentType];
  document.getElementById('infoInvlovedCount').innerHTML = props.involvedSize;
  document.getElementById('infoLightCondition').innerHTML = props.lightCondition;
  document.getElementById('infoLocationType').innerHTML = locationTypes[props.locationType];
  document.getElementById('infoRoadCondition').innerHTML = props.roadCondition;
  document.getElementById('infoLightCondition').innerHTML = lightConditions[props.lightCondition];
  document.getElementById('infoWeather').innerHTML = weathers[props.weather];
});

slider.oninput = function() {
  console.log(this.value)
  var label = document.getElementById('label');
  var month = parseInt(this.value);
  if (month == 0) {
    map.setFilter('collisions', undefined);
    label.innerText = labels[0];
    return;
  }
  var filters = ['==', 'month', month];
  label.innerText = labels[month];
  map.setFilter('collisions', filters);
}
