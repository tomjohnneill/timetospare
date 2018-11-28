import React from 'react'
import App from '../components/App.js';
import withMui from '../components/hocs/withMui.js';
import fire from '../fire';
import MediaQuery from 'react-responsive';
import ContentInbox from 'material-ui/svg-icons/content/inbox';
import Email from 'material-ui/svg-icons/communication/email';
import {List, ListItem} from 'material-ui/List';
import OrganisationsIcon from 'material-ui/svg-icons/communication/business';
import Router from 'next/router';
import Link from 'next/link'
import Add from 'material-ui/svg-icons/content/add';
import Avatar from 'material-ui/Avatar';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import ArrowRight from 'material-ui/svg-icons/navigation/arrow-forward';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider'
import {buttonStyles, iconButtonStyles, headerStyles, chipStyles, textFieldStyles} from '../components/styles.jsx';
import AddNote from '../components/addNote.jsx';
import 'react-quill/dist/quill.snow.css';
import Warning from 'material-ui/svg-icons/alert/warning';
import IconButton from 'material-ui/IconButton';
import {ReviewIcon, NoteIcon, AvatarIcon, Tag, Pin} from '../components/icons.jsx';
import AddTag from '../components/addTag.jsx';
import Chip from 'material-ui/Chip';
import * as firebase from 'firebase';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import EventIcon from 'material-ui/svg-icons/action/event';
import MoreVert from 'material-ui/svg-icons/navigation/more-vert'
import Delete from 'material-ui/svg-icons/action/delete'
import Close from 'material-ui/svg-icons/navigation/close'
import OrganisationAutocomplete from '../components/organisation-autocomplete.jsx';

let db = fire.firestore()
var randomColor = require('randomcolor')

let functions = fire.functions('europe-west1')

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


export var classifyIntsByDate = (date, includedSeparators) => {
  var one = new Date()
  var threeMonthsTime = one.setMonth(one.getMonth() + 3)
  var two = new Date()
  var twoMonthsTime = two.setMonth(two.getMonth() + 2)
  var three = new Date()
  var laterThisMonth = three.setMonth(three.getMonth() + 1)
  var four = new Date()
  var twoWeeksTime = four.setDate(four.getDate()+21);
  var five = new Date()
  var nextWeek = five.setDate(five.getDate()+14);
  var six = new Date()
  var laterThisWeek = six.setDate(six.getDate()+7);
  var seven = new Date()
  var tomorrow = new Date(seven.setDate(seven.getDate()+1)).setHours(23,59);
  var eight = new Date()
  var today = eight.setHours(23,59);
  var nine = new Date()
  var yesterday = new Date(nine.setDate(nine.getDate()-1)).setHours(23,59);
  var ten = new Date()
  var twoDaysAgo = new Date(ten.setDate(ten.getDate()-1)).setHours(23,59);
  var eleven = new Date()
  var thisWeek = new Date(eleven.setDate(eleven.getDate()-2)).setHours(23,59);
  var twelve = new Date()
  var lastWeek =  twelve.setDate(twelve.getDate()-7)
  var thirteen = new Date()
  var twoWeeksAgo =  thirteen.setDate(thirteen.getDate()-14)
  var fourteen = new Date()
  var thisMonth = fourteen.setMonth(fourteen.getMonth() - 1)
  var fifteen = new Date()
  var lastMonth = fifteen.setMonth(fifteen.getMonth() - 2)

    if (date > twoMonthsTime) {
      if (includedSeparators.filter(e => e.text === 'Three Months Time').length === 0) {
        includedSeparators.push({text: 'Three Months Time', Date: threeMonthsTime, Type : 'classifier'})
      }
    } else if (date > laterThisMonth) {
      if (includedSeparators.filter(e => e.text === 'Two Months Time').length === 0) {
        includedSeparators.push({text: 'Two Months Time', Date: twoMonthsTime, Type : 'classifier'})
      }
    } else if (date > twoWeeksTime) {
      if (includedSeparators.filter(e => e.text === 'Later This Month').length === 0) {
        includedSeparators.push({text: 'Later This Month', Date: laterThisMonth, Type : 'classifier'})
      }
    } else if (date > nextWeek) {
      if (includedSeparators.filter(e => e.text === 'Two Weeks Time').length === 0) {
        includedSeparators.push({text: 'Two Weeks Time', Date: twoWeeksTime, Type : 'classifier'})
      }
    } else if (date > laterThisWeek) {
      if (includedSeparators.filter(e => e.text === 'Next Week').length === 0) {
        includedSeparators.push({text: 'Next Week', Date: nextWeek, Type : 'classifier'})
      }
    } else if (date > tomorrow) {
      if (includedSeparators.filter(e => e.text === 'Later This Week').length === 0) {
        includedSeparators.push({text: 'Later This Week', Date: laterThisWeek, Type : 'classifier'})
      }
    } else if (date > today) {
      if (includedSeparators.filter(e => e.text === 'Tomorrow').length === 0) {
        includedSeparators.push({text: 'Tomorrow', Date: tomorrow, Type : 'classifier'})
      }
    } else if (date > yesterday) {
      if (includedSeparators.filter(e => e.text === 'Today').length === 0) {
        includedSeparators.push({text: 'Today', Date: today, Type : 'classifier'})
      }
    } else if (date > twoDaysAgo) {
      if (includedSeparators.filter(e => e.text === 'Yesterday').length === 0) {
        includedSeparators.push({text: 'Yesterday', Date: yesterday, Type : 'classifier'})
      }
    } else if (date > thisWeek) {
      if (includedSeparators.filter(e => e.text === 'Two Days Ago').length === 0) {
        includedSeparators.push({text: 'Two Days Ago', Date: twoDaysAgo, Type : 'classifier'})
      }
    } else if (date > lastWeek) {
      if (includedSeparators.filter(e => e.text === 'Earlier This Week').length === 0) {
        includedSeparators.push({text: 'Earlier This Week', Date: twoDaysAgo, Type : 'classifier'})
      }
    } else if (date > twoWeeksAgo) {
      if (includedSeparators.filter(e => e.text === 'Last Week').length === 0) {
        includedSeparators.push({text: 'Last Week', Date: lastWeek, Type : 'classifier'})
      }
    } else if (date > thisMonth) {
      if (includedSeparators.filter(e => e.text === 'Two Weeks Ago').length === 0) {
        includedSeparators.push({text: 'Two Weeks Ago', Date: lastWeek, Type : 'classifier'})
      }
    } else if (date > lastMonth) {
      if (includedSeparators.filter(e => e.text === 'Earlier This Month').length === 0) {
        includedSeparators.push({text: 'Earlier This Month', Date: lastWeek, Type : 'classifier'})
      }
    }
}

