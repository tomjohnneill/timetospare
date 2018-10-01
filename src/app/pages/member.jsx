import React from 'react'
import App from '../components/App.js';
import withMui from '../components/hocs/withMui.js';
import fire from '../fire';
import MediaQuery from 'react-responsive';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import Email from 'material-ui/svg-icons/communication/email';
import {List, ListItem} from 'material-ui/List';
import Router from 'next/router';
import Link from 'next/link'
import Add from 'material-ui/svg-icons/content/add';
import Avatar from 'material-ui/Avatar';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ArrowRight from 'material-ui/svg-icons/navigation/arrow-forward';
import Divider from 'material-ui/Divider'
import {buttonStyles, iconButtonStyles} from '../components/styles.jsx';
import AddNote from '../components/addNote.jsx';
import 'react-quill/dist/quill.snow.css';
import IconButton from 'material-ui/IconButton';
import {ReviewIcon, NoteIcon, AvatarIcon, Tag} from '../components/icons.jsx';
import AddTag from '../components/addTag.jsx';
import Chip from 'material-ui/Chip';
import * as firebase from 'firebase';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import MoreVert from 'material-ui/svg-icons/navigation/more-vert'
import Delete from 'material-ui/svg-icons/action/delete'
import Close from 'material-ui/svg-icons/navigation/close'

let db = fire.firestore()
var randomColor = require('randomcolor')

const styles = {
  chip: {
    margin: 0,
    height: 25,
    lineHeight: '25px'
  },
  chipLabel: {
    lineHeight: '25px'
  }
}



export class Member extends React.Component {
  constructor(props) {
    super(props);
    this.state = {member: {}, interactions: [], note: '', memberData: {}}
    if (typeof window !== 'undefined') {
      this.ReactQuill = require('react-quill')
    }
  }

  updateData = () => {
    this.setState({interactions: []})
    db.collection("Interactions")
    .where("Member", "==", Router.query.member)
    .where("Organisation", "==", Router.query.organisation)
    .orderBy("Date", 'desc').get()
    .then((intSnapshot) => {
      var data = this.state.interactions ? this.state.interactions : []
      intSnapshot.forEach((intDoc) => {
        var elem = intDoc.data()
        elem._id = intDoc.id
        data.push(elem)
      })
      this.setState({interactions: data})
    })

    db.collection("Interactions")
    .where("Members", "array-contains", Router.query.member)
    .where("Organisation", "==", Router.query.organisation)
    .orderBy("Date", 'desc').get()
    .then((intSnapshot) => {
      var data = this.state.interactions ? this.state.interactions : []
      intSnapshot.forEach((intDoc) => {
        var elem = intDoc.data()
        elem._id = intDoc.id
        data.push(elem)
      })
      this.setState({interactions: data})
    })

    db.collection("PersonalData").doc(Router.query.member).get()
    .then((doc) => {
      var elem = doc.data()
      elem._id = doc.id
      const rawData = Object.create(elem)
      this.setState({memberData: rawData, member: elem})
    })
  }

  componentDidMount(props) {
    db.collection("PersonalData").doc(Router.query.member).get()
    .then((doc) => {
      var elem = doc.data()
      elem._id = doc.id
      const rawData = Object.create(elem)
      console.log(rawData)
      this.setState({memberData: rawData})

      this.setState({member: elem})
    })
    /*
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
    */
    console.log(Router.query)
    this.updateData()
  }

  noteMarkup(note) {
    return {__html: note}
  }

  handleOptionsClick = (event, int) => {
    console.log('clicked')
    console.log(int)
    this.setState({
      optionsOpen: true,
      targetedInt: int,
      anchorEl: event.currentTarget,
    });
  }

  handleOptionsRequestClose = () => {
    this.setState({
      optionsOpen: false,
    });
  };

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
              rightIcon={<IconButton
                tooltip='Options'
                onClick={(e) => this.handleOptionsClick(e, int)}
                style={iconButtonStyles.button}><MoreVert /></IconButton>}
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
              rightIcon={<IconButton
                tooltip='Options'
                onClick={(e) => this.handleOptionsClick(e, int)}
                style={iconButtonStyles.button}><MoreVert /></IconButton>}
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
              rightIcon={<IconButton
                tooltip='Options'
                onClick={(e) => this.handleOptionsClick(e, int)}
                style={iconButtonStyles.button}><MoreVert /></IconButton>}
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

  handleSaveNote = (note) => {
    this.setState({takeNote: false})
    var data = {
      Organisation: Router.query.organisation,
      Members: [Router.query.member],
      Creator: fire.auth().currentUser.uid,
      Date: new Date(),
      Type: 'Note',
      tags: this.state.member.tags ? this.state.member.tags : [],
      Details : {
        Note: note
      }
    }
    db.collection("Interactions").add(data)
    .then(() => {
      this.updateData()
    })
  }

  handleTagAdded = (tag) => {
    var tags = this.state.member.tags
    var member = this.state.member
    if (tags) {
      tags.push(tag)
    }
    member.tags = tags
    this.setState({member: member})
    this.updateData()
  }

  handleDeleteTag = (tag) => {
    db.collection("PersonalData").doc(Router.query.member).update("tags", firebase.firestore.FieldValue.arrayRemove(tag))
    .then(() => {
      this.updateData()
    })
  }

