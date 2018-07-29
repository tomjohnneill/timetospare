import React from 'react';
import MediaQuery from 'react-responsive';
import {changeImageAddress} from '../components/desktopproject.jsx';
import Avatar from 'material-ui/Avatar';
import Link from "next/link"
import Router from 'next/router'
import {Tabs, Tab} from 'material-ui/Tabs';
import {CalendarIcon, Place, Clock, World, Tick, Cross, CleanTick} from '../components/icons.jsx';
import EmbeddedProject from '../components/embeddedproject.jsx';
import Share from '../components/share.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import Masonry from 'react-masonry-css';
import CloudUpload from 'material-ui/svg-icons/file/cloud-upload';
import Star from 'material-ui/svg-icons/toggle/star';
import CircularProgress from 'material-ui/CircularProgress';
import {grey500, grey200, amber500} from 'material-ui/styles/colors';
import DocumentTitle from 'react-document-title';
import Divider from 'material-ui/Divider';
import SignupModal from '../components/signupmodal.jsx';
import Dropzone from 'react-dropzone';
import fire from '../fire';
import App from "../components/App"
import withMui from '../components/hocs/withMui';

let db = fire.firestore()

const styles = {
  buttonLabel: {
    fontWeight: 700,
    letterSpacing: 0.5
  },
  selectedTab: {
    height: '60px',
    backgroundColor: 'white',
    color: '#000AB2',
    textTransform: 'none',
    fontSize: '16px',
    letterSpacing: '0.4px',
    lineHeight: '16px',
    paddingLeft: '20px',
    paddingRight: '20px',
    fontWeight: 600
  },
  tab: {
    height: '60px',
    backgroundColor: 'white',
    color: '#484848',
    textTransform: 'none',

    fontSize: '16px',
    letterSpacing: '0.4px',
    lineHeight: '16px',
    paddingLeft: '20px',
    paddingRight: '20px',

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
  }
}

export class GroupReviews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount(props) {
    var data = this.props.members
    var reviews = []
    data.forEach((member) => {
      db.collection("UserReview").where("User", "==", member._id).get()
      .then((reviewSnapshot) => {
        reviewSnapshot.forEach((doc) => {
          reviews.push(doc.data())
          this.setState({reviews: reviews})
        })
      })
    })
  }

  render() {
    return (
      <div>
        {this.state.reviews ? this.state.reviews.map((project) => (
          <div>
            <Link as={`/projects/p/${project.Project}`} href={`/project?project=${project.Project}`}>
              <div style={{display: 'flex', padding: 20, textAlign: 'left', borderBottom: '1px solid #DDDDDD'}}>
                <div>
                  {project['Charity Picture'] ?
                  <img
                    src={changeImageAddress(project['Charity Picture'], '250xauto')}
                    style={{borderRadius: '50%', height: 30, width: 30}} className='logo'/>
                    :
                  <World style={{height: 30, width: 30}} color={'#484848'}/>
                  }
                  <div className='charity-name' style={{paddingTop: 6, fontSize: '12px'}}>
                    {project['Charity Name']}
                  </div>
                </div>

                <div className='review-detail-container' style={{display: 'flex',
                  flexDirection: 'column', justifyContent: 'space-between',
                  paddingLeft: 20}}>
                  <div className='review-content' style={{fontSize: '15px', paddingBottom: 20}}>
                    {project['Review']}
                  </div>
                  <div className='review-project' style={{fontWeight:700, fontSize: '11px'}}>
                    For the project {project['Project Name']}, {project.created.toLocaleString('en-gb', {month: 'long', year: 'numeric'})}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )) : null}
      </div>
    )
  }
}

class InterestedAvatars extends React.Component {
  constructor(props) {
    super(props);
    this.state = {selected: 'interested'}
  }

