import React from 'react';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import FlatButton from 'material-ui/FlatButton';
import {buttonStyles, iconButtonStyles, chipStyles} from '../components/styles.jsx';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import Link from 'next/link';
import Chip from 'material-ui/Chip';
import Router from 'next/router'
import {ListItem, List} from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import Avatar from 'material-ui/Avatar';
import fire from '../fire.js';
import IconButton from 'material-ui/IconButton';
import MoreVert from 'material-ui/svg-icons/navigation/more-vert'
import Email from 'material-ui/svg-icons/communication/email';
import EventIcon from 'material-ui/svg-icons/action/event';
import {ReviewIcon, NoteIcon, Tag, Pin} from '../components/icons.jsx';

let db = fire.firestore()
var randomColor = require('randomcolor')

export default class Interaction extends React.Component {
  constructor(props) {
    super(props)
    this.state = {adminMap: {}, interactionUsers: {}}
    console.log(this.props)
  }

  componentDidMount(props) {
    var elem = this.props.interaction
    var promises = []
    if (elem.Private && elem.Creator == fire.auth().currentUser.uid) {
      db.collection("Private").doc(elem._id).get().then((privateDoc) => {
        var privateDocs = this.state.privateDocs ? this.state.privateDocs : {}
        privateDocs[elem._id] = privateDoc.data()
        this.setState({privateDocs: privateDocs})
      })
    }
    if (elem.Creator && !this.state.adminMap[elem.Creator]) {
      db.collection("PersonalData").where("managedBy", "==", localStorage.getItem('ttsOrg'))
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
    Promise.all(promises).then(() => this.setState({membersLoaded: true}))
  }

  renderInteraction = (int) => {

    switch(int.Type) {
      case "Event":
        return (
          <Link prefetch href={`/project-admin?project=${int._id}&view=${localStorage.getItem('ttsOrg')}`}>
            <div
              style={{ borderBottom : '1px solid #DBDBDB'}}
              >
              <ListItem
                id={int._id}
                rightIcon={<IconButton
                  tooltip='Options'
                  onClick={(e) => this.props.handleOptionsClick(e, int)}
                  style={iconButtonStyles.button}><MoreVert /></IconButton>
                }
                className='email-interaction'

                primaryText={int.Details ? int.Details.name : null}
                primaryTogglesNestedList={true}
                nestedItems={[
                  <div>
                    <p>Involving:</p>
                    <div style={{paddingLeft: 72, display: 'flex', flexWrap: 'wrap'}}>
                    {
                      int.Members && this.state.membersLoaded
                       ? int.Members.map((user) => (
                         <Link
                           key={user._id}
                            prefetch href={`/member?view=${localStorage.getItem('ttsOrg')}&member=${user}`}>
                            <div style={{margin: 4, textTransform: 'capitalize'}}>
                              <Chip
                                style={chipStyles.chip}
                                labelStyle={chipStyles.chipLabel}
                                backgroundColor={this.state.interactionUsers && this.state.interactionUsers[user] ? this.state.interactionUsers[user].color : null}>
                                {this.state.interactionUsers[user] && this.state.interactionUsers[user]['Full Name']
                                   ? this.state.interactionUsers[user]['Full Name'][0] : null}
                              </Chip>
                          </div>
                         </Link>
                      ))
                      :
                      null
                    }
                    {
                      int.Creator && this.state.adminMap && this.state.adminMap[int.Creator]
                       ?

                        <Chip
                          style={chipStyles.chip}
                          labelStyle={chipStyles.chipLabel}
                          >
                           {this.state.adminMap[int.Creator]}
                        </Chip>

                      :
                      null
                    }
                  </div>
                </div>]}
                secondaryText={int.Date.toLocaleString('en-gb',
                  {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'})}
                  leftAvatar={<Avatar
                  backgroundColor={'#e91e63'}
                  icon={
                    <Link prefetch href={`/project-admin?project=${int._id}&view=${localStorage.getItem('ttsOrg')}`}>
                    <EventIcon color='white'/>
                  </Link> } />
                  } />

            </div>
          </Link>
        )
        case "CalendarEvent":
          return (
            <Link prefetch href={`/project-admin?project=${int._id}&view=${localStorage.getItem('ttsOrg')}`}>
              <div
                style={{ borderBottom : '1px solid #DBDBDB'}}
                >
                <ListItem
                  id={int._id}
                  rightIcon={<IconButton
                    tooltip='Options'
                    onClick={(e) => this.props.handleOptionsClick(e, int)}
                    style={iconButtonStyles.button}><MoreVert /></IconButton>
                  }
                  className='email-interaction'
                  primaryText={int.Details ? int.Details.Subject : null}
                  primaryTogglesNestedList={true}
                  nestedItems={[<div style={{paddingLeft: 72, display: 'flex', flexWrap: 'wrap'}}>
                    {
                      int.Members && this.state.membersLoaded
                       ? int.Members.map((user) => (
                         <Link  prefetch href={`/member?view=${localStorage.getItem('ttsOrg')}&member=${user}`}>
                           <div
                             key={user._id}
                             style={{margin: 4, textTransform: 'capitalize'}}>
                              <Chip
                                style={chipStyles.chip}
                                labelStyle={chipStyles.chipLabel}
                                backgroundColor={this.state.interactionUsers[user].color}>
                                {this.state.interactionUsers[user] && this.state.interactionUsers[user]['Full Name']
                                   ? this.state.interactionUsers[user]['Full Name'][0] : null}
                              </Chip>
                            </div>
                         </Link>
                      ))
                      :
                      null
                    }
                  </div>]}
                  secondaryText={int.Date.toLocaleString('en-gb',
                    {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'})}
                    leftAvatar={<Avatar
                    backgroundColor={'#039BE5'}
                    icon={
                      <Link prefetch href={`/project-admin?project=${int._id}&view=${localStorage.getItem('ttsOrg')}`}>
                      <EventIcon color='white'/>
                    </Link> } />
                    } />

              </div>
            </Link>
          )

          case "PlaceholderEvent":
            return (

                <div
                  style={{ borderBottom : '1px solid #DBDBDB'}}
                  >
                  <ListItem
                    id={int._id}
                    rightIcon={<IconButton
                      tooltip='Options'
                      onClick={(e) => this.props.handleOptionsClick(e, int)}
                      style={iconButtonStyles.button}><MoreVert /></IconButton>
                    }
                    className='email-interaction'
                    primaryText={int.Details ? int.Details.Subject : null}
                    primaryTogglesNestedList={true}
                    nestedItems={[<div style={{paddingLeft: 72, display: 'flex', flexWrap: 'wrap'}}>
                      {
                        int.Members && this.state.membersLoaded
                         ? int.Members.map((user) => (
                           <Link  prefetch href={`/member?view=${localStorage.getItem('ttsOrg')}&member=${user}`}>
                             <div
                               key={user._id}
                               style={{margin: 4, cursor: 'pointer',textTransform: 'capitalize'}}>
                                <Chip
                                  style={chipStyles.chip}
                                  labelStyle={chipStyles.chipLabel}
                                  backgroundColor={this.state.interactionUsers[user].color}>
                                  {this.state.interactionUsers[user] && this.state.interactionUsers[user]['Full Name']
                                     ? this.state.interactionUsers[user]['Full Name'][0] : null}
                                </Chip>
                              </div>
                           </Link>
                        ))
                        :
                        null
                      }
                    </div>]}
                    secondaryText={int.Date.toLocaleString('en-gb',
                      {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'})}
                      leftAvatar={<Avatar
                      backgroundColor={'#039BE5'}
                      icon={
                        <Link prefetch href={`/project-admin?project=${int._id}&view=${localStorage.getItem('ttsOrg')}`}>
                        <EventIcon color='white'/>
                      </Link> } />
                      } />

                </div>

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
        case "classifier":
          return (
            <div style={{borderBottom: '1px solid black', fontWeight: 700 ,paddingBottom: 5, paddingTop:20}}>
              {int.text}
            </div>
          )
        break;
      case "Email":
        return (
          <div style={{ borderBottom : '1px solid #DBDBDB'}}>
            <ListItem
              className='email-interaction'
              style={{marginBottom: 5 }}
              nestedItems={[
                <div style={{paddingLeft: 72}}>

                  <span>Involving:</span>
                  <div style={{paddingLeft: 10, display: 'inline-flex', flexWrap: 'wrap'}}>
                  {
                    int.Members && this.state.membersLoaded
                     ? int.Members.map((user) => (
                       <Link
                         key={user._id}
                          prefetch href={`/member?view=${localStorage.getItem('ttsOrg')}&member=${user}`}>
                          <div style={{ textTransform: 'capitalize'}}>
                            <Chip
                              style={chipStyles.chip}
                              labelStyle={chipStyles.chipLabel}
                              backgroundColor={this.state.interactionUsers[user] ? this.state.interactionUsers[user].color : null}>
                              {this.state.interactionUsers[user] && this.state.interactionUsers[user]['Full Name']
                                 ? this.state.interactionUsers[user]['Full Name'][0] : null}
                            </Chip>
                        </div>
                       </Link>
                    ))
                    :
                    null
                  }
                  {
                    int.Creator && this.state.adminMap && this.state.adminMap[int.Creator]
                     ?

                      <Chip
                        style={chipStyles.chip}
                        labelStyle={chipStyles.chipLabel}
                        >
                         {this.state.adminMap[int.Creator]}
                      </Chip>

                    :
                    null
                  }
                </div>

                <div style={{height: 10}}/>
                <div style={{borderBottom: '1px solid #DBDBDB', marginBottom: 10}}/>
                <div>
                  {int.Details.BodyText && int.Details.BodyText.split('----Original message----')[0].split('From:')[0].split('From :')[0].split('www.localtrust.org.uk<http://www.localtrust.org.uk/>Twitter<https://twitter.com/LocalTrust>')[0]}
                </div>
              </div>]}
              primaryTogglesNestedList={true}
              rightIcon={
                <IconButton
                  tooltip='Options'
                  onClick={(e) => this.props.handleOptionsClick(e, int)}
                  style={iconButtonStyles.button}><MoreVert />
                </IconButton>
            }
              primaryText={int.Private && int.Creator === fire.auth().currentUser.uid ?
              <div>
                {this.state.privateDocs[int._id].details.Subject}
              </div>
              :
              int.Private ?
              <div>
                Details are hidden, talk to {this.state.adminMap[int.Creator]}
              </div>
              :
              <span>Received your email: <b>{int.Details ? int.Details.Subject : ""}</b></span>}
              secondaryText={int.Date.toLocaleString('en-gb',
                {weekday: 'long', month: 'long', day: 'numeric'})}
                leftAvatar={<Avatar
                  backgroundColor={'#DBDBDB'}
                  icon={<Email /> } />} />

          </div>
        )
        break;
      case "Reply":
        return (
          <div>
            <ListItem
              rightIcon={<IconButton
                tooltip='Options'
                onClick={(e) => this.props.handleOptionsClick(e, int)}
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
                onClick={(e) => this.props.handleOptionsClick(e, int)}
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
                     <Link  prefetch href={`/member?view=${localStorage.getItem('ttsOrg')}&member=${user}`}>
                        <Chip
                          style={chipStyles.chip}
                          labelStyle={chipStyles.chipLabel}
                          backgroundColor={this.state.interactionUsers[user] ? this.state.interactionUsers[user].color : null}>
                           {this.state.interactionUsers[user] ? this.state.interactionUsers['Full Name'] : null}
                        </Chip>
                     </Link>
                  ))
                  :
                  null
                }
                {
                  int.Creator && this.state.adminMap && this.state.adminMap[int.Creator]
                   ?

                    <Chip
                      style={chipStyles.chip}
                      labelStyle={chipStyles.chipLabel}
                      >
                       {this.state.adminMap[int.Creator]}
                    </Chip>

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

  noteMarkup(note) {
    return {__html: note}
  }

  render() {
    return (
      <div>
        {this.renderInteraction(this.props.interaction)}
      </div>
    )
  }
}
