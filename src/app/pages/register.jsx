import React from 'react';
import Link from "next/link";
import App from '../components/App';
import Router from 'next/router';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import withMui from '../components/hocs/withMui';

import fire from '../fire';

let db = fire.firestore()
var md5 = require("blueimp-md5")

const styles = {
  inputStyle :
  {borderRadius: '2px', border: '1px solid #aaa',
    paddingLeft: '12px',  boxSizing: 'border-box'},
    whiteTextfield : {
      backgroundColor: 'rgb(255,255,255)',
      height: '40px',

    },
}

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount(props) {
    db.collection("Project").doc(Router.query.project).get()
    .then((doc) => {
      this.setState({project: doc.data()})
    })

    db.collection("Engagement").where("Project", "==", Router.query.project)
    .orderBy("Name")
    .onSnapshot({ includeMetadataChanges: true }, (snapshot) => {
      var data = []
      snapshot.forEach((doc) => {
        var elem = doc.data()
        elem._id = doc.id
        db.collection("Engagement").doc(doc.id).collection("Private")
          .doc(Router.query.project).get().then((privateData) => {
          console.log(privateData.data())
          if (privateData.data()) {
              elem.Location = privateData.data().Location
              elem.Email = privateData.data().Email
              elem.Name = privateData.data().Name
            }
            data.push(elem)
            this.setState({attendees: data})
        })
      })
      this.setState({attendees: data})
      snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
              console.log("New city: ", change.doc.data());
          }

          var source = snapshot.metadata.fromCache ? "local cache" : "server";
          console.log("Data came from " + source);
      });
  });
  }

  registerNew = () => {
    this.setState({registerNew: true})
  }

  changeInfo (id, e, nv) {
    this.setState({[id]: nv})
  }

  handleSaveVolunteer = () => {
    this.setState({saving: true})
    console.log(this.state.email)
    db.collection("User").where("Email", "==", this.state.email).get()
    .then((querySnapshot) => {
      if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
          var user = doc.data()
          db.collection("Engagement").add({
            Name: user.Name,
            Project: Router.query.project,
            'Project Name': this.state.project.Name,
            'Project Photo': this.state.project['Featured Image'],
            User: doc.id,
            'Volunteer Picture': null,
            created: new Date()
          })
          .then(() => this.setState({saving: false}))
        })
      } else {
        db.collection("Engagement").add({
          Name: this.state.name,
          Project: Router.query.project,
          'Project Name': this.state.project.Name,
          'Project Photo': this.state.project['Featured Image'],
          User: md5(this.state.email),
          'Volunteer Picture': null,
          created: new Date()
        })
        .then(() => this.setState({saving: false}))
      }
    })
  }

  render() {
    return (
      <App>
        <div style={{padding: 10, textAlign: 'left'}}>
          <p style={{textAlign: 'left', fontWeight: 700, margin: 0}}>Check in your volunteers</p>
          <p style={{margin: 0, fontWeight: 'lighter'}}>
            Drag right to check in, left to check as missing
          </p>
          {
            this.state.attendees ?
            <List>
              {this.state.attendees.map((person) => (
                <div>
                  <ListItem
                    style={{textAlign: 'left'}}
                    leftAvatar={
                        <Avatar>Hi</Avatar>
                      }
                      >
                    {person.Name}
                  </ListItem>
                </div>
              ))}

            </List>
            :
            null
          }

          {
            this.state.registerNew ?
            <div style={{fontWeight: 'lighter', fontSize: '12px'}}>
              <TextField fullWidth={true}
                inputStyle={styles.inputStyle}
                underlineShow={false}
                onChange={this.changeInfo.bind(this, 'email')}
                hintText={'Email'}
                type={'email'}
                hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                key='email'
              style={styles.whiteTextfield}/>
            <div style={{height: 10}}/>
              <TextField fullWidth={true}
                inputStyle={styles.inputStyle}
                underlineShow={false}
                onChange={this.changeInfo.bind(this, 'name')}
                hintText={'Name'}
                hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                key='name'
              style={styles.whiteTextfield}/>
            <div style={{height: 10}}/>
            Only add this volunteer if they have given you permission to be on your mailing list
            <div style={{height: 10}}/>
            <FlatButton
              label='Close'
              onClick={() => this.setState({registerNew: false})}
              />
            <RaisedButton label='Add Volunteer'
              disabled={this.state.saving}
              primary={true}
              onClick={this.handleSaveVolunteer}/>
            </div>
            :
            <ListItem
              onClick={this.registerNew}
              style={{color: '#65A1e7', fontWeight: 700, textAlign: 'center'}}>
              Register a new volunteer
            </ListItem>
          }
        </div>
      </App>
    )
  }
}

export default withMui(Register)