  render() {
    console.log(this.props.members)
    console.log(this.props.Interested)

    var interested = []
    var notInterested = []
    var notReplied = []
    this.props.members.map((member) => {
      if (this.props.Interested[member._id] === true) {
        interested.push(member)
      } else if (this.props.Interested[member._id] === false) {
        notInterested.push(member)
      } else {
        notReplied.push(member)
      }
    })


    return (
      <div>
          <div style={{display: 'flex'}}>

            <span style={{paddingRight: 16, cursor: 'pointer',
              color: this.state.selected === 'interested' ? '#65A1e7' : 'inherit'}}
              onClick={() => this.setState({selected: 'interested'})}
              >
              Interested ({interested ? interested.length : 0})
            </span>
            <span style={{paddingRight: 16, cursor: 'pointer',
              color: this.state.selected === 'not-interested' ? '#65A1e7' : 'inherit'}}
              onClick={() => this.setState({selected: 'not-interested'})}
              >
              Not Interested ({notInterested ? notInterested.length : 0})
            </span>
            <span style={{paddingRight: 16, cursor: 'pointer',
              color: this.state.selected === 'not-replied' ? '#65A1e7' : 'inherit'}}
              onClick={() => this.setState({selected: 'not-replied'})}
              >
              Not Replied ({notReplied ? notReplied.length : 0})
            </span>
          </div>
          <div className='going'

            style={{display: 'flex', paddingTop: 10, paddingBottom: 10,

            display: this.state.selected === 'interested' ? 'inherit' : 'none'}}>
            {
              interested.map((eng) => (
                eng['Volunteer Picture'] ?
                <Link href={`/profile?user=${eng._id}`} as={`/profile/${eng._id}`}>
                  <IconButton tooltip={eng.Name} style={{padding: 0}}>
                    <Avatar src={changeImageAddress(eng['Volunteer Picture'], '40xauto')}
                      />
                  </IconButton>
                </Link>
                :
                <Link href={`/profile?user=${eng._id}`} as={`/profile/${eng._id}`}>
                  <IconButton tooltip={eng.Name} style={{padding: 0}}>
                    <Avatar>{eng['Name'] ? eng['Name'].substring(0,1) : null}</Avatar>
                  </IconButton>
                </Link>
                  ))


            }
          </div>
          <div className='going'

            style={{display: 'flex', paddingTop: 10, paddingBottom: 10,
              color: this.state.selected === 'not-interested' ? '#65A1e7' : 'inherit',
              display: this.state.selected === 'not-interested' ? 'inherit' : 'none'
            }}>
            {
              notInterested.map((eng) => (
                eng['Volunteer Picture'] ?
                <Link href={`/profile?user=${eng._id}`} as={`/profile/${eng._id}`}>
                  <IconButton tooltip={eng.Name} style={{padding: 0}}>
                    <Avatar src={changeImageAddress(eng['Volunteer Picture'], '40xauto')}
                      />
                  </IconButton>
                </Link>
                :
                <Link href={`/profile?user=${eng._id}`} as={`/profile/${eng._id}`}>
                  <IconButton tooltip={eng.Name} style={{padding: 0}}>
                    <Avatar>{eng['Name'] ? eng['Name'].substring(0,1) : null}</Avatar>
                  </IconButton>
                </Link>
                  ))


            }
          </div>
          <div className='going'

            style={{display: 'flex', paddingTop: 10, paddingBottom: 10,
              color: this.state.selected === 'not-replied' ? '#65A1e7' : 'inherit',
            display: this.state.selected === 'not-replied' ? 'inherit' : 'none'}}>
            {
              notReplied.map((eng) => (
                eng['Volunteer Picture'] ?
                <Link href={`/profile?user=${eng._id}`} as={`/profile/${eng._id}`}>
                  <IconButton tooltip={eng.Name} style={{padding: 0}}>
                    <Avatar src={changeImageAddress(eng['Volunteer Picture'], '40xauto')}
                      />
                  </IconButton>
                </Link>
                :
                <Link href={`/profile?user=${eng._id}`} as={`/profile/${eng._id}`}>
                  <IconButton tooltip={eng.Name} style={{padding: 0}}>
                    <Avatar>{eng['Name'] ? eng['Name'].substring(0,1) : null}</Avatar>
                  </IconButton>
                </Link>
                  ))


            }
          </div>
      </div>
    )
  }
}

