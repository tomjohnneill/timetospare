import * as functions from "firebase-functions"
import eventbrite from 'eventbrite';
const fetch = require('node-fetch')
var querystring = require('querystring');

const admin = require('firebase-admin');
let db = admin.firestore()

var FieldValue = admin.firestore.FieldValue

const getEventbriteOrganisations = functions.region('europe-west1').https.onCall((data, context) => {
    var sdk
    console.log(data)
    return db.collection("Charity").doc(data.organisation).get().then((docSnapshot) => {
      console.log(docSnapshot.data())
       sdk = eventbrite({token: docSnapshot.data().eventbrite_access_token});
       console.log(sdk)
       return sdk.request('/users/me/organizations/')
    })
    .then((result) => result.organizations)
    .catch((err) => console.log(err))
})

const getEventAttendees = functions.region('europe-west1').https.onCall((data, context) => {
    var sdk
    return db.collection("Charity").doc(data.organisation).get().then((docSnapshot) => {
      return docSnapshot.data().eventbrite_access_token
    }).then((token) => {
       sdk = eventbrite({token: token});
       return sdk.request(`/organizations/${data.eventbriteOrgId}/events/`)
    })
    .then((result) => getAllAttendees(sdk, result.events, data.organisation))
    .catch((err) => console.log(err))
})

const getAllAttendees = (sdk, eventList, organisation) => {

  var promiseList = []
    eventList.forEach((event) => {
      sdk.request(`/events/${event.id}/attendees/`).then((eventData) => {
        let attendeeList = eventData.attendees
        attendeeList.forEach((attendee) => {
          console.log(attendee)
          console.log(attendee.profile)
          console.log(attendee.profile.email)
          promiseList.push(
            db.collection("PersonalData").where("Email", "array-contains", attendee.profile.email)
            .where("organisation", "==", organisation)
            .get()
            .then((docSnapshot) => {
              if (docSnapshot.size > 0) {
                docSnapshot.forEach((doc) => {
                  console.log(doc.data())
                  console.log(event.start.utc)
                  console.log(event.name)
                  console.log([doc.id])
                  console.log(organisation)
                  console.log(doc.data().Organisations)
                  let body = {
                    Date: new Date(event.start.utc),
                    'Start Time': new Date(event.start.utc),
                    'End Time' : new Date(event.end.utc),
                    Details: {
                      name: event.name.text,
                      url: event.url
                    },
                    Members: [doc.id],
                    Organisation: organisation,
                    Type: 'Event',
                    Organisations: doc.data().Organisations
                  }
                  console.log(body)
                  var docRef = db.collection("Interactions").doc(event.id.toString())
                  return docRef.set(body, {merge: true})

                })
              }
            })
            .catch((err) => console.log(err))
          )
        })
      })
    })
    return Promise.all(promiseList)
    .catch((err) => console.log(err))
}

export {getEventbriteOrganisations, getEventAttendees}
