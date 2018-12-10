import React from 'react'
import App from '../components/App.js';
import withMui from '../components/hocs/withMui.js';
import fire from '../fire';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField';
import Router from 'next/router';
import Link from 'next/link'
import Chip from 'material-ui/Chip';
import {buttonStyles, textFieldStyles, chipStyles} from '../components/styles.jsx'
import {AvatarIcon} from '../components/icons.jsx';
import Dialog from 'material-ui/Dialog';
import * as firebase from 'firebase';

let db = fire.firestore()
var functions = firebase.app().functions('europe-west1');

export class AdminAccounts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  getPendingAdmins  = (pendingObject) => {

    this.setState({pending: pendingObject})
  }

  componentDidMount(props) {
    if (Router.query.organisation) {
        db.collection("Organisations").doc(Router.query.organisation)
        .get()
        .then((doc) => {
          var data = doc.data()
          this.setState({organisation: doc.data()})
          if (data && data.PendingAdmins) {
            this.getPendingAdmins(data.PendingAdmins)
          }
          var promiseArray = []
          if (data && data.Admin) {
            Object.keys(data.Admin).forEach((admin) => {
              console.log(admin)
              promiseArray.push(
                db.collection("PersonalData")
                .where("User", "==", admin)
                .where("managedBy", "==", Router.query.organisation).limit(1)
                .get()
                  .then((userDocSnapshot) =>
                  {
                  var data
                  userDocSnapshot.forEach((userDoc) => {
                    data = userDoc.data()
                  })
                  return data
                })
              )
            })
          }
          return Promise.all(promiseArray)
        })
        .then((userArray) => {
          console.log(userArray)
          if (userArray[0]) {
            this.setState({users: userArray})
          }

        })
    }

  }

  handleInviteText = (e, nv) => {
    this.setState({email: nv})
  }

  handleSendInvite = () => {
    var email = this.state.email
    var promises = []
    var inviteEmail = functions.httpsCallable('transactional-sendInviteEmail')
    var body =
      {organisation: this.state.organisation.Name
        , link: `https://timetospare.com/signup?organisation=${this.state.organisation.Name}&email=${this.state.email}&orgId=${Router.query.organisation}`
        , to: email}
    console.log(body)
    promises.push(inviteEmail(body)
      .then((result) => {
        console.log(result)
      }))

    promises.push(db.collection("Organisations").doc(Router.query.organisation)
    .update("PendingAdmins", firebase.firestore.FieldValue.arrayUnion(this.state.email)))

    Promise.all(promises)
    .then(() => {
      var pending = this.state.pending ? this.state.pending : []
      pending.unshift(email)
      this.setState({pending: pending, email: ''})
    })


  }

  removePendingAdmin = (email) => {
    db.collection("Organisations").doc(Router.query.organisation)
    .update("PendingAdmins", firebase.firestore.FieldValue.arrayRemove(email))
    .then(() =>
      db.collection("Organisations").doc(Router.query.organisation).get()
    )
    .then((doc) =>
      this.setState({pending: doc.data().PendingAdmins})
    )
  }

  render() {
    console.log(this.state.users)
    return (
      <App>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div style={{paddingTop: 20, maxWidth: 800, width: '100%', textAlign: 'left', minHeight: '100vh'}}>
              <h2 style={{fontWeight: 200, fontSize: '30px', marginBottom: '15px'}}>
                <b>Admins</b> for this organisation
              </h2>
              <div style={{height: '4px', width: 200, backgroundColor: '#000AB2', marginBottom: 30}}/>
              <div style={{display: 'flex', alignItems: 'center', marginBottom: 40}}>
                <div style={{width: 400, marginRight: 20}}>
                  <TextField
                    inputStyle={textFieldStyles.input}
                    hintStyle={textFieldStyles.hint}
                    style={textFieldStyles.style}
                    fullWidth={true}
                    value={this.state.email}
                    onChange={this.handleInviteText}
                    underlineShow={false}
                    hintText='To add a new admin, enter their email address'
                    />
                </div>
                <RaisedButton
                  primary={true}
                  style={buttonStyles.smallSize}
                  onClick={this.handleSendInvite}
                  labelStyle={buttonStyles.smallLabel}
                  label='Invite'
                  />
              </div>
              {
                this.state.pending ?
                this.state.pending.map((user) => (
                  <div style={{width: '100%', border: '1px solid #DBDBDB', display: 'flex',
                    borderRadius: 4, padding: 20, marginTop: 5}}>
                    <AvatarIcon fill={'#484848'} style={{height: 44}}/>
                    <div style={{flex: 1, textAlign: 'left'}}>

                        <Chip
                          backgroundColor='#59baea'
                          style={chipStyles.chip} labelStyle={chipStyles.chipLabel}>
                          PENDING
                        </Chip>


                      <div style={{flex: 1}}>
                        {user}
                      </div>

                    </div>
                    <div style={{width: 300, display: 'flex'}}>
                      <div style={{padding: 5}}>
                        <RaisedButton label='Resend'
                          primary={true}
                          style={buttonStyles.smallSize}
                          labelStyle={buttonStyles.smallLabel}
                          />
                      </div>
                      <div style={{padding: 5}}>
                        <FlatButton label='Edit'

                          style={buttonStyles.smallSize}
                          labelStyle={buttonStyles.smallLabel}
                          />
                      </div>
                      <div style={{padding: 5}}>
                        <RaisedButton label='Remove'
                          onClick={() => this.removePendingAdmin(user)}
                          secondary={true}
                          style={buttonStyles.smallSize}
                          labelStyle={buttonStyles.smallLabel}
                          />
                      </div>

                    </div>
                  </div>
                ))
                :
                null
              }
              {this.state.users ?
                <div>
                  {this.state.users.map((user) => (
                    <div style={{width: '100%', border: '1px solid #DBDBDB', display: 'flex',
                      borderRadius: 4, padding: 20, marginTop: 5}}>
                      <AvatarIcon fill={'#484848'} style={{height: 44}}/>
                      <div style={{flex: 1, textAlign: 'left'}}>


                          <div style={{textAlign: 'left', textDecoration: 'underline', fontWeight: 700}}>
                            {user && user['Full Name']}
                          </div>



                        <div style={{flex: 1}}>
                          {user && user.Email}
                        </div>

                      </div>
                      <div style={{width: 200, display: 'flex'}}>

                        <div style={{padding: 5}}>
                          <FlatButton label='Edit'

                            style={buttonStyles.smallSize}
                            labelStyle={buttonStyles.smallLabel}
                            />
                        </div>
                        <div style={{padding: 5}}>
                          <RaisedButton label='Remove'
                            secondary={true}

                            style={buttonStyles.smallSize}
                            labelStyle={buttonStyles.smallLabel}
                            />
                        </div>

                      </div>
                    </div>
                  ))}
                </div>
                :
                null
              }

          </div>
        </div>
      </App>
    )
  }
}

export default withMui(AdminAccounts)
