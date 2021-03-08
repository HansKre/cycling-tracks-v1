const express = require('express');
const app = express();
const PORT = 3000;
const fs = require('fs');
const path = require('path');
const { calcCrow } = require('./utils.js');
const { downloadDetailsGarmin } = require('./garmin.js');
const { downloadDetailsBosch } = require('./bosch.js');

app.use(express.static('public'));

app.get('/download/garmin', async (req, res) => {
    const result = downloadDetailsGarmin();
    res.send('OK');
});

app.get('/download/bosch', async (req, res) => {
    const result = downloadDetailsBosch();
    res.send('OK');
});

const detailsFileNames = () => {
    const fileNames = fs.readdirSync('./public/activity-details');
    return fileNames.filter(fileName => path.extname(fileName) === '.json');
}

app.get('/files', (req, res) => {
    res.json(detailsFileNames());
});

app.get('/heatmap/generate', (req, res) => {
    const mergedLine = [];
    const datasets = [];
    detailsFileNames().forEach(fileName => {
        console.log(fileName);
        data = JSON.parse(fs.readFileSync(`./public/activity-details/${fileName}`));
        if (data && data.bike && data.bike === 'ebike') {
            datasets.push({ id: data.details.activityId, dataset: data.details });
        } else {
            // map out the [lat,long]
            if (!data.details || !data.details.geoPolylineDTO)
                return;
            const dataset = data.details.geoPolylineDTO.polyline.map((p) => { return { lat: p.lat, lng: p.lon, count: 0 } });
            datasets.push({ id: data.details.activityId, dataset });
        }
    });

    // compare each tour with each other tour
    datasets.forEach(d1 => {
        datasets.forEach(d2 => {
            if (d1.id === d2.id)
                return;
            // compare each point of d1.dataset with each point from d2.dataset
            d1.dataset.forEach(p1 => {
                d2.dataset.forEach(p2 => {
                    const distance = calcCrow(p1.lat, p1.lng, p2.lat, p2.lng);
                    if (distance < 50) {
                        if (p1.hasOwnProperty('count')) {
                            p1.count = p1.count + 1;
                        } else {
                            p1.count = 1;
                        }
                    }
                })
            })
        });
    });
    // merge datasets
    datasets.forEach(d => mergedLine.push(...d.dataset));
    // calc intensity
    let maxCount = 0;
    mergedLine.forEach(point => {
        if (point.count > maxCount)
            maxCount = point.count;
    });
    mergedLine.forEach(p => {
        p.intensity = p.count / maxCount;
    });
    fs.writeFileSync(`./public/activity-details/heatmap.json`, JSON.stringify(mergedLine));
    res.send('OK');
})

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));