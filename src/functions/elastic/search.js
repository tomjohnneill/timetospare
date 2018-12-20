const fetch = require('node-fetch')
import * as functions from "firebase-functions"

const admin = require('firebase-admin');
let db = admin.firestore()

var elasticsearch = require('elasticsearch');
const elasticConfig = functions.config().elasticsearch

var client = new elasticsearch.Client({
  host: elasticConfig.url,
  httpAuth: `${elasticConfig.username}:${elasticConfig.password}`,
  log: 'trace'
});

const addDocument = functions.firestore
    .document('Interactions/{intId}')
    .onWrite((change, context) => {
        const newValue = change.after.data()
        if (newValue) {
          var body = newValue
          if (body.Date) {
            var date = new Date(body.Date)
            var timestring = date.toISOString()
            body.Date = timestring
          }
          console.log(body)
          return client.index({
            index: process.env.GCLOUD_PROJECT === 'timetospare-123' ? 'interactions' : 'staging-interactions',
            type: 'interaction',
            id: context.params.intId,
            body: body

          });
        } else {
          const oldValue = change.before.data()
          return client.delete({
            index: process.env.GCLOUD_PROJECT === 'timetospare-123' ? 'interactions' : 'staging-interactions',
            type: 'interaction',
            id: context.params.intId
          });
        }
})

const addMember = functions.firestore
    .document('PersonalData/{memberId}')
    .onWrite((change, context) => {
        const newValue = change.after.data()
        var body = newValue
        if (body.lastInteraction) {
          var date = new Date(body.lastInteraction)
          var timestring = date.toISOString()
          body.lastInteraction = timestring
        }
        console.log(body)
        return client.index({
          index: process.env.GCLOUD_PROJECT === 'timetospare-123' ? 'members' : 'staging-members',
          type: 'member',
          id: context.params.memberId,
          body: body

        });

})

const addOrg = functions.firestore
    .document('OrgData/{orgId}')
    .onWrite((change, context) => {
        const newValue = change.after.data()
        var body = newValue
        if (body.lastInteraction) {
          var date = new Date(body.lastInteraction)
          var timestring = date.toISOString()
          body.lastInteraction = timestring
        }
        console.log(body)
        return client.index({
          index: process.env.GCLOUD_PROJECT === 'timetospare-123' ? 'orgs' : 'staging-orgs',
          type: 'org',
          id: context.params.orgId,
          body: body

        });

})

const basicSearch = functions.region('europe-west1').https.onCall((data, context) => {
    return client.search({
      index: data.index,
      body: {
        query: data.query
      }
    })
})

const basicOrganisationAggregation = functions.region('europe-west1').https.onCall((data, context) => {
    return client.search({
      index: data.index,
      body: {
        "size" : 0,
            "query" : {
                 "constant_score": {
                     "filter": {
                       "bool": {
                         "must": [
                           {"term": {
                             "managedBy": data.view
                            }},
                            {"term": {
                             "Organisations.raw": data.organisation
                            }}
                         ]
                       }

                     }
                 }
             },
            "aggs": data.aggs
          }
    })
})

const summaryAggregation  = functions.region('europe-west1').https.onCall((data, context) => {
    return client.search({
      index: data.index,
      body: {
        "query" : {

            "constant_score": {
             "filter": {
               "bool": {
                 "must": [
                   {"term": {
                     "managedBy": data.view
                    }},
                    {"range" : {
                        "Date" : {
                            "gte": data.fromDate,
                            "lte": data.toDate,
                            "format": "dd/MM/yyyy"
                        }
                    }}
                 ]
               }

             }
           }
        },
        "size" : 0,
        "aggs": data.aggs

      }
    }).then((result) => result)
    .catch(err => err)
})

const indexAllInteractions = functions.region('europe-west1').https.onCall((data, context) => {
    return db.collection("Interactions").get().then((intSnapshot) => {
      var intIndexes = []
      intSnapshot.forEach((int) => {
        var body = int.data()
        if (body.Date) {
          var date = new Date(body.Date)
          var timestring = date.toISOString()
          body.Date = timestring
        }
        console.log(body)
        intIndexes.push(client.index({
          index: process.env.GCLOUD_PROJECT === 'timetospare-123' ? 'interactions' : 'staging-interactions',
          type: 'interaction',
          id: int.id,
          body: body
        }).then((result) => result)
        .catch((err) => console.log(err))
      )
      })
      return intIndexes
    }).then((intIndexes) => Promise.all(intIndexes))
})

const indexAllMembers = functions.region('europe-west1').https.onCall((data, context) => {
    return db.collection("PersonalData").get().then((intSnapshot) => {
      var intIndexes = []
      intSnapshot.forEach((int) => {
        var body = int.data()
        if (body.lastInteraction) {
          var date = new Date(body.lastInteraction)
          var timestring = date.toISOString()
          body.lastInteraction = timestring
        }
        console.log(body)
        intIndexes.push(client.index({
          index: process.env.GCLOUD_PROJECT === 'timetospare-123' ? 'members' : 'staging-members',
          type: 'member',
          id: int.id,
          body: body
        }).then((result) => result)
        .catch((err) => console.log(err))
      )
      })
      return intIndexes
    }).then((intIndexes) => Promise.all(intIndexes))
})

const indexAllOrgs = functions.region('europe-west1').https.onCall((data, context) => {
    return db.collection("OrgData").get().then((intSnapshot) => {
      var intIndexes = []
      intSnapshot.forEach((int) => {
        var body = int.data()
        if (body.lastInteraction) {
          var date = new Date(body.lastInteraction)
          var timestring = date.toISOString()
          body.lastInteraction = timestring
        }
        console.log(body)
        intIndexes.push(client.index({
          index: process.env.GCLOUD_PROJECT === 'timetospare-123' ? 'orgs' : 'staging-orgs',
          type: 'org',
          id: int.id,
          body: body
        }).then((result) => result)
        .catch((err) => console.log(err))
      )
      })
      return intIndexes
    }).then((intIndexes) => Promise.all(intIndexes))
})

export {summaryAggregation, basicSearch, basicOrganisationAggregation, addDocument, addMember, addOrg, indexAllInteractions, indexAllMembers, indexAllOrgs}
