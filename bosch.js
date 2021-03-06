const client = require('tunneled-got');

const COOKIES = "REMEMBER=ceb3da1fc127edf7e51b7acda371408f08be981ede7f18da73904d4621bb881d5d2887a0f52f22c3b24986b55fd52aa2c24f37bb42fa7cb5c845ca4c33028621; JSESSIONID=C1D6BCD6381F8EC942A78F16E6074CE6";

const getDetailsBosch = async (id) => {
    const details = await client.fetch(`https://www.ebike-connect.com/ebikeconnect/api/activities/trip/details/${id}?timezone=60`, {
        "headers": {
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
            "cookie": COOKIES
        },
        "referrer": "https://www.ebike-connect.com/activities/details/trip/1198893732943",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        // "method": "GET",
        "mode": "cors"
    });
    return JSON.parse(details);
}

const getActivitiesBosch = async () => {
    const activities = await client.fetch("https://www.ebike-connect.com/ebikeconnect/api/portal/activities/trip/headers?max=2000&offset=1615068105341", {
        "headers": {
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
            "cookie": COOKIES
        },
        "referrer": "https://www.ebike-connect.com/activities/details/trip/549233306443",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": null,
        // "method": "GET",
        "mode": "cors"
    });
    return JSON.parse(activities);
}

module.exports = { getDetailsBosch, getActivitiesBosch };