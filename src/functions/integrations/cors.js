const fetch = require('node-fetch')
import * as functions from "firebase-functions"

export const wrapCors = functions.region('europe-west1').https.onCall((data, context) => {
    return fetch(data.url)
    .then(response => response.json())
    .then(data => data)
})
