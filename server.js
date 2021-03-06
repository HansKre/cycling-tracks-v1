const express = require('express');
const app = express();
const PORT = 3000;
const client = require('tunneled-got');
const fs = require('fs');

app.use(express.static('public'));

const getDetails = async (id) => {
    const details = await client.fetch(`https://connect.garmin.com/modern/proxy/activity-service/activity/${id}/details?maxChartSize=2000&maxPolylineSize=4000&_=1615033738402`, {
        "headers": {
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
            "cookie": "G_ENABLED_IDPS=google; notice_preferences=2:; notice_gdpr_prefs=0,1,2:; _ga=GA1.2.987071538.1611160661; __cfduid=d6af2bb0280eaa8b37dd87ba7e2f9a67a1615033710; __cflb=02DiuJLbVZHipNWxN8xjNziif9XwiLsQeS23h4PmiHnKE; __cfruid=80434dc21c0b33d14f664bb9da4329def42b31f7-1615033711; GarminUserPrefs=de-DE; notice_behavior=implied,eu; _gid=GA1.2.1935350866.1615033713; ADRUM=s=1615033726036&r=https%3A%2F%2Fsso.garmin.com%2Fsso%2Fsignin%3Fhash%3D1343028567; GARMIN-SSO=1; GarminNoCache=true; GARMIN-SSO-GUID=5C8C08548C95AA6F3EF1A97CFCD0EA0C0868790D; GARMIN-SSO-CUST-GUID=82a11586-b698-47fb-8dc5-c5819fdbbc03; SESSIONID=e3f56654-541e-4fed-a796-921c35846633; CONSENTMGR=c1:1%7Cc2:1%7Cc3:1%7Cc4:1%7Cc5:1%7Cc6:1%7Cc7:1%7Cc8:1%7Cc9:1%7Cc10:1%7Cc11:1%7Cc12:1%7Cc13:1%7Cc14:1%7Cc15:1%7Cts:1615033741393%7Cconsent:true; utag_main=v_id:017720a64051002ef4bae0612d780207800570700083e$_sn:4$_ss:0$_st:1615035541399$ses_id:1615033712836%3Bexp-session$_pn:3%3Bexp-session; _gat_gprod=1"
        },
        "referrer": "https://connect.garmin.com/modern/activity/6350875787",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        // "method": "GET",
        "mode": "cors"
    });
    return JSON.parse(details);
}

app.get('/download', async (req, res) => {
    const activities = await client.fetch("https://connect.garmin.com/modern/proxy/activitylist-service/activities/search/activities?activityType=cycling&sortBy=startLocal&sortOrder=desc&limit=500&start=0&_=1615033738343", {
        "headers": {
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
            "cookie": "G_ENABLED_IDPS=google; notice_preferences=2:; notice_gdpr_prefs=0,1,2:; _ga=GA1.2.987071538.1611160661; __cfduid=d6af2bb0280eaa8b37dd87ba7e2f9a67a1615033710; SameSite=None; __cflb=02DiuJLbVZHipNWxN8xjNziif9XwiLsQeS23h4PmiHnKE; __cfruid=80434dc21c0b33d14f664bb9da4329def42b31f7-1615033711; GarminUserPrefs=de-DE; notice_behavior=implied,eu; _gid=GA1.2.1935350866.1615033713; _gat_gprod=1; ADRUM=s=1615033726036&r=https%3A%2F%2Fsso.garmin.com%2Fsso%2Fsignin%3Fhash%3D1343028567; GARMIN-SSO=1; GarminNoCache=true; GARMIN-SSO-GUID=5C8C08548C95AA6F3EF1A97CFCD0EA0C0868790D; GARMIN-SSO-CUST-GUID=82a11586-b698-47fb-8dc5-c5819fdbbc03; SESSIONID=e3f56654-541e-4fed-a796-921c35846633; CONSENTMGR=c1:1%7Cc2:1%7Cc3:1%7Cc4:1%7Cc5:1%7Cc6:1%7Cc7:1%7Cc8:1%7Cc9:1%7Cc10:1%7Cc11:1%7Cc12:1%7Cc13:1%7Cc14:1%7Cc15:1%7Cts:1615033731283%7Cconsent:true; utag_main=v_id:017720a64051002ef4bae0612d780207800570700083e$_sn:4$_ss:0$_st:1615035531286$ses_id:1615033712836%3Bexp-session$_pn:2%3Bexp-session"
        },
        "referrer": "https://connect.garmin.com/modern/activities?activityType=cycling&sortBy=startLocal&sortOrder=desc",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        // "method": "GET",
        "mode": "cors"
    });
    activitiesMapped = JSON.parse(activities).map(activity => {
        return {
            activityId: activity.activityId,
            activityName: activity.activityName,
            calories: activity.calories,
            elevationGain: activity.elevationGain,
            distance: activity.distance,
            duration: activity.duration
        };
    });
    for (let activity of activitiesMapped) {
        console.log(activitiesMapped.length - activitiesMapped.indexOf(activity));
        const details = await getDetails(activity.activityId);
        fs.writeFileSync(`./public/activity-details/details-${activity.activityId}.json`, JSON.stringify(details));
    }
    res.send('OK');
});

app.get('/files', (req, res) => {
    const files = fs.readdirSync('./public/activity-details');
    res.json(files);
});

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));