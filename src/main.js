mapboxgl.accessToken = 'pk.eyJ1IjoibWFyY3VzcmV0dGlnIiwiYSI6ImNqZnozMTVkdDJlbTUyd3FqNmxqMG5idXEifQ.rM9pDvg9gOFxvOixQ_GCcA';

var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/light-v9',
  center: [18.0686, 59.3293], // initial map center in [lon, lat]
  zoom: 3
});

map.on('load', function() {
  map.addLayer({
    id: 'collisions',
    type: 'circle',
    source: {
      type: 'geojson',
      data: 'https://h4s-api.herokuapp.com/api/acc'
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