import React from 'react'
import withMui from '../components/hocs/withMui.js'
import App from '../components/App.js';
import fire from '../fire';
import {Options} from '../components/icons.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import CalendarIcon from 'material-ui/svg-icons/action/date-range';
import People from 'material-ui/svg-icons/social/people';
import Router from 'next/router';
import Email from 'material-ui/svg-icons/communication/email';
import {buttonStyles} from '../components/styles.jsx';

let db = fire.firestore()

const styles = {
  box: {
    height: 140,
    width: 200,
    padding: 10,
    border: '1px solid #DBDBDB',
    borderRadius: 4,
    display: 'flex',
    alignItems: 'top',
    margin: 10
  },
  leftIcon: {
    width: 60,
    paddingRight: 10
  },
  textBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',

  },
  text: {
    marginTop: 0,
    height: 150
  }
}

export class Organisation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {user: {}}
  }

  getData = (uid) => {
    db.collection("Charity").where("Admin." + uid, "==", true).get()
    .then((snapshot) => {
      if (snapshot.size > 0) {
        snapshot.forEach((doc) => {
          this.setState({organisation: doc.data(), orgId: doc.id})
        })
      }
    })
    db.collection("User").doc(uid).get()
    .then((userDoc) => {
      this.setState({user: userDoc.data()})
    })
  }

  componentDidMount(props) {
    Router.prefetch(`/project-calendar`)
    Router.prefetch(`/volunteer-preview`)
    fire.auth().onAuthStateChanged((user) => {
      console.log(user)
      if (user === null) {
      }
      else {
        this.getData(user.uid)
      }
    })
    if (fire.auth().currentUser) {
      this.getData(fire.auth().currentUser.uid)
    }
  }

  render() {
    return (
      <div>
        <App>
          <div style={{width: '100%', display: 'flex', justifyContent: 'center', height: '100vh', paddingTop: 20}}>
            <div style={{textAlign: 'left'}}>
              {
                this.state.organisation ?
                <div>
                  <h2 style={{fontSize: '40px'}}>Good Afternoon, {this.state.user['Name']}!</h2>
                  <p style={{borderBottom: '1px solid #DBDBDB', paddingBottom: 20}}>
                     Welcome back to your Time to Spare dashboard. Have a look around to see how we can help today.
                  </p>
                  <h2 style={{paddingTop: 25, fontStyle: 'italic'}}>Your options</h2>
                  <div style={{display: 'flex', flexWrap: 'wrap', alignItems: 'center'}}>
                    <Options style={{height: 120, width: 120}}
                      color={'#000AB2'}/>
                    <span style={styles.box}>
                      <div style={styles.leftIcon}>
                        <CalendarIcon/>
                      </div>
                      <div style={styles.textBox}>
                        <p style={styles.text}>
                          View your calendar, add new projects
                        </p>
                        <RaisedButton
                          primary={true}
                          labelStyle={buttonStyles.smallLabel}
                          style={buttonStyles.smallSize}
                          onClick={() => Router.push(`/project-calendar?organisation=${this.state.orgId}`)}
                          label='Calendar'/>
                      </div>
                    </span>
                    <span style={styles.box}>
                      <div style={styles.leftIcon}>
                        <People/>
                      </div>
                      <div style={styles.textBox}>
                        <p style={styles.text}>
                          Search through your volunteer database.
                          Add or change your details.
                        </p>
                        <RaisedButton
                          primary={true}
                          labelStyle={buttonStyles.smallLabel}
                          onClick={() => Router.push(`/people?organisation=${this.state.orgId}`)}
                          style={buttonStyles.smallSize}
                          label='People'/>
                      </div>
                    </span>
                    <span style={styles.box}>
                      <div style={styles.leftIcon}>
                        <Email/>
                      </div>
                      <div style={styles.textBox}>
                        <p style={styles.text}>
                          Contact your volunteers, or look through your past conversation history.
                        </p>
                        <RaisedButton
                          primary={true}
                          labelStyle={buttonStyles.smallLabel}
                          style={buttonStyles.smallSize}
                          label='Messaging'/>
                      </div>
                    </span>
                  </div>

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

export default withMui(Organisation)
