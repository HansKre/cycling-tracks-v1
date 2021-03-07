const express = require('express');
const app = express();
const PORT = 3000;
const fs = require('fs');
const path = require('path');
const { calcCrow, timeConverter } = require('./utils.js');
const { getDetailsGarmin, getActivitiesGarmin } = require('./garmin.js');
const { getDetailsBosch, getActivitiesBosch } = require('./bosch.js');

app.use(express.static('public'));

app.get('/download/garmin', async (req, res) => {
    const activities = await getActivitiesGarmin();
    activitiesMapped = activities.map(activity => {
        return {
            activityId: activity.activityId,
            activityName: activity.activityName,
            calories: activity.calories,
            elevationGain: activity.elevationGain,
            distance: activity.distance,
            duration: new Date(activity.duration * 1000).toISOString().substr(11, 8),
            begin: timeConverter(activity.beginTimestamp)
        };
    });
    for (let activity of activitiesMapped) {
        console.log(activitiesMapped.length - activitiesMapped.indexOf(activity));
        const details = await getDetailsGarmin(activity.activityId);
        fs.writeFileSync(`./public/activity-details/details-${activity.activityId}.json`, JSON.stringify({ details: details, activity: activity, bike: 'ktm' }));
    }
    res.send('OK');
});

app.get('/download/bosch', async (req, res) => {
    const activities = await getActivitiesBosch();
    activitiesMapped = activities.map(activity => {
        return {
            activityId: activity.id,
            activityName: undefined,
            calories: undefined,
            elevationGain: undefined,
            distance: activity.total_distance,
            duration: new Date(parseInt(activity.driving_time)).toISOString().substr(11, 8),
            begin: timeConverter(parseInt(activity.start_time))
        };
    });
    for (let activity of activitiesMapped) {
        console.log(activitiesMapped.length - activitiesMapped.indexOf(activity));
        const details = await getDetailsBosch(activity.activityId);

        activity.calories = details.calories;
        activity.elevationGain = details.elevation_gain;

        const coordinates = [];
        if (details && details.coordinates) {
            // on longer stops, tours get split into segments
            details.coordinates.forEach(tourSegment => coordinates.push(...tourSegment));

            const points = coordinates.filter(val => val[0] !== null && val[1] !== null).map(p => { return { x: p[0], y: p[1] } });

            const simplify = require('simplify-js');

            const tolerance = 0.00001 * 2; //-70%
            const highQuality = true;

            const simplifiedPoints = simplify(points, tolerance, highQuality);

            console.log(points.length, simplifiedPoints.length, (simplifiedPoints.length / points.length).toFixed(1) - 1);

            const latlngcounts = simplifiedPoints.map(p => { return { lat: p.x, lng: p.y, count: 0 } });

            fs.writeFileSync(`./public/activity-details/details-${activity.activityId}.json`, JSON.stringify({ details: latlngcounts, activity: activity, bike: 'ebike' }));
        }
    }
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
                    if (distance < 50)
                        p1.count = p1.count + 1;
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