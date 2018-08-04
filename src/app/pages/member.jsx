import React from 'react'
import App from '../components/App.js';
import withMui from '../components/hocs/withMui.js';
import fire from '../fire';
import MediaQuery from 'react-responsive';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import Email from 'material-ui/svg-icons/communication/email';
import {List, ListItem} from 'material-ui/List';
import Router from 'next/router';
import Add from 'material-ui/svg-icons/content/add';
import Avatar from 'material-ui/Avatar';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider'
import {buttonStyles} from '../components/styles.jsx';
import 'react-quill/dist/quill.snow.css';
import {ReviewIcon, NoteIcon} from '../components/icons.jsx';

let db = fire.firestore()

const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ]
  }

export class Member extends React.Component {
  constructor(props) {
    super(props);
    this.state = {member: {}, interactions: []}
    if (typeof window !== 'undefined') {
      this.ReactQuill = require('react-quill')
    }
  }

  updateData = () => {
    db.collection("Interactions")
    .where("Member", "==", Router.query.member)
    .where("Organisation", "==", Router.query.organisation)
    .orderBy("Date", 'desc').get()
    .then((intSnapshot) => {
      var data = []
      intSnapshot.forEach((intDoc) => {
        data.push(intDoc.data())
      })
      this.setState({interactions: data})
    })
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
    this.updateData()
  }

  noteMarkup(note) {
    return {__html: note}
  }

  renderInteraction = (int) => {
    console.log(int)
    switch(int.Type) {

      case "Invited":
      console.log(int.Type)
        return (
          <div>
            <ListItem

              primaryText={`Invited to ${int.Details ? int.Details.Name : ""}`}
              secondaryText={int.Date.toLocaleString('en-gb',
                {weekday: 'long', month: 'long', day: 'numeric'})}
               leftIcon={<ContentInbox />} />
          </div>
        )
        break;
      case "Email":
        return (
          <div>
            <ListItem
              className='email-interaction'
              style={{marginBottom: 10, borderLeft: '3px solid #DBDBDB', backgroundColor: 'rgb(249, 249, 249)'}}
              primaryText={<span>Received your email: <b>{int.Details ? int.Details.Subject : ""}</b></span>}
              secondaryText={int.Date.toLocaleString('en-gb',
                {weekday: 'long', month: 'long', day: 'numeric'})}
               leftIcon={<Email />} />
          </div>
        )
        break;
      case "Reply":
        return (
          <div>
            <ListItem
              className='email-interaction'
              style={{marginBottom: 10, borderLeft: '3px solid #DBDBDB', backgroundColor: 'rgb(249, 249, 249)'}}
              primaryText={<span>Replied to your email: <b>{int.Details ? int.Details.Subject : ""}</b>
            <div className='story-text' dangerouslySetInnerHTML={this.noteMarkup(int.Details ? int.Details.Message : null)}/>
        </span>}
              secondaryText={int.Date.toLocaleString('en-gb',
                {weekday: 'long', month: 'long', day: 'numeric'})}
               leftIcon={<Email />} />
          </div>
        )
        break;
      case "Note":
        return (
          <div>
            <ListItem
              className='email-interaction'
              style={{marginBottom: 10, borderLeft: '3px solid rgb(253,216,53)', backgroundColor: 'rgb(255,249,196)'}}
              primaryText={<div>
                <div className='story-text' dangerouslySetInnerHTML={this.noteMarkup(int.Details ? int.Details.Note : null)}/>
              </div>}
              secondaryText={int.Date.toLocaleString('en-gb',
                {weekday: 'long', month: 'long', day: 'numeric'})}
               leftIcon={<NoteIcon fill={'black'}/>} />
          </div>
        )
        break;
      default:
        return (
          <ListItem primaryText="Other"
            secondaryText={int.Date.toLocaleString('en-gb',
              {weekday: 'long', month: 'long', day: 'numeric'})}
             leftIcon={<ContentInbox />} />
        )
    }
  }

  handleNoteChange = (value) => {
    this.setState({note: value})
  }

  handleSaveNote = () => {
    this.setState({takeNote: false})
    var data = {
      Organisation: Router.query.organisation,
      Member: Router.query.member,
      Date: new Date(),
      Type: 'Note',
      Details : {
        Note: this.state.note
      }
    }
    db.collection("Interactions").add(data)
    .then(() => {
      this.updateData()
      this.setState({note: null})
    })
  }

