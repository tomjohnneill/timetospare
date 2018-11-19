import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Router from 'next/router'
import fire from '../../fire.js';
import * as firebase from 'firebase';
import {buttonStyles} from '../styles.jsx';

var functions = firebase.app().functions('europe-west1');
let db = fire.firestore()

export default class OutlookIntegrate extends React.Component {
  constructor(props) {
    super(props);
    this.state =  {}
  }

  getUserDetails = (id) => {
    if (Router.query.access_token) {
      this.setState({access_token: Router.query.access_token})
      var access_token = Router.query.access_token
      var refresh_token = Router.query.refresh_token
      if (access_token) {
        db.collection("User").doc(fire.auth().currentUser.uid).update({
          outlook_access_token : access_token,
          outlook_refresh_token: refresh_token
        })
      }
    }
    return db.collection("User").doc(id).get().then((doc) => {
      this.setState({user: doc.data()})
      return this.getOrgDetails(doc.id)
    })
  }

  getOrgDetails = (id) => {
    return db.collection("Charity").where("Admin." + id, "==", true)
    .get()
    .then((querySnapshot) => {
      var data , orgId
      querySnapshot.forEach((option) => {
        data = option.data()
        orgId = option.id
      })
      this.setState({organisation: data, orgId: orgId})
      if (this.state.orgId) {
        return db.collection("PersonalData").where("organisation", "==",this.state.orgId)
          .where("Email", "==", this.state.user.Email)
          .get()
          .then((personalDataSnapshot) => {
            var dataId
            personalDataSnapshot.forEach((one) => {
              dataId = one.id
            })
            this.setState({personalDataId: dataId})
          })
      }

    })

  }

  componentDidMount(props) {
    fire.auth().onAuthStateChanged((user) => {
      if (user === null) {

      } else {
        this.getUserDetails(fire.auth().currentUser.uid)
        .then(() => this.handleScrapeEmails())
      }
    })
    if (fire.auth().currentUser) {
        this.getUserDetails(fire.auth().currentUser.uid)
        .then(() => this.handleScrapeEmails())
    }


  }

  onIntegrateClick = () => {
    var client_id = 'b1b13e27-ce52-480b-905c-7540c3cd976c'
    var redirect_uri = encodeURIComponent(`https://europe-west1-whosin-next.cloudfunctions.net/integrations-outlookAuth`)
    window.location.href = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?
    response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}&scope=
    openid+offline_access+profile+https:%2f%2foutlook.office.com%2fmail.readwrite+https:%2f%2foutlook.office.com%2fmail.readwrite.shared+https:%2f%2foutlook.office.com%2fmail.send.shared+https:%2f%2foutlook.office.com%2fcalendars.readwrite+https:%2f%2foutlook.office.com%2fcalendars.readwrite.shared+https:%2f%2foutlook.office.com%2fcontacts.readwrite+https:%2f%2foutlook.office.com%2fcontacts.readwrite.shared+https:%2f%2foutlook.office.com%2fmailboxsettings.readwrite+https:%2f%2foutlook.office.com%2fpeople.read+https:%2f%2foutlook.office.com%2fuser.readbasic.all`
  }

  handleScrapeEmails = (link) => {
    if (this.props.handleResult) {
      var definedLink
      if (link) {
        definedLink = link
      } else {
        definedLink = null
      }
      if (Router.query.access_token ) {
        var inviteEmail = functions.httpsCallable('integrations-scrapeOutlookEmails')
        if (this.state.orgId) {
          inviteEmail({refresh_token: this.state.user.outlook_refresh_token,
            access_token: this.state.user.outlook_access_token, organisation: this.state.orgId,
            personalDataId: this.state.personalDataId}).then((result) => {
              console.log(result)
            })
        } else {
          alert("You don't belong to an organisation")
        }
      } else {
        var inviteEmail = functions.httpsCallable('integrations-scrapeOutlookEmails')
        if (this.state.orgId && this.state.user.outlook_refresh_token) {
          inviteEmail({refresh_token: this.state.user.outlook_refresh_token,
              access_token: this.state.user.outlook_access_token,
              organisation: this.state.orgId,
              personalDataId: this.state.personalDataId,
              link: definedLink
            }).then((result) => {
              console.log(result)
              this.props.handleResult(result)
              if (result.data && result.data.nextLink) {
                this.handleScrapeEmails(result.data.nextLink)
              } else if (!result.data.nextLink) {
                this.props.onFinish()
              }
            })
          } else {
            this.onIntegrateClick()
          }
      }
    }
  }

  render() {
    return (
      <div>

      </div>
    )
  }
}