export class UpcomingProjects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount(props) {
    db.collection("Group").doc(this.props.groupId).collection("Projects").get()
    .then((querySnapshot) => {
      let data = []
      querySnapshot.forEach((doc) => {
        let elem = doc.data()

        db.collection("Project").doc(doc.id).get().then((project) => {
          var projectData = project.data()
          projectData._id = doc.id
          elem.project = projectData
          if (new Date(projectData['End Time']) > new Date()) {
            data.push(elem)
          }
          this.setState({projects: data})
        })
        console.log(this.state.projects)
      })

    })

  }

  handleTick = (_id) => {
    if (fire.auth().currentUser) {
      var projects = this.state.projects
      let updatedProjects = []

      projects.forEach((project) => {
        if (project.project._id === _id) {
          console.log('Set as Interested')
          project.Interested = {}
          project.Interested[fire.auth().currentUser.uid] = true
        }
        updatedProjects.push(project)
      })
      this.setState({
          projects: updatedProjects
      })
      db.collection("Group").doc(this.props.groupId).collection("Projects")
      .doc(_id).update({
          ['Interested.' + fire.auth().currentUser.uid]: true
      })
    }
    else {
      this.props.setModalOpen()
    }
  }

  handleCross = (_id) => {
    if (fire.auth().currentUser) {
      console.log(this.props.groupId)
      console.log(_id)
      var projects = this.state.projects
      let updatedProjects = []

      projects.forEach((project) => {
        if (project.project._id === _id) {
          console.log('Set as Interested')
          project.Interested = {}
          project.Interested[fire.auth().currentUser.uid] = false
        }
        updatedProjects.push(project)
      })
      this.setState({
          projects: updatedProjects
      })
      db.collection("Group").doc(this.props.groupId).collection("Projects")
      .doc(_id).update({
          ['Interested.' + fire.auth().currentUser.uid]: false
      })
    }
    else {
      this.props.setModalOpen()
    }
  }

  handleGroupSignUp = (project) => {
    this.props.members.forEach((member) => {
      db.collection("Engagement").where("Project", "==", project._id)
      .where("User", "==", member._id).get().then((querySnapshot) => {
        if (querySnapshot.size === 0) {
          db.collection("Engagement").add({
            "Project": project._id,
            "Project Name": project.Name,
            "User": member._id,
            "Name": member.Name.replace(/ .*/,''),
            "Project Photo": project['Featured Image'],
            "Charity":project['Charity Name'] ? project['Charity Name'] : null,
            "Charity Number": project.Charity ? project.Charity : null,
            "Volunteer Picture": member.Picture ? member.Picture : null,
            "Location": member.Location && member.privacy && member.privacy.Location
                ? member.Location : null,
            "created": new Date()
          })
        }
      })
    })
  }

  render() {
    console.log(this.state.projects)
    if (this.state.projects) {

      var projectArray = Object.values(this.state.projects)
      console.log(projectArray)



      return (
        <div>
          <MediaQuery minDeviceWidth={700}>
            <h1 className='desktop-header' style={{marginTop: 16}}>
              Potential Projects</h1>
            {
              this.state.projects.map((project) => (
                <div>
                  {project.project ?
                    <div>
                      <div style={{border: '1px solid rgb(221, 221, 221)', borderRadius: 6}}>
                        <div style={{display: 'flex'}}>
                          <Link as={`/projects/p/${project.project._id}`} href={`/project?project=${project.project._id}`}>
                            <img src={changeImageAddress(project.project['Featured Image'], '500xauto')}
                              style={{flex: 1, height: 180, width: 250, objectFit: 'cover'}}/>
                          </Link>
                          <div style={{flex: 3, fontSize: '18px', fontWeight: 200, paddingLeft: 16,
                          paddingTop: 10}}>
                            <div style={{fontWeight: 700, fontSize: '26px'}}>
                              {project.project.Name}
                            </div>
                            <InterestedAvatars
                              setModalOpen={this.props.setModalOpen}
                              members={this.props.members}
                              Interested={project.Interested}/>
                          </div>
                          <div style={{width: 170}}>
                            <div style={{flex: 3,textAlign: 'center', fontSize: '18px', boxSizing: 'border-box',
                              fontWeight: 200,
                            paddingTop: 45.2, paddingBottom: 10}}>
                              Are you interested?
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                              <IconButton style={{padding: 0}}
                                onClick={() => this.handleTick(project.project._id)}
                                >
                                <CleanTick
                                  color={project.Interested && fire.auth().currentUser &&
                                    project.Interested[fire.auth().currentUser.uid] === false ?
                                    grey200 : '#3B9E74'
                                  }
                                  />
                              </IconButton>
                              <IconButton
                                onClick={() => this.handleCross(project.project._id)}
                                 style={{padding: 0, marginLeft: 20}}>
                                <Cross
                                  color={project.Interested && fire.auth().currentUser &&
                                    project.Interested[fire.auth().currentUser.uid] === true ?
                                    grey200 : 'rgb(182,48,43)'
                                  }
                                  />
                              </IconButton>
                            </div>
                          </div>

                        </div>
                        <Link as={`/projects/p/${project.project._id}`} href={`/project?project=${project.project._id}`}>
                          <div style={{
                            backgroundColor: 'rgba(250,250,250,0.8)', display: 'flex', padding: 16,
                            textAlign: 'left'}}
                            className='datetime-container'>
                            {project.project['Start Time'] ?
                            <div className='date-container' style={{display: 'flex', minWidth: 160}}>
                              <div className='date-icon'>
                                <CalendarIcon color={'black'} style={{height: 20, width: 20, marginRight: 10}}/>
                              </div>
                              <div>
                                {project.project['Start Time'].toLocaleString('en-gb',
                                  {weekday: 'long', month: 'long', day: 'numeric'})}
                              </div>
                            </div>
                            : null}
                            {project.project['Start Time'] ?
                            <div className='time-container' style={{display: 'flex', marginLeft: 24, minWidth: 140}}>
                              <div className='time-icon'>
                                <Clock color={'black'} style={{height: 20, width: 20, marginRight: 10}}/>
                              </div>
                              <div >
                                {project.project['Start Time'].toLocaleString('en-gb',
                                  {hour: '2-digit', minute: '2-digit'})} -
                                  {project.project['End Time'].toLocaleString('en-gb',
                                    {hour: '2-digit', minute: '2-digit'})}
                              </div>
                            </div>
                            : null}


                            {project.project.Location || project.project.Remote ?
                              <div className='location-container' style={{display: 'flex', marginLeft: 24}}>
                                <div className='location-icon'>
                                  <Place color={'black'} style={{height: 20, width: 20, marginRight: 10}}/>
                                </div>
                                {
                                  project.project.Location ?
                                  <a href={`https://www.google.com/maps/?q=${project.project.Location}`} target='_blank' rel='noopener' style={{color: '#65A1e7', textAlign: 'left'}}>
                                    {project.project.Location}
                                  </a>
                                  :
                                  'Remote'
                                }
                              </div>
                              : null
                            }
                          </div>
                        </Link>
                        {project.Leader && fire.auth().currentUser && project.Leader[fire.auth().currentUser.uid] ?
                          <div style={{backgroundColor: '#e1f5fe', color: '#0288d1', padding: 16}}>
                            <div style={{display: 'flex'}}>
                              <Star color={'#0288d1'} style={{marginRight: 10}}/>
                              Since you're the project leader, you get to make the decisions


                            </div>
                            <div style={{fontWeight: 700, paddingLeft: 34,
                                paddingTop: 20,
                                  display: 'block'}}>
                              <div style={{paddingBottom: 20}}>
                                When you're ready you can add everyone who's said they're interested.
                              </div>
                              <RaisedButton
                                onClick={() => this.handleGroupSignUp(project.project)}
                                labelStyle={{fontWeight: 700, letterSpacing: 0.6}}
                                  label="We're ready, sign us up"/>
                            </div>
                          </div>
                          :
                          null
                        }



                      </div>
                      <Divider style={{marginTop: 20, marginBottom: 20}}/>
                      </div>
                    :
                    null
                  }
                </div>
              ))
            }
          </MediaQuery>
          <MediaQuery maxDeviceWidth={700}>
            {
              this.state.projects.map((project) => (
                <div>
                  {project.project ?
                    <div>
                      <div style={{border: '1px solid rgb(221, 221, 221)', borderRadius: 6}}>
                        <Link as={`/projects/p/${project.project._id}`} href={`/project?project=${project.project._id}`}>
                          <img src={changeImageAddress(project.project['Featured Image'], '500xauto')}
                            style={{width: '100%', height: 180, objectFit: 'cover'}}/>
                        </Link>
                        <div style={{fontWeight: 700, fontSize: '26px', padding: 10, textAlign: 'left'}}>
                          {project.project.Name}
                        </div>
                        <div style={{flex: 3, fontSize: '18px', fontWeight: 200, paddingLeft: 10,
                        paddingTop: 10, textAlign:'left'}}>

                        <InterestedAvatars members={this.props.members}
                          setModalOpen={this.props.setModalOpen}
                          Interested={project.Interested}/>
                        </div>
                        <div style={{display: 'flex'}}>


                          <div style={{width: '100%', paddingLeft: 10, textAlign: 'left'}}>
                            <div style={{flex: 3, fontSize: '18px', boxSizing: 'border-box',
                              fontWeight: 200,
                            paddingTop: 16, paddingBottom: 10}}>
                              Are you interested?
                            </div>
                            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center',
                            paddingBottom: 10}}>
                              <IconButton style={{padding: 0}}
                                onClick={() => this.handleTick(project.project._id)}
                                >
                                <CleanTick
                                  color={project.Interested && fire.auth().currentUser &&
                                    project.Interested[fire.auth().currentUser.uid] === false ?
                                    grey200 : '#3B9E74'
                                  }
                                  />
                              </IconButton>
                              <IconButton
                                onClick={() => this.handleCross(project.project._id)}
                                 style={{padding: 0, marginLeft: 20}}>
                                <Cross
                                  color={project.Interested && fire.auth().currentUser &&
                                    project.Interested[fire.auth().currentUser.uid] === true ?
                                    grey200 : 'rgb(182,48,43)'
                                  }
                                  />
                              </IconButton>
                            </div>
                          </div>

                        </div>
                        <Link as={`/projects/p/${project.project._id}`} href={`/project?project=${project.project._id}`}>
                          <div style={{
                            backgroundColor: 'rgba(250,250,250,0.8)',  paddingLeft: 10,
                            paddingTop: 20, paddingBottom: 20,
                            textAlign: 'center'}}
                            className='datetime-container'>
                            {project.project['Start Time'] ?
                            <div className='date-container' style={{display: 'flex', minWidth: 160}}>
                              <div className='date-icon'>
                                <CalendarIcon color={'black'} style={{height: 20, width: 20, marginRight: 10}}/>
                              </div>
                              <div>
                                {project.project['Start Time'].toLocaleString('en-gb',
                                  {weekday: 'long', month: 'long', day: 'numeric'})}
                              </div>
                            </div>
                            : null}
                            {project.project['Start Time'] ?
                            <div className='time-container' style={{paddingTop: 6, display: 'flex',  minWidth: 140}}>
                              <div className='time-icon'>
                                <Clock color={'black'} style={{height: 20, width: 20, marginRight: 10}}/>
                              </div>
                              <div >
                                {project.project['Start Time'].toLocaleString('en-gb',
                                  {hour: '2-digit', minute: '2-digit'})} -
                                  {project.project['End Time'].toLocaleString('en-gb',
                                    {hour: '2-digit', minute: '2-digit'})}
                              </div>
                            </div>
                            : null}


                            {project.project.Location || project.project.Remote ?
                              <div className='location-container' style={{paddingTop: 6,display: 'flex'}}>
                                <div className='location-icon'>
                                  <Place color={'black'} style={{height: 20, width: 20, marginRight: 10}}/>
                                </div>
                                {
                                  project.project.Location ?
                                  <a href={`https://www.google.com/maps/?q=${project.project.Location}`} target='_blank' rel='noopener' style={{color: '#65A1e7', textAlign: 'left'}}>
                                    {project.project.Location}
                                  </a>
                                  :
                                  'Remote'
                                }
                              </div>
                              : null
                            }
                          </div>
                        </Link>
                        {project.Leader && fire.auth().currentUser &&
                          project.Leader[fire.auth().currentUser.uid] ?
                          <div style={{backgroundColor: '#e1f5fe', color: '#0288d1',
                            textAlign: 'left', padding: 16}}>
                            <div style={{display: 'flex'}}>
                              <Star color={'#0288d1'} style={{marginRight: 10}}/>
                              Since you're the project leader, you get to make the decisions


                            </div>
                            <div style={{fontWeight: 700, paddingLeft: 24,
                                paddingTop: 20,
                                  display: 'block'}}>
                              <div style={{paddingBottom: 20}}>
                                When you're ready you can add everyone who's said they're interested.
                              </div>
                              <RaisedButton
                                onClick={() => this.handleGroupSignUp(project.project)}
                                labelStyle={{fontWeight: 700, letterSpacing: 0.6}}
                                  label="We're ready, sign us up"/>
                            </div>
                          </div>
                          :
                          null
                        }



                      </div>
                      <Divider style={{marginTop: 20, marginBottom: 20}}/>
                      </div>
                    :
                    null
                  }
                </div>
              ))
            }
          </MediaQuery>

        </div>
      )
    }
    else {
      return (
        null
      )
    }
  }
}

