const functions = require('firebase-functions');
const fetch = require('node-fetch')
const admin = require('firebase-admin');


let db = admin.firestore()
var cors = require('cors')({origin: true});
var querystring = require('querystring');
var bodyParser = require('body-parser');

var FieldValue = admin.firestore.FieldValue

const makeNewUserAdmin = functions.firestore
    .document('User/{userId}')
    .onCreate((snap, context) => {

      const newValue = snap.data();
      if (newValue.Email) {
        return db.collection("Organisations").where("PendingAdmins", "array-contains", newValue.Email)
        .get()
        .then((querySnapshot) => {
          if (querySnapshot.size > 0) {
            querySnapshot.forEach((orgDoc) => {

              // Check if already exists

              db.collection("PersonalData").add({
                User: context.params.userId,
                Name: newValue.Name,
                Email: newValue.Email,
                Organisation: orgDoc.id
              }).then(() =>
                db.collection("Organisations").doc(orgDoc.id).update({
                  "PendingAdmins": FieldValue.arrayRemove(newValue.Email),
                  ["Admin." + context.params.userId] : true
                })
              )


            })
          }
        })
      }

    });


const updateContactRecord = functions.firestore
    .document('Interactions/{intId}')
    .onWrite((change, context) => {
      const newValue = change.after.exists && change.before.exists ? change.after.data() : null;
      var updates = []
      if (newValue && newValue.Members) {
        newValue.Members.forEach((member) => {
          updates.push(db.collection("PersonalData").doc(member)
          .update({lastInteraction: new Date()})
        )
        })
      }
      if (newValue && newValue.Organisations) {
        newValue.Organisations.forEach((org) => {
          updates.push(db.collection("OrgData").doc(org)
          .update({lastInteraction: new Date()})
        )
        })
      }
      return Promise.all(updates)
  });

export {makeNewUserAdmin, updateContactRecord}
