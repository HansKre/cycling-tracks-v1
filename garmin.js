const client = require('tunneled-got');
const config = require('./config');
const { timeConverter } = require('./utils.js');
const simplify = require('simplify-js');
const fs = require('fs');

const headers = {
    "accept": "application/json, text/javascript, */*; q=0.01",
    "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
    "cache-control": "no-cache",
    "nk": "NT",
    "pragma": "no-cache",
    "sec-ch-ua": "\"Chromium\";v=\"88\", \"Google Chrome\";v=\"88\", \";Not A Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "x-app-ver": "4.40.1.0",
    "x-lang": "de-DE",
    "x-requested-with": "XMLHttpRequest",
    "cookie": config.cookie_garmin
};

const options = {
    "headers": headers,
    "referrer": "https://connect.garmin.com/modern/activities?activityType=cycling&sortBy=startLocal&sortOrder=desc",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors"
};

const getDetailsForId = async (id) => {
    const details = await client.fetch(`https://connect.garmin.com/modern/proxy/activity-service/activity/${id}/details?maxChartSize=2000&maxPolylineSize=4000&_=1615033738402`,
        options);
    return JSON.parse(details);
}

const getActivities = async () => {
    const activities = await client.fetch("https://connect.garmin.com/modern/proxy/activitylist-service/activities/search/activities?activityType=cycling&sortBy=startLocal&sortOrder=desc&limit=500&start=0&_=1615033738343",
        options);
    return JSON.parse(activities);
}

const downloadDetailsGarmin = async () => {
    try {
        const activities = await getActivitiesGarmin();
        activitiesMapped = activities.map(activity => {
            return {
                activityId: activity.activityId,
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
            const points = details.geoPolylineDTO.polyline;
            const simplifiedPoints = simplify(points,
                config.simplify_trip_tolerance, simplify_trip_highQuality);

            console.log(points.length, simplifiedPoints.length, (simplifiedPoints.length / points.length).toFixed(1) - 1);

            const latlngcounts = simplifiedPoints.map(p => { return { lat: p.x, lng: p.y } });
            const out = {
                coordinates: latlngcounts,
                activity: activity,
                bike: 'ktm'
            };
            fs.writeFileSync(config.detailsFileName(activity.activityId),
                JSON.stringify(out));
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = { downloadDetailsGarmin };