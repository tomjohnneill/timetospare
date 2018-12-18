import React from 'react';
import Router from 'next/router'
import App from '../../components/App';
import fire from '../../fire';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import withMui from '../../components/hocs/withMui';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';
import ShortText from 'material-ui/svg-icons/editor/short-text';
import {List, ListItem} from 'material-ui/List';
import Email from 'material-ui/svg-icons/communication/email';
import Chip from 'material-ui/Chip';
import OutlookIntegrate from '../../components/outlook/integrate.jsx';
import CircularProgress from 'material-ui/CircularProgress';
import LinesEllipsis from 'react-lines-ellipsis';
import {headerStyles, buttonStyles, chipStyles} from '../../components/styles.jsx';
import lunr from 'lunr'

var chunk = (array, count) => {
    if (count == null || count < 1) return [];
    var result = [];
    var i = 0, length = array.length;
    while (i < length) {
      result.push(array.slice( i, i += count));
    }
    return result;
  };

let db = fire.firestore()

const editStyles = {
  container : {
    display: 'flex', alignItems: 'center', padding: 10,
    boxSizing: 'border-box'
  },
  icon: {
    height: 20, width: 20, paddingRight: 30
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
        margin: 4,
        cursor: 'pointer'
      },
  selectedChip: {
    margin: 4
  },
  nextContainer : {
    position: 'fixed',
    bottom: 0,
    height: 80,
    zIndex: 5,
    display: 'flex',
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 100,
    boxSizing: 'border-box',
    left: 0
  }
}

class ClassifiedInteraction extends React.Component {
  constructor(props) {
    super(props)
    this.state = {visible: false}
  }

  componentDidMount (props) {
    setTimeout(
        () => {
            this.setState({visible: true});
        },
        100
    );
  }

  noteMarkup(note) {
    return {__html: note}
  }

  handleDeleteOrg = (user, org) => {
    console.log(org)
    var userArray = this.props.data.details
    var userPosition = userArray.indexOf(user)
    console.log(userArray[userPosition])
    userArray[userPosition] && userArray[userPosition].RELATIONSHIPS.forEach((rel) => {
      console.log(rel.OrgNames[org])
        delete rel.OrgNames[org]
        console.log(rel)
    })
    console.log(userArray)
    this.props.editDetails(userArray, this.props.index)
  }

  handleDeleteUser = (user) => {
    var userArray = this.props.data.details
    var userPosition = userArray.indexOf(user)
    userArray.splice(userPosition, 1)
    this.props.editDetails(userArray, this.props.index)
  }


  handleDelete = () => {
    this.props.handleDelete(this.props.conversationId)
  }

