import React from 'react';
import withMui from '../components/hocs/withMui.js';
import App from '../components/App.js';
import Router from 'next/router';
import Link from "next/link"
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
import {buttonStyles, iconButtonStyles} from '../components/styles.jsx';
import AddNote from '../components/addNote.jsx';
import {ReviewIcon, NoteIcon, Tag} from '../components/icons.jsx';
import AddTag from '../components/addTag.jsx';
import Chip from 'material-ui/Chip';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import MoreVert from 'material-ui/svg-icons/navigation/more-vert'
import Delete from 'material-ui/svg-icons/action/delete'
import Close from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton';

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

const styles = {
  chip: {
    margin: 4,
    color: 'white',
    fontWeight: 700,
    borderRadius: 6
  }
}

var randomColor = require('randomcolor')


export class UserTag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {tagOpen: false, interactionUsers: {}}
  }

  updateData = () => {
    db.collection("Interactions")
    .where("tags", "array-contains", Router.query.tag)
    .where("Organisation", "==", Router.query.organisation)
    .orderBy("Date", 'desc').get()
    .then((intSnapshot) => {
      var data = []
      var promises = []
      intSnapshot.forEach((intDoc) => {
        var elem = intDoc.data()
        elem._id = intDoc.id
        data.push(elem)
        if (elem.Members) {
          elem.Members.forEach((member) => {
            promises.push(db.collection("PersonalData").doc(member)
              .get().then((dataDoc) => {
                let userData = dataDoc.data()
                userData.color = randomColor({luminosity: 'light'})
                let interactionUsers = this.state.interactionUsers
                interactionUsers[member] = userData
                this.setState({interactionUsers: interactionUsers})
              })
            )
          })
        }



      })
      Promise.all(promises).then(() => this.setState({membersLoaded: true}))
      this.setState({interactions: data})
    })
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


    handleDeleteInteraction = (int) => {
      db.collection("Interactions").doc(int._id).delete()
      .then(() => {
        this.setState({deleteOpen: false, interactions: []})
        this.updateData()
      })
    }

  handleSaveNote = (note) => {
    var memberIds = []
    console.log('saving note')
    console.log(note)
    this.setState({takeNote: false})
    let data = {
      Organisation: Router.query.organisation,
      Members: this.state.memberIds,
      Date: new Date(),
      Type: 'Note',
      tags: [Router.query.tag],
      Details : {
        Note: note
      }
    }
    console.log(data)
    db.collection("Interactions").add(data)

    .then(() => {
      this.updateData()
    })

  }

  renderInteraction = (int) => {

    switch(int.Type) {

      case "Invited":

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
          <div style={{borderLeft: '3px solid #DBDBDB', backgroundColor: 'rgb(249, 249, 249)', paddingBottom: 10, marginBottom: 10}}>
            <ListItem
              className='email-interaction'
              style={{marginBottom: 5 }}
              rightIcon={<IconButton
                tooltip='Options'
                onClick={(e) => this.handleOptionsClick(e, int)}
                style={iconButtonStyles.button}><MoreVert /></IconButton>}
              primaryText={<span>Received your email: <b>{int.Details ? int.Details.Subject : ""}</b></span>}
              secondaryText={int.Date.toLocaleString('en-gb',
                {weekday: 'long', month: 'long', day: 'numeric'})}
               leftIcon={<Email />} />
             <div style={{paddingLeft: 72, display: 'flex', flexWrap: 'wrap'}}>
               {
                 int.Members && this.state.membersLoaded
                  ? int.Members.map((user) => (
                    <Link  prefetch href={`/member?organisation=${Router.query.organisation}&member=${user}`}>
                       <Chip
                         style={styles.chip}
                         backgroundColor={this.state.interactionUsers[user].color}>
                         {this.state.interactionUsers[user]['Full Name']}
                       </Chip>
                    </Link>
                 ))
                 :
                 null
               }
             </div>
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
          <div
            style={{borderLeft: '3px solid rgb(253,216,53)', backgroundColor: 'rgb(255,249,196)', paddingBottom: 10, marginBottom: 10}}
            >
            <ListItem
              rightIcon={<IconButton
                tooltip='Options'
                onClick={(e) => this.handleOptionsClick(e, int)}
                style={iconButtonStyles.button}><MoreVert /></IconButton>}

              className='email-interaction'
              style={{marginBottom: 10,  backgroundColor: 'rgb(255,249,196)'}}
              primaryText={<div>
                <div className='story-text' dangerouslySetInnerHTML={this.noteMarkup(int.Details ? int.Details.Note : null)}/>
              </div>}
              secondaryText={int.Date.toLocaleString('en-gb',
                {weekday: 'long', month: 'long', day: 'numeric'})}
               leftIcon={<NoteIcon fill={'black'}/>} />
               <div style={{paddingLeft: 72, display: 'flex', flexWrap: 'wrap'}}>
                 {
                   int.Members && this.state.membersLoaded
                    ? int.Members.map((user) => (
                      <Link  prefetch href={`/member?organisation=${Router.query.organisation}&member=${user}`}>
                         <Chip
                           style={styles.chip}
                           backgroundColor={this.state.interactionUsers[user].color}>
                           {this.state.interactionUsers[user]['Full Name']}
                         </Chip>
                      </Link>
                   ))
                   :
                   null
                 }
               </div>
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
        db.collection("PersonalData")
        .where("tags", "array-contains", Router.query.tag)
        .where("organisation", "==", Router.query.organisation)
        .get()
        .then((querySnapshot) => {
            var data = []
            var ids = []
            querySnapshot.forEach((doc) => {
              var elem = doc.data()
              elem._id = doc.id
              data.push(elem)
              ids.push(elem._id)
            })
            console.log(data)
            this.setState({members: data, memberIds: ids})
        })
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
          <Popover
            open={this.state.optionsOpen}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.handleOptionsRequestClose}
          >
            <Menu style={{textAlign: 'left'}}>
              <MenuItem primaryText="Tags"
                onClick={() => this.setState({tagOpen: true, optionsOpen: false,
                  tags: this.state.targetedInt.tags, int: this.state.targetedInt._id})}
                  leftIcon={<Tag style={{height: 25}}/>} />
              <MenuItem
                onClick={() => this.setState({deleteOpen: true, optionsOpen: false})}
                primaryText="Completely delete" leftIcon={<Delete/>} />
              <MenuItem
                onClick={() => this.setState({deleteOpen: true, optionsOpen: false})}
                primaryText="Remove from this tag" leftIcon={<Close/>} />
            </Menu>
          </Popover>
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
                primaryText={<span>Contact everyone in this tag</span>}
                onClick={() => Router.push(`/csv-upload?organisation=${this.state.organisation}`,
                      `/csv-upload/${this.state.organisation}`)}
                leftAvatar={<Avatar backgroundColor={'#FFCB00'} icon={<Email/>}></Avatar>}

              />

            </List>
          </Dialog>


          <AddTag
            selection={[this.state.memberData]}
            text={`Add new tag`}
            organisation={this.props.url.query.organisation}
            open={this.state.tagOpen}
            edit
            type='interaction'
            interaction={this.state.int}
            tags={this.state.tags}
            onTagAdded={this.handleTagAdded}
            onRequestClose={() => this.setState({tagOpen:false})}/>
          <div
            style={{ paddingTop: 20, paddingBottom: 20, justifyContent: 'center',
              fontWeight: 700,
              display: 'flex'}}>
              <div style={{display: 'flex', maxWidth: 1050, width: '100%',
                justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{textAlign: 'left'}}>

              <div style={{fontWeight: 700, fontSize: '40px', paddingBottom: 10,
                borderBottom: '4px solid #000AB2', display: 'flex', alignItems: 'center'
              }}>
                <Tag style={{height: 30, paddingRight: 15}} color='#484848'/>
                {decodeURIComponent(this.props.url.query.tag)}
              </div>
            </div>
            <RaisedButton label='Add new interaction'
              style={buttonStyles.smallSize}
              labelStyle={buttonStyles.smallLabel}
              onClick={() => this.setState({new: true})}
              icon={<Add/>}

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
                  primaryText='Members'

                  initiallyOpen={true}
                  primaryTogglesNestedList={true}
                  nestedItems = {
                    [<div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {this.state.members ? this.state.members.map((member) => (
                      <Link prefetch href={`/member?organisation=${Router.query.organisation}&member=${member._id}`}>
                        <Chip
                          style={styles.chip}

                          backgroundColor={randomColor({luminosity: 'light'})}>
                          {member['Full Name']}
                        </Chip>
                      </Link>
                    )) :
                  null}
                    </div>
                  ]
                  }
                   style={{ borderBottom: '1px solid #DBDBDB'}}/>



              </div>
            </div>

            <div style={{maxWidth: 700,textAlign: 'left',  width: '100%', boxSizing: 'border-box', padding: 20}}>
              <div style={{fontWeight: 200, fontSize: '20px', paddingBottom: 20}}>
                  Key info
                </div>
              <div style={{display: 'flex', padding: 40, backgroundColor: '#DBDBDB',
              marginBottom: 20}}>
                This is going to be summary statistics
              </div>
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
