import * as functions from "firebase-functions"
const fetch = require('node-fetch')
var querystring = require('querystring');

const CLIENT_ID = functions.config().outlook.client_id;
const CLIENT_SECRET = functions.config().outlook.client_secret;
const SITE = `https://timetospare.com`

const admin = require('firebase-admin');
let db = admin.firestore()

const outlookAuth = functions.region('europe-west1').https.onRequest((req, res) => {
  var code = req.query.code
  var encoded_url = 'https://europe-west1-whosin-next.cloudfunctions.net/integrations-outlookAuth'
  var data = {
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: encoded_url,
    code: code
  }
  var access_token, refresh_token
  var body = querystring.stringify(data)
  console.log(body)
  fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
    method: 'POST',
    headers:
    { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: querystring.stringify(data)
  })
  .then(response => response.json())
  .then(data =>
    {
      access_token = data.access_token
      refresh_token = data.refresh_token
    return res.redirect(SITE + `/dashboard?access_token=${access_token}&refresh_token=${refresh_token}`)
  })
})

const requestNewToken = (refresh_token, uid) => {
  console.log(refresh_token, uid)
  var data = {
    grant_type: 'refresh_token',
    client_id: CLIENT_ID,
    refresh_token: refresh_token,
    client_secret: CLIENT_SECRET,
  }
  console.log(data)
  return fetch('https://login.microsoftonline.com/common/oauth2/v2.0/token', {
    method: 'POST',
    headers:
    { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: querystring.stringify(data)
  })
  .then(response => response.json())
  .then(data => {
    console.log(data)
    return db.collection("User").doc(uid).update({
    outlook_access_token: data.access_token
    })
    .then(() => data.access_token)
  })
}

const getMessages = (link, access_token) => {
  return fetch(link, {
      method: 'GET',
      headers:
      {
        'Accept': 'application/json',
        'Authorization': `Bearer ${access_token}`,
     }
    })
}

const checkAgainstMembers = (emails, organisation, uid) => {
  console.log(organisation, uid)
  var batch = db.batch()
  var batchPromises = []
  emails.forEach((email) => {
    let from = email.Sender.EmailAddress.Address
    let to = []
    email.ToRecipients.forEach((person) => {
      to.push(person.EmailAddress.Address)
    })
    let checks = []

    console.log(from, to[0], organisation)
    checks.push(db.collection("PersonalData")
      .where("organisation", "==", organisation)
      .where("Email", "array-contains", from)
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.size > 0) {
          let id
          let tags
          querySnapshot.forEach((result) => {
            id = result.id
            tags = result.data().tags
          })
          if (id !== uid) {
            return {id:  id, tags: tags}
          } else {
            return true
          }
        } else {
          return false
        }
      }))

      // Currently only checking the first to recipient

    checks.push(db.collection("PersonalData")
      .where("organisation", "==", organisation)
      .where("Email", "array-contains", to[0])
      .get()
      .then((querySnapshot) => {
        if (querySnapshot.size > 0) {
          let id, tags
          querySnapshot.forEach((result) => {
            id = result.id
            tags = result.data().tags
          })

          // it shouldn't be uid, it should be the id of the PersonalData of the user in that org

          if (id !== uid) {
            return {id:  id, tags: tags}
          } else {
            return true
          }
        } else {
          return false
        }
      }))

    batchPromises.push(
      Promise.all(checks).then((results) => {
        console.log(results)
        if (results[0] && results[1]) {

          let members = []
          let tags
          if (results[0] === true) {
            members.push(results[1].id)
            tags = results[1].tags
          } else {
            members.push(results[0].id)
            tags = results[0].tags
          }
          let body
          if (tags) {
            body = {
              Date : new Date(email.SentDateTime),
              Details : {
                Subject: email.Subject
              },
              Organisation: organisation,
              Type: 'Email',
              tags: tags,
              Members: members,
              Creator: uid
            }
          } else {
            body = {
              Date : new Date(email.SentDateTime),
              Details : {
                Subject: email.Subject
              },
              Organisation: organisation,
              Type: 'Email',
              Members: members,
              Creator: uid
            }
          }
          batch.set(db.collection("Interactions").doc(), body)
        }
      })
    )
  })
  console.log(batchPromises)
  return Promise.all(batchPromises)
  .then(() => batch.commit())
}

const scrapeOutlookEmails = functions.region('europe-west1').https.onCall((data, context) => {
    var today = new Date()
    var lastUpdated, fromDate, toDate, link
    return db.collection("User").doc(context.auth.uid).get().then((doc) => {
      lastUpdated = doc.data().last_scraped_outlook
      return lastUpdated
    }).then((lastUpdated) => {
      var toDate = encodeURIComponent(new Date().toISOString())
      if (lastUpdated) {
        fromDate = encodeURIComponent(lastUpdated.toISOString())
      } else {
        fromDate = encodeURIComponent(new Date(today.setMonth(today.getMonth() - 1)).toISOString());
      }
      link = `https://outlook.office.com/api/v2.0/me/messages/?&select=Sender,Subject,ToRecipients,SentDateTime&filter=sentdatetime%20ge%20${fromDate}&sentdatetime%20le%20${toDate}`
        return getMessages(link,
          data.access_token)
      })
      .then(response => {
        if (response.status === 200) {
          return response.json()
        } else if (response.status === 401) {
          db.collection("User").doc(context.auth.uid).get()
          .then((userDoc) => {
            var refresh_token = userDoc.data().outlook_refresh_token
            return refresh_token
          })
          .then((refresh_token) => {
            return requestNewToken(refresh_token, context.auth.uid)
              .then((token) => {
                getMessages(link, token)
              })
          })
        } else {
          throw "not authorised"
        }
      })
      .then((newData) => checkAgainstMembers(newData.value, data.organisation, data.personalDataId))
      .catch((err) => console.log(err))
})


export { outlookAuth,  scrapeOutlookEmails}
