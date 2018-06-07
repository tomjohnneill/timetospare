import React , {PropTypes} from 'react';
import {grey200, grey500, grey100, amber500, grey300, lightBlue50, blue500, yellow600} from 'material-ui/styles/colors'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';
import Divider from 'material-ui/Divider';
import {Tabs, Tab} from 'material-ui/Tabs';
import Dialog from 'material-ui/Dialog';
import Link from "next/link"
import Router from 'next/router'
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import DocumentTitle from 'react-document-title';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import CircularProgress from 'material-ui/CircularProgress';
import FontIcon from 'material-ui/FontIcon';
import ShowChart from 'material-ui/svg-icons/editor/show-chart';
import Email from 'material-ui/svg-icons/communication/email';
import SignupModal from './signupmodal.jsx';
import Loading from './loading.jsx';
import Snackbar from 'material-ui/Snackbar';
import {Spiral, CalendarIcon, Place, Clock, World, Tick} from './icons.jsx';
import Share from './share.jsx'
import {List, ListItem} from 'material-ui/List';
import GroupSignUp from './groups/groupsignup.jsx';
import Suggest from './groups/suggest.jsx';
import {ProjectReviewComponent} from './casestudy.jsx';
import {withScriptjs,  withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import fire from '../fire';

  let db = fire.firestore()
  const { MarkerWithLabel } = require("react-google-maps/lib/components/addons/MarkerWithLabel")

  const style = {margin: 5};

  const styles = {
    box: {
      backgroundColor: grey200,
      marginTop: '10px',
      marginBottom: '10px',
      padding: '10px'
    },
    header: {
      backgroundColor: 'white',
      fontSize: '20pt',
      fontWeight: 'bold',
      padding: '10px',
    },
    cardTitle: {
      display: 'flex',
      marginTop: '10px'
    },
    bigTitle: {
      width: '50%',
      fontStyle: 'italic',
      color: grey500
    },
    currentCommitments: {
      textAlign: 'center',

    },
    targetCommitments: {
      textAlign: 'center'
    },
    smallIcon: {
      width: 24,
      height: 24,
      color: 'white',
    },
    mediumIcon: {
      width: 48,
      height: 48,
    },
    largeIcon: {
      width: 60,
      height: 60,
    },
    small: {
      width: 36,
      height: 36,
      padding: '4px 4px 4px 20px'
    },
    medium: {
      width: 96,
      height: 96,
      padding: 24,
    },
    large: {
      width: 120,
      height: 120,
      padding: 30,
    },
    number: {
      color: '#E55749',
      fontSize: '20px',

    },
    bottomBit: {
      marginTop: '-5px',
      fontWeight: 'lighter',
      width: '100%',
      color: grey500,
      textAlign: 'left'
    },
    chip: {
    margin: 4,
  },
  explanation: {
    fontSize: '8pt',
    color: grey500
  },     selectedTab: {
      height: '36px',
      backgroundColor: 'white',
      color: '#E55749',
      textTransform: 'none',
      letterSpacing: '0.4px',
      lineHeight: '16px',
      fontWeight: 700,
      paddingLeft: '20px',
      paddingRight: '20px',
    },
    tab: {
      height: '36px',
      backgroundColor: 'white',
      color: '#484848',
      textTransform: 'none',
      letterSpacing: '0.4px',
      lineHeight: '16px',
      paddingLeft: '20px',
      paddingRight: '20px',

    },
    contactIcon: {
      flex: 1,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }
  }



  var _MS_PER_DAY = 1000 * 60 * 60 * 24;

  export function changeImageAddress(file, size) {
    if (file && file.includes('https://d3kkowhate9mma.cloudfront.net')) {
      var str = file, replacement = '/' + size + '/';
      str = str.replace(/\/([^\/]*)$/,replacement+'$1');
      return(str + '?pass=this')
    } else {
      return (file)
    }
  }

  // a and b are javascript Date objects
  export function dateDiffInDays(a, b) {
    // Discard the time and time-zone information.
    try {
      var utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
      var utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    } catch(err) {
      var utc1 = 0
      var utc2 = 1
    }

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }

  function readableTimeDiff(a, b) {
    try{
      var diff = Math.abs(a - b)
      console.log(diff)
      if (diff/1000 < 60) {
        return `${Math.round(diff/1000)} seconds ago`
      } else if (diff/1000/60 < 60) {
        return `${Math.round(diff/1000/60)} minutes ago`
      } else if (diff/1000/60/60 < 24) {
        return `${Math.round(diff/1000/60/60)} hours ago`
      } else if (diff/1000/60/60/24/14 < 2) {
        return `${Math.round(diff/1000/3600/24)} days ago`
      } else {
        return `${Math.round(diff/1000/3600/24/7)} weeks ago`
      }
    }
    catch(err) {
      return null
    }
  }


  export const MyMapComponent = withScriptjs(withGoogleMap((props) =>
    <GoogleMap
      defaultZoom={10}
      defaultCenter={props.Geopoint}
    >
    <MarkerWithLabel
        position={props.Geopoint}
        labelAnchor={new window.google.maps.Point(0, 0)}
        labelStyle={{backgroundColor: 'rgba(255,255,255,0.7)', padding: 4, borderRadius: 2}}
      >
        <div>{props.address}</div>
      </MarkerWithLabel>
      {props.isMarkerShown && <Marker position={props.Geopoint} />}
    </GoogleMap>
  ))

  class CompletedModal extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
      return (
        <div>
          <Dialog
            modal={false}
            open={this.props.open}
            style={{paddingTop: 0}}
            actions={[
              <div style={{padding: 20}}>
                <FlatButton onClick={this.props.handleClose}
                primary={true}
                labelStyle={{textTransform: 'none', fontSize: '25px', fontWeight: 700}}
                label='OK'/>
          </div>]}
            onRequestClose={this.props.handleClose}
          >
          <div style={{maxWidth: '1000px', width: '100%', padding: 40, boxSizing: 'border-box', textAlign: 'left'}}>
            <div style={{display: 'flex', height: 150, alignItems: 'center', justifyContent: 'center'}}>

                <Tick style={{height: 150}} color={'#3B9E74'}/>


            </div>
            <div style={{fontSize: '40px', fontWeight: 'bold', textAlign: 'left', marginBottom: 16}}>
            Nice, you've started a project.
            </div>
            <div style={{marginBottom: '16px', fontWeight: 'lighter', fontSize: '28px'}}>
              We'll just need to approve it before other people can see it.
            </div>


            <div style={{textAlign: 'left'}}>
              <div style={{width: '60%'}}>
              </div>

              <div style={{marginTop: '30px'}}>


              </div>
            </div>
          </div>
          </Dialog>
        </div>
      )
    }
  }

  export class WhosIn extends React.Component{
    constructor(props) {
      super(props);
      this.state = {}
    }

    componentDidMount(props) {
      var attendees = 0
      db.collection("Engagement").where("Project", "==", this.props.project._id).get().then((querySnapshot) => {
        var data = []
        querySnapshot.forEach((doc) => {
          console.log(doc.data())
          var elem = doc.data()
          elem['_id'] = doc.id
          data.push(elem)
        });
        this.setState({engagements: data, loading: false})
        console.log(data.length)
        attendees += data.length
        console.log(attendees)
        if (this.props.setAttendeeCount) {
          this.props.setAttendeeCount(attendees)
        }
      });

      if (this.props.project.MeetupLink) {
        var link = this.props.project.MeetupLink
        link = link.replace('https://www.meetup.com/', '')
        var pathname = link.split( '/' )

        fetch(`https://us-central1-whos-in-dev.cloudfunctions.net/getMeetupRSVPs?eventId=${pathname[2]}&group=${pathname[0]}`)
        .then(response => response.json())
        .then(data => {
          this.setState({meetupRSVPS: data.rsvps})
          attendees += data.rsvps.length
          console.log(attendees)
          if (this.props.setAttendeeCount) {
            this.props.setAttendeeCount(attendees)
          }
        })
      }

      if (this.props.setAttendeeCount) {
        this.props.setAttendeeCount(attendees)
      }
      }

    render() {
      return (
        <div>
          {this.state.engagements ?
            this.state.engagements.map((eng) => (
              <Link href={'/profile?user=' + eng.User} as={'/profile/' + eng.User}>
              <ul style={{textAlign: 'left', alignItems: 'center', borderBottom: '1px solid #DDDDDD', height: '60px', fontSize: '10px', display: 'flex'}}>
                {eng['Volunteer Picture'] ?

                <Avatar src={changeImageAddress(eng['Volunteer Picture'], '40xauto')}/>:
                  <Avatar>{eng['Name'] ? eng['Name'].substring(0,1) : null}</Avatar>}
                <div style={{flex: 2, paddingLeft: '24px',display: 'flex', alignItems: 'center'}}>
                  <div>
                    <b>{eng['Name']}</b> <br/>
                  {eng['Location']}
                </div>
                </div>
                <div style={{flex: 1, display: 'flex', alignItems: 'center'}}>
                  {eng['created'] ? readableTimeDiff(new Date(), eng['created']) : null}
                </div>
              </ul>
              </Link>
            ))
            :
            null}
            {this.state.meetupRSVPS ?
              this.state.meetupRSVPS.map((eng) => (

                <ul style={{textAlign: 'left', alignItems: 'center', borderBottom: '1px solid #DDDDDD', height: '60px', fontSize: '10px', display: 'flex'}}>
                  {eng.Photo ?

                  <Avatar src={eng.Photo}/>:
                    <Avatar>{eng['Name'] ? eng['Name'].substring(0,1) : null}</Avatar>}
                  <div style={{flex: 2, paddingLeft: '24px',display: 'flex', alignItems: 'center'}}>
                    <div>
                      <b>{eng['Name']}</b> <br/>
                    via Meetup
                  </div>
                  </div>
                  <div style={{flex: 1, display: 'flex', alignItems: 'center'}}>
                    {eng['created'] ? readableTimeDiff(new Date(), new Date(eng['created'])) : null}
                  </div>
                </ul>

              ))
              :
              null}

        </div>
      )
    }
  }

  export default class DesktopProject extends React.Component {
    constructor(props) {
      super(props);
      this.state = {open: false, adminDrawerOpen: false, selectedIndex: 0
        , loading: true, selected: 'story', inkBarLeft: '30px', conditionalStatus: false,
      challengeExists: false, completedOpen: false
      }
    }

    componentDidMount(props) {
      let project = this.props.project
      if (typeof project['Start Time'] === 'string') {
        project['Start Time'] = new Date(project['Start Time'])
        project['End Time'] = new Date(project['End Time'])
      }

      this.setState({project: project, charity: this.props.charity, loading: false, creator: this.props.creator})

      if (window.location.pathname.substr(window.location.pathname.length - 10) === '/completed') {

        setTimeout(function() { this.setState({completedOpen: true}); }.bind(this), 2000);
      }
    }

    componentWillReceiveProps(nextProps) {
      if (this.props !== nextProps) {
        let project = nextProps.project
        if (typeof project['Start Time'] === 'string') {
          project['Start Time'] = new Date(project['Start Time'])
          project['End Time'] = new Date(project['End Time'])
        }
        this.setState({project: nextProps.project})
        this.setState({projectReviews: nextProps.projectReviews})
        this.setState({charity: nextProps.charity, creator: nextProps.creator})
      }
    }

    deleteEngagement = () => {
      console.log('remove engagement')
        db.collection("Engagement").where("Project", "==", this.props.project._id)
        .where("User", "==", fire.auth().currentUser.uid).get().then((querySnapshot) => {
            querySnapshot.forEach(function(doc) {
              doc.ref.delete();
            })
        })
      .catch(error => {this.setState({error: error}); console.log(error)})
      this.forceUpdate()
    }

    addToWaitingList = () => {
      db.collection("Project").doc(this.props.project._id).collection("WaitingList").add({
        user: fire.auth().currentUser.uid
      }).then(
        () => this.setState({waitingListAdded: true})
      )
    }

    handleRequestClose = () => {
      this.setState({waitingListAdded: false})
    }

    createEngagement = () => {

      console.log(this.props.project)
      console.log(fire.auth().currentUser)
      db.collection("User").doc(fire.auth().currentUser.uid).get().then((doc) => {
        var body = {
          "Project": this.props.project._id,
          "Project Name": this.props.project.Name,
          "User": fire.auth().currentUser.uid,
          "Name": doc.data().Name.replace(/ .*/,''),
          "Project Photo": this.props.project['Featured Image'],
          "Charity": this.props.project['Charity Name'] ? this.props.project['Charity Name'] : null,
          "Charity Number": this.props.project.Charity ? this.props.project.Charity : null,
          "Volunteer Picture": doc.data().Picture ? doc.data().Picture : null,
          "Location": doc.data().Location && doc.data().privacy && doc.data().privacy.Location
              ? doc.data().Location : null,
          "created": new Date()
        }
        console.log(body)
        db.collection("Engagement").where("Project", "==", this.props.project._id)
        .where("User", "==", fire.auth().currentUser.uid).get().then((querySnapshot) => {
            if (querySnapshot.size === 0) {
              var engRef = db.collection("Engagement").doc()

              engRef.set(body)
              .then(data => engRef.collection("Private").doc(this.props.project._id).
              set({
                User: fire.auth().currentUser.uid,
                Email: doc.data().Email,
                Name: doc.data().Name,
                "Volunteer Picture": doc.data().Picture ? doc.data().Picture : null,
                "Location": doc.data().Location ? doc.data().Location : null
              }))
              .catch(error => console.log('Error', error))
            }
        })

      })

      .catch(error => {this.setState({error: error}); console.log(error)})
    }

    addChallengeMember = () => {
      var challengeRef = db.collection("Project").doc(this.props.project._id).collection("Challenge").doc(this.props.challenge._id)
      challengeRef.get().then((data) => {
        var challengeMembers = data.data().challengeMembers ? data.data().challengeMembers : []
        challengeMembers.push(fire.auth().currentUser.uid)
        challengeRef.update({challengeMembers: challengeMembers})
      })
    }

    setModal = () => {
      let modal = this.state.modalOpen
      this.setState({modalOpen: !modal})
    }

    handleModal = (e) => {
      if (fire.auth().currentUser) {
        if (fire.auth().currentUser.phoneNumber || 1 === 1) {
          if (this.props.questions) {
            Router.push(window.location.href + '/questions')
          }
          else if (this.props.project['People Pledged'] >= this.props.project['Maximum People']) {
            this.addToWaitingList()
          }
          else {
            this.createEngagement()
            if (this.props.challenge) {
              this.addChallengeMember()
            }
            if (window.location.pathname.includes('/joined')) {
              Router.push(window.location.pathname)
            } else {
              Router.push(`/joined?project=${this.props.project._id}`, window.location.pathname + '/joined')
            }
          }
        } else {
            this.setState({
              modalOpen: true, modalType: 'phone'
            })
        }
      } else {
        this.setState({modalOpen: true})
      }
    }

    handleModalChangeOpen = (e) => {
      this.setState({modalOpen: false})
    }


    handleCompletedModalChangeOpen = () => {
      this.setState({completedOpen: false})
      Router.push(window.location.pathname.replace('/completed', ''))
    }

    handleDecline(e) {
      e.preventDefault()
      this.setState({open: true})
    }

    handleClose() {
    this.setState({open: false});
  };

    descriptionMarkup() {
      return {__html: this.state.project.Description ?
        this.state.project.Description.replace('<img', '<img style="width:100%;height:auto"') : this.state.project.Description}
    }

    onComplete = () => {
      if (this.state.conditionalStatus) {
        this.setState({conditionalOpen: true, conditionalStatus: false, modalOpen: false})
      }
      else if (this.props.questions) {
        Router.push(window.location.href + '/questions')
      } else if (this.props.project['People Pledged'] >= this.props.project['Maximum People']) {
        this.addToWaitingList()
      } else {
        this.createEngagement()
        Router.push(`/joined?project=${this.props.project._id}`, window.location.pathname + '/joined')
      }
    }

    handleLetsGo = (e) => {
      e.preventDefault()
      if (fire.auth().currentUser) {
        Router.push('/create-project?stage=0')
      } else {
        this.setModal()
      }

    }

    changeAnchorEl = (e) => {
      console.log('handleMultipleChoiceClick')
      e.preventDefault()
      console.log(e)
      var rect = e.target.getBoundingClientRect()
      console.log(rect)
      console.log(window.innerWidth)
      this.setState({inkBarLeft: (rect.width-60)/2  + rect.x - 100  ,

      })

    }

    handleUnJoin = (e) => {
      e.preventDefault()
      this.deleteEngagement()
      Router.push(`/declined?project=${this.props.project._id}`, window.location.pathname + '/declined')
    }

    handleChangeTab = (value) => {
      this.setState({selected: value})
    }

    handleDropzoneEnter = () => {
      this.setState({dropzoneHover: true})
    }

    handleDropzoneLeave = () => {
      this.setState({dropzoneHover: false})
    }


    changeAttendees = (attendees) => {
      var project = this.state.project
      project['People Pledged'] = attendees
      this.setState({project: project})
    }

    handleEmailOrganiser = () => {
      fetch('')
      .then(response => response.json())
      .then(data => {
        window.location.href = `mailto:${data.email}`
      })
    }

    render () {

      console.log(this.props)
      console.log(this.state)
      var badgeFill = 1


      return (
        <div>

          <Snackbar
            open={this.state.waitingListAdded}
            message="We've added you to the waiting list"
            autoHideDuration={4000}
            onRequestClose={this.handleRequestClose}
          />
          {this.state.loading ?
              <Loading />
           :
              <div >
                <img
                  onMouseEnter={this.handleDropzoneEnter}
                  src={changeImageAddress(this.state.project['Featured Image'], '1500xauto')}
                  style={{height: '400px', width: '100%', position: 'relative',
                    objectPosition: this.state.project.imageY ? `50% ${this.state.project.imageY}`  : '50% 50%'
                  , objectFit: 'cover'}}/>


                <div style={{position: 'absolute', right: 200, boxSizing: 'border-box',
                  borderRadius: '50%',
                    border: '3px solid #E55749', fontWeight: 700
                  , height: 150, width: 150, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  background: `linear-gradient( 0deg, #E55749, #E55749 ${this.state.project['People Pledged'] === undefined ? 0 : (this.state.project['People Pledged']/this.state.project['Target People'] * 100)}%,
                  white ${this.state.project['People Pledged'] === undefined ? 0 : (this.state.project['People Pledged']/this.state.project['Target People'] * 100)}%, white 100%)`,
                  top: 375, zIndex: 3}}>
                  <span style={{backgroundColor: 'rgba(255,255,255,1)', padding: 4, borderRadius: 4}}>
                    { this.state.project['People Pledged'] === undefined ?
                      0 :
                      this.state.project['People Pledged']}/{this.state.project['Target People']} people
                  </span>
                </div>


                {this.state.dropzoneHover && fire.auth().currentUser &&
                  (this.state.project.Admin && this.state.project.Admin[fire.auth().currentUser.uid]
                  || this.state.project.Creator === fire.auth().currentUser.uid)  ?
                    <RaisedButton label='Change Crop'
                      style={{padding: 0, position: 'absolute', top: 'calc(50% - 20px)', right: 'calc(50% - 98px)', height: 40, zIndex: 10}}
                      labelStyle={{fontWeight: 700}}
                      onClick={() => {localStorage.setItem('project-image', this.state.project['Featured Image'])
                        Router.push(`/crop-edit?project=${this.state.project._id}`, `${Router.asPath}/crop-edit`)}}
                      secondary={true}
                      />
                    :
                    null}
                <div className='container' style={{width: '100%', paddingRight: 100, paddingTop: 30,
                    paddingLeft: 100, display: 'flex', boxSizing: 'border-box'}}>
                  <div className='story-etc' style={{flex: 1, width: '50%'}}>
                    {fire.auth().currentUser &&
                      (this.state.project.Admin && this.state.project.Admin[fire.auth().currentUser.uid]
                      || this.state.project.Creator === fire.auth().currentUser.uid) ?
                      <div style={{display: 'flex', float: 'right'}}>
                        <FlatButton
                          secondary={true}
                          style={{marginRight: 20}}
                          label='Admin View' labelStyle={{textTransform: 'none', fontWeight: 700, padding: '10px', fontSize: '16px'}}
                            onClick={() => Router.push(`/admin?project=${this.state.project._id}&tab=admin`
                              , Router.asPath + '/admin')}
                             />
                       <FlatButton
                         secondary={true}
                         label='Edit Project' labelStyle={{textTransform: 'none', padding: '10px', fontWeight: 700,  fontSize: '16px'}}
                           onClick={() => Router.push(`/admin?project=${this.state.project._id}&tab=edit-project`
                             , Router.asPath + '/admin')}
                            />
                     </div>
                       : null
                     }
                    <p className='mobile-project-title'
                      style={{fontSize: '32px', fontWeight: 'bold', textAlign: 'left',
                      margin: 0}}>
                      {this.state.project.Name}
                    </p>

                    {this.state.project.Charity ?
                      <Link  className='charity-link' as={`/charity/${this.state.charity._id}`}
                        href={`/charity?charityId=${this.state.charity._id}`}>
                        <div className='charity-link-content'
                           style={{display: 'flex', marginTop: 6, alignItems: 'center', color: '#65A1e7'}}>
                          <div style={{marginRight: 10}} className='charity-icon'>
                            {this.state.charity['Featured Image'] ?
                              <img src={changeImageAddress(this.state.charity['Featured Image'], '50xauto')}
                                style={{height: 25, width: 25, borderRadius: '50%', objectFit: 'cover'}}/>
                              :
                              <World style={{height: 25, width: 25}} color={'#484848'}/>
                              }
                          </div>
                          <p className='charity-name' style={{margin: 0, fontSize: '14px'}}>
                              {this.state.charity.Name}
                          </p>
                        </div>
                      </Link>
                      :
                      <Link  className='charity-link' href={`/profile?user=${this.state.project.Creator}`}
                        as={`/profile/${this.state.project.Creator}`}>
                        <div className='charity-link-content'
                           style={{display: 'flex', marginTop: 6, alignItems: 'center', color: '#65A1e7'}}>
                          <div style={{marginRight: 10}} className='charity-icon'>
                            {this.state.creator && this.state.creator.Picture ?
                              <Avatar src={this.state.creator.Picture}/>
                              :
                              <Avatar>{this.state.creator ? this.state.creator.Name.substring(0,1) : null}</Avatar>
                            }

                          </div>
                          <p className='charity-name' style={{margin: 0, fontSize: '14px'}}>
                              {this.state.creator ? this.state.creator.Name : null}
                          </p>
                        </div>
                      </Link>
                    }


                    <div style={{
                      borderRadius: 4, display: 'flex',
                       paddingTop: 10, textAlign: 'left'}}
                      className='datetime-container'>
                      {this.state.project['Start Time'] ?
                      <div className='date-container' style={{display: 'flex', minWidth: 160}}>
                        <div className='date-icon'>
                          <CalendarIcon color={'black'} style={{height: 20, width: 20, marginRight: 10}}/>
                        </div>
                        <div>
                          {this.state.project['Start Time'].toLocaleString('en-gb',
                            {weekday: 'long', month: 'long', day: 'numeric'})}
                        </div>
                      </div>
                      : null}
                      {this.state.project['Start Time'] ?
                      <div className='time-container' style={{display: 'flex', marginLeft: 24, minWidth: 140}}>
                        <div className='time-icon'>
                          <Clock color={'black'} style={{height: 20, width: 20, marginRight: 10}}/>
                        </div>
                        <div >
                          {this.state.project['Start Time'].toLocaleString('en-gb',
                            {hour: '2-digit', minute: '2-digit'})} -
                            {this.state.project['End Time'].toLocaleString('en-gb',
                              {hour: '2-digit', minute: '2-digit'})}
                        </div>
                      </div>
                      : null}


                      {this.state.project.Location || this.state.project.Remote ?
                        <div className='location-container' style={{display: 'flex', marginLeft: 24}}>
                          <div className='location-icon'>
                            <Place color={'black'} style={{height: 20, width: 20, marginRight: 10}}/>
                          </div>
                          {
                            this.state.project.Location ?
                            <a href={`https://www.google.com/maps/?q=${this.state.project.Location}`} target='_blank' rel='noopener' style={{color: '#65A1e7', textAlign: 'left'}}>
                              {this.state.project.Location}
                            </a>
                            :
                            'Remote'
                          }
                        </div>
                        : null
                      }
                    </div>


                    <Tabs
                      ref='tabs'
                      style={{flex: 1, borderBottom: '1px solid #e4e4e4', paddingTop: 16}}
                      tabItemContainerStyle={{ backgroundColor: 'white', borderBottom: '1px solid #DDDDDD'}}
                      inkBarStyle={{zIndex: 2, backgroundColor: '#E55749',
                      left:this.state.inkBarLeft, width: '60px'}}
                      onChange={this.handleChangeTab}
                      tabTemplateStyle={{backgroundColor: 'white'}}
                      >
                      <Tab
                        style={{width: 'auto'}}
                        buttonStyle={this.state.selected === 'story' ? styles.selectedTab : styles.tab}
                        value='story'
                        onTouchTap={this.changeAnchorEl}
                        label='The Story'>
                        <CardText  children = {
                            <div>

                              <div style={{marginBottom: '30px', fontSize: '16px'}}
                        className='story-text'
                         dangerouslySetInnerHTML={this.descriptionMarkup()}/>

                       <RaisedButton
                         secondary={true}
                         label='Email Organiser'
                         icon={<Email/>}
                         onClick={this.handleEmailOrganiser}
                         />
                            </div>
                          }>

                        </CardText>
                      </Tab>
                      {this.state.projectReviews ?
                        <Tab
                          value='reviews'
                          style={{width: 'auto'}}
                          buttonStyle={this.state.selected === 'reviews' ? styles.selectedTab : styles.tab}
                          onTouchTap={this.changeAnchorEl}
                          label='Previous Reviews'>
                          <div style={{padding: 16}}>
                            {this.state.projectReviews.map((review) => (
                              <ProjectReviewComponent review={review}/>
                            ))}
                          </div>
                        </Tab>
                        :
                        null
                      }

                      {this.state.project.Charity ?
                      <Tab
                        value='aboutus'
                        style={{width: 'auto'}}
                        buttonStyle={this.state.selected === 'aboutus' ? styles.selectedTab : styles.tab}
                        onTouchTap={this.changeAnchorEl}
                        label='About Us'>
                        <div style={{padding: 16}}>
                          <h2>{this.state.charity.Name}</h2>
                          <div style={{fontWeight: 'lighter', fontSize: '14px', marginBottom: 20}}>
                            {this.state.charity.Description}
                          </div>
                          {this.state.charity.Facebook || this.state.charity.Twitter || this.state.charity.Instagram ?
                            <div>
                              <Divider/>

                              <h2 style={{fontSize: '18px', marginBottom: 16}}>Contact Us</h2>
                              <div style={{display: 'flex', width: '100%'}}>
                                {this.state.charity.Facebook ?
                                  <a style={{flex: 1}} href={`https://www.facebook.com/${this.state.charity.Facebook.replace(/[^\x00-\x7F]/g, "")}`}>
                                    <span style={styles.contactIcon}>
                                      <Avatar
                                        icon={<FontIcon className="fab fa-facebook-f fa-2x" />}
                                        color={'white'}
                                        backgroundColor={'#3b5998'}
                                        size={50}
                                        style={style}
                                      />
                                    {this.state.charity.Facebook}
                                  </span>
                                </a>
                                : null }
                                {this.state.charity.Twitter ?
                                  <a style={{flex: 1}} href={`https://www.twitter.com/${this.state.charity.Twitter.replace(/[^\x00-\x7F]/g, "")}`}>
                                    <span style={styles.contactIcon}>
                                      <Avatar
                                        icon={<FontIcon className="fab fa-twitter fa-2x" />}
                                        color={'white'}
                                        backgroundColor={'#00aced'}
                                        size={50}
                                        style={style}
                                      />
                                    {this.state.charity.Twitter.trim()}
                                  </span>
                                </a>
                                  : null }
                                {this.state.charity.Instagram ?
                                <span style={styles.contactIcon}>
                                  <Avatar
                                    icon={<FontIcon className="fab fa-instagram fa-2x" />}
                                    color={'white'}
                                    backgroundColor={'#fb3958'}
                                    size={50}
                                    style={style}
                                  />
                                {this.state.charity.Instagram}
                                </span> : null}
                              </div>
                            </div>
                            : null
                          }
                        </div>
                      </Tab>
                      : null}
                    </Tabs>
                  </div>
                  <div className='join-container' style={{width: 350, paddingLeft: 150}}>
                    <div style={{paddingTop: 60}}>
                      {
                        !this.props.joined && this.props.project['People Pledged'] >= this.props.project['Maximum People'] ?
                        <div>
                          <RaisedButton
                             primary={true} fullWidth={true}
                              labelStyle={{letterSpacing: '0.6px', fontWeight: 'bold'}}
                             label="Join Waiting List" onTouchTap={this.handleModal} />
                         </div>
                         :
                        !this.props.joined && this.props.challenge ?
                        <div>
                          <div style={{marginBottom: 10}}>
                          <span style={{fontWeight: 700, fontSize: '18px', display: 'inline-block', width: '100%'}}>
                            {`Accept ${this.props.challengeUser.Name}'s challenge:`}
                        </span>
                        <span style={{fontWeight: 'lighter', color: 'grey', fontSize: '14px'}}>(They're not coming unless you are)</span>
                        </div>
                        <RaisedButton
                           primary={true} fullWidth={true}
                            labelStyle={{letterSpacing: '0.6px', fontWeight: 'bold'}}
                           label='Join Now' onTouchTap={this.handleModal} />
                         </div>
                         :
                         !this.props.joined ?
                        <div>
                            {!this.state.challengeExists && !this.props.challengeExists && !this.props.challenge ?
                              <div>
                          <RaisedButton
                             primary={true} fullWidth={true}
                              labelStyle={{letterSpacing: '0.6px', fontWeight: 'bold'}}
                             label="Join Now" onTouchTap={this.handleModal} />
                         </div> : <RaisedButton
                            primary={true} fullWidth={true}
                             labelStyle={{letterSpacing: '0.6px', fontWeight: 'bold'}}
                            label='Join Now' onTouchTap={this.handleModal} />}
                           </div>
                     :
                     <RaisedButton
                         fullWidth={true}
                         labelStyle={{letterSpacing: '0.6px', fontWeight: 'bold'}}
                        label="I can't come anymore" onTouchTap={this.handleUnJoin} />}

                        <Suggest projectId={this.props.project._id}/>

                      </div>
                      <div>

                        <h1 style={{fontFamily: 'Permanent Marker', textAlign: 'left', marginTop: 45}}>Who's In?</h1>

                      <li>

                        <WhosIn
                          setAttendeeCount={this.changeAttendees}
                          project={this.props.project}/>


                      </li>

                    </div>

                  </div>





              </div>

                <div style={{height: 60}}/>
                  <SignupModal
                    _id={this.props.project._id}
                    type={this.state.modalType}

                    open={this.state.modalOpen}
                    changeOpen={this.handleModalChangeOpen}
                  onComplete={this.onComplete}/>

                <CompletedModal
                    open={this.state.completedOpen}
                    handleClose={this.handleCompletedModalChangeOpen}
                    project={this.state.project}
                    />


            </div>
      }

    </div>
      )
    }
  }
