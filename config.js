const config = {
    cookie_bosch: 'REMEMBER=ceb3da1fc127edf7e51b7acda371408f08be981ede7f18da73904d4621bb881d5d2887a0f52f22c3b24986b55fd52aa2c24f37bb42fa7cb5c845ca4c33028621; JSESSIONID=C1D6BCD6381F8EC942A78F16E6074CE6',
    cookie_garmin: 'G_ENABLED_IDPS=google; notice_preferences=2:; notice_gdpr_prefs=0,1,2:; _ga=GA1.2.987071538.1611160661; __cfduid=d6af2bb0280eaa8b37dd87ba7e2f9a67a1615033710; __cflb=02DiuJLbVZHipNWxN8xjNziif9XwiLsQeS23h4PmiHnKE; __cfruid=80434dc21c0b33d14f664bb9da4329def42b31f7-1615033711; GarminUserPrefs=de-DE; notice_behavior=implied,eu; _gid=GA1.2.1935350866.1615033713; ADRUM=s=1615033726036&r=https%3A%2F%2Fsso.garmin.com%2Fsso%2Fsignin%3Fhash%3D1343028567; GARMIN-SSO=1; GarminNoCache=true; GARMIN-SSO-GUID=5C8C08548C95AA6F3EF1A97CFCD0EA0C0868790D; GARMIN-SSO-CUST-GUID=82a11586-b698-47fb-8dc5-c5819fdbbc03; CONSENTMGR=c1:1%7Cc2:1%7Cc3:1%7Cc4:1%7Cc5:1%7Cc6:1%7Cc7:1%7Cc8:1%7Cc9:1%7Cc10:1%7Cc11:1%7Cc12:1%7Cc13:1%7Cc14:1%7Cc15:1%7Cts:1615033741393%7Cconsent:true; utag_main=v_id:017720a64051002ef4bae0612d780207800570700083e$_sn:4$_ss:0$_st:1615035541399$ses_id:1615033712836%3Bexp-session$_pn:3%3Bexp-session; _gat_gprod=1; SESSIONID=6ca70a57-bf97-4de2-bcd2-23ef11c4ea99; SameSite=None',
    detailsFileName: (id) => {
        return `./public/activity-details/details-${id}.json`;
    },
    simplify_trip_tolerance: 0.00001 * 2, //-70%
    simplify_trip_highQuality: true
}

module.exports = config;