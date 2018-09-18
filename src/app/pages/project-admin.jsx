import React from 'react';
import withMui from '../components/hocs/withMui.js';
import fire from '../fire';
import App from "../components/App"
import Link from "next/link";
import Router from 'next/router';
import {Tabs, Tab} from 'material-ui/Tabs';
import {List, ListItem} from 'material-ui/List';
import {buttonStyles} from '../components/styles.jsx';
import MediaQuery from 'react-responsive';
import Avatar from 'material-ui/Avatar';
import ReactTable from 'react-table';
import RaisedButton from 'material-ui/RaisedButton';

let mobile = require('is-mobile');
let db = fire.firestore()

export class Attendees extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }


  render() {
    return (
      <div style={{width: '100%'}}>
        {
          this.props.project.Members ? this.props.project.Members.map((person) => (
            <div>
                <List style={{textAlign: 'left', backgroundColor: 'white'}}>
                  <ListItem
                    style={{
                      border: 'solid 1px #979797', borderRadius: 4, marginTop: 10,
                      backgroundColor: person['Cancelled'] ? 'rgb(248,248,248)' : 'white',
                            color: person['Cancelled'] ? 'rgba(0, 0, 0, 0.4)' : 'inherit'}}
                    leftAvatar={<Avatar
                      style={{opacity: person['Cancelled'] ? 0.5 : 1}}
                       />}
                    primaryText={person.Name}
                    primaryTogglesNestedList={true}
                  />
                </List>
            </div>
          ))
          :
          null
        }
      </div>
    )
  }
}

export class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div style={{width: '100%'}}>
        {
          this.props.attendees.map((person) => (
            <div>

            </div>
          ))
        }
      </div>
    )
  }
}

export class ProjectAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {project: {}}
  }

  getOneMemberData = (member, org) => {
    fire.auth().currentUser.getIdToken()
    .then((token) =>
    fetch(`https://us-central1-whosin-next.cloudfunctions.net/users-getOneMember?member=${member}&organisation=${org}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    .then(response => response.json())
    .then(data => data)
    )
  }

  componentDidMount(props) {
    db.collection("Interactions").where("Project", "==" , Router.query.project).get()
    .then((intSnapshot) => {
      var data = []
      intSnapshot.forEach((intDoc) => {
        data.push(intDoc.data())
      })
      this.setState({interactions: data})
    })
    db.collection("Project").doc(Router.query.project).get()
    .then((projectDoc) => {
      var project = projectDoc.data()
      this.setState({project: projectDoc.data()})
      var members = []

      this.setState({members: members})
    })
  }

  handleClick = () => {
    if (fire.auth().currentUser) {
      fire.auth().currentUser.getIdToken()
      .then((token) =>
      fetch(`https://us-central1-whosin-next.cloudfunctions.net/users-addMember?project=${Router.query.project}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      })
      .then(response => response.json())
      .then(data => console.log(data))
      )
    }
  }

  render() {
    var isMobile = mobile(this.props.userAgent)
    return (
      <App>
        <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
          <MediaQuery
            values={{deviceWidth: isMobile ? 600 : 1400}}
            minDeviceWidth={700}>
            <div style={{width: '100%', width: 900}}>
              <div >
                <h2 style={{width: 500}}>{this.state.project.Name}</h2>
                <div>
                  <img src={this.state.project['Featured Image']}
                    style={{flex: 1, height: 'auto'}}/>
                </div>
                <Attendees
                  project={this.state.project}
                  />
                <RaisedButton label='Check' primary={true} onClick={this.handleClick}
                  />
              </div>


            </div>
          </MediaQuery>
        </div>
      </App>
    )
  }
}

export default withMui(ProjectAdmin)