  render() {
    return (
      <Card
        expandable={true}
        key={this.props.data.details.Subject}
        style={{textAlign: 'left', marginBottom: 20, boxShadow: 'none',
        opacity: this.state.visible ? 100 : 0,
        transition: 'opacity 0.5s',
        borderBottom: '1px solid #DBDBDB'}}>
        <CardHeader
          title={this.props.data.email ? this.props.data.email.Subject : this.props.data.event.Subject}
          actAsExpander={true}
          showExpandableButton={true}
          subtitle={this.props.type}
          avatar={<Avatar>H</Avatar>}
          children={<div style={{display: 'inline-flex', flexWrap: 'wrap'}}>
            {
              this.props.data && this.props.data.details.map((user) => (

                    user && user.RELATIONSHIPS && user.RELATIONSHIPS.map((rel) => (
                      rel.OrgNames && Object.keys(rel.OrgNames).map((orgId) => (
                        <Chip style={chipStyles.chip}
                          deleteIconStyle={chipStyles.deleteStyle}
                          onRequestDelete={() => this.handleDeleteOrg(user, orgId)}
                          labelStyle={chipStyles.chipLabel}>
                          {rel.OrgNames[orgId]}
                        </Chip>
                      ))


                    ))

              ))
            }
          </div>}
        />

      <CardText expandable={true}>
          <div style={{display: 'flex'}}>
            <div style={{flex: 1, paddingRight: 20}}>
              <div style={{display: 'flex'}}>
                <ShortText style={editStyles.icon} color={'#484848'}/>
                <div style={{display: 'flex', flexWrap: 'wrap', textTransform: 'capitalize'}}>
                  {
                    this.props.data && this.props.data.details.map((user) => (
                      user ?
                      <Chip style={chipStyles.chip}
                        deleteIconStyle={chipStyles.deleteStyle}
                        onRequestDelete={() => this.handleDeleteUser(user)}
                        labelStyle={chipStyles.chipLabel}>
                        {user['Full Name']}
                      </Chip>
                      :
                      null
                    ))
                  }
                </div>
              </div>

              <div style={{display: 'flex', paddingTop: 16}}>
                <div style={{width: 54}}>
                  <ShortText style={editStyles.icon} color={'#484848'}/>
                </div>
                <div style={{flex: 1}}>

                  <LinesEllipsis
                    text={this.props.data.email ? this.props.data.email.Body.Content :
                            this.props.data.event.Body.Content}
                    maxLine='3'
                    ellipsis='...'
                    trimRight
                    basedOn='words'/>

                </div>

              </div>
            </div>
            <div style={{flex: 1}}>
              <div style={{display: 'flex'}}>
                <div style={{width: 54}}>
                  <ShortText style={editStyles.icon} color={'#484848'}/>
                </div>
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {
                      this.props.data && this.props.data.details.map((user) => (

                            user && user.RELATIONSHIPS && user.RELATIONSHIPS.map((rel) => (
                              rel.OrgNames && Object.keys(rel.OrgNames).map((orgId) => (
                                <Chip style={chipStyles.chip}
                                  deleteIconStyle={chipStyles.deleteStyle}
                                  onRequestDelete={() => this.handleDeleteOrg(user, orgId)}
                                  labelStyle={chipStyles.chipLabel}>
                                  {rel.OrgNames[orgId]}
                                </Chip>
                              ))


                            ))

                      ))
                    }
                  </div>
                </div>
              </div>
              <div style={{display: 'flex', paddingTop: 16}}>
                <div style={{width: 54}}>
                  <ShortText style={editStyles.icon} color={'#484848'}/>
                </div>
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {
                      this.props.data && this.props.data.details.map((user) => (
                            user && user.tags && user.tags.map((tag) => (
                              <Chip style={chipStyles.chip}
                                deleteIconStyle={chipStyles.deleteStyle}
                                onRequestDelete={() => this.handleDeleteTag(user, tag)}
                                labelStyle={chipStyles.chipLabel}>
                                {tag}
                              </Chip>
                            ))
                      ))
                    }
                  </div>
                </div>
              </div>

            </div>
          </div>
        </CardText>
        <CardActions
          expandable={true}
          style={{textAlign: 'right'}}>
          <FlatButton
            labelStyle={buttonStyles.smallLabel}
            style={buttonStyles.smallSize}
            onClick={this.handleDelete}
             label="Delete" />


        </CardActions>
      </Card>
    )
  }
}

class InteractionCard extends React.Component {
  constructor(props) {
    super(props)




    this.state = {visible: false}
  }

  componentDidMount (props) {
    setTimeout(
        () => {
            this.setState({visible: true});
        },
        100
    );
  }

  handleDeleteUser = (user) => {
    var userArray = this.props.users
    var userPosition = userArray.indexOf(user)
    userArray.splice(userPosition, 1)
    console.log(userArray)
    this.props.editUsers(userArray, this.props.conversationId)
  }

  handleDeleteOrg = (relationships, org) => {
    var rels = this.props.relationships
    var position = this.props.relationships.indexOf(relationships)
    console.log(rels)
    console.log(rels[position])
    delete rels[position].OrgNames[org]

    console.log(rels)
    this.props.editOrgs(rels, this.props.conversationId)

  }

  noteMarkup(note) {
    return {__html: note}
  }

  handleDeleteTag = (user, tag) => {
    var userArray = this.props.data.details
    var userPosition = userArray.indexOf(user)
    var tagPosition = userArray[userPosition].tags.indexOf(tag)
    userArray[userPosition].tags.splice(tagPosition, 1)
    this.props.editDetails(userArray, this.props.index)
  }

  handleDelete = () => {
    this.props.handleDelete(this.props.conversationId)
  }

  handleConfirm = () => {
    this.props.classify(this.props.conversationId)
  }

