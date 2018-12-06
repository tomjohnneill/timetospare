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
                Admin: true,
                managedBy: orgDoc.id
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
      const newValue = change.after.data()
      var updates = []
      if (newValue && newValue.Members) {
        console.log(newValue.Members)
        newValue.Members.forEach((member) => {
          updates.push(db.collection("Interactions").where("Date", "<", new Date())
          .where("Members", "array-contains", member)
          .orderBy("Date", "desc").limit(1).get().then((querySnapshot) => {
            if (querySnapshot.size > 0) {
              var latest
              querySnapshot.forEach((doc) => {
                latest = new Date(doc.data().Date)
              })
              console.log(latest)
              return latest
            }
          })
          .then((latest) => {
            db.collection("PersonalData").doc(member)
            .update({lastInteraction: latest})
          })
        )
        })
      }
      if (newValue && newValue.Organisations) {
        newValue.Organisations.forEach((org) => {
          updates.push(db.collection("Interactions").where("Date", "<", new Date())
          .where("Organisations", "array-contains", org)
          .orderBy("Date", "desc").limit(1).get().then((querySnapshot) => {
            if (querySnapshot.size > 0) {
              var latest
              querySnapshot.forEach((doc) => {
                latest = new Date(doc.data().Date)
              })
              console.log(latest)
              return latest
            }
          })
          .then((latest) => {
            db.collection("OrgData").doc(org)
            .update({lastInteraction: latest})
          })
        )
        })
      }
      return Promise.all(updates)
  });

export {makeNewUserAdmin, updateContactRecord}
