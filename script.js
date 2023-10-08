mapboxgl.accessToken = '';

var pin_location = [0, 0]

navigator.geolocation.getCurrentPosition(   
    successLocation, 
    errorLocation, 
    { enableHighAccuracy: true}
);

function successLocation(position) {
    console.log(position)
    setupMap([position.coords.longitude, position.coords.latitude])
    console.log([position.coords.longitude, position.coords.latitude])
    pin_location = [position.coords.longitude, position.coords.latitude]
    console.log("Pin:" + pin_location)

}

function errorLocation() {

    setupMap([0.0, 0.0])
}

function setupMap(center) {
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/enething/clni3z62g03xc01pj4ksqej23',
        center: center,
        zoom: 10
    });

    //map.setStyle('mapbox://styles/mapbox/' + layerId);

    const nav = new mapboxgl.NavigationControl()
    map.addControl(nav, 'top-left');


    const geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
        placeholder: 'Enter location...'
      });
    
      map.addControl(geocoder, 'top-left');
    
      geocoder.on('result', function (e) {
        const { center } = e.result.geometry;
    
        // Move the map to the selected location
        map.flyTo({
          center: center,
          zoom: 15 // You can adjust the zoom level as needed
        });
      });

      map.on('load', function () {
        // Add any other map-related functionality here
      });
}

console.log("Pin:" + pin_location)
const pin = {
    'type': 'FeatureCollection',
        'features': [
        {
        'type': 'Feature',
        'properties': 
        {
            'message': 'Your current location.',
            'iconSize': [100.0, 100.0]
        },
        'geometry': 
            {
            'type': 'Point',
            'coordinates': [pin_location[0], pin_location[1]]
            }
        }
    ]
};

for (const marker of pin.features) {
    // Create a DOM element for each marker.
    const el = document.createElement('div');
    const width = marker.properties.iconSize[0];
    const height = marker.properties.iconSize[1];
    el.className = 'marker';
    el.style.backgroundImage = `url(https://placekitten.com/g/${width}/${height}/)`;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.style.backgroundSize = '100%';
     
    el.addEventListener('click', () => {
    window.alert(marker.properties.message);
    });
     
    // Add markers to the map.
    new mapboxgl.Marker(el)
    .setLngLat(marker.geometry.coordinates)
    .addTo(map);
}

map.addListener('bounds_changed', function () {
    searchBox.setBounds(map.getBounds());
});

searchBox.addListener('places_changed', function () {
    const places = searchBox.getPlaces();

    if (places.length === 0) {
      return;
    }

    map.setCenter(places[0].geometry.location);
    map.setZoom(15);
});
