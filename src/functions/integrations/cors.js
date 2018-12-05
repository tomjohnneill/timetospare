const fetch = require('node-fetch')
import * as functions from "firebase-functions"

export const wrapCors = functions.region('europe-west1').https.onCall((data, context) => {
  if (data.headers) {
    return fetch(data.url, {
      method: data.method,
      headers: data.headers
    })
    .then(response => response.json())
    .then(data => data)
  } else {
    return fetch(data.url)
    .then(response => response.json())
    .then(data => data)
  }

})
