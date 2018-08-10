import React from 'react';
import withMui from '../components/hocs/withMui.js';
import App from '../components/App.js';
import Router from 'next/router';
import fire from '../fire.js';
import MediaQuery from 'react-responsive';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import Email from 'material-ui/svg-icons/communication/email';
import {List, ListItem} from 'material-ui/List';
import Add from 'material-ui/svg-icons/content/add';
import Avatar from 'material-ui/Avatar';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ArrowRight from 'material-ui/svg-icons/navigation/arrow-forward';
import Divider from 'material-ui/Divider'
import {buttonStyles} from '../components/styles.jsx';
import 'react-quill/dist/quill.snow.css';
import {ReviewIcon, NoteIcon} from '../components/icons.jsx';
import AddTag from '../components/addTag.jsx';
import Chip from 'material-ui/Chip';

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


export class UserTag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  updateData = () => {
    db.collection("Interactions")
    .where("tags", "array-contains", Router.query.tag)
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

  render() {
    return (
      <div>
        <App>
          <div
            style={{ paddingTop: 20, paddingBottom: 20, justifyContent: 'center',
              display: 'flex', borderBottom: '1px solid #DBDBDB'}}>
              <div style={{display: 'flex', maxWidth: 1050, width: '100%',
                justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{textAlign: 'left'}}>

              <div style={{fontWeight: 200, fontSize: '40px'}}>
                {decodeURIComponent(this.props.url.query.tag)}
              </div>
            </div>
            <RaisedButton label='Add new interaction'
              style={buttonStyles.smallSize}
              labelStyle={buttonStyles.smallLabel}
              icon={<Add/>}
              onClick={() => this.setState({new: true})}
              primary={true}
              />

          </div>

          </div>

          <div style={{width: '100%', display: 'flex', justifyContent: 'center', paddingTop: 20, minHeight: '100vh'}}>
            <div style={{textAlign: 'left', padding: 20, width: 350}}>
              <div style={{fontWeight: 200, fontSize: '20px', paddingBottom: 20}}>
                Tag Members
              </div>
              <div style={{boxSizing: 'border-box',
              border: '1px solid #DBDBDB', borderRadius: 2}}>
                <ListItem
                  primaryText='Details'
                  leftIcon={<Add/>}
                  primaryTogglesNestedList={true}

                   style={{ borderBottom: '1px solid #DBDBDB'}}/>



              </div>
            </div>

            <div style={{maxWidth: 700,textAlign: 'left',  width: '100%', boxSizing: 'border-box', padding: 20}}>
              <div style={{fontWeight: 200, fontSize: '20px', paddingBottom: 20}}>
                  Key info
                </div>
              <div style={{display: 'flex', padding: 40, backgroundColor: '#DBDBDB',
              marginBottom: 20}}>
                This is going to be mega
              </div>
              <div style={{textAlign: 'left'}}>

                <div style={{padding: '00px 0px'}}>
                  <div style={{fontWeight: 200, fontSize: '20px', paddingBottom: 20}}>
                      Your interactions
                    </div>
                  {
                    this.state.takeNote ?
                    <div style={{padding: 10, marginBottom: 10, borderLeft: '3px solid rgb(253,216,53)', backgroundColor: 'rgb(255,249,196)'}}>
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

                       </div>
                  }
                </div>
                {
                  <div>

                    {this.state.interactions && this.state.interactions.length > 0 ?
                      this.state.interactions.map((int) => (
                      this.renderInteraction(int)
                    ))
                      :
                      <div style={{display: 'flex', padding: 50, alignItems: 'center', justifyContent: 'center'
                      , backgroundColor: '#F5F5F5'}}>
                        There's nothing here just yet
                      </div>
                  }
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

export default withMui(UserTag)
