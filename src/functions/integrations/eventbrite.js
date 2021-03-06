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
    return db.collection("Organisations").doc(data.organisation).get().then((docSnapshot) => {
      console.log(docSnapshot.data())
       sdk = eventbrite({token: docSnapshot.data().eventbrite_access_token});
       console.log(sdk)
       return sdk.request('/users/me/organizations/')
    })
    .then((result) => result.organizations)
    .catch((err) => console.log(err))
})

const getEventList = functions.region('europe-west1').https.onCall((data,context) => {
  var sdk
  return db.collection("Organisations").doc(data.organisation).get().then((docSnapshot) => {
    return docSnapshot.data()
  }).then((orgData) => {
     sdk = eventbrite({token: orgData.eventbrite_access_token});
     return sdk.request(`/organizations/${orgData.eventbriteOrgId}/events/?expand=venue`)
  })
  .then((result) => result)
  .catch((err) => console.log(err))
})

const getOneEventAttendees = functions.region('europe-west1').https.onCall((data, context) => {
  var sdk
  return db.collection("Organisations").doc(data.organisation).get().then((docSnapshot) => {
    return docSnapshot.data()
  }).then((orgData) => {
     sdk = eventbrite({token: orgData.eventbrite_access_token});
     return sdk.request(`/events/${data.eventId}/attendees`)
  })
  .then((result) => result)
  .catch((err) => console.log(err))
})

const getEventAttendees = functions.region('europe-west1').https.onCall((data, context) => {
    var sdk
    return db.collection("Organisations").doc(data.organisation).get().then((docSnapshot) => {
      return docSnapshot.data()
    }).then((orgData) => {
       sdk = eventbrite({token: orgData.eventbrite_access_token});
       return sdk.request(`/organizations/${orgData.eventbriteOrgId}/events/`)
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
          promiseList.push(
            db.collection("PersonalData").where("Email", "array-contains", attendee.profile.email)
            .where("managedBy", "==", organisation)
            .get()
            .then((docSnapshot) => {
              var relPromises = []

              if (docSnapshot.size > 0) {

                docSnapshot.forEach((doc) => {
                  relPromises.push(
                    db.collection("Relationships")
                    .where("Member", "==", doc.id)
                    .get().then((relSnapshot) => {
                      var organisations = []
                      relSnapshot.forEach((rel) => {
                        var elem = rel.data()
                        elem.Organisations && Object.keys(elem.Organisations).forEach((org) => {
                          organisations.push(org)
                        })
                      })
                      let body = {
                        Date: new Date(event.start.utc),
                        'Start Time': new Date(event.start.utc),
                        'End Time' : new Date(event.end.utc),
                        Details: {
                          name: event.name.text,
                          url: event.url
                        },
                        Members: [doc.id],
                        Organisations: organisations,
                        Type: 'Event',
                        EventId: event.id,
                        managedBy: organisation
                      }
                      console.log(body)
                      var docRef = db.collection("Interactions").doc(attendee.id.toString())
                      return docRef.set(body, {merge: true})
                    })
                  )
                })
              }
              return Promise.all(relPromises)
            })
            .catch((err) => console.log(err))
          )
        })
      })
    })
    return Promise.all(promiseList)
    .catch((err) => console.log(err))
}

export {getEventbriteOrganisations, getEventAttendees, getEventList, getOneEventAttendees}