export var runThroughInts = (ints) => {
  var includedSeparators = []
  ints.forEach((int) => {
    classifyIntsByDate(int.Date, includedSeparators)
  })
  console.log(ints)
  console.log(includedSeparators)
  ints = ints.concat(includedSeparators)
  return ints.sort((a,b) => (a.Date > b.Date) ? -1 : ((b.Date > a.Date) ? 1 : 0))
}

export class Member extends React.Component {
  constructor(props) {
    super(props);
    this.state = {member: {}, interactions: [], note: '', memberData: {}}
    if (typeof window !== 'undefined') {
      this.ReactQuill = require('react-quill')
    }
  }

  addOneOrg = (data, index, details) => {
    console.log(data)
    var body = {
      MemberName: {
        [Router.query.member] : this.state.member['Full Name']
      },
      Members: [Router.query.member],
      OrgNames: {
        [data._id] : data.name
      },
      Organisations: [data._id]
    }

    db.collection("Relationships").add(body)


  }

  updateData = () => {
    if (localStorage.getItem('sample') == "true") {
      var data = []
      var corsRequest = functions.httpsCallable('integrations-wrapCors');
      var teams = {}
      corsRequest({url: 'https://fantasy.premierleague.com/drf/teams/'})
      .then(teamData => {
        teamData.data.forEach((team) => {
          teams[team.id] = team.name
        })
      })
      .then(() => corsRequest({url: 'https://fantasy.premierleague.com/drf/fixtures/'}))
      .then(responseData => {

        var data = []
        responseData.data.forEach((fixture) => {
          if (fixture.team_a === parseInt(Router.query.team) || fixture.team_h === parseInt(Router.query.team)) {
            data.push({
              Date: fixture.kickoff_time,
              Type: 'Event',
              Details: {
                name: `${teams[fixture.team_h]} v ${teams[fixture.team_a]}`
              }
            })
          }
        })

        this.setState({interactions: data})
      })
    } else {




      db.collection("PersonalData").doc(Router.query.member).get()
      .then((doc) => {
        var elem = doc.data()
        elem._id = doc.id
        const rawData = Object.create(elem)
        delete rawData.managedBy
        delete rawData.User
        delete rawData.lastContacted
        this.setState({memberData: rawData, member: elem})
      })
    }


  }

