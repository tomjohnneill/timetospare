import React from 'react';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import Close from 'material-ui/svg-icons/navigation/close';
import {CalendarIcon, Clock, AvatarIcon} from './icons.jsx';
import fire from '../fire';
import {buttonStyles} from '../components/styles.jsx';
import SignupModal from './signupmodal.jsx';
import Router from 'next/router';

let db = fire.firestore()

export default class ChooseDates extends React.Component {
  constructor(props) {
    super(props);
    this.state = {userEngagements: {}}
  }

  componentDidMount(props) {
    if (fire.auth().currentUser) {
      db.collection("Engagement").where("User", "==", fire.auth().currentUser.uid)
      .where("Project", "==", this.props.project._id)
      .get().then((engSnapshot) => {
        var data = {}
        engSnapshot.forEach((engDoc) => {
          data[engDoc.data().SubProject] = true
          this.setState({userEngagements: data})
          console.log(data)
        })
      })
    }
  }

  updateChoices = () => {
    db.collection("Engagement").where("User", "==", fire.auth().currentUser.uid)
    .where("Project", "==", this.props.project._id)
    .get().then((engSnapshot) => {
      var data = {}
      engSnapshot.forEach((engDoc) => {
        data[engDoc.data().SubProject] = true
        this.setState({userEngagements: data})
        console.log(data)
      })
    })
  }

  handleUnChoose = (sub) => {
    console.log('remove engagement')
      db.collection("Engagement").where("SubProject", "==", sub._id)
      .where("User", "==", fire.auth().currentUser.uid).get().then((querySnapshot) => {
          querySnapshot.forEach(function(doc) {
            doc.ref.delete();
          })
      })
    .catch(error => {this.setState({error: error}); console.log(error)})
    this.updateChoices()
  }

  createSubEngagement = (sub) => {
    console.log('creating subengagement')
    db.collection("User").doc(fire.auth().currentUser.uid).get().then((doc) => {
      var body = {
        "Project": this.props.project._id,
        "SubProject": sub._id,
        "Project Name": this.props.project.Name,
        "User": fire.auth().currentUser.uid,
        "Project Photo": this.props.project['Featured Image'],
        "Organisations": this.props.project['Charity Name'] ? this.props.project['Charity Name'] : null,
        "Charity Number": this.props.project.Charity ? this.props.project.Charity : null,
        "Name": doc.data().Name.replace(/ .*/,''),
        "Email": doc.data().Email,
        "Volunteer Picture": doc.data().Picture ? doc.data().Picture : null,
        "Location": doc.data().Location ? doc.data().Location : null,
        "created": new Date()
      }
      console.log(body)
      db.collection("Engagement").where("SubProject", "==", sub._id)
      .where("User", "==", fire.auth().currentUser.uid).get().then((querySnapshot) => {
          if (querySnapshot.size === 0) {
            var engRef = db.collection("Engagement").doc()
            console.log(body)
            engRef.set(body)

            .then(data => engRef.collection("Private").doc(this.props.project._id).
            set({
              User: fire.auth().currentUser.uid,
              Email: doc.data().Email,
              Name: doc.data().Name,
              "Volunteer Picture": doc.data().Picture ? doc.data().Picture : null,
              "Location": doc.data().Location ? doc.data().Location : null
            })
            .then(() => Router.push(`/joined?project=${this.props.project._id}&sub=${sub._id}`,
               window.location.pathname + '/joined?sub=' + sub._id))
          )

            .catch(error => console.log('Error', error))
          }
      })
      /*
      Router.push(`/joined?project=${this.props.project._id}&sub=${sub._id}`,
         window.location.pathname + '/joined?sub=' + sub._id)
         */
    })
  }

  handleChoose = (sub) => {
    this.setState({clicked: true})
    if (fire.auth().currentUser) {
      this.createSubEngagement(sub)
    } else {
      this.setState({logInModal: true, clicked: false})
    }
  }

  render() {
    if (this.props.preview) {
      return (
        <div style={{height: 80, width: '100%', display: 'flex', textAlign: 'left',
          alignItems: 'center',
        boxSizing: 'border-box', padding: 10}}>
          <div style={{flex: 1}}>
            No Reviews just yet
          </div>
          <div>
            <RaisedButton
              label='See dates'
              primary={true}
              style={buttonStyles.bigSize}
              labelStyle={buttonStyles.bigLabel}
              onClick={this.props.openPreview}
              />
          </div>
        </div>
      )
    }
    else if (this.state.logInModal) {
      return (
        <div>
          <SignupModal
            _id={this.props.project._id}
            open={this.state.logInModal}
            changeOpen={() => this.setState({logInModal: false, clicked: false})}
          onComplete={this.onComplete}/>
        </div>
      )
    } else {
      return (
        <div style={{textAlign: 'left'}}>
          {this.props.closeModal ?
            <div>
          <IconButton
            style={{padding: 0, width: 24,marginBottom: 16}}
            iconStyle={{padding: 0, width: 36, height: 36, color: 'rgb(118, 118, 118)'}}
             onClick={this.props.closeModal} >
            <Close/>
          </IconButton>

          <h2 style={{fontSize: '32px', marginTop: 0, marginBottom: 0}}>When do you want to do this?</h2>
          </div>
          :
          null
        }
          {this.props.subProjects.slice(0, this.props.limit).map((sub) => (
            <div style={{borderBottom: '1px solid #DBDBDB', lineHeight: 1.43,
              fontWeight: 200,
            paddingTop: 24, paddingBottom: 24}}>
            <div style={{float: 'right'}}>
              {
                this.state.userEngagements[sub._id] ?
                <RaisedButton  label='Un-Choose'
                  style={buttonStyles.smallSize}
                  labelStyle={buttonStyles.smallLabel}
                  onClick={() => this.handleUnChoose(sub)}
                  disabled={this.state.clicked}
                  />
                :
                <RaisedButton secondary={true} label='Choose'
                  onClick={() => this.handleChoose(sub)}
                  style={buttonStyles.smallSize}
                  labelStyle={buttonStyles.smallLabel}
                  disabled={this.state.clicked}
                  />
              }
            </div>
              <div style={{display: 'flex', paddingBottom: 10}}>
                  <CalendarIcon color={'black'} style={{height: 20, width: 20, marginRight: 16}}/>
                {sub.Date.toLocaleString('en-gb',
                  {weekday: 'long', month: 'long', day: 'numeric'})}
              </div>
              <div style={{display: 'flex', paddingBottom: 10}}>
                <Clock color={'black'} style={{height: 20, width: 20, marginRight: 16}}/>
                {sub.Date.toLocaleString('en-gb',
                  {hour: '2-digit', minute: '2-digit'})}
              </div>
              <div style={{display: 'flex'}}>
                  <AvatarIcon color={'black'} style={{height: 20, width: 20, marginRight: 16}}/>
                  6/11 people
              </div>
            </div>
          ))}

        </div>
      )
    }
  }
}
