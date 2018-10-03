import React from 'react'
import withMui from '../components/hocs/withMui.js'
import App from '../components/App.js';
import fire from '../fire';
import {Options} from '../components/icons.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import CalendarIcon from 'material-ui/svg-icons/action/date-range';
import People from 'material-ui/svg-icons/social/people';
import Router from 'next/router';
import Link from 'next/link';
import Chip from 'material-ui/Chip';
import Email from 'material-ui/svg-icons/communication/email';
import {buttonStyles, chipStyles} from '../components/styles.jsx';
import OutlookIntegrate from '../components/outlook/integrate.jsx';

var randomColor = require('randomcolor')
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
  },
  tableHeader : {
    backgroundColor: '#F5F5F5',
    padding: 6
  },
  tableRow : {
    borderBottom: '1px solid #DBDBDB',
    padding: 6,
    boxSizing: 'border-box',
    height: 38,
    display: 'flex',
    alignItems: 'center'
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
        var admins
        snapshot.forEach((doc) => {
          if (doc.data().Admin) {
            admins = doc.data().Admin
          }
          this.setState({organisation: doc.data(), orgId: doc.id})
        })
        return admins
      }
    })
    .then((admins) => {
      console.log(this.state.orgId)
      var promiseArray = []
      Object.keys(admins).forEach((admin) => {
        promiseArray.push(
          db.collection("PersonalData")
          .where("User", "==", admin)
          .where("Organisation", "==", this.state.orgId).limit(1)
          .get()
            .then((userDocSnapshot) =>
            {
            var data
            userDocSnapshot.forEach((userDoc) => {
              data = userDoc.data()
            })
            return data
            }
          ))
        })

      return Promise.all(promiseArray)
    })
    .then((userArray) => {
      console.log(userArray)
      this.setState({users: userArray})
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

    var today = new Date()
    var curHr = today.getHours()
    var timeOfDay
    if (curHr < 12) {
      timeOfDay = 'Morning'
    } else if (curHr < 18) {
      timeOfDay = 'Afternoon'
    } else {
      timeOfDay = 'Evening'
    }
    return (
      <div>
        <App>
          <div style={{width: '100%', display: 'flex', justifyContent: 'center', minHeight: '100vh', paddingBottom: 50, paddingTop: 20}}>
            <div style={{textAlign: 'left'}}>
              {
                this.state.organisation ?
                <div>
                  <h2 style={{fontSize: '40px'}}>Good {timeOfDay}, {this.state.user['Name']}!</h2>
                  <p style={{borderBottom: '1px solid #DBDBDB', paddingBottom: 20}}>
                     Welcome back to your Time to Spare dashboard. Have a look around to see how we can help today.
                  </p>
                  {
                    this.props.url.query.access_token ?
                    null :
                    <div>
                      <h2 style={{paddingTop: 25, fontStyle: 'italic'}}>Tasks</h2>
                        <div style={{backgroundColor: 'rgb(255,249,196)', padding: 10, borderRadius: 4,
                          display: 'flex', alignItems: 'center',
                            margin: 10, border: '1px solid rgb(253, 216, 53)'}}>
                            <img src='https://upload.wikimedia.org/wikipedia/commons/0/0b/Microsoft_Outlook_2013_logo.svg'
                              style={{height: 30, paddingRight: 20}}/>
                            <span style={{flex: 1}}>Get emails from outlook</span>
                            <OutlookIntegrate/>
                        </div>
                        <div style={{backgroundColor: 'rgb(255,249,196)', marginTop: 10, padding: 10, borderRadius: 4,
                          display: 'flex', alignItems: 'center',
                            margin: 10, border: '1px solid rgb(253, 216, 53)'}}>
                            <img src='https://pbs.twimg.com/profile_images/1041676563727581184/PZdTbu06.jpg'
                              style={{height: 30, paddingRight: 20}}/>
                            <span style={{flex: 1}}>Get events from Eventbrite</span>
                            <RaisedButton style={buttonStyles.smallSize}
                              labelStyle={buttonStyles.smallLabel}
                              primary={true}
                              label='Scrape events'
                              disabled={true}
                              />
                        </div>
                    </div>
                  }

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
                          Look through your linked organisations, or look through your past history.
                        </p>
                        <RaisedButton
                          primary={true}
                          onClick={() => Router.push(`/organisations?organisation=${this.state.orgId}`)}
                          labelStyle={buttonStyles.smallLabel}
                          style={buttonStyles.smallSize}
                          label='Organisations'/>
                      </div>
                    </span>
                  </div>

                  <h2 style={{paddingTop: 25, fontStyle: 'italic'}}>Your admins</h2>
                  <div style={{marginTop: 30}}>
                    <div style={{width: '100%', textAlign: 'left', display: 'flex'}}>
                      <div style={{flex: 1}}>
                        <div style={styles.tableHeader}>
                          Name
                        </div>
                      </div>

                      <div style={{flex: 1}}>
                        <div style={styles.tableHeader}>
                          Email
                        </div>
                        <div>

                        </div>
                      </div>

                      <div style={{flex: 1}}>
                        <div style={styles.tableHeader}>
                          Last logged in
                        </div>

                      </div>
                    </div>

                      {
                        this.state.users ?
                        this.state.users.map((user) => (
                          <div style={{width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center'}}>
                            <div style={{flex: 1}}>
                              <div style={styles.tableRow}>
                                {user.Name}
                              </div>
                            </div>

                            <div style={{flex: 1}}>
                              <div style={styles.tableRow}>
                                <Chip
                                  backgroundColor={randomColor({luminosity: 'light'})}
                                  style={chipStyles.chip}
                                  labelStyle={chipStyles.chipLabel}
                                  >
                                  {user.Email}
                                </Chip>
                              </div>
                              <div>

                              </div>
                            </div>

                            <div style={{flex: 1}}>
                              <div style={styles.tableRow}>
                                Last logged in
                              </div>
                            </div>
                          </div>
                        ))
                        :
                        null
                      }

                    <Link prefetch href={`/admin-accounts?organisation=${this.state.orgId}`}>
                      <div
                        style={{width: '100%', display: 'flex', alignItems: 'center',
                          justifyContent: 'center', padding: 20, boxSizing: 'border-box'}}>
                        <RaisedButton label='Add/Edit admins'
                          style={buttonStyles.smallSize}
                          labelStyle={buttonStyles.smallLabel}
                          primary={true}
                          />
                      </div>
                    </Link>
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