export class GroupProjects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
    console.log(this.props)
  }

  componentDidMount(props) {
    db.collection("Group").doc(this.props.groupId).collection("Projects").get()
    .then((querySnapshot) => {
      let data = []
      querySnapshot.forEach((doc) => {
        let elem = doc.data()

        db.collection("Project").doc(doc.id).get().then((project) => {
          var projectData = project.data()
          elem.project = projectData
          if (new Date(projectData['End Time']) < new Date()) {
            data.push(elem)

          }

          this.setState({projects: data})
        })
        console.log(this.state.projects)
      })

    })
  }

  render() {
    if (this.state.projects) {
      var projectArray = Object.values(this.state.projects)
    }

    return (
      <div>
        <MediaQuery minDeviceWidth={700}>
          <h1 className='desktop-header' style={{marginTop: 16}}>
            Previous Projects</h1>
          <Masonry
            breakpointCols={2}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column">
            {projectArray ?
              projectArray.map((project) => (
              <div style={{padding: 20, minWidth: 280, boxSizing: 'border-box', width: '100%', position: 'relative'}}>
                <EmbeddedProject style={{position: 'relative'}}
                  noLogo={true} projectId={project.project._id}/>
              </div>
            ))
            : null
            }
          </Masonry>
        </MediaQuery>
        <MediaQuery maxDeviceWidth={700}>
          {projectArray ?
            projectArray.map((project) => (
            <div style={{padding: 16, boxSizing: 'border-box', width: '100%', position: 'relative'}}>
              <EmbeddedProject style={{position: 'relative'}}
                noLogo={true} projectId={project.project._id}/>
            </div>
          ))
          : null
          }
        </MediaQuery>
      </div>
    )
  }
}

