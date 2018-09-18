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
        return db.collection("Charity").where("PendingAdmins", "array-contains", newValue.Email)
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
                db.collection("Charity").doc(orgDoc.id).update({
                  "PendingAdmins": FieldValue.arrayRemove(newValue.Email),
                  ["Admin." + context.params.userId] : true
                })
              )


            })
          }
        })
      }

    });


const addMember = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const tokenId = req.get('Authorization').split('Bearer ')[1];
    return admin.auth().verifyIdToken(tokenId)
      .then((decoded) => {
        db.collection("Charity").doc(req.query.organisation).get()
        .then((organisationDoc) => {
          var organisation = organisationDoc.data()
          var organisationId = req.query.organisation
          console.log('Auth check', organisation.Admin[decoded.uid])
          if (organisation.Admin[decoded.uid]) {
            var batch = db.batch();
            var post_body = JSON.parse(req.body)
            var memberCollection = db.collection("Members")
            var data = post_body.data
            var memberIds = []
            var columns = post_body.columns
            var batchPromises = []
            data.forEach((row) => {
              var member = {}
              try {
                for (var j = 0; j < row.length; j++) {
                  if (columns[j].name) {
                    if (columns[j].name === "Email" || columns[j].name === "Full Name") {
                      member[columns[j].name] = row[j].value
                    }
                    else if (member.organisations && member.organisations[organisationId]) {
                      member.organisations[organisationId][columns[j].name] = row[j].value
                    } else if (member.organisations) {
                      member.organisations[organisationId] = {}
                      member.organisations[organisationId][columns[j].name] = row[j].value
                    } else {
                      member.organisations = {}
                      member.organisations[organisationId] = {}
                      member.organisations[organisationId][columns[j].name] = row[j].value
                    }
                  }
                }
                member[organisationId] = true
                member.lists = {}
                member.lists[post_body.listId] = true

                let checkExists = db.collection("Members").where("Email", "==", member.Email)
                .limit(1).get().then((snapshot) => {
                  if (snapshot.size > 0) {
                    let ref
                    snapshot.forEach((docRef) => {
                      ref = docRef.id
                    })
                    return ref
                  } else {
                    return false
                  }
                })
                .then((loc) => {
                  console.log(loc)
                  if (loc) {
                    batch.set(db.collection("Members").doc(loc), member, {merge: true})
                  } else {
                    let memberRef = memberCollection.doc()
                    batch.set(memberRef, member, {merge: true})
                  }
                })
                batchPromises.push(checkExists)
              }
              catch(err) {
                console.log(err)
              }
            })
            Promise.all(batchPromises)
            .then(() => {batch.commit().then(function () {
              return res.send({memberIds})
            })})

          } else {
            return res.send({"Approved": false})
          }
        })
        .catch((err) => res.status(401).send(err));
      })
      .catch((err) => res.status(401).send(err));
  })
})

const getMemberDetails = functions.https.onRequest((req, res) => {
  cors(req, res, () => {

    var orgId = req.query.organisation
    console.log(req.cookies)
    if ((!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) &&
        !(req.cookies && req.cookies.__session)) {
      console.error('No Firebase ID token was passed as a Bearer token in the Authorization header.',
          'Make sure you authorize your request by providing the following HTTP header:',
          'Authorization: Bearer <Firebase ID Token>',
          'or by passing a "__session" cookie.');
      res.status(403).send('Unauthorized');
      return;
    }

    let idToken;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      console.log('Found "Authorization" header');
      // Read the ID Token from the Authorization header.
      idToken = req.headers.authorization.split('Bearer ')[1];
    } else if(req.cookies) {
      console.log('Found "__session" cookie');
      // Read the ID Token from cookie.
      idToken = req.cookies.__session;
    } else {
      // No cookie
      res.status(403).send('Unauthorized');
      return;
    }
    admin.auth().verifyIdToken(idToken).then((decoded) => {
      console.log('ID Token correctly decoded', decoded);

          db.collection("Charity").doc(req.query.organisation).get()
          .then((organisationDoc) => {
            var organisation = organisationDoc.data()

            if (organisation.Admin[decoded.uid]) {
              console.log('Authorised')
              db.collection("Members").where(orgId, "==", true).get()
              .then((memberSnapshot) => {
                var memberArray = []
                memberSnapshot.forEach((memberDoc) => {
                  var member = memberDoc.data()
                  var returnedMember = {}
                  returnedMember._id = memberDoc.id
                  Object.keys(member).forEach((key) => {

                    if (typeof member[key] !== 'object' && key !== orgId) {
                      returnedMember[key] = member[key]
                    }
                  })
                  var orgSpecific = member.organisations && member.organisations[orgId]
                  if (orgSpecific) {
                    Object.keys(orgSpecific).forEach((orgKey) => {
                      returnedMember[orgKey] = orgSpecific[orgKey]
                    })
                  }
                  memberArray.push(returnedMember)
                  console.log(memberArray)
                })
                res.set('Cache-Control', 'public, max-age=300, s-maxage=300');
                res.status(200).send(memberArray)
              })
            } else {
              res.status(401).send({Authorized: false})
            }
          })
    }).catch((error) => {
      console.error('Error while verifying Firebase ID token:', error);
      res.status(403).send('Unauthorized');
    });
    if (idToken) {

    }

  })
})

