import React from 'react';
import Add from 'material-ui/svg-icons/content/add';
import Link from "next/link"
import Router from 'next/router'
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import Share from '../components/share.jsx';
import {World, Plant, Spiral, Muscle} from '../components/icons.jsx'
import Popover from 'material-ui/Popover';
import {List, ListItem} from 'material-ui/List';
import AutoComplete from 'material-ui/AutoComplete';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import DocumentTitle from 'react-document-title';
import MediaQuery from 'react-responsive';
import Loading from '../components/loading.jsx';
import {grey500, grey100, amber500} from 'material-ui/styles/colors';
import {changeImageAddress} from '../components/desktopproject.jsx';
import SignupModal from '../components/signupmodal.jsx';
import App from "../components/App"
import fire from '../fire';
import withMui from '../components/hocs/withMui';

let db = fire.firestore()

const styles = {
  buttonLabel: {
    fontWeight: 700,
    textTransform: 'none',
    letterSpacing: 0.5
  },
  inputStyle: {
    borderRadius: '6px',
    border: '1px solid #858987',
    paddingLeft: '12px',
    boxSizing: 'border-box'
  },
  hintStyle: {
     paddingLeft: '12px',
     bottom: '8px'
  },
  outline: {
    height: '40px',
    fontsize: '20px'
  },
  miniHeading: {
    fontWeight: 700,
    paddingTop: 10,
    paddingBottom: 10
  },
  inkbar: {
    height: 6,
    marginTop: 10,
    marginBottom: 10,
    width: '100px',
    backgroundColor: 'rgba(250,250,250,0.5)'
  },
  bigNumber: {
    fontWeight: 700,
    fontSize: '24px'
  },
  title: {
    fontSize: '36px',
    fontWeight: 700,
  },
  gifContainer: {
    display: 'flex',
    transition: 'all 1s',
    height: 200,
    alignItems: 'center',
    color: 'white',
    marginBottom: 20,
    backgroundColor: '#000AB2',
    padding: 20,
    borderRadius: 2
  },
  mobileGifContainer: {
    transition: 'all 1s',
    minHeight: 350,
    alignItems: 'center',
    color: 'white',
    marginBottom: 20,
    backgroundColor: '#000AB2',
    padding: 20,
    borderRadius: 2
  },
  headerContainer: {
    width: '60%',
    padding: 20,
    boxSizing: 'border-box'
  },
  gif: {
    height: '100%',
    width: 'auto',
    maxWidth: '100%',
    objectFit: 'cover'
  },
  imageBox: {
    width: '40%',
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
    alignItems: 'center'
  },
  mobileImageBox: {
    width: '100%',
    padding: 20,
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'center'
  }
}

class NoGroups extends React.Component {
  constructor(props) {
    super(props);
    this.state = {stage: 3}
  }

  handleModalChangeOpen = (e) => {
    this.setState({modalOpen: false})
  }


