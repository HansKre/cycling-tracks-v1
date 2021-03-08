const client = require('tunneled-got');
const config = require('./config');
const { timeConverter } = require('./utils.js');
const simplify = require('simplify-js');
const fs = require('fs');

const headers = {
    "accept": "application/vnd.ebike-connect.com.v4+json, application/json",
    "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
    "cache-control": "no-cache",
    "if-modified-since": "Mon, 26 Jul 1997 05:00:00 GMT",
    "pragma": "no-cache",
    "protect-from": "CSRF",
    "sec-ch-ua": "\"Chromium\";v=\"88\", \"Google Chrome\";v=\"88\", \";Not A Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "cookie": config.cookie_bosch
}

const options = {
    "headers": headers,
    "referrer": "https://www.ebike-connect.com/activities/details/trip/1198893732943",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors"
};

const getDetailsForId = async (id) => {
    const details = await client.fetch(`https://www.ebike-connect.com/ebikeconnect/api/activities/trip/details/${id}?timezone=60`, options);
    return JSON.parse(details);
}

const getActivities = async () => {
    const activities = await client.fetch("https://www.ebike-connect.com/ebikeconnect/api/portal/activities/trip/headers?max=2000&offset=1615068105341", options);
    return JSON.parse(activities);
}

const downloadDetailsBosch = async () => {
    try {
        const activities = await getActivities();
        activitiesMapped = activities.map(activity => {
            return {
                activityId: activity.id,
                distance: activity.total_distance,
                duration: new Date(parseInt(activity.driving_time)).toISOString().substr(11, 8),
                begin: timeConverter(parseInt(activity.start_time))
            };
        });
        for (let activity of activitiesMapped) {
            console.log(activitiesMapped.length - activitiesMapped.indexOf(activity));
            const details = await getDetailsForId(activity.activityId);

            activity.calories = details.calories;
            activity.elevationGain = details.elevation_gain;

            const coordinates = [];
            if (details && details.coordinates) {
                // on longer stops, tours get split into segments
                // we want to combine them into one point-array
                details.coordinates.forEach(tourSegment => coordinates.push(...tourSegment));

                const points = coordinates
                    .filter(val => val[0] !== null && val[1] !== null)
                    .map(p => { return { x: p[0], y: p[1] } });

                const simplifiedPoints = simplify(points,
                    config.simplify_trip_tolerance, simplify_trip_highQuality);

                console.log(points.length, simplifiedPoints.length, (simplifiedPoints.length / points.length).toFixed(1) - 1);

                const latlngcounts = simplifiedPoints.map(p => { return { lat: p.x, lng: p.y } });
                const out = {
                    coordinates: latlngcounts,
                    activity: activity,
                    bike: 'ebike'
                }

                fs.writeFileSync(config.detailsFileName(activity.activityId),
                    JSON.stringify(out));
            }
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = { downloadDetailsBosch };