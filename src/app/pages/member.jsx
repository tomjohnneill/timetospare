import React from 'react'
import App from '../components/App.js';
import withMui from '../components/hocs/withMui.js';
import fire from '../fire';
import MediaQuery from 'react-responsive';
import Router from 'next/router';

let db = fire.firestore()

export class Member extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
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

  render() {
    console.log(this.state)
    return (
      <div>
        <App>
          Member page
        </App>
      </div>
    )
  }
}

export default withMui(Member)