  getContent = () => {
    switch(this.state.stage) {

        case 3 :
        return (
          <div >
            <MediaQuery minDeviceWidth={700}>
            <div style={styles.gifContainer}>
              <div style={styles.headerContainer}>
                <div style={styles.title}>
                  Invite your friends to a group
                </div>
                <div style={styles.inkbar}/>
              </div>
              <div style={styles.imageBox}>
                  <Muscle style={{height: 100}} color={'white'}/>
              </div>
            </div>
            <div style={styles.gifContainer}>
              <div style={styles.imageBox}>
                  <Plant style={{height: 100}} color={'white'}/>

              </div>
              <div style={styles.headerContainer}>
                  <div style={styles.title}>
                    Suggest projects and see who's interested
                  </div>
                  <div style={styles.inkbar}/>
                </div>
            </div>
            <div style={styles.gifContainer}>
              <div style={styles.headerContainer}>
                <div style={styles.title}>
                  Drag along your friends
                </div>
                <div style={styles.inkbar}/>
              </div>
              <div style={styles.imageBox}>
                <img style={styles.gif} src='https://blooper0223.files.wordpress.com/2016/06/anigif_enhanced-buzz-15412-1327085582-9.gif'/>
              </div>
            </div>
            </MediaQuery>

            <MediaQuery maxDeviceWidth={700}>
            <div style={styles.mobileGifContainer}>
              <div >
                <div style={styles.title}>
                  Invite your friends to a group
                </div>
                <div style={styles.inkbar}/>
              </div>
              <div style={styles.mobileImageBox}>
                  <Muscle style={{height: 100}} color={'white'}/>
              </div>
            </div>
            <div style={styles.mobileGifContainer}>

              <div >
                  <div style={styles.title}>
                    Suggest projects and see who's interested
                  </div>
                  <div style={styles.inkbar}/>
                </div>
                <div style={styles.mobileImageBox}>
                    <Plant style={{height: 100}} color={'white'}/>

                </div>
            </div>
            <div style={styles.mobileGifContainer}>
              <div >
                <div style={styles.title}>
                  Drag along your friends
                </div>
                <div style={styles.inkbar}/>
              </div>
              <div >
                <img style={styles.gif} src='https://blooper0223.files.wordpress.com/2016/06/anigif_enhanced-buzz-15412-1327085582-9.gif'/>
              </div>
            </div>
            </MediaQuery>
            <div style={{height: 100, display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'center'}}>
              <RaisedButton labelStyle={{fontWeight: 700, textTransform: 'none'}}
                secondary={true}
                onClick={fire.auth().currentUser ? this.handleCreateGroup
                  : () => this.setState({modalOpen: true})}
                label='Create a Group'/>
            </div>
            <SignupModal
              open={this.state.modalOpen}
              changeOpen={this.handleModalChangeOpen}
            onComplete={this.handleCreateGroup}/>
          </div>
        )
    }
  }


  render() {
    return (
      <div>
        {this.getContent()}
      </div>
    )
  }
}