  render() {
    const ReactQuill = this.ReactQuill
    console.log(this.state)
    if (this.state.interactions[0]) {

      console.log(this.renderInteraction(this.state.interactions[0]))
    }
    return (
      <div>
        <App>
          <Dialog
            open={this.state.new}
            onRequestClose={() => this.setState({new:false})}>
            <List style={{backgroundColor: 'white', borderRadius: 4}}>

              <ListItem
                style={{display: 'flex', height: 80, alignItems: 'center'}}
                primaryText="Add a note"
                onClick={()=> this.setState({new: false, takeNote: true})}
                leftAvatar={<Avatar backgroundColor={'#000AB2'} icon={<NoteIcon/>}></Avatar>}

              />
              <Divider/>
              <ListItem
                style={{display: 'flex', height: 80, alignItems: 'center'}}
                primaryText="Leave project feedback"
                onClick={() => Router.push(`/csv-upload?organisation=${this.state.organisation}`,
                      `/csv-upload/${this.state.organisation}`)}
                leftAvatar={<Avatar  icon={<ReviewIcon/>}></Avatar>}


              />
              <Divider/>
              <ListItem
                style={{display: 'flex', height: 80, alignItems: 'center'}}
                primaryText={<span>Contact {this.state.member['Full Name'] ? this.state.member['Full Name'] : decodeURIComponent(this.props.url.query.name)}</span>}
                onClick={() => Router.push(`/csv-upload?organisation=${this.state.organisation}`,
                      `/csv-upload/${this.state.organisation}`)}
                leftAvatar={<Avatar backgroundColor={'#FFCB00'} icon={<Email/>}></Avatar>}

              />

            </List>
          </Dialog>
          <div style={{width: '100%', display: 'flex', justifyContent: 'center', paddingTop: 20, minHeight: '100vh'}}>
            <div style={{maxWidth: 1000, width: '100%', boxSizing: 'border-box', padding: 10}}>
              <div
                style={{display: 'flex', borderBottom: '1px solid #DBDBDB'}}>

                <div style={{textAlign: 'left'}}>
              <div style={{fontWeight: 200, fontSize: '20px'}}>
                  Your interactions with
                </div>
              <div style={{fontWeight: 200, fontSize: '40px'}}>
                  {this.state.member['Full Name'] ? this.state.member['Full Name'] : decodeURIComponent(this.props.url.query.name)}
                </div>

              </div>
              </div>
              <div style={{textAlign: 'left'}}>

                <div style={{padding: '20px 0px'}}>
                  {
                    this.state.takeNote ?
                    <div style={{padding: 10, borderLeft: '3px solid rgb(253,216,53)', backgroundColor: 'rgb(255,249,196)'}}>
                      <h2 style={{margin:0, marginBottom: 6}}>Type your note</h2>
                      <ReactQuill
                        style={{fontFamily: 'Nunito', backgroundColor: 'white'}}
                        modules={modules}
                        toolbar={{fontName: 'Nunito'}}
                        onChange={this.handleNoteChange}
                        value={this.state.note}

                           />
                         <div style={{display: 'flex', justifyContent: 'space-between', paddingTop: 10}}>
                           <div style={{flex: 1}}/>
                           <div style={{display: 'flex'}}>
                             <FlatButton
                               style={buttonStyles.smallSize}
                               labelStyle={buttonStyles.smallLabel}
                               label='Cancel'
                               onClick={() => this.setState({takeNote: false})}
                               />
                             <div style={{width: 20}}/>
                             <RaisedButton
                               style={buttonStyles.smallSize}
                               labelStyle={buttonStyles.smallLabel}
                               label='Save'
                               onClick={this.handleSaveNote}
                               primary={true}/>
                           </div>
                        </div>
                     </div>
                       :
                       <div >
                         <RaisedButton label='Add new interaction'
                           style={buttonStyles.smallSize}
                           labelStyle={buttonStyles.smallLabel}
                           icon={<Add/>}
                           onClick={() => this.setState({new: true})}
                           primary={true}
                           />
                       </div>
                  }
                </div>
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
