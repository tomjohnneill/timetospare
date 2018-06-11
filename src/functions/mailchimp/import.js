import * as functions from "firebase-functions"
const fetch = require('node-fetch')
const admin = require('firebase-admin');
admin.initializeApp();

let db = admin.firestore()
var cors = require('cors')({origin: true});
var querystring = require('querystring');

const CLIENT_ID = functions.config().mailchimp.client_id;
const CLIENT_SECRET = functions.config().mailchimp.client_secret;
const SITE = `https://whosin-next.firebaseapp.com`


const getListOfLists = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const tokenId = req.get('Authorization').split('Bearer ')[1];
    return admin.auth().verifyIdToken(tokenId)
      .then((decoded) => db.collection("User").doc(decoded.uid).get())
      .then((doc) => doc.data().mailchimp_access_token)
      .then((access_token) => {
        console.log('AccessToken: ' + access_token)
        return fetch('https://login.mailchimp.com/oauth2/metadata', {
            method: 'GET',
            headers:
            {
              'Accept': 'application/json',
              'Authorization': `OAuth ${access_token}`,
           }
          })
          .then(response => response.json())
          .then((data) =>
            {
              console.log(data)
              return fetch(data.api_endpoint + '/3.0/' + '/lists', {
                headers:
                {
                  'Accept': 'application/json',
                  'Authorization': `OAuth ${access_token}`,
               }
              })
            }
          )
          .then(response => response.json())
          .then(data => {
            console.log(data)
            return res.send(data)
            }
          )
        }
      )
      .catch((err) => res.status(401).send(err));
  })
});

const getContacts = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const tokenId = req.get('Authorization').split('Bearer ')[1];
    return admin.auth().verifyIdToken(tokenId)
      .then((decoded) => db.collection("User").doc(decoded.uid).get())
      .then((doc) => doc.data().mailchimp_access_token)
      .then((access_token) => {
        console.log('AccessToken: ' + access_token)
        return fetch('https://login.mailchimp.com/oauth2/metadata', {
            method: 'GET',
            headers:
            {
              'Accept': 'application/json',
              'Authorization': `OAuth ${access_token}`,
           }
          })
          .then(response => response.json())
          .then((data) =>
            {
              console.log(data)
              return fetch(data.api_endpoint + '/3.0/' + '/lists/' + req.query.listId + '/members', {
                headers:
                {
                  'Accept': 'application/json',
                  'Authorization': `OAuth ${access_token}`,
               }
              })
            }
          )
          .then(response => response.json())
          .then(data => {
            console.log(data)
            return res.send(data)
            }
          )
        }
      )
      .catch((err) => res.status(401).send(err));
  })
})

export { getListOfLists, getContacts }
