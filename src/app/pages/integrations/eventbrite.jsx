import React from 'react'
import withMui from '../../components/hocs/withMui.js'
import App from '../../components/App.js';
import fire from '../../fire';
import {Options, Place, CalendarIcon} from '../../components/icons.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import People from 'material-ui/svg-icons/social/people';
import Router from 'next/router';
import Link from 'next/link';
import {List, ListItem} from 'material-ui/List';
import Chip from 'material-ui/Chip';
import Email from 'material-ui/svg-icons/communication/email';
import {buttonStyles, chipStyles, headerStyles} from '../../components/styles.jsx';
import eventbrite from 'eventbrite';
import {styles} from '../../components/data-validation.jsx';
import FlatButton from 'material-ui/FlatButton';

let db = fire.firestore()
const queryString = require('query-string');

let functions = fire.functions('europe-west1')

class EventComponent extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props)
    this.state = {clicked: false}
  }



  render () {
    var start = new Date(this.props.data.start.utc)
    var end = new Date(this.props.data.end.utc)
    return (
      <div
        onMouseEnter={() => this.setState({clicked: !this.state.clicked})}
        onMouseLeave={() => this.setState({clicked: !this.state.clicked})}
        style={{ maxWidth: 300, textAlign: 'left', margin: 20,
        overflow: 'hidden', cursor: 'pointer', position: 'relative',
        border: '1px solid #DBDBDB', borderRadius: 8}}>

        {
          this.state.clicked ?
          <div style={{height: '100%', width: '100%', zIndex: 4, backgroundColor: 'rgba(200, 200, 200, 0.4)',
          position: 'absolute', top: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>

          </div>
          :
          null
        }

        <img src={this.props.data.logo.url} style={{width: '100%', height: 'auto'}}/>
        <div style={{padding: 15}}>
          <div style={{fontWeight: 700, fontSize: '25px'}}>
              {this.props.data.name.text}
            </div>
          <div style={{display: 'flex', fontWeight: 200, marginTop: 15,
            fontSize: '14px', alignItems: 'center'}}>
            <CalendarIcon style={{height: 20, paddingRight: 20}}/>
            <div>
              {start.toLocaleDateString('en-GB', {weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'})} -
              {end.toLocaleDateString('en-GB', {weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'})}
            </div>
          </div>
          {
            this.props.data.venue ?
            <div style={{display: 'flex'}}>
              <Place style={{height: 24, paddingRight: 20}}/>
              <div>

              </div>
            </div>
            :
            null
          }
        </div>

      </div>
    )
  }
}

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
      this.getEventbriteOrgs()
    }
    console.log(localStorage)
  }

  getEventbriteOrgs = () => {
    var getEventbriteOrgs = functions.httpsCallable('integrations-getEventbriteOrganisations')
    getEventbriteOrgs({organisation: localStorage.getItem('ttsOrg')}).then((result) => {
      this.setState({organisations: result.data})
    })
  }

  getEventbriteList = (org) => {
    var getEventList = functions.httpsCallable('integrations-getEventList')
    getEventList({organisation: localStorage.getItem('ttsOrg'), eventbriteOrgId: org.id}).then((result) => {
      console.log(result)
      this.setState({events: result.data.events})
    })
  }

  handleOrgClick = (org) => {
    var getEventAttendees = functions.httpsCallable('integrations-getEventAttendees')
    getEventAttendees({organisation: localStorage.getItem('ttsOrg'), eventbriteOrgId: org.id}).then((result) => {
      console.log(result)
    })
  }

  handleConfirm = () => {
    console.log('Adding all the events')
    var batch = db.batch()
    this.state.events.forEach((event) => {
      var eventRef = db.collection("Events").doc(event.id)
      var body = {
        managedBy: localStorage.getItem('ttsOrg'),
        source: 'Eventbrite',
        capacity: event.capacity,
        description: event.description,
        end: event.end.utc,
        picture: event.logo.url,
        name: event.name,
        start: event.start.utc,
        url: event.url
      }
      batch.set(eventRef, body)
    })
    batch.commit().then(() => {
      Router.push(`/project-calendar?view=${localStorage.getItem('ttsOrg')}`)
    })
  }

  render()  {
    return (
      <div>
        <App>
          <div style={{position: 'fixed', zIndex: -1, top: 50, borderRadius: '30% 0 0 90%',
            transform: 'skewX(-10deg)', backgroundColor: '#FFCB00', right: -250,
             width: '30vw', height: '100vw'}}/>
             <div style={styles.nextContainer}>
               <RaisedButton label='Next'
                 primary={true}
                 onClick={this.handleConfirm}
                 style={buttonStyles.smallSize}
                 labelStyle={buttonStyles.smallLabel}
                 />
             </div>
           <div style={{minHeight: '100vh', display: 'flex', justifyContent: 'center', textAlign : 'left'}}>
             <div>
              <div style={headerStyles.desktop}>
                We found some of your events
              </div>
              <div style={{height: 4, width: 100, backgroundColor: '#000AB2', marginBottom: 20}}/>

              {
                this.state.organisations ?
                this.state.organisations.map((org) => (
                  <ListItem primaryText={org.name}
                    onClick={() => this.getEventbriteList(org)}
                    />
                ))
                :
                null
              }
              {
                this.state.events ?
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                  {this.state.events.map((event) => (
                    <EventComponent data={event}/>
                  ))}
                </div>
                :
                null
              }
            </div>
          </div>
        </App>
      </div>
    )
  }
}

export default withMui(EventbriteSuccessPage)
