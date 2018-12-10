import React from 'react';
import App from '../components/App.js';
import OrganisationDetails from '../components/organisation-details.jsx';
import withMui from '../components/hocs/withMui';
import Router from 'next/router'
import fire from '../fire';

let db = fire.firestore()


export class Onboarding extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  handleSaveOrg = (details) => {
    console.log(details)
    db.collection("Organisations").add(details)
    .then((docRef) => {
      db.collection("User").doc(fire.auth().currentUser.uid).get().then((userDoc) => {
        var userData = userDoc.data()
        db.collection("PersonalData").add({
          "Full Name": userData.Name,
          "Email": userData.Email,
          managedBy: docRef.id,
          User: fire.auth().currentUser.uid
        }).then(() => {
          Router.push(`/upload-data?view=${docRef.id}&onboarding=true`)
        })
      })
    })
  }

  render() {
    return (
      <App>
        <div style={{position: 'fixed', zIndex: -1, top: 50, borderRadius: '0 30% 90% 0%',
          transform: 'skewX(-10deg)', backgroundColor: '#FFCB00', left: -150,
           width: '30vw', height: '100vw'}}/>
         <div style={{display: 'flex', justifyContent: 'center', padding: 16, minHeight: '100vh'}}>
          <div style={{width: '100%', maxWidth: 600}}>

            <OrganisationDetails
              handleSave={this.handleSaveOrg}
               />
          </div>
        </div>
      </App>
    )
  }
}

export default withMui(Onboarding)
