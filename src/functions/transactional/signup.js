const functions = require('firebase-functions');
const fetch = require('node-fetch')
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');


let db = admin.firestore()


var mailgun = require('mailgun-js')({host: 'api.eu.mailgun.net', apiKey: 'key-dfe410401ff096a0f1764383dfb5e89a', domain: 'mg.timetospare.com'})

const sendInviteEmail = functions.region('europe-west1').https.onCall((data, context) => {
    let body = {
      to: data.to,
      from: `${data.organisation}@timetospare.com`,
      subject: `${data.organisation} want you to join Time to Spare`,
      html: `<span>${data.organisation} want you to join their organisation on Time to Spare.
      <br></br>
      Click this link to sign up: ${data.link.replace(/ /g,"%20")}
      <br></br>
      Thanks,
      <br></br>
      Time to Spare team
      `
    }
    return mailgun.messages().send(body)
})

export {sendInviteEmail}