  render() {
    return (
      <Card
        key={this.props.conversationId}
        style={{textAlign: 'left', marginBottom: 20, boxShadow: 'none',
        opacity: this.state.visible ? 100 : 0,
        transition: 'opacity 0.5s',
        borderBottom: '1px solid #DBDBDB'}}>
        <CardHeader
          actAsExpander={true}
          title={this.props.Subject}
          subtitle={this.props.type}
          avatar={<Avatar icon={<Email /> }/>}
        />

        <CardText
          actAsExpander={true}
          >
          <div style={{display: 'flex'}}>
            <div style={{flex: 1, paddingRight: 20}}>
              <div style={{display: 'flex'}}>
                <ShortText style={editStyles.icon} color={'#484848'}/>
                <div style={{display: 'flex', flexWrap: 'wrap', textTransform: 'capitalize'}}>
                  {
                    this.props.users.map((user) => (
                      user ?
                      <Chip style={chipStyles.chip}
                        deleteIconStyle={chipStyles.deleteStyle}
                        onRequestDelete={() => this.handleDeleteUser(user)}
                        labelStyle={chipStyles.chipLabel}>
                        {user['Full Name']}
                      </Chip>
                      :
                      null
                    ))
                  }
                </div>
              </div>

            </div>
            <div style={{flex: 1}}>
              <div style={{display: 'flex'}}>
                <div style={{width: 54}}>
                  <ShortText style={editStyles.icon} color={'#484848'}/>
                </div>
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {
                      this.props.relationships && this.props.relationships.map((rel) => (
                              rel.OrgNames && Object.keys(rel.OrgNames).map((orgId) => (
                                <Chip style={chipStyles.chip}
                                  deleteIconStyle={chipStyles.deleteStyle}
                                  onRequestDelete={() => this.handleDeleteOrg(rel, orgId)}
                                  labelStyle={chipStyles.chipLabel}>
                                  {rel.OrgNames[orgId]}
                                </Chip>
                              ))


                            ))

                    }
                  </div>
                </div>
              </div>


            </div>
          </div>
        </CardText>
        <CardText expandable={true}>
          <List>
            {
              Object.values(this.props.conversation).map((email) => (
                email && email.email ?
                <ListItem
                  leftAvatar={<Avatar
                    backgroundColor={'#DBDBDB'}
                    icon={<Email /> } />}
                  children={<div dangerouslySetInnerHTML={this.noteMarkup(email.email.Body.Content)}/>}
                  />
                :
                null
              ))
            }

          </List>
        </CardText>

        <CardActions style={{textAlign: 'right'}}>
          <FlatButton
            onClick={this.handleDelete}
            labelStyle={buttonStyles.smallLabel}
            style={buttonStyles.smallSize}
             label="Delete" />
          <RaisedButton
            style={buttonStyles.smallSize}
            labelStyle={buttonStyles.smallLabel}
            primary={true}
            onClick={this.handleConfirm}
            label="Confirm" />

        </CardActions>
      </Card>
    )
  }
}

export class Categorise extends React.Component {
  constructor(props) {
    super(props)
    this.state = {outlookFinished: false, conversations: {}}
  }

  handleEditUsers = (users, conversation)  => {
    console.log(users)
    console.log(conversation)
    var conversations = this.state.conversations
    conversations[conversation].users = users
    this.setState({conversations: conversations})
  }

  handleEditOrgs = (orgs, conversation)  => {
    var conversations = this.state.conversations
    conversations[conversation].relationships = orgs
    this.setState({conversations: conversations})
  }

