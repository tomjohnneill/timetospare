import React from 'react'
import App from '../components/App.js';
import withMui from '../components/hocs/withMui.js';
import fire from '../fire';
import MediaQuery from 'react-responsive';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import {List, ListItem} from 'material-ui/List';
import Router from 'next/router';

let db = fire.firestore()

export class Member extends React.Component {
  constructor(props) {
    super(props);
    this.state = {member: {}, interactions: []}
  }

  componentDidMount(props) {
    fire.auth().onAuthStateChanged((user) => {
      if (user === null) {

      } else {
        fire.auth().currentUser.getIdToken()
        .then((token) =>
          fetch(`https://us-central1-whosin-next.cloudfunctions.net/users-getOneMember?organisation=${Router.query.organisation}&member=${Router.query.member}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Authorization': 'Bearer ' + token
            },
          })
          .then(response => response.json())
          .then((memberArray) => {
            console.log(memberArray)
            if (memberArray) {
              this.setState({member: memberArray})
            }

          })
        )
      }
    })
    console.log(Router.query)
    db.collection("Interactions")
    .where("Member", "==", Router.query.member)
    .where("Organisation", "==", Router.query.organisation).get()
    .then((intSnapshot) => {
      var data = []
      intSnapshot.forEach((intDoc) => {
        data.push(intDoc.data())
      })
      this.setState({interactions: data})
    })
  }

  renderInteraction = (int) => {
    console.log(int)
    switch(int.Type) {

      case "Invited":
      console.log(int.Type)
        return (
          <div>
            <ListItem primaryText={`Invited to ${int.Details ? int.Details.Name : ""}`}
              secondaryText={int.Date.toLocaleString('en-gb',
                {weekday: 'long', month: 'long', day: 'numeric'})}
               leftIcon={<ContentInbox />} />
          </div>
        )
        break;
      default:
        return (
          <ListItem primaryText="Other"

             leftIcon={<ContentInbox />} />
        )
    }
  }

  render() {
    console.log(this.state)
    if (this.state.interactions[0]) {

      console.log(this.renderInteraction(this.state.interactions[0]))
    }
    return (
      <div>
        <App>
          <div style={{width: '100%', display: 'flex', justifyContent: 'center', paddingTop: 20, minHeight: '100vh'}}>
            <div style={{maxWidth: 1000, width: '100%', boxSizing: 'border-box', padding: 10}}>
              <div
                style={{display: 'flex', borderBottom: '1px solid #DBDBDB'}}>

                <div style={{textAlign: 'left'}}>
              <div style={{fontWeight: 200, fontSize: '20px'}}>
                  Your interactions with
                </div>
              <div style={{fontWeight: 200, fontSize: '40px'}}>
                  {this.state.member['Full Name']}
                </div>

              </div>
              </div>
              <div style={{textAlign: 'left'}}>
                {
                  <div>
                    {this.state.interactions.map((int) => (
                      this.renderInteraction(int)
                    ))}
                  </div>
                }
              </div>
            </div>
          </div>
        </App>
      </div>
    )
  }
}

export default withMui(Member)
