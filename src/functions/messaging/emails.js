const functions = require('firebase-functions');
const fetch = require('node-fetch')
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');


let db = admin.firestore()


var mailgun = require('mailgun-js')({host: 'api.eu.mailgun.net', apiKey: 'key-dfe410401ff096a0f1764383dfb5e89a', domain: 'mg.timetospare.com'})


const receiveReply = functions.region('europe-west1').https.onRequest((req, res) => {
  if (req.method === 'POST') {
    console.log(req.body)
    var post_body = req.body
    console.log(typeof post_body)
    var message = post_body
    console.log(message)
    var sender = message.sender
    var mailgunId = message['In-Reply-To']
    var html = message['stripped-html']
    var memberId
    // Put this bit in a transaction
    db.collection("Members").where("Email", "==", sender).limit(1).get()
    .then((userSnapshot) => {
      var member
      userSnapshot.forEach((userDoc) => {
          member = userDoc.id
        }
      )
      memberId = member
      return member
    })
    .then((memberId) =>
      db.collection("Messages").where("MailgunId", "==", mailgunId).limit(1).get()
    )
    .then((messageSnap) => {
        var orgId
        messageSnap.forEach((messageDoc) => {
          orgId = messageDoc.data().Organisation
        })
        return {member: memberId, org: orgId}
    })
    .then((data) => {
      var body = {
        Date: new Date(),
        Member: data.member,
        Organisation: data.org,
        Type: "Reply",
        Details : {
          MailgunId: mailgunId,
          Message: html
        }
      }
      return db.collection("Interactions").add(body)
    })
    .then(() => res.status(200).send('Complete'))
    .catch((error) => {
      console.log(error)
      res.status(404).send('Error')

    })
  }
})

const sendCustomEmail = functions.region('europe-west1').https.onCall((data, context) => {
    var routeUrl = 'https://europe-west1-whosin-next.cloudfunctions.net/messaging-receiveReply'
    var body = {
      to: data.to,
      from: data.from,
      subject: data.subject,
      html: data.html,
      "recipient-variables": data.recipientVariables
    }
    console.log(body)
    var mailgunId
    return mailgun.messages().send(body)
    .then((response) =>  {
      mailgunId = response.id
      return mailgun.post('/routes',
          {expression: 'match_header("In-Reply-To", ".*'+ response.id +'")',
            action: [`forward("${routeUrl}")`],
            description: 'Replying',
            priority: 1
          })
    })
    .then(() => {
      var message = {
        Organisation: data.Organisation,
        ListId: data.ListId,
        Subject: data.subject,
        Type: "Email",
        MailgunId: mailgunId,
        Date: new Date(),
        Body: data.html
      }
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
              Subject: data.subject,
              MessageId: messageDoc.id
            }
          }
          console.log(interaction)
          var intRef = db.collection("Interactions").doc()
          batch.set(intRef, interaction)
        })
        return batch.commit()
    })
    .catch(err => err)
})

export {sendCustomEmail, receiveReply}
