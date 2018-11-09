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
import OrganisationsIcon from 'material-ui/svg-icons/communication/business';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ArrowRight from 'material-ui/svg-icons/navigation/arrow-forward';
import Divider from 'material-ui/Divider'
import {buttonStyles, iconButtonStyles} from '../components/styles.jsx';
import AddNote from '../components/addNote.jsx';
import {ReviewIcon, NoteIcon, Tag, Pin} from '../components/icons.jsx';
import AddTag from '../components/addTag.jsx';
import Chip from 'material-ui/Chip';
import EventIcon from 'material-ui/svg-icons/action/event';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import Warning from 'material-ui/svg-icons/alert/warning';
import MenuItem from 'material-ui/MenuItem';
import MoreVert from 'material-ui/svg-icons/navigation/more-vert'
import Delete from 'material-ui/svg-icons/action/delete'
import Close from 'material-ui/svg-icons/navigation/close'
import IconButton from 'material-ui/IconButton';

let db = fire.firestore()

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

// a and b are javascript Date objects
function dateDiffInDays(a, b) {
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function convertToReadableTime(days) {
  if (days < 1) {
    return `today`
  }
  else if (days < 2) {
    return '1 day ago'
  }
  else if (days < 7) {
    return `${days} days ago`
  } else if (days < 56) {
    return `${Math.ceil(days/7)} weeks ago`
  } else {
    return `${Math.ceil(days/ 365.25*12)} months ago`
  }
}

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
    borderRadius: 10
  },
  chipLabel: {
    lineHeight: '28px'
  }
}

var randomColor = require('randomcolor')


