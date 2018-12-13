import React from 'react'
import Router from 'next/router'
import Link from 'next/link'
import VolunteerTable from '../components/admin-tools/table.jsx';
import App from '../components/App.js';
import withMui from '../components/hocs/withMui';
import RaisedButton from 'material-ui/RaisedButton';
import Breadcrumbs from '../components/onboarding/breadcrumbs.jsx';
import {buttonStyles} from '../components/styles.jsx';
import fire from '../fire.js';
import * as firebase from 'firebase';


var functions = firebase.app().functions('europe-west1');

export  class VolunteerPreview extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  indexAllDocuments = () => {
    var indexAllInteractions = functions.httpsCallable('elastic-indexAllInteractions')
    indexAllInteractions().then((result) => {
      console.log(result)
    }).catch((err) => console.log(err))
  }


  render() {
    return (
      <div>
        <App>

            <div style={{display: 'flex', maxWidth: 1000, width: '100%', marginTop: 20}}>
              <RaisedButton label='Next'
                primary={true}
                style={buttonStyles.smallSize}
                onClick={this.indexAllDocuments}
                labelStyle={buttonStyles.smallLabel}
                />
          </div>
        </App>
      </div>
    )
  }
}

export default withMui(VolunteerPreview)