const getOneMember = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    var orgId = req.query.organisation
    var memberId = req.query.member
    console.log(memberId)
    const tokenId = req.get('Authorization').split('Bearer ')[1];
    return admin.auth().verifyIdToken(tokenId)
      .then((decoded) => {
        db.collection("Charity").doc(req.query.organisation).get()
        .then((organisationDoc) => {
          var organisation = organisationDoc.data()
          if (organisation.Admin[decoded.uid]) {
            db.collection("Members").doc(memberId).get()
            .then((memberDoc) => {
              var member = memberDoc.data()
              var returnedMember = {}
              returnedMember._id = memberDoc.id
              Object.keys(member).forEach((key) => {
                if (typeof member[key] !== 'object' && key !== req.query.organisation) {
                  returnedMember[key] = member[key]
                }
              })
              var orgSpecific = member.organisations && member.organisations[orgId]
              if (orgSpecific) {
                Object.keys(orgSpecific).forEach((orgKey) => {
                  returnedMember[orgKey] = orgSpecific[orgKey]
                })
              }
              if (member[orgId]) {
                res.status(200).send(returnedMember)
              } else {
                res.status(403).send({Authorized: false})
              }
            })
          } else {
            res.status(403).send({Authorized: false})
          }
        })
      })
      .catch((err) => res.status(401).send(err));
  })
})

const getMemberInListEurope = functions.region('europe-west1').https.onCall((data, context) => {
    console.log(data)
    var orgId = data.organisation
    var listId = data.list

    const uid = context.auth.uid
    console.log(uid)
    return db.collection("Charity").doc(orgId).get()
    .then((organisationDoc) => {
      var organisation = organisationDoc.data()
      console.log(organisation)
      if (organisation.Admin[uid]) {
        console.log('authorised')
        return db.collection("Members").where("lists." + listId, "==", true).get()
      }
      else {
        console.log('not authorised')
        throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
          'while authenticated.');
        return {error: true}
      }
    })
    .then((memberSnapshot) => {
      console.log('going through members')
      var memberArray = []
      memberSnapshot.forEach((memberDoc) => {
        var member = memberDoc.data()
        var returnedMember = {}
        returnedMember._id = memberDoc.id
        Object.keys(member).forEach((key) => {

          if (typeof member[key] !== 'object' && key !== orgId) {
            returnedMember[key] = member[key]
          }
        })
        var orgSpecific = member.organisations && member.organisations[orgId]
        console.log(returnedMember)
        console.log(orgSpecific)
        if (orgSpecific) {
          Object.keys(orgSpecific).forEach((orgKey) => {
            returnedMember[orgKey] = orgSpecific[orgKey]
          })
        }
        memberArray.push(returnedMember)
        console.log(memberArray)
      })
      return memberArray
    })
    .catch(err => console.log(err))
})

const addTagToMembers = functions.region('europe-west1').https.onCall((data, context) => {
    console.log(data)
    var tag = data.tag
    console.log(FieldValue)
    var members = data.members
    var orgId = data.orgId
    const uid = context.auth.uid

    return db.collection("Charity").doc(orgId).get()
    .then((organisationDoc) => {
      var organisation = organisationDoc.data()
      console.log(organisation)
      if (organisation.Admin[uid]) {
        console.log('authorised')
        return true
      }
      else {
        console.log('not authorised')
        throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
          'while authenticated.');
        return false
      }
    })
    .then((authorised) => {
      var promiseArray = []
      members.forEach((member) => {
        var docRef = db.collection("Members").doc(member._original ? member._original._id : member._id)
        var promise = db.runTransaction((transaction) =>
            transaction.get(docRef)
            .then((doc) => {
              if (!doc.exists) {
                throw "Document does not exist!";
              } else {
                console.log(admin.firestore.FieldValue.serverTimestamp())
                return transaction.update(docRef, {[`organisations.${orgId}.tags`]: FieldValue.arrayUnion(tag)});
              }
            })
          )
        promiseArray.push(promise)
      })
      return Promise.all(promiseArray)
    })
    .catch(err => console.log(err))
})

export {addMember, getMemberDetails, getOneMember, getMemberInListEurope, addTagToMembers, makeNewUserAdmin}
