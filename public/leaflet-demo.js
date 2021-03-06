// import { queries } from './queries.js';
// export const drawTable = (config, targetDiv, query) => 

// import 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js';

const map = L.map('mapid'); //.setView([51.505, -0.09], 13);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

const randomColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    return '#' + randomColor;
}

fetch('/files')
    .then(response => response.json())
    .then(data => {
        data.forEach(
            fileName => {
                fetch(`activity-details/${fileName}`)
                    .then(response => response.json())
                    .then(data => {
                        // map out the [lat,long]
                        const latslongs = data.geoPolylineDTO.polyline.map((entry) => [entry.lat, entry.lon]);

                        // add latslongs to map
                        var polyline = L.polyline(latslongs, { color: randomColor() }).addTo(map);

                        // add on-click popup
                        polyline.on('click', e => {
                            const popup = L.popup();
                            popup
                                .setLatLng(e.latlng)
                                .setContent(`Tour ... ${e.latlng.toString()}`)
                                .openOn(map);
                        });

                        // zoom the map to the polyline
                        map.fitBounds(polyline.getBounds());
                    });
            }
        );
    });