export class GroupMembers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {members: this.props.members}
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps != this.props) {
      this.setState({members: nextProps.members})
    }
  }

  render() {
    return (
      <div style={{display: 'flex', flexWrap: 'wrap'}}>
        {this.state.members ? this.state.members.map((eng) => (
          <Link href={`/profile?user=${eng._id}`} as={'/profile/' + eng._id}>
            <ul style={{textAlign: 'left', alignItems: 'center',
              borderBottom: '1px solid #DDDDDD', height: '60px',
              width: 150,
               fontSize: '10px', display: 'flex'}}>
              {eng['Volunteer Picture'] ?

              <Avatar src={changeImageAddress(eng['Volunteer Picture'], '40xauto')}/>:
                <Avatar>{eng['Name'] ? eng['Name'].substring(0,1) : null}</Avatar>}
              <div style={{flex: 2, paddingLeft: '24px',display: 'flex', alignItems: 'center'}}>
                <div>
                  <b>{eng['Name']}</b>
              </div>
              </div>
            </ul>
          </Link>
        )) : null}
      </div>
    )
  }
}

class GroupPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {userIsMember: false, selected: 'projects', inkBarLeft: 20.2,
    modalOpen: false}
  }

  componentDidMount(props) {
    db.collection("Group").doc(Router.query.groupId).get().then((doc) => {
      var elem = doc.data()
      elem._id = doc.id
      this.setState({group: elem})
    })

    db.collection("Group").doc(Router.query.groupId).collection("Members")
    .get().then((querySnapshot) => {
      var data = []
      querySnapshot.forEach((doc) => {
        var user = doc.data()
        user._id = doc.id
        if (fire.auth().currentUser && doc.id === fire.auth().currentUser.uid) {
          this.setState({userIsMember: true})
        }
        data.push(user)
        this.setState({members: data})
      })
    })
  }

  upload(file, rej) {
    console.log(this.state)
    console.log(file)
    console.log(rej)
    this.setState({uploading: true, uploadComplete: false})
    fetch('https://3ymyhum5sh.execute-api.eu-west-2.amazonaws.com/prod/getS3Url')
      .then(response => response.json())
      .then(function(data) {
        var stripped = data.substring(data.indexOf('amazonaws.com/') + 14, data.indexOf('?'))
        var imageUrl = 'https://d3kkowhate9mma.cloudfront.net/' + stripped


        console.log(changeImageAddress(imageUrl, '250xauto'))
        this.setState({imageUrl: imageUrl})
        db.collection("Group").doc(Router.query.groupId).update({
          'Featured Image': imageUrl
        })
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                console.log(xhr.responseText);
                if (this.props.changeParentState) {
                  this.props.changeParentState()
                }
                this.setState({uploadComplete: true, uploading: false})
            }
        }.bind(this)

        xhr.open('PUT', data , true);
        xhr.setRequestHeader('Content-Type', file[0].type);
        xhr.send(file[0]);

      }.bind(this))
      .catch(error => this.setState({ error }));

  }

  changeAnchorEl = (e) => {
    console.log('handleMultipleChoiceClick')
    e.preventDefault()
    console.log(e)
    var rect = e.target.getBoundingClientRect()
    console.log(rect)
    this.setState({inkBarLeft: (rect.width-60)/2  + rect.x -100,
    })
  }

  handleTwoTabClick = (value) => {
    this.setState({selected: value})
  }

  handleJoinGroup = () => {
    if (fire.auth().currentUser) {
      db.collection("User").doc(fire.auth().currentUser.uid).get().then((doc) => {
        var userName = doc.data().Name.replace(/ .*/,'')
        var updateString = "members." + fire.auth().currentUser.uid
        console.log(updateString)
        db.collection("Group").doc(Router.query.groupId).update({
          [updateString] : true
        })
        db.collection("Group").doc(Router.query.groupId).collection("Members")
        .doc(fire.auth().currentUser.uid).set({
          Name: userName
        }).then(() => {
          db.collection("Group").doc(Router.query.groupId).collection("Members")
          .get().then((querySnapshot) => {
            var data = []
            querySnapshot.forEach((doc) => {
              var user = doc.data()
              user._id = doc.id
              if (fire.auth().currentUser && doc.id === fire.auth().currentUser.uid) {
                this.setState({userIsMember: true})
              }
              data.push(user)
              this.setState({members: data})
            })
          })
        })
      })

    }
  }

  handleModalChangeOpen = (e) => {
    this.setState({modalOpen: false})
  }



  render() {
    var imageUrl
     if(this.state.imageUrl) {
       imageUrl = this.state.imageUrl
     } else if (this.props.imageUrl) {
       imageUrl = this.props.imageUrl
     } else if (typeof window !== 'undefined' && localStorage.getItem('coverPhoto') === 'undefined') {
       imageUrl = null
     } else {
       imageUrl = typeof window !== 'undefined' ? localStorage.getItem('coverPhoto') : null
     }
     console.log(imageUrl)

    return (
      <App>
        {this.state.group ?
          <div>
            <DocumentTitle title={this.state.group.Name}/>

              {this.state.group['Featured Image'] ?
              <img
                onMouseEnter={this.handleDropzoneEnter}
                src={this.state.group['Featured Image'] ?
                  changeImageAddress(this.state.group['Featured Image'], '1500xauto')
                  : null
                }
                style={{height: '45vh', width: '100%', position: 'relative',
                  objectPosition: this.state.group.imageY ? `50% ${this.state.group.imageY}`  : '50% 50%'
                , objectFit: 'cover'}}/>
              :
              <Dropzone key={'photos'} onDrop={this.upload.bind(this)}
                onMouseEnter={this.handleDropzoneEnter}
                onMouseLeave={this.handleDropzoneLeave}
                 style={{}}>
                    {({ isDragActive, isDragReject }) => {
                      let styles = {
                        width: '100%',
                        height: '40vh',
                        textAlign: 'center',
                        justifyContent: 'center',
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid #DDDDDD',
                        borderRadius: 6,
                        color: grey500,
                        flexDirection: 'column'

                      }

                      const acceptedStyles = {
                        ...styles,
                        borderStyle: 'solid',
                        borderColor: '#6c6',
                        backgroundColor: '#eee'
                      }

                      const rejectStyles = {
                        ...styles,
                        borderStyle: 'solid',
                        borderColor: '#c66',
                        backgroundColor: '#eee'
                      }

                      if (isDragActive) {
                        return (
                          <div style={acceptedStyles}>
                            File will be accepted
                          </div>
                        )
                      }
                      if (isDragReject) {
                        return (
                          <div style={rejectStyles}>
                            File will be rejected
                          </div>
                        )
                      }
                      // Default case
                      return (
                        <div style={styles}>
                          {this.state.uploading ?
                          <div style={{height: '70vh', width: '100%', display: 'flex',
                            alignItems: 'center', justifyContent: 'center'}}>
                            <CircularProgress size={80} thickness={5} />
                          </div>
                          :
                            (localStorage.getItem('coverPhoto') && !this.state.uploadComplete) || this.props.imageUrl ?
                            <div style={{position: 'relative', height: '100%', width: '100%'}}>
                              <img src={imageUrl}
                              style={{boxSizing: 'border-box', position: 'relative', width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px'}}/>
                            {this.state.dropzoneHover ?
                              <RaisedButton label='Change Photo'
                                style={{padding: 0, position: 'absolute', top: 'calc(50% - 20px)', right: 'calc(50% - 98px)', height: 40, zIndex: 10}}
                                icon={<CloudUpload />}
                                labelStyle={{textTransform: 'none', fontFamily: 'Permanent Marker', fontSize: '20px'}}
                                primary={true}
                                />
                              :
                              null}

                            </div>
                            :
                            this.state.uploadComplete  ?
                            <div style={{position: 'relative', height: '100%', width: '100%'}}>
                              <img src={imageUrl}
                        style={{padding: 16, boxSizing: 'border-box', position: 'relative', width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px'}}/>
                        {this.state.dropzoneHover ?
                          <RaisedButton label='Change Photo'
                            style={{padding: 0, position: 'absolute', top: 'calc(50% - 20px)', right: 'calc(50% - 98px)', height: 40, zIndex: 10}}
                            icon={<CloudUpload />}
                            labelStyle={{textTransform: 'none', fontFamily: 'Permanent Marker', fontSize: '20px'}}
                            primary={true}
                            />
                          :
                          null}
                            </div>
                            :
                            <div>
                              <RaisedButton label='Upload Photo'
                                icon={<CloudUpload />}
                                labelStyle={{textTransform: 'none', fontFamily: 'Permanent Marker', fontSize: '20px'}}
                                primary={true}
                                />
                              <div style={{marginTop: '20px', fontWeight: 700}}>or drag one in</div>
                            </div>
                        }



                        </div>
                      )
                    }}
                  </Dropzone>}

                <MediaQuery minDeviceWidth={700}>
                <div className='container' style={{width: '100%', paddingRight: 100, paddingTop: 30,
                    paddingLeft: 100, display: 'flex', boxSizing: 'border-box'}}>
                    <p className='mobile-project-title'
                      style={{fontSize: '32px', fontWeight: 'bold',
                        textAlign: 'left', width: '100%',
                      margin: 0}}>
                      {this.state.group.Name}
                    </p>
                </div>
                <div style={{ paddingLeft: 100, paddingRight: 100}}>
                  {this.state.members ?
                    <GroupMembers members={this.state.members}/>
                    :
                    null
                  }
                </div>

                <div style={{paddingLeft: 100, paddingRight: 100,
                    width: '100%', boxSizing: 'border-box'}}>
                  <div>
                    {
                      this.state.userIsMember ?
                      null :
                      <RaisedButton
                        labelStyle={styles.buttonLabel}
                        primary={true}
                        onClick={
                          fire.auth().currentUser ?
                          this.handleJoinGroup : () => this.setState({modalOpen: true})}
                        label='Join Group'/>
                    }
                    <SignupModal
                      open={this.state.modalOpen}
                      changeOpen={this.handleModalChangeOpen}
                    onComplete={this.handleJoinGroup}/>
                  </div>
                  <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    <div style={{minWidth: 500, width: '70%', marginRight: 100}}>
                      <Tabs
                          tabItemContainerStyle={{height: '60px', backgroundColor: 'white', borderBottom: '1px solid #DDDDDD'}}
                          value={Router.query.tab}
                          onChange={this.handleTwoTabClick}
                          inkBarStyle={{zIndex: 2, backgroundColor: '#000AB2',
                          left:this.state.inkBarLeft, width: '60px'}}
                        >
                          <Tab label="Projects"
                            style={{width: 'auto', fontSize: '16px'}}
                            onTouchTap={this.changeAnchorEl}
                            buttonStyle={this.state.selected === 'projects' ? styles.selectedTab : styles.tab}
                            value="projects">
                            {this.state.members ?
                             <div>
                               <UpcomingProjects members={this.state.members}
                                 setModalOpen={() => this.setState({modalOpen: true})}
                                 groupId={Router.query.groupId}/>

                                 <GroupProjects groupId={Router.query.groupId}
                                    members={this.state.members}/>

                             </div>
                             :
                             null
                           }
                          </Tab>

                      </Tabs>
                    </div>
                    <div style={{minWidth: 250, flex: 1}}>
                      <div style={{paddingLeft: 16, borderBottom: '1px solid #DDDDDD', height: 60,
                            display: 'flex', alignItems: 'center', textAlign: 'left'}}>
                        <b>Invite some more people</b>
                      </div>
                      { typeof window !== undefined ?
                      <Share
                        buttonClicked={() => {}}
                        Name={this.state.Name ? this.state.Name : ''}
                        url={window.location.href}
                        smsbody={encodeURIComponent("Join my group on Time to Spare: " + window.location.href )}
                        emailbody={encodeURIComponent("Join my group on Time to Spare: " +  window.location.href )}
                        />
                      :
                      null}
                      <div style={{paddingLeft: 16, paddingTop: 40, borderBottom: '1px solid #DDDDDD', height: 60,
                              display: 'flex', alignItems: 'center', textAlign: 'left'}}>


                          <b>Reviews</b>
                        </div>
                        {this.state.members ?
                          <GroupReviews members={this.state.members}/>
                          :
                          null
                        }

                      <div>

                      </div>
                    </div>
                  </div>
                </div>

            </MediaQuery>
            <MediaQuery maxDeviceWidth={700}>
              <div style={{padding: '16px'}}>
                <div className='container' style={{width: '100%', display: 'flex', boxSizing: 'border-box'}}>
                    <p className='mobile-project-title'
                      style={{fontSize: '32px', fontWeight: 'bold',
                        textAlign: 'left', width: '100%',
                      margin: 0}}>
                      {this.state.group.Name}
                    </p>
                </div>
                {this.state.members ?
                  <GroupMembers members={this.state.members}/>
                  :
                  null
                }
                <div>
                  {
                    this.state.userIsMember ?
                    null :
                    <RaisedButton
                      labelStyle={styles.buttonLabel}
                      primary={true}
                      onClick={fire.auth().currentUser ?
                      this.handleJoinGroup : () => this.setState({modalOpen: true})}
                      label='Join Group'/>
                  }
                  <SignupModal
                    open={this.state.modalOpen}
                    changeOpen={this.handleModalChangeOpen}
                  onComplete={this.handleJoinGroup}/>
                </div>

                <div>
                  <h2 style={{fontSize: '20px', textAlign: 'left'}}>
                    Potential Projects
                  </h2>
                  {this.state.members ?
                    <UpcomingProjects groupId={Router.query.groupId}
                      members={this.state.members}/>
                    :
                    null
                  }
                </div>

                <div>
                  <h2 style={{fontSize: '20px', textAlign: 'left'}}>
                    Invite some more people
                  </h2>
                  { typeof window !== undefined ?

                  <Share
                    buttonClicked={() => {}}
                    Name={this.state.Name ? this.state.Name : ''}
                    url={window.location.href }
                    smsbody={encodeURIComponent("Join my group on Time to Spare: " + window.location.href)}
                    emailbody={encodeURIComponent("Join my group on Time to Spare: " +  window.location.href )}
                    />
                  :
                  null}
                </div>

                <div>
                  <h2 style={{fontSize: '20px', textAlign: 'left'}}>
                    Group Reviews
                  </h2>
                  {this.state.members ?
                    <GroupReviews members={this.state.members}/>
                    :
                    null
                  }
                </div>

                <div>
                  <h2 style={{fontSize: '20px', textAlign: 'left'}}>
                    Group Projects
                  </h2>
                  {this.state.members ?
                    <GroupProjects groupId={Router.query.groupId}
                      members={this.state.members}/>
                    :
                    null
                  }
                </div>

              </div>
            </MediaQuery>

          </div>
        :
        <div>
          .
        </div>
      }
    </App>
    )
  }
}

export default withMui(GroupPage)