  smartCategorise = (email, type) => {

    // If there's only 1 org attached, classify it
    if (email.details) {

        var attachedOrgs = []

        email.details && email.details.forEach((person) => {
          if (person && person.RELATIONSHIPS) {
            person.RELATIONSHIPS && person.RELATIONSHIPS.forEach((rel) => {
              Object.keys(rel.OrgNames) && Object.keys(rel.OrgNames).forEach((orgId) => {
                if (!attachedOrgs.includes({_id: orgId, name: rel.OrgNames[orgId]})) {
                  attachedOrgs.push({_id: orgId, name: rel.OrgNames[orgId]})
                }
              })
            })
          }
        })

        if (attachedOrgs.length < 2) {
          email.classified = true
        }

        /*
        email.details.forEach((person) => {
          if (person.RELATIONSHIPS && person.RELATIONSHIPS.length === 1) {

          }
        })
        */

        if (type == 'email') {
          email.email.BodyText = email.email.Body.Content
          var idx = lunr(function () {
            this.ref('Id')
            this.field('Subject')
            this.field('BodyText')
            this.add(email.email)
          })

          var matchedOrgs = []
          attachedOrgs.forEach((org) => {
            var searchResults = idx.search(org.name)
            console.log(searchResults)
            if (searchResults.length > 0 && searchResults[0].score > 0.15) {
              matchedOrgs.push(org)
            }
          })

          var orgNameObject = {}
          if (matchedOrgs.length > 0) {
            matchedOrgs.forEach((obj) => {
              orgNameObject[obj._id] = obj.name
            })
            email.details.forEach((person) => {
              delete person.RELATIONSHIPS
            })
            email.details[0].RELATIONSHIPS = [{OrgNames: orgNameObject}]
            email.classified = true
          }
        } else if (type == 'calendar') {
          email.event.BodyText = email.event.Body.Content
          var idx = lunr(function () {
            this.ref('Id')
            this.field('Subject')
            this.field('BodyText')
            this.add(email.event)
          })

          var matchedOrgs = []
          attachedOrgs.forEach((org) => {
            var searchResults = idx.search(org.name)
            console.log(searchResults)
            if (searchResults.length > 0 && searchResults[0].score > 0.15) {
              matchedOrgs.push(org)
            }
          })

          var orgNameObject = {}
          if (matchedOrgs.length > 0) {
            matchedOrgs.forEach((obj) => {
              orgNameObject[obj._id] = obj.name
            })
            email.details.forEach((person) => {
              delete person.RELATIONSHIPS
            })
            email.details[0].RELATIONSHIPS = [{OrgNames: orgNameObject}]
            email.classified = true
        }

      }
    }
    return email
  }

  smartClassConversation = (conversation) => {
    console.log(conversation)
    if (conversation.relationships && conversation.relationships.length < 2) {
      var editedConvo = conversation
      editedConvo.classified = true
      return editedConvo
    } else {
      var editedConvo = conversation
      editedConvo.classified = false
      return editedConvo
    }
  }

  handleSaveConversations = () => {
    mixpanel.track('Scraped emails')
    var batch = db.batch()
    var updatesToBatch = []
    this.state.conversations && Object.values(this.state.conversations).forEach((convData) => {
      console.log('data',convData)
      console.log('data.emails',convData.emails)

      convData.emails && Object.values(convData.emails).forEach((email) => {
        var details = email.details
        var members = [], orgs = []
        var orgNameObj = {}

        convData.users && convData.users.forEach((person) => {
          members.push(person._id)
        })

        convData.relationships && convData.relationships.forEach((rel) => {
          Object.keys(rel.OrgNames) && Object.keys(rel.OrgNames).forEach((key) => {
            orgs.push(key)
            orgNameObj[key] = rel.OrgNames[key]
          })
        })

        let body = {
          Creator : fire.auth().currentUser.uid,
          Members: members,
          Organisations: orgs,
          OrgNames: orgNameObj,
          managedBy: localStorage.getItem('ttsOrg')
        }

        if (email.email) {
          var data = email.email
          body.Details = data
          body.Type = 'Email'
          body.Date = new Date(data.SentDateTime)
          console.log(body)

          updatesToBatch.push({docRef: db.collection("Interactions").doc(data.Id), data: body})

        }
      })
    })

    const batches = chunk(updatesToBatch, 450).map(postSnapshots => {
                const writeBatch = db.batch();

                postSnapshots.forEach(post => {
                  writeBatch.set(post.docRef, post.data, {merge: true});
                });

                return writeBatch.commit();
            });
    return  Promise.all(batches).then(() => {
      Router.push('/dashboard')
    });
  }

