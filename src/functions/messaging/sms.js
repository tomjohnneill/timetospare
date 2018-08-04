const functions = require('firebase-functions');
const fetch = require('node-fetch')
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');


let db = admin.firestore()

var TWILIO_ACCOUNT_SID = functions.config().twilio.account_sid; // Your Account SID from www.twilio.com/console
const TWILIO_AUTH_TOKEN = functions.config().twilio.auth_token;   // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);



const sendCustomSMS = functions.region('europe-west1').https.onCall((data, context) => {
  var message = {
    Organisation: data.Organisation,
    ListId: data.ListId,
    Type: "Email",
    Date: new Date(),
    Body: data.body
  }
  return Promise.all(
      data.to.map(number => {
      return client.messages.create({
        to: number,
        from: '+441315103997',
        body: data.body
      });
    })
  )
  .then((sidArray) => {
    console.log(sidArray)
    return db.collection("Messages").add(message)
  })
  .then((messageDoc) => {
      var batch = db.batch()
      data.Members.forEach((member) => {
        let interaction = {
          Date: new Date(),
          Member: member,
          Organisation: data.Organisation,
          Type: "Email",
          Details :{
            Body: data.body,
            MessageId: messageDoc.id
          }
        }
        console.log(interaction)
        var intRef = db.collection("Interactions").doc()
        batch.set(intRef, interaction)
      })
      return batch.commit()
  })
  .catch((err) => err)
})

export {sendCustomSMS}
