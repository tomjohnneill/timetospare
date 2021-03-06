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
  .then(response => {
    if (response.status === 200) {
      return response.json()
    } else {
      throw "Failed to get access token"
    }
  })
  .then(data =>
    {
      access_token = data.access_token
      refresh_token = data.refresh_token
    return res.redirect(SITE + `/integrations/categorise?access_token=${access_token}&refresh_token=${refresh_token}`)
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
  .then(response => {
    if (response.status === 200) {
      return response.json()
    } else {
      throw "Refresh token not authorised"
    }
  })
  .then(data => {
    console.log(data)
    return db.collection("User").doc(uid).update({
    outlook_access_token: data.access_token
    })
    .then(() => data.access_token)
    .catch((err) => console.log(err))
  })
}

const getMessages = (link, access_token) => {
  console.log('link', link)
  console.log('access_token', access_token)
  return fetch(link, {
      method: 'GET',
      headers:
      {
        'Accept': 'application/json',
        'Authorization': `Bearer ${access_token}`,
        'Prefer': 'outlook.body-content-type="html"'
     }
    })
}


const includesNTimes = (array, n, value) => {
  var counter = 0
  array.forEach((elem) => {
    if (elem == value) {
      counter += 1
    }
  })
  if (counter > n) {
    return true
  } else {
    return false
  }
}

const uniqObjs = (array, field) => {
  var index = [];
  var _ids = []
  console.log(array)
  for (var i = 0; i < array.length; i ++) {
    if (array[i] && !_ids.includes(array[i][field])) {
      index.push(array[i])
    }
    if (array[i]) {
      _ids.push(array[i][field])
    }
  }
  return index
}

const keepEmail = (email, people, type) => {
  if (type === 'received') {

    if (email.Sender && people[email.Sender.EmailAddress.Address].exists &&
       !people[email.Sender.EmailAddress.Address].admin) {
      return true
    } else {
      return false
    }
  } else if (type === 'sent') {
    var include = false
    email.ToRecipients.forEach((person) => {
      if (person && person.EmailAddress && people[person.EmailAddress.Address].exists && !people[person.EmailAddress.Address].admin) {
        include = true
      }
    })
    email.CcRecipients.forEach((person) => {
      console.log(person.EmailAddress)
      if (person && person.EmailAddress && people[person.EmailAddress.Address].exists && !people[person.EmailAddress.Address].admin) {
        include = true
      }
    })
    return include
  }
}

const keepEvent = (calendarEvent, people) => {
  var matchedAttendees = 0
  var admins = 0
  calendarEvent.Attendees.forEach((person) => {
    if (people[person.EmailAddress.Address].exists) {
      matchedAttendees += 1
      if (people[person.EmailAddress.Address].admin) {
        admins += 1
      }
    }
  })
  if (matchedAttendees > 0 && admins < matchedAttendees) {
    return true
  } else {
    return false
  }
}

const attachDataToEmail = (email, people, type) => {
  if (type === 'received') {
    var details = []
    email.ToRecipients.forEach((person) => {
      if (person && person.EmailAddress) {
        details.push(people[person.EmailAddress.Address].details)
      }
    })
    email.CcRecipients.forEach((person) => {
      if (person && person.EmailAddress) {
        details.push(people[person.EmailAddress.Address].details)
      }
    })
    if (email && email.Sender && email.Sender.EmailAddress) {
      details.push(people[email.Sender.EmailAddress.Address].details)
    }
    var uniqDetails
    if (details.length > 0) {
      uniqDetails =  uniqObjs(details, '_id')
    } else {
      uniqDetails = details
    }
    return ({email: email, details: uniqDetails})
  } else if (type === 'sent') {
    var details = []
    email.ToRecipients.forEach((person) => {
      if (person && person.EmailAddress) {
        details.push(people[person.EmailAddress.Address].details)
      }
    })
    email.CcRecipients.forEach((person) => {
      if (person && person.EmailAddress) {
        details.push(people[person.EmailAddress.Address].details)
      }
    })
    var uniqDetails
    if (details.length > 0) {
      uniqDetails =  uniqObjs(details, '_id')
    } else {
      uniqDetails = details
    }
    return ({email: email, details: uniqDetails})
  }
}

const attachDataToEvent = (calendarEvent, people) => {
  var details = []
  calendarEvent.Attendees.forEach((attendee) => {
    details.push(people[attendee.EmailAddress.Address].details)
  })
  return ({event: calendarEvent, details: details})
}

const getRelationships =  (memberData) => {
  return db.collection("Relationships")
  .where("Member", "==", memberData._id).get()
  .then((relSnapshot) => {
    var data = []
    relSnapshot.forEach((doc) => {
      var elem = doc.data()
      elem._id = doc.id
      data.push(elem)
    })
    memberData.RELATIONSHIPS = data
  })
}

const checkIfExists = (person, organisation, adminList) => {

  return db.collection("PersonalData")
    .where("managedBy", "==", organisation)
    .where("Email", "array-contains", person)
    .get()
    .then((querySnapshot) => {
      if (querySnapshot.size > 0) {
        let data, _id
        querySnapshot.forEach((result) => {
          data = result.data()
          data._id = result.id
        })
        return getRelationships(data)
          .then(() => db.collection("User")
            .where("Email", "==", person)
            .get()
            .then((userSnapshot) => {
              var includesAdmin = false
              if (userSnapshot.size > 0) {
                userSnapshot.forEach((user) => {
                  if (adminList[user.id]) {
                    includesAdmin = true
                  }
                })
              }

              if (includesAdmin) {
                return ({
                  exists: true,
                  email: person,
                  details: data,
                  admin: true
                })
              } else {
                return ({
                  exists: true,
                  email: person,
                  details: data,
                  admin: false
                })
              }

            })
          )
      } else {
        return {exists: false}
      }
    })
}

const emailPeople = (emails) => {
  var people = {}
  emails.forEach((email) => {
    console.log(email.Sender)
    let from
    if (email.Sender && email.Sender.EmailAddress) {
      from = email.Sender.EmailAddress.Address
      people[from] = {exists: false}
    }
    email.ToRecipients.forEach((person) => {
      if (person && person.EmailAddress) {
        people[person.EmailAddress.Address] = {exists: false}
      }
    })
    email.CcRecipients.forEach((person) => {
      if (person && person.EmailAddress) {
        people[person.EmailAddress.Address] = {exists: false}
      }
    })
  })

  return people
}

const calendarPeople = (events) => {
  var people = {}
  events.forEach((event) => {
    event.Attendees.forEach((attendee) => {
      people[attendee.EmailAddress.Address] = {exists: false}
    })
  })
  return people
}

const checkAgainstMembers = (items, organisation, type, nextLink, element) => {
  var promises = []

  var people
  if (element == 'Emails') {
    people = emailPeople(items)
  } else if (element === 'Calendar') {
    people = calendarPeople(items)
    console.log(people)
  }



  return db.collection("Organisations").doc(organisation).get().then((orgDoc) => orgDoc.data())
  .then((orgData) => {
    var admins = orgData.Admin

    Object.keys(people).forEach((person) => {
      promises.push(checkIfExists(person, organisation, admins))
    })

    return Promise.all(promises)
    .then((results) => {
      results.forEach((result) => {
        if (result.exists) {
          people[result.email] = {
            exists: true,
            admin: result.admin,
            details: result.details
          }
        }
      })
      return people
    })
    .then((people) => {
      var data = []
      if (element === 'Emails') {
        items.forEach((email) => {
          if (keepEmail(email, people, type)) {
            console.log('email has been kept', email)
            data.push(attachDataToEmail(email, people, type))
          }
        })
      } else if (element === 'Calendar') {
        items.forEach((email) => {
          if (keepEvent(email, people)) {

            data.push(attachDataToEvent(email, people))
          }
        })
      }

      return ({data: data, nextLink: nextLink})
    })
  })

}

const checkAuthorisation = (response, context, link, passedFunction) => {
  console.log('response', response)
  console.log('response status', response.status)
  if (response.status === 200) {
    return response.json()
  } else if (response.status === 401) {
    return db.collection("User").doc(context.auth.uid).get()
    .then((userDoc) => {
      var refresh_token = userDoc.data().outlook_refresh_token
      return refresh_token
    })
    .then((refresh_token) => {
      return requestNewToken(refresh_token, context.auth.uid)
        .then((token) =>
          {
            console.log(token)
            console.log(link)
            return passedFunction(link, token)
            .then(response => {
              if (response.status === 200) {
                return response.json()
              } else {
                console.log(response.json())
                throw "Refresh token not authorised"

              }
            })
          }
        )
    })
  } else {
    throw "not authorised"
  }
}


const scrapeOutlookEmails = functions.region('europe-west1').https.onCall((data, context) => {
    var today = new Date()
    var interactions = []
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
      if (data.link) {
        link = data.link
      } else {
        link = `https://outlook.office.com/api/v2.0/me/messages/?&select=Sender,CcRecipients,ConversationId,Subject,Body,ToRecipients,SentDateTime&filter=sentdatetime%20ge%20${fromDate}&sentdatetime%20le%20${toDate}&$top=50`
      }
        return getMessages(link,
          data.access_token)
      })
      .then(response =>
        checkAuthorisation(response, context, link, getMessages)
      )
      .then((newData) => {
        console.log(newData)
        return checkAgainstMembers(newData.value, data.organisation, 'received', newData["@odata.nextLink"], 'Emails')
      })
      .catch((err) => console.log(err))
})