export class Organisation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {tagOpen: false, interactionUsers: {}}
  }

  updateData = () => {
    this.setState({interactions: [], pinned: []})
    db.collection("Interactions")
    .where("Organisations", "array-contains", Router.query.targetorganisation)
    .where("Pinned", "==", true)
    .orderBy("Date", 'desc').get()
    .then((pinSnapshot) => {
      var pinnedData = this.state.pinned ? this.state.pinned : []
      pinSnapshot.forEach((pinDoc) => {
        var elem = pinDoc.data()
        elem._id = pinDoc.id
        pinnedData.push(elem)
      })
      this.setState({pinned: pinnedData})
    })

    db.collection("Interactions")
    .where("Organisations", "array-contains", Router.query.targetorganisation)
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

    this.setState({takeNote: false})
    let data = {
      Organisation: Router.query.organisation,
      Members: this.state.memberIds,
      Date: new Date(),
      Type: 'Note',
      Organisations: [Router.query.targetorganisation],
      Details : {
        Note: note
      }
    }

    db.collection("Interactions").add(data)

    .then(() => {
      this.updateData()
    })

  }

  renderInteraction = (int) => {

    switch(int.Type) {
      case "Event":
        return (
          <a href={int.Details ? int.Details.url : null}>
            <div
              style={{ borderBottom : '1px solid #DBDBDB'}}
              >
              <ListItem
                id={int._id}
                rightIcon={<IconButton
                  tooltip='Options'
                  onClick={(e) => this.handleOptionsClick(e, int)}
                  style={iconButtonStyles.button}><MoreVert /></IconButton>
                }
                className='email-interaction'

                primaryText={int.Details ? int.Details.name : null}
                primaryTogglesNestedList={true}
                nestedItems={[<div style={{paddingLeft: 72, display: 'flex', flexWrap: 'wrap'}}>
                  {
                    int.Members && this.state.membersLoaded
                     ? int.Members.map((user) => (
                       <Link  prefetch href={`/member?organisation=${Router.query.organisation}&member=${user}`}>
                          <Chip
                            style={styles.chip}
                            backgroundColor={this.state.interactionUsers[user] ? this.state.interactionUsers[user].color : null}>
                             {this.state.interactionUsers[user] ? this.state.interactionUsers['Full Name'] : null}
                          </Chip>
                       </Link>
                    ))
                    :
                    null
                  }
                </div>]}
                secondaryText={int.Date.toLocaleString('en-gb',
                  {weekday: 'long', month: 'long', day: 'numeric'})}
                  leftAvatar={<Avatar
                    backgroundColor={'#e91e63'}
                    icon={<EventIcon /> } />} />

            </div>
          </a>
        )
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
          <div style={{ borderBottom : '1px solid #DBDBDB'}}>
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
                leftAvatar={<Avatar
                  backgroundColor={'#DBDBDB'}
                  icon={<Email /> } />} />
             <div style={{paddingLeft: 72, display: 'flex', flexWrap: 'wrap'}}>
               {
                 int.Members && this.state.membersLoaded
                  ? int.Members.map((user) => (
                    <Link  prefetch href={`/member?organisation=${Router.query.organisation}&member=${user}`}>
                       <Chip
                         style={styles.chip}
                         backgroundColor={this.state.interactionUsers[user].color}>
                         {this.state.interactionUsers[user] ? this.state.interactionUsers['Full Name'] : null}
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
            style={{  borderBottom : '1px solid #DBDBDB'}}
            >
            <ListItem
              id={int._id}
              rightIcon={<IconButton
                tooltip='Options'
                onClick={(e) => this.handleOptionsClick(e, int)}
                style={iconButtonStyles.button}><MoreVert /></IconButton>}
              className='email-interaction'
              primaryText={<div>
                <div className='story-text' dangerouslySetInnerHTML={this.noteMarkup(int.Details ? int.Details.Note : null)}/>
              </div>}
              primaryTogglesNestedList={true}
              nestedItems={[<div style={{paddingLeft: 72, display: 'flex', flexWrap: 'wrap'}}>
                {
                  int.Members && this.state.membersLoaded
                   ? int.Members.map((user) => (
                     <Link  prefetch href={`/member?organisation=${Router.query.organisation}&member=${user}`}>
                        <Chip
                          style={styles.chip}
                          backgroundColor={this.state.interactionUsers[user] ? this.state.interactionUsers[user].color : null}>
                           {this.state.interactionUsers[user] ? this.state.interactionUsers['Full Name'] : null}
                        </Chip>
                     </Link>
                  ))
                  :
                  null
                }
              </div>]}
              secondaryText={int.Date.toLocaleString('en-gb',
                {weekday: 'long', month: 'long', day: 'numeric'})}
                leftAvatar={<Avatar
                  backgroundColor={'rgb(253,216,53)'}
                  icon={<NoteIcon  color={'black'}/> } />}
               />

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
        .where("Organisations", "array-contains", Router.query.targetorganisation)
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
    console.log(this.props.url)
    this.updateData()
  }

  noteMarkup(note) {
    return {__html: note}
  }


  handlePin = () => {
    var newStatus = this.state.targetedInt ? !this.state.targetedInt.Pinned : true
    db.collection("Interactions").doc(this.state.targetedInt._id).update({Pinned: newStatus})
    .then(() => {
      this.setState({optionsOpen: false, interactions: []})
      this.updateData()
    })
  }

  render() {
    return (
      <div>
        <App>
          <div style={{position: 'fixed', zIndex: -1, top: 50, borderRadius: '30% 0 0 90%',
            transform: 'skewX(-10deg)', backgroundColor: '#FFCB00', right: -250,
             width: '30vw', height: '100vw'}}/>
           <div style={{position: 'fixed', zIndex: -1, top: 50, borderRadius: '0 30% 90% 0%',
             transform: 'skewX(-10deg)', backgroundColor: '#FFCB00', left: -250,
              width: '20vw', height: '100vw'}}/>
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
              <MenuItem
                onClick={this.handlePin}
                primaryText={`${this.state.targetedInt && this.state.targetedInt.Pinned ? 'Unpin' : 'Pin'} this`} leftIcon={<Pin/>} />
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
                primaryText={<span>Contact everyone in this organisation</span>}
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
                <OrganisationsIcon style={{height: 30, paddingRight: 15}} color='#484848'/>
                {decodeURIComponent(this.props.url.query.targetorganisation)}
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
                Organisation Members
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

                   <ListItem
                     primaryText='Roles'

                     initiallyOpen={true}
                     primaryTogglesNestedList={true}
                     nestedItems = {
                       [<div>
                           {
                             this.state.members ?
                             this.state.members.map((member) => (
                               member[this.props.url.query.targetorganisation] ?
                               member[this.props.url.query.targetorganisation].map((role) => (
                                 <div style={{display: 'flex', overflowX: 'hidden', alignItems: 'center',
                                    borderBottom: '1px solid #DBDBDB'}}>
                                   <div style={{flex: 3, padding: '5px 5px 5px 15px', alignItems: 'center'}}>
                                     <b>{member['Full Name']}</b>
                                   </div>
                                   <div style={{flex: 7, padding: 5}}>
                                     <Chip
                                       backgroundColor={randomColor({luminosity: 'light'})}
                                       style={styles.chip}
                                       labelStyle={styles.chipLabel}
                                       >
                                       {role}
                                     </Chip>

                                   </div>
                                 </div>
                               ))
                               :
                               null
                             ))
                              : null
                           }
                       </div>]
                     }
                      style={{ borderBottom: '1px solid #DBDBDB'}}/>



              </div>
            </div>

            <div style={{maxWidth: 700,textAlign: 'left',  width: '100%', boxSizing: 'border-box', padding: 20}}>
              <div style={{fontWeight: 200, fontSize: '20px', paddingBottom: 20}}>
                  Last interaction:
                </div>
              <div style={{display: 'flex', padding: 20, textAlign: 'center', width: '100%',
                boxSizing: 'border-box', justifyContent: 'center',
                display: 'flex', alignItems: 'center', color: '#000AB2',
                fontSize: '24px', fontWeight: 700,
              marginBottom: 20}}>
                {this.state.interactions && this.state.interactions[0] ?
                  capitalizeFirstLetter(
                    convertToReadableTime(dateDiffInDays(new Date(this.state.interactions[0].Date), new Date()))
                  ):
                  null
                }
              </div>
              <div style={{textAlign: 'left'}}>

                <div style={{padding: '00px 0px'}}>
                  {this.state.pinned && this.state.pinned.length > 0 ?
                    <div style={{marginBottom: 20}}>
                      <div style={{fontWeight: 200, fontSize: '20px', paddingBottom: 20}}>
                          Important to be aware of
                        </div>
                      {this.state.pinned.map((int) => (
                      this.renderInteraction(int)
                    ))}

                    </div>

                  :
                  null
                }
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
                      int.Pinned ? null : this.renderInteraction(int)
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

export default withMui(Organisation)