class GroupList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {modalOpen: false, createOpen: false, users: [], emails: []}
  }

  componentDidMount(props) {
    if (fire.auth().currentUser) {
      db.collection("Group").where("members." + fire.auth().currentUser.uid, "==", true)
      .get().then((querySnapshot) => {
        var data = []
        querySnapshot.forEach((doc) => {
          var elem = doc.data()
          elem._id = doc.id
          data.push(elem)
        })
        this.setState({groups: data})
      })
    } else {
      this.setState({groups: []})
    }

    fire.auth().onAuthStateChanged((user) => {
      if (user === null) {
        this.setState({groups: []})
      } else {
        db.collection("Group").where("members." + fire.auth().currentUser.uid, "==", true)
        .get().then((querySnapshot) => {
          var data = []
          querySnapshot.forEach((doc) => {
            var elem = doc.data()
            elem._id = doc.id
            data.push(elem)
          })
          this.setState({groups: data})
        })
      }
    })
    console.log(this.state.groups)
  }

  handleMobileCreateGroup = () => {
    Router.push('/groups/create')
  }

  handleCreateGroup = () => {
    this.setState({createOpen: true})
    var groupRef = db.collection("Group").doc()
    this.setState({groupId: groupRef.id})

    if (fire.auth().currentUser) {
      var data = {}
      db.collection("Engagement").where("User", "==", fire.auth().currentUser.uid).get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          db.collection("Engagement").where("Project", "==", doc.data().Project).get()
          .then((otherEngagements) => {
            otherEngagements.forEach((engDoc) => {
              data[engDoc.data().User] = {
                User: engDoc.data().User,
                'Project Photo': engDoc.data()['Project Photo'],
                'Volunteer Picture': engDoc.data()['Volunteer Picture'],
                Name : engDoc.data().Name,
                Project : engDoc.data()['Project Name']
              }
              console.log(data)
              this.setState({whosinPeople: data})
            })
          })
        })
      })
    }
  }

  handleClose = () => {
    this.setState({createOpen: false});
  };

  handleButtonClicked = () => {

  }

  handleUpdateInput = (e, searchText) => {
    this.setState({searchText: searchText})
  }

  addPerson = (userId, Name) => {
    var users = this.state.users
    if (!users.includes({id: userId, Name: Name})) {
      users.push({id: userId, Name: Name})
    }
    this.setState({users: users, searchText: ''})
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      var emails = this.state.emails
      if (!emails.includes(this.state.searchText)) {
        emails.push(this.state.searchText)
      }
      this.setState({emails: emails, searchText: ''})
    }
  }

  removePerson = (userId, Name) => {
    var users = this.state.users
    var index = users.indexOf({id: userId, Name: Name})
    users.splice(index, 1)
    this.setState({users: users})
  }

  removeEmail = (email) => {
    var emails = this.state.emails
    var index = emails.indexOf(email)
    emails.splice(index, 1)
    this.setState({emails: emails})
  }

  handleSaveGroup = () => {
    if (fire.auth().currentUser) {
      var updateString = "members." + fire.auth().currentUser.uid
      db.collection("Group").doc(this.state.groupId).set({
        Creator: fire.auth().currentUser.uid,
        Name: this.state.groupName,

      }).then(() => {
        db.collection("Group").doc(this.state.groupId).update({
          [updateString] : true
        })
      })

      db.collection("User").doc(fire.auth().currentUser.uid).get().then((doc) => {
        var userName = doc.data().Name.replace(/ .*/,'')
        var users = this.state.users
        users.push({
          id: fire.auth().currentUser.uid,
          Name: userName
        })
        var batch = db.batch();
        var groupRef = db.collection("Group").doc(this.state.groupId)
        users.forEach((user) => {
          var memberRef = db.collection("Group").doc(this.state.groupId).collection("Members").doc(user.id)
          batch.set(memberRef, {
            Name: user.Name,
            'Volunteer Picture': user['Volunteer Picture'] ? user['Volunteer Picture'] : null
          })
          batch.update(groupRef, {
            ['members.' + user.id] : true
          })
        })

        if (this.state.emails) {
          this.state.emails.forEach((email) => {
            batch.update(groupRef, {
              ['invites.' + email.replace(".", "SJR2pDzRb9XHFdZ")] : true
            })
        })}
        batch.commit().then(() => {
            Router.push(`/groups?groupId=${this.state.groupId}`,`/groups/${this.state.groupId}`)
        })
      })


    }


  }

  handleGroupName = (e, nv) => {
    this.setState({groupName: nv})
  }

  handleModalChangeOpen = (e) => {
    this.setState({modalOpen: false})
  }



  render() {
    console.log(this.state.whosinPeople)
    if (this.state.whosinPeople) {
      console.log(Object.values(this.state.whosinPeople))
    }

    var updatedList
    if (this.state.searchText && this.state.whosinPeople) {
      var length = this.state.searchText.length
      var people = Object.values(this.state.whosinPeople)
      var filteredPeople = []
      people.forEach((person) => {
        if (person.Name.substring(0, length).toLowerCase() === this.state.searchText.toLowerCase()) {
          filteredPeople.push(person)
          console.log(person)
        }
      })
      console.log(filteredPeople)
    }

    return (
      <App>
      <div style={{display: 'flex', flexDirection: 'column', width: '100%',
        alignItems: 'center', justifyContent: 'center'}}>
        <DocumentTitle title='Groups'/>
        <div style={{maxWidth: 1000, width: '100%', paddingTop: 26}}>
          <MediaQuery minDeviceWidth={700}>
          <h2 style={{
              paddingLeft: 16, paddingRight: 16, boxSizing: 'border-box', paddingBottom: 16,
              marginBottom: 0,
                textAlign: 'left', width: '100%', borderBottom: '1px solid #DDDDDD'}}>
                Your groups
                <div className='create-group'
                  style={{float: 'right'}}
                  >
                  <RaisedButton
                    style={{height: 36}}
                    buttonStyle={{display: 'flex', alignItems: 'center'}}
                    onClick={fire.auth().currentUser ? this.handleCreateGroup
                      : () => this.setState({modalOpen: true})}
                    labelStyle={styles.buttonLabel}
                    overlayStyle={{display: 'flex', alignItems: 'center'}}
                    icon={<Add/>}
                    secondary={true}
                    label='Create New Group'
                    />
                    <SignupModal
                      open={this.state.modalOpen}
                      changeOpen={this.handleModalChangeOpen}
                    onComplete={this.handleCreateGroup}/>
                </div>
              </h2>
            </MediaQuery>
          <MediaQuery maxDeviceWidth={700}>
            <h2 style={{
                paddingLeft: 16, paddingRight: 16, boxSizing: 'border-box', paddingBottom: 16,
                marginBottom: 0,
                  textAlign: 'left', width: '100%'}}>
                  Groups you belong to
                </h2>
                <div className='create-group'
                  style={{display: 'flex', alignItems: 'left', paddingLeft: 20, paddingBottom: 20}}
                  >
                  <RaisedButton
                    onClick={fire.auth().currentUser ? this.handleMobileCreateGroup
                      : () => this.setState({modalOpen: true})}
                    labelStyle={styles.buttonLabel}
                    icon={<Add/>}
                    style={{height: 36}}
                    secondary={true}
                    overlayStyle={{display: 'flex', alignItems: 'center'}}
                    label='Create New Group'
                    />
                    <SignupModal
                      open={this.state.modalOpen}
                      changeOpen={this.handleModalChangeOpen}
                    onComplete={this.handleMobileCreateGroup}/>
                </div>
          </MediaQuery>

          <div >
            {this.state.groups ?
              <div style={{display: 'flex', flexWrap: 'wrap', width: '100%'}}>
                <MediaQuery minDeviceWidth={700}>
                  <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {this.state.groups.map((group) => (
                      <Link
                        href={`/group?groupId=${group._id}`}
                        as={`/groups/${group._id}`}>
                        <div style={{display: 'inline-block', height: 150, width: 460,
                          margin: 20, boxSizing: 'border-box'}}>
                        <div style={{width: '100%', height: 150, border: 'solid 1px #979797', borderRadius: 4,
                            cursor: 'pointer', boxSizing: 'border-box'}}>
                          {group['Featured Image'] ?
                            <img src={changeImageAddress(group['Featured Image'], '500xauto')}
                              style={{height: '70%', width: '100%', marginBottom: '-6px', objectFit: 'cover'}}
                              />
                            :
                            <div style={{width: '100%', height: '70%', display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'}}>
                              <World style={{height: '70%'}} color={'#484848'}/>
                            </div>
                          }
                          <div style={{height: '30%', alignItems: 'center', display: 'flex',
                              backgroundColor: 'rgb(248,248,248)', borderRadius: 4}}>
                            <b style={{paddingLeft: 16}}>{group.Name}</b>
                          </div>
                        </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </MediaQuery>
                <MediaQuery maxDeviceWidth={700}>
                  {this.state.groups.map((group) => (
                    <Link
                       href={`/group?groupId=${group._id}`}
                       as={`/groups/${group._id}`}>
                       <div style={{height: 150, display: 'block', width: '100%',
                          margin: '20px', boxSizing: 'border-box'}}>
                      <div style={{width: '100%', height: 150,
                        border: 'solid 1px #979797', borderRadius: 4,
                          cursor: 'pointer', boxSizing: 'border-box'}}>
                        {group['Featured Image'] ?
                          <img src={changeImageAddress(group['Featured Image'], '500xauto')}
                            style={{height: '70%', width: '100%', marginBottom: '-6px', objectFit: 'cover'}}
                            />
                          :
                          <div style={{width: '100%', height: '70%', display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'}}>
                            <World style={{height: '70%'}} color={'#484848'}/>
                          </div>
                        }
                        <div style={{height: '30%', alignItems: 'center', display: 'flex',
                            backgroundColor: 'rgb(248,248,248)', borderRadius: 4}}>
                          <b style={{paddingLeft: 16}}>{group.Name}</b>
                        </div>
                      </div>
                      </div>
                    </Link>
                  ))}
                </MediaQuery>
              </div>
            :
            <div>
              <Loading/>
            </div>
            }
          </div>
          {
            this.state.groups && this.state.groups.length === 0 ?
              <div style={{margin: 20,
                textAlign: 'left', padding: 1}}>

                  <NoGroups/>


              </div>
              :
              null
          }
        </div>

      <Dialog
        modal={false}
        open={this.state.createOpen}
        contentStyle={{maxWidth: 500}}
        onRequestClose={this.handleClose}
        style={{textAlign: 'left'}}
        >
        <h2 style={{marginTop: 0}}>Create a group</h2>
        <div style={styles.miniHeading}>
          Name your group
        </div>
        <TextField
          underlineShow={false}
          fullWidth={true}
          value={this.state.groupName}
          onChange={this.handleGroupName}
          style={styles.outline}
          hintStyle={styles.hintStyle}
          inputStyle={styles.inputStyle}
          />
        <div style={styles.miniHeading}>
          Add some people you've met before
        </div>
        {
          (this.state.emails && this.state.emails.length > 0) ||
          (this.state.users && this.state.users.length > 0) ?
          <div style={{display: 'flex', flexWrap: 'wrap', paddingBottom: 10}}>
            {this.state.users.map((user) => (
              <Chip style={{marginRight: 4, marginLeft: 4, marginTop: 2}}
                onRequestDelete={() => this.removePerson(user.id, user.Name)}
                >
                {user.Name}
              </Chip>
            ))}
            {this.state.emails.map((email) => (
              <Chip style={{marginRight: 4, marginLeft: 4, marginTop: 2}}
                onRequestDelete={() => this.removeEmail(email)}
                >
                {email}
              </Chip>
            ))}
          </div>
          :
          null
        }
        <TextField
          underlineShow={false}
          fullWidth={true}
          ref={el => { this.el = el; }}
          value={this.state.searchText}
          style={styles.outline}
          hintText='Type some names or emails'
          hintStyle={styles.hintStyle}
          onKeyPress={this.handleKeyPress}
          onChange={this.handleUpdateInput}
          inputStyle={styles.inputStyle}
          />

        {this.state.searchText && filteredPeople ?
          <List>
          {
            filteredPeople.map((person) => (
              <ListItem
                leftAvatar={<Avatar />}
                onClick={() => this.addPerson(person.User, person.Name)}
                primaryText={person.Name}
                secondaryText={person.Project}
              />
            ))
          }
          </List>
        : null
        }


        <div style={styles.miniHeading}>
          Invite some others
        </div>
        { typeof window === 'undefined' ?
          null :
        <Share
          buttonClicked={this.handleButtonClicked}
          Name={this.state.Name ? this.state.Name : ''}
          url={Router.asPath + '/' + this.state.groupId}
          smsbody={encodeURIComponent("Join my group on Who's In?: " + Router.asPath + '/' + this.state.groupId)}
          emailbody={encodeURIComponent("Join my group on Who's In?: " +  Router.asPath + '/' + this.state.groupId)}
          />
        }
      <div style={{width: '100%', paddingTop: 16}}>
          <div style={{float: 'right'}}>
            <RaisedButton
              labelStyle={styles.buttonLabel}
              primary={true}
              onClick={this.handleSaveGroup}
              label='Create'/>
          </div>
        </div>
      </Dialog>
      </div>
    </App>
    )
  }
}

export default withMui(GroupList)