  handleDeleteInteraction = (int) => {
    db.collection("Interactions").doc(int._id).delete()
    .then(() => {
      this.setState({deleteOpen: false, interactions: []})
      this.updateData()
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
          <Popover
            open={this.state.optionsOpen}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.handleOptionsRequestClose}
          >
            <Menu style={{textAlign: 'left'}}>
              <MenuItem primaryText="Tags" onClick={() => alert('work in progress')}
                  leftIcon={<Tag style={{height: 25}}/>} />
              <MenuItem
                onClick={() => this.setState({deleteOpen: true, optionsOpen: false})}
                primaryText="Completely delete" leftIcon={<Delete/>} />
              <MenuItem
                onClick={() => this.setState({deleteOpen: true, optionsOpen: false})}
                primaryText="Remove from this member" leftIcon={<Close/>} />
            </Menu>
          </Popover>
          <AddTag
            selection={[this.state.memberData]}
            text={`Tag ${decodeURIComponent(this.props.url.query.name)}`}
            organisation={this.props.url.query.organisation}
            open={this.state.tagOpen}
            onTagAdded={this.handleTagAdded}
            onRequestClose={() => this.setState({tagOpen:false})}/>

          <Dialog
            open={this.state.deleteOpen}
            actions={[

              <FlatButton
                label='Cancel'
                style={buttonStyles.smallSize}
                labelStyle={buttonStyles.smallLabel}
                onClick={() => this.setState({deleteOpen: false, optionsOpen: false})}
                />,
                <RaisedButton
                  style={buttonStyles.smallSize}
                  labelStyle={buttonStyles.smallLabel}
                  icon={<Delete/>}
                  label='Delete interaction'
                  onClick={() => this.handleDeleteInteraction(this.state.targetedInt)}
                  primary={true}/>
            ]}
            onRequestClose={() => this.setState({deleteOpen:false})}>
            <h2 style={{textAlign: 'left'}}>Are you sure you want to delete this?</h2>
            <div style={{textAlign: 'left'}}>
              {this.state.targetedInt ? this.renderInteraction(this.state.targetedInt) : null}
            </div>
          </Dialog>
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

          <div
            style={{ paddingTop: 20, paddingBottom: 20, justifyContent: 'center',
              display: 'flex'}}>
              <div style={{display: 'flex', maxWidth: 1050, width: '100%',
                justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{textAlign: 'left'}}>

                  <div style={{fontWeight: 700, fontSize: '40px', paddingBottom: 10,
                    borderBottom: '4px solid #000AB2', display: 'flex', alignItems: 'center'
                  }}>
                  <AvatarIcon style={{height: 60, paddingRight: 15}} color='#484848'/>
                {this.state.member['Full Name'] ? this.state.member['Full Name'] : decodeURIComponent(this.props.url.query.name)}
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
                Member details
              </div>
              <div style={{boxSizing: 'border-box',
              border: '1px solid #DBDBDB', borderRadius: 2}}>
                <ListItem
                  primaryText='Details'
                  leftIcon={<Add/>}
                  initiallyOpen={true}
                  primaryTogglesNestedList={true}
                  nestedItems={
                    [<div>

                        {
                          Object.keys(this.state.member).map((key) => {
                            if (key !== '_id' && key !== 'tags' && typeof this.state.member[key] !== 'object') {
                              return (
                                <div style={{display: 'flex', overflowX: 'hidden', alignItems: 'center',
                                   borderBottom: '1px solid #DBDBDB'}}>
                                  <div style={{flex: 3, padding: '5px 5px 5px 15px', alignItems: 'center'}}>
                                    <b>{key}</b>
                                  </div>
                                  <div style={{flex: 7, padding: 5}}>
                                    <Chip
                                      backgroundColor={randomColor({luminosity: 'light'})}
                                      style={styles.chip}
                                      labelStyle={styles.chipLabel}
                                      >
                                      {this.state.member[key]}
                                    </Chip>

                                  </div>
                                </div>
                              )
                            }
                          })
                        }


                    </div>]

                  }
                   style={{ borderBottom: '1px solid #DBDBDB'}}/>

                   <ListItem
                     primaryText='Tags'
                     leftIcon={<Add/>}
                     initiallyOpen={true}
                     primaryTogglesNestedList={true}
                     nestedItems={
                       [<div>
                         {this.state.memberData && this.state.memberData.tags ? this.state.memberData.tags.map((tag) => (
                           <Link prefetch href={`/tag?tag=${tag}&organisation=${Router.query.organisation}`}>
                         <Chip

                           style={{margin:6, cursor: 'pointer'}}
                           onRequestDelete={() => this.handleDeleteTag(tag)}
                           >{tag}
                         </Chip>
                         </Link>
                       )) : null}
                       </div>,
                       <div style={{padding: 6}}>
                         <RaisedButton label='Add new tag'
                           secondary={true}
                           icon={<Add/>}
                           onClick={() => this.setState({tagOpen: true})}
                           style={buttonStyles.smallStyle}
                           labelStyle={buttonStyles.smallLabel}/>
                       </div>]

                     }

                      style={{ borderBottom: '1px solid #DBDBDB'}}/>

              </div>
            </div>

            <div style={{maxWidth: 700, width: '100%', boxSizing: 'border-box', padding: 20}}>

              <div style={{textAlign: 'left'}}>

                <div style={{padding: '00px 0px'}}>
                  <div style={{fontWeight: 200, fontSize: '20px', paddingBottom: 20}}>
                      Your interactions
                    </div>
                  {
                    this.state.takeNote ?
                    <AddNote
                      handleCancelNote={() => this.setState({takeNote: false})}
                      handleSaveNote={this.handleSaveNote}
                      />


                       :
                       <div >

                       </div>
                  }
                </div>
                {
                  <div>

                    {this.state.interactions.length > 0 ?
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

export default withMui(Member)
