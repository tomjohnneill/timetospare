import React from 'react'
import withMui from '../../components/hocs/withMui.js'
import App from '../../components/App.js';
import fire from '../../fire';
import {Options} from '../../components/icons.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import CalendarIcon from 'material-ui/svg-icons/action/date-range';
import People from 'material-ui/svg-icons/social/people';
import Router from 'next/router';
import Link from 'next/link';
import {List, ListItem} from 'material-ui/List';
import Chip from 'material-ui/Chip';
import Email from 'material-ui/svg-icons/communication/email';
import {buttonStyles, chipStyles} from '../../components/styles.jsx';
import eventbrite from 'eventbrite';

let db = fire.firestore()
const queryString = require('query-string');

let functions = fire.functions('europe-west1')

export class EventbriteSuccessPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount(props) {
    var parsedHash = queryString.parse(window.location.hash)
    console.log(parsedHash)
    console.log(localStorage)
    var access_token = parsedHash.access_token
    var org = localStorage.getItem('ttsOrg')
    if (org && parsedHash && !parsedHash.error) {
      db.collection("Organisations").doc(org).update({eventbrite_access_token: parsedHash.access_token})

    } else {
      alert('There was a slight problem')
    }
    if (access_token) {
      const sdk = eventbrite({token: 'OATH_TOKEN_HERE'});
      sdk.request('/users/me/organizations/').then((data) => {

      })
    }
    console.log(localStorage)
  }

  getEventbriteOrgs = () => {
    var getEventbriteOrgs = functions.httpsCallable('integrations-getEventbriteOrganisations')
    getEventbriteOrgs({organisation: localStorage.getItem('ttsOrg')}).then((result) => {
      this.setState({organisations: result.data})
    })
  }

  handleOrgClick = (org) => {
    var getEventAttendees = functions.httpsCallable('integrations-getEventAttendees')
    getEventAttendees({organisation: localStorage.getItem('ttsOrg'), eventbriteOrgId: org.id}).then((result) => {
      console.log(result)
    })
  }

  render()  {
    return (
      <div>
        <App>
          Evenbrite
          <RaisedButton
            label='Get event list'
            onClick={this.getEventbriteOrgs}
            />
          {
            this.state.organisations ?
            this.state.organisations.map((org) => (
              <ListItem primaryText={org.name}
                onClick={() => this.handleOrgClick(org)}
                />
            ))
            :
            null
          }
        </App>
      </div>
    )
  }
}

export default withMui(EventbriteSuccessPage)
