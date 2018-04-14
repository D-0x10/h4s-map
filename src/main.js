mapboxgl.accessToken = 'pk.eyJ1IjoibWFyY3VzcmV0dGlnIiwiYSI6ImNqZnozMTVkdDJlbTUyd3FqNmxqMG5idXEifQ.rM9pDvg9gOFxvOixQ_GCcA';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v9',
  center: [18.0686, 59.3293],
  zoom: 3
});

var year = 2017;
if (window.location.hash) {
  year = parseInt(window.location.hash.substr(1));
  if (year === NaN) {
    year = 2017;
  }
}

document.getElementById('year').innerHTML = year.toString();

var info = {};

map.on('load', function() {
  map.addLayer({
    id: 'collisions',
    type: 'circle',
    source: {
      type: 'geojson',
      data: 'https://h4s-api.herokuapp.com/api/accidents/' + year,
    },
    paint: {
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['number', ['get', 'inv']],
        1, 5,
        10, 20
      ],
      'circle-color': [
        'interpolate',
        ['linear'],
        ['number', ['get', 'in']],
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
  function p(key) {
    return info[props.name][key];
  }
  document.getElementById('infoType').innerHTML = accidentTypes[p('accidentType')];
  document.getElementById('infoInvlovedCount').innerHTML = props.inv;
  document.getElementById('infoLightCondition').innerHTML = p('lightCondition');
  document.getElementById('infoLocationType').innerHTML = locationTypes[p('locationType')];
  document.getElementById('infoRoadCondition').innerHTML = p('roadCondition');
  document.getElementById('infoLightCondition').innerHTML = lightConditions[p('lightCondition')];
  document.getElementById('infoWeather').innerHTML = weathers[p('weather')];
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

function httpGet(theUrl, callback)
{
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() { 
    if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
      callback(xmlHttp.responseText);
  }
  xmlHttp.open('GET', theUrl, true); // true for asynchronous 
  xmlHttp.send();
}

httpGet('https://h4s-api.herokuapp.com/api/accidents/info/' + year, function(result) {
  info = JSON.parse(result);
});
