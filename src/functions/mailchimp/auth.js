import * as functions from "firebase-functions"
const fetch = require('node-fetch')
var querystring = require('querystring');

const CLIENT_ID = functions.config().mailchimp.client_id;
const CLIENT_SECRET = functions.config().mailchimp.client_secret;
const SITE = `https://timetospare.org.uk`

const mailchimpAuth = functions.https.onRequest((req, res) => {
  var code = req.query.code
  var encoded_url = 'https://us-central1-whosin-next.cloudfunctions.net/greetings-mailchimpAuth'
  var data = {
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: encoded_url,
    code: code
  }
  var access_token
  var body = querystring.stringify(data)
  console.log(body)
  fetch('https://login.mailchimp.com/oauth2/token', {
    method: 'POST',
    headers:
    { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: querystring.stringify(data)
  })
  .then(response => response.json())
  .then(data =>
    {
      access_token = data.access_token
      return fetch('https://login.mailchimp.com/oauth2/metadata', {
          method: 'GET',
          headers:
          {
            'Accept': 'application/json',
            'Authorization': `OAuth ${data.access_token}`,
         }
        })
    }
    )
  .then(response => response.json())
  .then(data => {
    console.log(data)
    return res.redirect(SITE + `/mailchimp?access_token=${access_token}&api_endpoint=${data.api_endpoint}`)
  })
})

export { mailchimpAuth }
