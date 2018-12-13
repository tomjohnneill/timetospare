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
import {buttonStyles, iconButtonStyles, chipStyles} from '../components/styles.jsx';
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
import * as firebase from 'firebase';
import Close from 'material-ui/svg-icons/navigation/close'
import Interaction from '../components/interaction.jsx';
import IconButton from 'material-ui/IconButton';
import {classifyIntsByDate, runThroughInts} from './member.jsx'
import Lock from 'material-ui/svg-icons/action/lock';
import LockOpen from 'material-ui/svg-icons/action/lock-open';

let db = fire.firestore()

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

let functions = fire.functions('europe-west1')

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
    this.state = {tagOpen: false, interactionUsers: {}, adminMap: {}, privateDocs : {}}
  }

  componentWillUnmount(props) {
    this.unsubscribe()
  }

  updateData = () => {
    if (localStorage.getItem('sample') == 'true') {
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
              Date: new Date(fixture.kickoff_time),
              Type: 'Event',
              Details: {
                name: `${teams[fixture.team_h]} v ${teams[fixture.team_a]}`
              }
            })
          }
        })
        if (this.state.interactions) {

          var ints = this.state.interactions.concat(data)
          ints = ints.sort(function(a, b) {
              a = new Date(a.Date);
              b = new Date(b.Date);
              return a>b ? -1 : a<b ? 1 : 0;
          });
          this.setState({interactions: ints})
        } else {

          this.setState({interactions: data})
        }

      })
    } else {
      this.setState({interactions: [], pinned: []})


      this.unsubscribe = db.collection("Interactions")
      .where("Organisations", "array-contains", Router.query.targetorganisation)
      .where("managedBy", "==", Router.query.view)
      .orderBy("Date", 'desc').onSnapshot(
        (intSnapshot) => {
        var data = []
        var promises = []
        intSnapshot.forEach((intDoc) => {
          var elem = intDoc.data()
          elem._id = intDoc.id
          data.push(elem)
          if (elem.Private && elem.Creator == fire.auth().currentUser.uid) {
            db.collection("Private").doc(elem._id).get().then((privateDoc) => {
              var privateDocs = this.state.privateDocs ? this.state.privateDocs : {}
              privateDocs[elem._id] = privateDoc.data()
              this.setState({privateDocs: privateDocs})
            })
          }
          if (elem.Creator && !this.state.adminMap[elem.Creator]) {
            db.collection("PersonalData").where("managedBy", "==", Router.query.view)
            .where("User", "==", elem.Creator).get()
            .then((adminSnapshot) => {
              adminSnapshot.forEach((adminDoc) => {
                var adminData = adminDoc.data()
                console.log(adminData)
                var adminMap = this.state.adminMap ? this.state.adminMap : {}
                adminMap[elem.Creator] = adminData['Full Name'] ? adminData['Full Name'] : adminData['Name']
                this.setState({adminMap: adminMap})
              })
            })
          }
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
      managedBy: Router.query.view,
      Creator: fire.auth().currentUser.uid,
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


  componentDidMount(props) {
    fire.auth().onAuthStateChanged((user) => {
      if (user === null) {

      }
      else if (localStorage.getItem('sample') == "true") {
        var data = []
        var news = []
        var corsRequest = functions.httpsCallable('integrations-wrapCors');
        corsRequest({url: 'https://fantasy.premierleague.com/drf/elements/'})
        .then(responseData => {

          responseData.data.forEach((player) => {
            if (player.team === parseInt(Router.query.team)) {

              if (player.news_added != 'null' && player.news.length > 0) {
                news.push({
                  Type: 'Note',
                  Date: new Date(player.news_added),
                  Details: {
                    Note: player.news
                  }
                })


              }

              data.push({
                '_id': player.id,
                'Full Name': player.first_name + ' ' + player.second_name,
                'Team': player.team
              })
            }
          })
          if (this.state.interactions) {
            var ints = this.state.interactions.concat(news)
            ints = ints.sort(function(a, b) {
                a = new Date(a.Date);
                b = new Date(b.Date);
                return a>b ? -1 : a<b ? 1 : 0;
            });
            this.setState({interactions: ints})
          } else {
            this.setState({interactions: news})
          }
          this.setState({members: data})
        })
      }
      else {
        db.collection("OrgData").doc(Router.query.targetorganisation).get()
        .then((doc) => {
          var data = doc.data()
          data._id = doc.id
          this.setState({organisation: data})
        })

        db.collection("Relationships")
        .where("managedBy" , "==", Router.query.view)
        .where("Organisations." + Router.query.targetorganisation, "==", true)
        .get()
        .then((querySnapshot) => {
            var data = []
            var ids = []
            querySnapshot.forEach((doc) => {
              var elem = doc.data()

              if (elem.MemberName) {
                console.log(elem.MemberName)
                Object.keys(elem.MemberName).forEach((key) => {
                  console.log(key)
                  var user = {}
                  user._id = elem.Member
                  user.relId = doc.id
                  user.orgNames = elem.OrgNames
                  user['Full Name'] = elem.MemberName[key]
                  data.push(user)
                })
              }

              if (elem.RoleMap && elem.OrgNames) {
                var orgRoleMap = this.state.orgRoleMap ? this.state.orgRoleMap : {}
                Object.keys(elem.RoleMap).forEach((roleName) => {
                  if (elem.RoleMap[roleName] == elem.OrgNames[Router.query.targetorganisation]) {
                    var usersInRole = orgRoleMap[roleName] ? orgRoleMap[roleName] : []
                    usersInRole.push({_id: elem.Member, name: elem.MemberName})
                    orgRoleMap[roleName] = usersInRole
                  }
                })
                this.setState({orgRoleMap : orgRoleMap})
              }
            })

            this.setState({members: data})
        })
      }
    })

    this.updateData()
  }

  noteMarkup(note) {
    return {__html: note}
  }


  handlePin = () => {
    this.setState({optionsOpen: false})
    var newStatus = this.state.targetedInt ? !this.state.targetedInt.Pinned : true
    db.collection("Interactions").doc(this.state.targetedInt._id).update({Pinned: newStatus})

  }

  handleMakePrivate = () => {
    if (!this.state.targetedInt.Private && fire.auth().currentUser) {
      db.collection("Private").doc(this.state.targetedInt._id).set({
        details: this.state.targetedInt.Details,
        creator: fire.auth().currentUser.uid
      }).then(() => {
        return db.collection("Interactions").doc(this.state.targetedInt._id)
        .update({Private: true, Details: {}})
      }).then(() => {
        this.setState({optionsOpen: false})
      })
    } else if (this.state.targetedInt.Private && fire.auth().currentUser) {
      db.collection("Private").doc(this.state.targetedInt._id).get()
      .then((doc) => {
        return doc.data().details
      })
      .then((details) => {
        db.collection("Interactions").doc(this.state.targetedInt._id).update({
          Details: details,
          Private: false
        })
      }).then(() => {
        this.setState({optionsOpen: false})
      })
    }
  }

  handleDeleteOrg = (memberId, relId, orgNames) => {
    delete orgNames[this.state.organisation.details.name]
    db.collection("Relationships").doc(relId).update({OrgNames : orgNames, ['Organisations.' + Router.query.targetorganisation] : false})
    .then(() => {
      this.updateData()
    })
    db.collection("PersonalData").doc(memberId).update("organisations", firebase.firestore.FieldValue.arrayRemove(this.state.organisation.details.name))
  }

  handleTagAdded = (tag) => {
    var tags = this.state.organisation.tags
    var organisation = this.state.organisation
    if (tags) {
      tags.push(tag)
    }
    organisation.tags = tags
    this.setState({organisation: organisation, tagOpen: false})
    this.updateData()
  }

  render() {
    var pinned = []
    if (this.state.interactions) {
      this.state.interactions.forEach((int) => {
        if (int.Pinned) {
          pinned.push(int)
        }
      })
    }

    console.log(this.state)
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
              {this.state.targetedInt ? <Interaction interaction={this.state.targetedInt}/> : null}
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
                onClick={() => this.setState({intTagOpen: true, optionsOpen: false,
                  tags: this.state.targetedInt.tags, int: this.state.targetedInt._id})}
                  leftIcon={<Tag style={{height: 25}}/>} />
              <MenuItem
                onClick={() => this.setState({deleteOpen: true, optionsOpen: false})}
                primaryText="Completely delete" leftIcon={<Delete/>} />
              <MenuItem
                onClick={() => this.setState({deleteOpen: true, optionsOpen: false})}
                primaryText="Remove from this organisation" leftIcon={<Close/>} />
                {
                  this.state.targetedInt && this.state.targetedInt.Creator === fire.auth().currentUser.uid ?
                  <MenuItem
                    onClick={this.handleMakePrivate}
                    primaryText={`Make ${this.state.targetedInt && this.state.targetedInt.Private ? 'Public' : 'Private'}`}
                    leftIcon={this.state.targetedInt && this.state.targetedInt.Private ? <LockOpen/> : <Lock/>} />
                  :
                  null
                }
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
                primaryText="Add event"
                onClick={() => Router.push(`/projectedit?view=${this.state.organisation._id}`)}
                leftAvatar={<Avatar  icon={<EventIcon/>}></Avatar>}
              />


            </List>
          </Dialog>


          <AddTag
            selection={this.state.organisation}
            text={`Add new tag`}
            organisation={this.props.url.query.view}
            open={this.state.intTagOpen}
            edit
            type='interaction'
            interaction={this.state.int}
            onTagAdded={this.handleTagAdded}
            onRequestClose={() => this.setState({intTagOpen:false})}/>

          <AddTag
            selection={this.state.organisation}
            text={`Add new tag`}
            organisation={this.props.url.query.view}
            open={this.state.tagOpen}
            edit
            type='organisation'
            interaction={this.state.int}
            tags={this.state.organisation && this.state.organisation.tags}
            onTagAdded={this.handleTagAdded}
            onRequestClose={() => this.setState({tagOpen:false})}/>
          <div
            style={{ paddingTop: 20, paddingBottom: 20, justifyContent: 'center',
              fontWeight: 700,
              display: 'flex'}}>
              <div style={{display: 'flex', maxWidth: 1050, width: '100%',
                justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{textAlign: 'left'}}>

              <div style={{fontWeight: 200, fontSize: '40px', paddingBottom: 10,
                textTransform: 'capitalize',
                borderBottom: '4px solid #000AB2', display: 'flex', alignItems: 'center'
              }}>
                <OrganisationsIcon style={{height: 30, paddingRight: 15}} color='#484848'/>
                  {this.state.organisation && this.state.organisation.details && this.state.organisation.details.name}
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
                    [<div style={{display: 'flex', flexWrap: 'wrap', padding: 10, textTransform: 'capitalize'}}>
                    {this.state.members ? this.state.members.map((member) => (
                      <Link prefetch href={localStorage.getItem('sample') == 'true' ?
                        `/member?view=${Router.query.view}&member=${member._id}&team=${member.Team}&name=${member['Full Name']}`
                        :
                        `/member?view=${Router.query.view}&member=${member._id}`}>
                        <Chip
                          key={member._id}
                          style={chipStyles.chip}
                          deleteIconStyle={chipStyles.deleteStyle}
                          onRequestDelete={() => this.handleDeleteOrg(member._id, member.relId, member.orgNames)}
                          labelStyle={chipStyles.chipLabel}
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
                             this.state.orgRoleMap ?
                             Object.keys(this.state.orgRoleMap).map((roleName) => (
                               <div style={{display: 'flex', overflowX: 'hidden', alignItems: 'center',
                                  borderBottom: '1px solid #DBDBDB'}}>
                                 <div style={{flex: 3, padding: '5px 5px 5px 15px', alignItems: 'center'}}>
                                   <b>{roleName}</b>
                                 </div>

                                 <div style={{flex: 7, padding: 5, flexWrap: 'wrap'}}>
                                   {
                                     this.state.orgRoleMap[roleName].map((member) => (
                                       <Link href={`/member?view=${Router.query.view}&member=${member._id}`}>
                                         <Chip
                                           style={chipStyles.chip}
                                           labelStyle={chipStyles.chipLabel}
                                           >
                                           {member.name}
                                         </Chip>
                                       </Link>
                                     ))
                                   }


                                 </div>
                               </div>
                             ))
                              : null
                           }
                       </div>]
                     }
                      style={{ borderBottom: '1px solid #DBDBDB'}}/>

                      <ListItem
                        primaryText='Tags'
                        leftIcon={<Tag/>}
                        primaryTogglesNestedList={true}
                        nestedItems={
                          [<div style={{display: 'flex', flexWrap: 'wrap', padding: 10}}>
                            {this.state.organisation && this.state.organisation.tags ? this.state.organisation.tags.map((tag) => (
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
                  {pinned && pinned.length > 0 ?
                    <div style={{marginBottom: 20}}>
                      <div style={{fontWeight: 200, fontSize: '20px', paddingBottom: 20}}>
                          Important to be aware of
                        </div>
                      {pinned.map((int) => (
                        <Interaction
                          interaction={int}
                          handleOptionsClick={this.handleOptionsClick}/>

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
                      runThroughInts(this.state.interactions).map((int) => (
                      int.Pinned ? null :
                      <Interaction
                        interaction={int}
                        handleOptionsClick={this.handleOptionsClick}/>
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
