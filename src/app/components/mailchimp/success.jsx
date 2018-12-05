import React from 'react';
import fire from '../../fire';
import Checkbox from 'material-ui/Checkbox';
import Router from 'next/router'
import RaisedButton from 'material-ui/RaisedButton';
import {buttonStyles} from '../styles.jsx'
import {List, ListItem} from 'material-ui/List';

function encodeEmail (email) {
  return email.replace(/\./g, 'ASDFadf94nc1OKC')
}

function decodeEmail (email) {
  return email.replace(/ASDFadf94nc1OKC/g, '.')
}

let db = fire.firestore()

export default class MailchimpSuccess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: {},
      members : []
    }
  }

  saveMembers = () => {
    var data = this.state.members
    fire.auth().currentUser.getIdToken()
    .then((token) =>
    fetch(`https://us-central1-whosin-next.cloudfunctions.net/users-addMember?organisation=${Router.query.organisation}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        data: data,
        columns: columns
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      if (Router.query.onboarding)
      { Router.push(`/volunteer-preview?organisation=${Router.query.organisation}`,
            `/volunteer-preview/${Router.query.organisation}`)
          } else {
            Router.push(`/people?organisation=${Router.query.organisation}`)
          }
    }
    )
    )
  }

  updateCheck = (value, id) => {
    var checked = this.state.checked
    console.log(id)
    checked[id] = !checked[id]
    this.setState({checked:checked})
    fire.auth().currentUser.getIdToken()
    .then((token) =>
    fetch(`https://us-central1-whosin-next.cloudfunctions.net/mailchimp-getContacts?listId=${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }))
    .then(response => response.json())
    .then(data => {console.log(data)
      var members = this.state.members
      data.members.forEach((member) => {
        members.push(member)
      })
      this.setState({members: members})
    }
    )
    .catch(error => console.log('Error', error))
  }

  componentDidMount(props) {
    console.log(fire.auth())
    fire.auth().onAuthStateChanged((user) => {
      if (user === null) {

      } else {
        this.setState({loading: true})
        db.collection("User").doc(fire.auth().currentUser.uid).update({
          mailchimp_access_token : this.props.access_token,
          mailchimp_api_endpoint: this.props.api_endpoint
        })
        .then(() => fire.auth().currentUser.getIdToken())
        .then((token) =>
        fetch('https://us-central1-whosin-next.cloudfunctions.net/mailchimp-getListOfLists', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        }))
        .then(response => response.json())
        .then(data => this.setState({loading: false, lists: data.lists}))
        .catch(error => console.log('Error', error))
      }
    })

    if (fire.auth().currentUser) {
      this.setState({loading: true})
      db.collection("User").doc(fire.auth().currentUser.uid).update({
        mailchimp_access_token : this.props.access_token
      })
      .then(() => fire.auth().currentUser.getToken())
      .then((token) =>
      fetch('https://us-central1-whosin-next.cloudfunctions.net/mailchimp-getListOfLists', {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      }))
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.setState({lists: data.lists, loading: false})
      })
      .catch(error => console.log('Error', error))
    }
  }

  handleImportContacts = () => {
    var batch = db.batch();
    var collRef = db.collection("Lists").doc()
    var columns = this.state.columns
    var Pending = {}
    console.log(columns)
    var emailPosition = columns.findIndex(x => x.name=="Email")
    data.forEach((row) => {
      Pending[encodeEmail(row[emailPosition].value)] = true
    })
    collRef.set({
      Organisation: Router.query.organisation,
      Pending: Pending,
      Columns: columns
      // set admins in here
    }).then(() => {
      db.collection("Organisations").doc(Router.query.organisation).update({
        ['lists.' + collRef.id] : true
      })
    }).then(() => {
      var memberCollection = collRef.collection("Members")
      data.forEach((row) => {
        var member = {}
        for (var j = 0; j < row.length; j++) {
          if (columns[j].name) {
            member[columns[j].name] = row[j].value
          }
        }
        batch.set(memberCollection.doc(), member)
      })
      batch.commit().then(function () {
          console.log("batch committed")
          Router.push(`/volunteer-preview?organisation=${Router.query.organisation}`,
                `/volunteer-preview/${Router.query.organisation}`)
      });

    })
  }

  render() {
    return (
      <div>
        <h2 style={{display: 'flex'}}>
          <img
            style={{height: 32.8, width: 'auto', paddingRight: 15}}
            src='https://static.mailchimp.com/web/brand-assets/logo-freddie-fullcolor.svg'/>
          Which lists do you want to import?
        </h2>
        {
          this.state.loading ?
          <div style={{display: 'flex', alignItems: 'center', width: '100%',
            justifyContent: 'center', backgroundColor: 'white', height: 200}}>
            Give us a sec, we're just finding your contact lists...
          </div>
          :
          null
        }
        {
          this.state.lists ?
          <div>

            <List style={{backgroundColor: 'white', borderRadius: 4}}>
              {this.state.lists.map((list) => (
                <ListItem>
                  <div style={{display: 'flex'}}>
                    <Checkbox
                      label={list.name}
                      checked={this.state.checked[list.id]}
                      onCheck={(value) => this.updateCheck(value, list.id)}
                    />
                  </div>
                </ListItem>

              ))}
            </List>
          </div>
          :
          null
        }
        {
          this.state.members.length > 0 ?
          this.state.members.map((member) => (
            member.email_address
          ))
          :
          null
        }
        <div style={{display: 'flex', marginTop: 20}}>
        <RaisedButton label='Import contacts'
          primary={true}
          style={buttonStyles.smallSize}
          labelStyle={buttonStyles.smallLabel}
          disabled={Object.keys(this.state.checked).length === 0}
          onClick={this.handleImportContacts}
          />
        </div>
      </div>
    )
  }
}