  handleSaveAll = () => {
    mixpanel.track('Scraped emails')
    var batch = db.batch()
    var updatesToBatch = []
    this.state.emails && this.state.emails.forEach((email) => {
      var details = email.details
      var members = [], orgs = []
      var orgNameObj = {}
      details && details.forEach((person) => {
        members.push(person._id)
        person.RELATIONSHIPS && person.RELATIONSHIPS.forEach((rel) => {
          Object.keys(rel.OrgNames) && Object.keys(rel.OrgNames).forEach((key) => {
            orgs.push(key)
            orgNameObj[key] = rel.OrgNames[key]
          })
        })
      })


      let body = {
        Creator : fire.auth().currentUser.uid,
        Members: members,
        Organisations: orgs,
        OrgNames: orgNameObj,
        managedBy: localStorage.getItem('ttsOrg')
      }

      if (email.email) {
        var data = email.email
        body.Details = data
        body.Type = 'Email'
        body.Date = new Date(data.SentDateTime)
        console.log(body)

        updatesToBatch.push({docRef: db.collection("Interactions").doc(data.Id), data: body})

      } else if (email.event) {
        var data = email.event
        body.Details = data
        body.Type = 'CalendarEvent'
        body.Details.EventId = data.Id
        body.Date = new Date(data.Start.DateTime)
        console.log(body)

        updatesToBatch.push({docRef: db.collection("Interactions").doc(data.Id), data: body})


        var eventBody = {
          description: {
            text: data.Body.Content
          },
          managedBy: localStorage.getItem('ttsOrg'),
          source: 'Outlook',
          start: new Date(data.Start.DateTime),
          end: new Date(data.End.DateTime),
          name: {
            text: data.Subject,
          },
          Location: data.Location
        }
        updatesToBatch.push({docRef: db.collection("Events").doc(data.Id), data: eventBody})

      }
    })

    const batches = chunk(updatesToBatch, 450).map(postSnapshots => {
                const writeBatch = db.batch();

                postSnapshots.forEach(post => {
                  writeBatch.set(post.docRef, post.data, {merge: true});
                });

                return writeBatch.commit();
            });
    return  Promise.all(batches).then(() => {
      Router.push('/dashboard')
    });


  }

  addEmails = (result) => {
    var conversations = this.state.conversations


    var newEmails = result.data && result.data.data
    var currentEmails = this.state.emails ? this.state.emails : []
    newEmails.forEach((email) => {
      if (email.email) {
        if (email.email.ConversationId) {
          var thisConversation = conversations[email.email.ConversationId]
          if (thisConversation && thisConversation.emails) {
            thisConversation.emails[email.email.Id] = this.smartCategorise(email, 'email')
          } else {
            thisConversation = {emails: {[email.email.Id] : this.smartCategorise(email, 'email')}}
          }
          var conversationRelationships = thisConversation.relationships ? thisConversation.relationships : []
          var conversationUsers = thisConversation.users ? thisConversation.users : []
          thisConversation.Subject = email.email.Subject
          Object.values(thisConversation.emails).forEach((data) => {
            var details = data.details
            details && details.forEach((person) => {
              person.RELATIONSHIPS && person.RELATIONSHIPS.forEach((rel) => {


                var alreadyExists = false
                for (var i = 0; i < conversationRelationships.length; i++) {
                  var relOrgNames = conversationRelationships[i].OrgNames
                  Object.keys(rel.OrgNames).forEach((orgId) => {
                    if (relOrgNames[orgId]) {
                      alreadyExists = true
                    }
                  })
                }
                if (!alreadyExists) {
                  conversationRelationships.push(rel)
                }

              })
              const result = conversationUsers.filter(word => word._id === person._id)
              if (result.length === 0) {
                conversationUsers.push(person)
              }

            })
          })
          thisConversation.relationships = conversationRelationships
          thisConversation.users = conversationUsers

          conversations[email.email.ConversationId] = thisConversation


          this.setState({conversations: conversations})
        }

        var editedEmail = this.smartCategorise(email, 'email')
        currentEmails.unshift(editedEmail)
        this.setState({emails: currentEmails})
      } else if (email.event) {
        var editedEmail = this.smartCategorise(email, 'calendar')
        currentEmails.unshift(editedEmail)
        this.setState({emails: currentEmails})
      }

    })

  }

  deleteEmail = (convId) => {
    var conversations = this.state.conversations
    delete conversations[convId]
    this.setState({conversations: conversations})
  }

  handleClassify = (convId) => {
    var conversations = this.state.conversations
    console.log(conversations)
    conversations[convId].classified = true
    this.setState({conversations: conversations})
  }


  editEmailDetailsFromChild = (detail, index) => {
    var emails = this.state.emails
    emails[index].details = detail
    this.setState({emails: emails})
  }

  handleFinish = (type) => {
    this.setState({[type]: true})
  }

