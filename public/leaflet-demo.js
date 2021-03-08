import './leaflet-heat.js';
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
                        let latslongs;
                        if (data && data.bike && data.bike === 'ebike') {
                            latslongs = data.coordinates.map(p => [p.lat, p.lng]);
                        } else {
                            if (!data.coordinates || !data.coordinates.geoPolylineDTO)
                                return;
                            // flatten differences
                            latslongs = data.coordinates.geoPolylineDTO.polyline.map((entry) => [parseInt(entry.lat * 10000) / 10000, parseInt(entry.lon * 10000) / 10000]);
                        }

                        // add latslongs to map
                        var polyline = L.polyline(latslongs, { color: randomColor(), weight: 5 }).addTo(map);

                        // add on-hover
                        polyline.on('mouseover', e => {
                            polyline.setStyle({ weight: 9 });
                            const popup = L.popup();
                            popup
                                .setLatLng(e.latlng)
                                .setContent(`${data.activity.activityId},
                                ${data.activity.begin}
                                ${(data.activity.distance / 1000).toFixed(1)}km
                                ${parseInt(data.activity.elevationGain)}m
                                ${data.activity.calories}kcal
                                ${data.activity.duration}
                                ${data.bike}`
                                )
                                .openOn(map);
                        });
                        polyline.on('mouseout', e => {
                            polyline.setStyle({ weight: 5 });
                            map.closePopup();
                        });
                    });
            }
        );
    });

fetch(`activity-details/heatmap.json`)
    .then(response => response.json())
    .then(data => {
        const incIntensity = (intensity) => {
            const newIntensity = intensity * 5;
            return newIntensity <= 1.0 ? newIntensity : 1.0;
        }

        const mapped = data.map(d => [d.lat, d.lng, incIntensity(d.intensity)]);
        const heat = L.heatLayer(mapped, {
            radius: 10,
            blur: 5,
            gradient: { 1: 'red' }
            // gradient: { 0.1: 'white', 0.2: 'blue', 0.3: 'lime', 0.5: 'yellow', 1: 'red' }
        }).addTo(map);
        // zoom the map to the polyline
        var polyline = L.polyline(mapped);
        map.fitBounds(polyline.getBounds());
    });