const getCalendarEvents = (link, access_token) => {
  console.log('link', link)
  console.log('access_token', access_token)
  return fetch(link, {
      method: 'GET',
      headers:
      {
        'Accept': 'application/json',
        'Authorization': `Bearer ${access_token}`
     }
    })
}

const scrapeCalendarEvents = functions.region('europe-west1').https.onCall((data, context) => {
  var today = new Date()
  var aday = new Date()
  var interactions = []
  var lastUpdated, fromDate, toDate, link
    return db.collection("User").doc(context.auth.uid).get().then((doc) => {
      lastUpdated = doc.data().last_scraped_outlook
      return lastUpdated
    }).then((lastUpdated) => {
      var toDate = encodeURIComponent(new Date(aday.setMonth(today.getMonth() + 6)).toISOString())
      if (lastUpdated) {
        fromDate = encodeURIComponent(lastUpdated.toISOString())
      } else {
        fromDate = encodeURIComponent(new Date(today.setMonth(today.getMonth() - 1)).toISOString());
      }
      if (data.link) {
        link = data.link
      } else {
        link = `https://outlook.office.com/api/v2.0/me/calendarview?startdatetime=${fromDate}&enddatetime=${toDate}&$top=50`
      }
        return getCalendarEvents(link,
          data.access_token)
      })
      .then(response =>
        checkAuthorisation(response, context, link, getCalendarEvents)
      )
      .then((newData) => {
        console.log(newData)
        return checkAgainstMembers(newData.value, data.organisation, null, newData["@odata.nextLink"], 'Calendar')
      })
      .catch((err) => console.log(err))

})

export { outlookAuth,  scrapeOutlookEmails, scrapeCalendarEvents}