  componentWillUnmount(props) {
    this.unsubscribe()
  }

  componentDidMount(props) {
    if (localStorage.getItem('sample') == 'true') {
      var corsRequest = functions.httpsCallable('integrations-wrapCors');
      var teams = {}
      var data = []
      corsRequest({url: 'https://fantasy.premierleague.com/drf/teams/'})
      .then(teamData => {
        teamData.data.forEach((team) => {
          if (team.id == Router.query.team) {
            var teamData = {
              Organisations: [{
                name: team.name,
                _id: team.id
              }]
            }

            this.setState({memberData: teamData})
          }
        })
      })
    } else {
      this.unsubscribe = db.collection("Interactions")
      .where("Members", "array-contains", Router.query.member)
      .where("Organisation", "==", Router.query.view)
      .orderBy("Date", 'desc')
      .onSnapshot({ includeMetadataChanges: true }, (intSnapshot) => {
        var data = []
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

        delete rawData.managedBy
        delete rawData.User
        delete rawData.lastContacted

        this.setState({memberData: rawData})
        this.setState({member: elem})
        return elem
      })
      .then((person) => db.collection("Relationships")
          .where('Members', "array-contains", person._id).get())
      .then((querySnapshot) => {
        var relArray = []
        querySnapshot.forEach((relDoc) => {
          var item = relDoc.data()
          item._id = relDoc.id
          relArray.push(item)
        })
        this.setState({relationships: relArray})
      })

    }
    this.updateData()
  }

