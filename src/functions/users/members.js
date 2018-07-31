const functions = require('firebase-functions');
const fetch = require('node-fetch')
const admin = require('firebase-admin');


let db = admin.firestore()
var cors = require('cors')({origin: true});
var querystring = require('querystring');
var bodyParser = require('body-parser');

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
                var memberRef = memberCollection.doc()
                memberIds.push({_id: memberRef.id, email: member.Email})
                batch.set(memberRef, member, {merge: true})
              }
              catch(err) {
                console.log(err)
              }
            })
            batch.commit().then(function () {
              return res.send({memberIds})
            })

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
    const tokenId = req.get('Authorization').split('Bearer ')[1];

    return admin.auth().verifyIdToken(tokenId)
      .then((decoded) => {

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
                memberArray.push(returnedMember)
              })
              res.status(200).send(memberArray)
            })
          } else {
            res.status(401).send({Authorized: false})
          }
        })

      })
      .catch((err) => res.status(401).send(err));
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
  cors(req, res, () => {
    var orgId = data.organisation
    var listId = data.list

    const uid = context.auth.uid

    db.collection("Charity").doc(data.organisation).get()
    .then((organisationDoc) => {
      var organisation = organisationDoc.data()
      if (organisation.Admin[uid]) {
        db.collection("Members").where("lists." + listId, "==", true).get()
        .then((snapshot) => {
          var memberArray = []
          snapshot.forEach((member) => {
            var member = memberDoc.data()
            var returnedMember = {}
            returnedMember._id = memberDoc.id
            Object.keys(member).forEach((key) => {
              if (typeof member[key] !== 'object' && key !== data.organisation) {
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
          })

        return(memberArray)

        })
      } else {
        throw new functions.https.HttpsError('failed-precondition', 'The function must be called ' +
          'while authenticated.');
      }
    })
  })
})

export {addMember, getMemberDetails, getOneMember, getMemberInListEurope}