  render() {
    var inputRequired = [], classified = []
    if (this.state.emails) {
      this.state.emails.forEach((email) => {
        if (email.classified) {
          classified.push(email)
        } else {
          inputRequired.push(email)
        }
      })
    }

    var emailConversations = [], classifiedConversations = []
    if (this.state.conversations) {

      Object.keys(this.state.conversations).forEach((conv) => {
        console.log(this.smartClassConversation(this.state.conversations[conv]))
        if (this.smartClassConversation(this.state.conversations[conv]).classified) {
          classifiedConversations.push({_id: conv, data: this.state.conversations[conv]})
        } else {
          emailConversations.push({_id: conv, data: this.state.conversations[conv]})
        }

      })
    }

    return (
      <div>
        <App>
          <OutlookIntegrate
            onFinish={this.handleFinish}
            handleResult={this.addEmails}
            />
          <div style={{position: 'fixed', zIndex: -1, top: 50, borderRadius: '30% 0 0 90%',
            transform: 'skewX(-10deg)', backgroundColor: '#FFCB00', right: -250,
             width: '30vw', height: '100vw'}}/>
           <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh'}}>
            <div style={{maxWidth: 1200, boxSizing: 'border-box', padding: 20, width: '100%'}}>
              <div style={headerStyles.desktop}>
                We just need a bit of help classifying a few things...
              </div>
              <div style={{height: 4, width: 100, backgroundColor: '#000AB2', marginBottom: 20}}/>
              {
                !this.state.calendarFinished || !this.state.emailFinished ?
                <div style={{width: '100%', display:'flex', alignItems: 'center', flexDirection: 'column'}}>
                  <CircularProgress size={50} thickness={4} />
                  <div style={{paddingTop: 10}}>
                    {
                      this.state.emails ?
                      <span>Still a few more to go</span> :

                      <span>This could take a minute</span>}</div>
                </div>
                :
                null
              }
              {
                emailConversations.map((conversation) => (
                    <InteractionCard
                      classify={this.handleClassify}
                      handleDelete={this.deleteEmail}
                      editDetails={this.editEmailDetailsFromChild}
                      editUsers={this.handleEditUsers}
                      editOrgs={this.handleEditOrgs}
                      conversationId={conversation._id}
                      relationships={conversation.data.relationships}
                      users={conversation.data.users}
                      Subject={conversation.data.Subject}
                      type={'Email'} conversation={conversation.data.emails}/>
                ))
              }
              {
                classifiedConversations.length > 0 ?
                <h2 style={headerStyles.desktop}>
                  Classified interactions
                </h2>
                :
                null
              }
              {
                classifiedConversations.map((conversation) => (
                  <InteractionCard
                    classify={this.handleClassify}
                    handleDelete={this.deleteEmail}
                    editDetails={this.editEmailDetailsFromChild}
                    editUsers={this.handleEditUsers}
                    editOrgs={this.handleEditOrgs}
                    conversationId={conversation._id}
                    relationships={conversation.data.relationships}
                    users={conversation.data.users}
                    Subject={conversation.data.Subject}
                    type={'Email'} conversation={conversation.data.emails}/>
                ))
              }

              {/*

              {
                inputRequired.map((email) => (
                  email ?
                  <InteractionCard
                    classify={this.handleClassify}
                    handleDelete={this.deleteEmail}
                    editDetails={this.editEmailDetailsFromChild}
                    index={this.state.emails.indexOf(email)}
                    type={email.email ? 'Email' : 'Event'} data={email}/>
                  :
                  null
                ))
              }
              {
                inputRequired.length === 0 && this.state.outlookFinished ?
                <div style={{display: 'flex', padding: 50, alignItems: 'center', justifyContent: 'center'
                , backgroundColor: '#F5F5F5'}}>
                  All interactions have been classified, click save to continue
                </div>
                :
                null
              }
              {
                classified.length > 0 ?
                <h2 style={headerStyles.desktop}>
                  Classified interactions
                </h2>
                :
                null
              }

                {
                  classified.map((email) => (
                    email ?
                    <ClassifiedInteraction
                      handleDelete={this.deleteEmail}
                      editDetails={this.editEmailDetailsFromChild}
                      index={this.state.emails.indexOf(email)}
                      type={email.email ? 'Email' : 'Event'} data={email}/>
                    :
                    null
                  ))
                }
                */}
            </div>
          </div>
          <div style={editStyles.nextContainer}>
            <FlatButton label='Back'
              style={buttonStyles.smallSize}
              labelStyle={buttonStyles.smallLabel}
              onClick={() => {
                Router.back()
              }}
              />
              <div style={{width: 10}}/>
            <RaisedButton label='Save All'
              primary={true}
              disabled={!this.state.emailFinished || !this.state.calendarFinished}
              style={buttonStyles.smallSize}
              labelStyle={buttonStyles.smallLabel}
              onClick={() => {
                this.handleSaveConversations()
              }}
              />
          </div>
        </App>
      </div>
    )
  }
}

export default withMui(Categorise)