  noteMarkup(note) {
    return {__html: note}
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

  renderInteraction = (int) => {

    switch(int.Type) {
      case "Event":
        return (

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

                primaryText={int.Details ?
                  <Link prefetch href={`/project-admin?project=${int._id}&view=${Router.query.view}`}>
                    {int.Details.name}
                  </Link>
                   : null}
                primaryTogglesNestedList={true}
                secondaryText={new Date(int.Date).toLocaleString('en-gb',
                  {weekday: 'long', month: 'long', day: 'numeric'})}
                  leftAvatar={

                      <Avatar
                      backgroundColor={'#e91e63'}
                      icon={
                        <Link prefetch href={`/project-admin?project=${int._id}&view=${Router.query.view}`}>
                        <EventIcon color='white'/>
                      </Link> } />

                }
                 />
            </div>

        )
      case "Invited":

        return (
          <div>
            <ListItem
              id={int._id}
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
              id={int._id}
              className='email-interaction'
              style={{ borderBottom : '1px solid #DBDBDB'}}
              primaryText={<span>Received your email: <b>{int.Details ? int.Details.Subject : ""}</b></span>}
              rightIcon={<IconButton
                tooltip='Options'
                onClick={(e) => this.handleOptionsClick(e, int)}
                style={iconButtonStyles.button}><MoreVert /></IconButton>}
              secondaryText={int.Date.toLocaleString('en-gb',
                {weekday: 'long', month: 'long', day: 'numeric'})}
                leftAvatar={<Avatar
                  backgroundColor={'#DBDBDB'}
                  icon={<Email /> } />}
                   />
          </div>
        )
        break;
      case "Reply":
        return (
          <div>
            <ListItem
              id={int._id}
              rightIcon={<IconButton
                tooltip='Options'
                onClick={(e) => this.handleOptionsClick(e, int)}
                style={iconButtonStyles.button}><MoreVert /></IconButton>}
              className='email-interaction'
                style={{ borderBottom : '1px solid #DBDBDB'}}
              primaryText={<span>Replied to your email: <b>{int.Details ? int.Details.Subject : ""}</b>
            <div className='story-text' dangerouslySetInnerHTML={this.noteMarkup(int.Details ? int.Details.Message : null)}/>
        </span>}
              secondaryText={int.Date.toLocaleString('en-gb',
                {weekday: 'long', month: 'long', day: 'numeric'})}

                leftAvatar={<Avatar
                  backgroundColor={'#DBDBDB'}
                  icon={<Email /> } />}
                  />

          </div>
        )
        break;
      case "Note":
        return (
          <div>
            <ListItem
              id={int._id}
              className='email-interaction'
              style={{  borderBottom : '1px solid #DBDBDB'}}
              primaryText={<div>
                <div className='story-text' dangerouslySetInnerHTML={this.noteMarkup(int.Details ? int.Details.Note : null)}/>
              </div>}
              rightIcon={<IconButton
                tooltip='Options'
                onClick={(e) => this.handleOptionsClick(e, int)}
                style={iconButtonStyles.button}><MoreVert /></IconButton>}
              secondaryText={int.Date.toLocaleString('en-gb',
                {weekday: 'long', month: 'long', day: 'numeric'})}
              leftAvatar={<Avatar
                backgroundColor={'rgb(253,216,53)'}
                icon={<NoteIcon  color={'black'}/> } />}

                  />
          </div>
        )
        case "classifier":
          return (
            <div style={{borderBottom: '1px solid black', fontWeight: 700 ,paddingBottom: 5, paddingTop:20}}>
              {int.text}
            </div>
          )
        break;
      default:
        return (
          <ListItem primaryText="Other"
            id={int._id}
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
      Organisation: Router.query.view,
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
    if (localStorage.getItem('sample') == "true") {
      if (this.state.interactions.includes(int)) {
        var position = this.state.interactions.indexOf(int)
        var ints = this.state.interactions
        ints.splice(position, 1)
        this.setState({interactions: ints})
      } else {
        var position = this.state.pinned.indexOf(int)
        var ints = this.state.pinned
        ints.splice(position, 1)
        this.setState({pinned: ints})
      }
      this.setState({deleteOpen: false})
    } else {
      db.collection("Interactions").doc(int._id).delete()
      .then(() => {
        this.setState({deleteOpen: false})
      })
    }

  }


  handlePin = (int) => {
    if (localStorage.getItem('sample') == "true") {
      var position = this.state.interactions.indexOf(int)
      var interactions = this.state.interactions
      var pinned = this.state.pinned ? this.state.pinned : []
      pinned.push(int)
      interactions.splice(position, 1)
      this.setState({interactions: interactions, pinned: pinned})
    } else {
      db.collection("Interactions").doc(this.state.targetedInt._id).update({Pinned: true})
    }
  }

  render() {
    const ReactQuill = this.ReactQuill
    return (
      <div>
        <div style={{position: 'fixed', zIndex: -1, top: 50, borderRadius: '30% 0 0 90%',
          transform: 'skewX(-10deg)', backgroundColor: '#FFCB00', right: -250,
           width: '30vw', height: '100vw'}}/>
         <div style={{position: 'fixed', zIndex: -1, top: 50, borderRadius: '0 30% 90% 0%',
           transform: 'skewX(-10deg)', backgroundColor: '#FFCB00', left: -250,
            width: '20vw', height: '100vw'}}/>
        <App>
          <Dialog
            actions={
              <RaisedButton
                label='Confirm'
                primary={true}
                onClick={() => this.setState({addOrgOpen: false})}
                labelStyle={buttonStyles.smallLabel}
                style={buttonStyles.smallSize}/>
            }
            open={this.state.addOrgOpen}
            onRequestClose={() => this.setState({addOrgOpen: false})}>
            <div style={headerStyles.desktop}>
              Select organisation or add new
            </div>
            <div>




              <div style={{display: 'flex', alignItems: 'center', paddingBottom: 20}}>
                <div style={{width: 20, paddingRight: 20}}>
                  <OrganisationsIcon style={{height: 30, paddingRight: 15}} color='#484848'/>
                </div>
                <div style={{flex: 1}}>
                  <OrganisationAutocomplete
                    handleNewRequest={this.addOneOrg}
                    org={this.props.url.query.view}/>
                </div>
              </div>

              <div style={{display: 'flex', alignItems: 'center', paddingBottom: 20}}>
                <div style={{width: 20, paddingRight: 20}}>
                  OI
                </div>
                <div style={{flex: 1}}>
                  <TextField
                    hintText={'What is their role?'}
                    underlineShow={false}
                    fullWidth={true}
                    style={textFieldStyles.style}
                    inputStyle={textFieldStyles.input}
                    hintStyle={textFieldStyles.hint}
                    />
                </div>
              </div>
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
              <MenuItem primaryText="Tags" onClick={() => alert('work in progress')}
                  leftIcon={<Tag style={{height: 25}}/>} />
              <MenuItem
                onClick={() => this.setState({deleteOpen: true, optionsOpen: false})}
                primaryText="Completely delete" leftIcon={<Delete/>} />
              <MenuItem
                onClick={() => this.setState({deleteOpen: true, optionsOpen: false})}
                primaryText="Remove from this member" leftIcon={<Close/>} />
              <MenuItem
                onClick={() => this.handlePin(this.state.targetedInt)}
                primaryText="Pin this" leftIcon={<Pin/>} />
            </Menu>
          </Popover>
          <AddTag
            selection={[this.state.memberData]}
            text={`Tag ${decodeURIComponent(this.props.url.query.name)}`}
            organisation={this.props.url.query.view}
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
            <h2 style={headerStyles.desktop}>Are you sure you want to delete this?</h2>
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
                      `/messaging/${this.state.organisation}`)}
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

                  <div style={{fontWeight: 200, fontSize: '40px', paddingBottom: 10, textTransform: 'capitalize',
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

                                      style={chipStyles.chip}
                                      labelStyle={chipStyles.chipLabel}
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
                     primaryText='Organisations'
                     leftIcon={<Add/>}
                     initiallyOpen={true}
                     primaryTogglesNestedList={true}
                     nestedItems={
                       [<div style={{display: 'flex', flexWrap: 'wrap', padding: 10}}>
                         {this.state.relationships && (typeof window !== 'undefined' && localStorage.getItem('sample') != 'true') ?
                           this.state.relationships.map((rel) => (
                             rel.OrgNames && Object.keys(rel.OrgNames).map((key) => (
                               <Link prefetch href={`/organisation?targetorganisation=${key}&view=${Router.query.view}`}>
                                 <Chip
                                   backgroundColor={randomColor({luminosity: 'light'})}
                                   style={chipStyles.chip}
                                   labelStyle={chipStyles.chipLabel}
                                   deleteIconStyle={chipStyles.deleteStyle}
                                   onRequestDelete={() => this.handleDeleteTag(tag)}
                                   >{rel.OrgNames[key].toString()}
                                 </Chip>
                               </Link>
                             ))

                       )) : (typeof window !== 'undefined' && localStorage.getItem('sample') == 'true' && this.state.memberData && this.state.memberData.Organisations && this.state.memberData.Organisations.length > 0) ?

                       this.state.memberData.Organisations.map((tag) => (
                       <Link prefetch href={`/organisation?targetorganisation=${tag.name}&team=${tag._id}&view=${Router.query.view}`}>
                         <Chip

                           style={chipStyles.chip}
                           labelStyle={chipStyles.chipLabel}
                           deleteIconStyle={chipStyles.deleteStyle}
                           onRequestDelete={() => this.handleDeleteTag(tag)}
                           >{tag.name}
                         </Chip>
                         </Link>
                       ))
                       :
                       null
                     }
                       </div>,
                       <div style={{padding: 6}}>
                         <RaisedButton label='Add new organisation'
                           primary={true}

                           icon={<Add/>}
                           onClick={() => this.setState({addOrgOpen: true})}
                           style={buttonStyles.smallStyle}
                           labelStyle={buttonStyles.smallLabel}/>
                       </div>]

                     }
                      style={{ borderBottom: '1px solid #DBDBDB'}}/>
                   <ListItem
                     primaryText='Tags'
                     leftIcon={<Add/>}
                     primaryTogglesNestedList={true}
                     nestedItems={
                       [<div style={{display: 'flex', flexWrap: 'wrap', padding: 10}}>
                         {this.state.memberData && this.state.memberData.tags ? this.state.memberData.tags.map((tag) => (
                           <Link prefetch href={`/tag?tag=${tag}&view=${Router.query.view}`}>
                         <Chip
                           style={chipStyles.chip}
                           labelStyle={chipStyles.chipLabel}
                           deleteIconStyle={chipStyles.deleteStyle}
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
                  {this.state.pinned && this.state.pinned.length > 0 ?
                    <div style={{marginBottom: 20}}>
                      <div style={{fontWeight: 200, fontSize: '20px', paddingBottom: 20}}>
                          Important info
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


                    {this.state.interactions.length > 0 ?
                      runThroughInts(this.state.interactions).map((int) => (
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

export default withMui(Member)
