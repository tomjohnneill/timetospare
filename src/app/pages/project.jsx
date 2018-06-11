import React , {PropTypes} from 'react';
import {grey200, grey500, grey100, amber500, grey300, lightBlue50} from 'material-ui/styles/colors'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';
import Divider from 'material-ui/Divider';
import {Tabs, Tab} from 'material-ui/Tabs';
import Dialog from 'material-ui/Dialog';
import Link from "next/link";
import Router from 'next/router';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import Edit from 'material-ui/svg-icons/image/edit';
import DocumentTitle from 'react-document-title';
import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import Snackbar from 'material-ui/Snackbar';
import CircularProgress from 'material-ui/CircularProgress';
import Chip from 'material-ui/Chip';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import MediaQuery from 'react-responsive';
import DesktopProject from '../components/desktopproject.jsx';
import SignupModal from '../components/signupmodal.jsx';
import Badge from 'material-ui/Badge';
import AccessTime from 'material-ui/svg-icons/device/access-time';
import Loading from '../components/loading.jsx';
import {WhosIn} from '../components/desktopproject.jsx';
import {Spiral, CalendarIcon, Place, Clock, World} from '../components/icons.jsx';
import {MyMapComponent} from '../components/desktopproject.jsx';
import {ProjectReviewComponent} from '../components/casestudy.jsx';
import Suggest from '../components/groups/suggest.jsx';
import BottomNavigationExampleSimple from '../components/bottomnav.jsx'
import CaseStudy from '../components/casestudy.jsx';
import fire from '../fire';
import Head from 'next/head'
import App from "../components/App"
import ChooseDates from "../components/choose-dates.jsx";

let db = fire.firestore()


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
    color: grey500,
    marginTop: '-5px'
  },
  chip: {
  margin: 4,
},
explanation: {
  fontSize: '8pt',
  color: grey500
} ,
selectedTab: {
    height: '36px',
    backgroundColor: 'white',
    color: '#E55749',
    textTransform: 'none',
    letterSpacing: '0.4px',
    lineHeight: '16px',
    fontWeight: 700,
    paddingLeft: '20px',
    paddingRight: '20px',
    zIndex: 4
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
    zIndex: 4
  },
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


export default class Project extends React.Component {
  constructor(props) {

    super(props);
    console.log(this.props)

    this.state = {open: false, adminDrawerOpen: false, selectedIndex: 0,
      loading: this.props.project ? false : true,
      project: this.props.project ? this.props.project : {},
      charity: {}, inkBarLeft: '20px', selected: 'story', challengeExists: false}
  }

  static async getInitialProps({req, pathname, query}) {
    const res =  await db.collection("Project").doc(query.project).get()
    .then((doc) => {
          var project = doc.data()
          project._id = doc.id
          console.log(project)
          return({loading: false, project: project, charity: {}})
        })
    return res

  }


  componentDidMount(props) {
    Router.prefetch(`/joined?project=${this.state.project._id}`)
    Router.prefetch(`/declined?project=${this.state.project._id}`)

    if (Router.query.project) {
          window.history.replaceState({}, 'Title', '/projects/p/' + Router.query.project)
    }
    this.setState({ loading: true });

    if (localStorage.getItem('project')) {
      let project = JSON.parse(localStorage.getItem('project'))
      if (typeof project['Start Time'] === 'string') {
        project['Start Time'] = new Date(project['Start Time'])
        project['End Time'] = new Date(project['End Time'])
      }
      this.setState({loading: false, project: project})
      localStorage.removeItem('project')
    }

    db.collection("Project").doc(Router.query.project).collection("SubProject").get()
    .then((sub) => {
      if (sub.docs.length > 0) {
        var data = []
        sub.forEach((subDoc) => {
          var elem = subDoc.data()
          elem._id = subDoc.id
          data.push(elem)
        })
        this.setState({subProjects: data})
      }
    })

    db.collection("Project").doc(Router.query.project).get().then((doc) => {
      var project = doc.data()
      project._id = doc.id
      this.setState({loading: false, project: project, charity: {}})
      if (project.Charity) {
        db.collection("Charity").doc(project.Charity.toString()).get().then((charityDoc) => {
            var charity = charityDoc.data() ? charityDoc.data() : {}
            charity._id = charityDoc.id
            this.setState({ charity: charity, loading: false})
          })
          .catch(error => console.log('Error', error))
        db.collection("ProjectReview").where("Charity", "==", project.Charity.toString()).get()
        .then((querySnapshotReviews) => {
          let data = []
          querySnapshotReviews.forEach((doc) => {
            data.push(doc.data())
          })
          this.setState({projectReviews: data})
        })
      } else {
        db.collection("User").doc(project.Creator).collection("public").doc(project.Creator).get().then((userDoc) => {
          var creator = userDoc.data()
          this.setState({creator: creator})
        })
      }
    })
    .catch(error => console.log('Error', error));

    fire.auth().onAuthStateChanged((user) => {
      if (user !== null) {
        db.collection("Engagement").where("User", "==", fire.auth().currentUser.uid)
        .where("Project", "==", Router.query.project ? Router.query.project : this.props.params._id).get().then((querySnapshot) => {
          if (querySnapshot.size > 0) {
            this.setState({joined: true})
          } else {
            this.setState({joined: false})
          }
        })
        .catch(error => console.log('Error', error))

        db.collection("Project").doc(Router.query.project).collection("Challenge")
        .where("User", "==", fire.auth().currentUser.uid).get().then((querySnapshot) => {
          console.log(querySnapshot)
          if (querySnapshot.size > 0) {
            this.setState({challengeExists: true})
          } else {
            this.setState({challengeExists: false})
          }
        })
        .catch(error => console.log('Error', error))
      }
    })




  }


  handleModalChangeOpen = (e) => {
    console.log('modal change state fired for some reason')
    this.setState({modalOpen: false})
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
      this.state.project.Description.replace('<img', '<img style="width:100%;height:auto"') : this.state.project.what}
  }

  setLoggedIn = () => {
    this.setState({loggedIn: true, modalOpen: false})
  }


  handleLetsGo = (e) => {
    e.preventDefault()
    Router.push('/create-project?stage=0')
  }


  changeAnchorEl = (e) => {
    console.log('handleMultipleChoiceClick')
    e.preventDefault()
    console.log(e)
    var rect = e.target.getBoundingClientRect()
    console.log(rect)
    console.log(window.innerWidth)
    this.setState({inkBarLeft: (rect.width-60)/2  + rect.x - (window.innerWidth - Math.min(window.innerWidth,1000) )/2  ,

    })

  }



  handleModal = (e) => {
    console.log('handle modal fired')
    if (fire.auth().currentUser) {
      if (fire.auth().currentUser.phoneNumber || 1 === 1) {
        if (this.state.questions) {
          browserHistory.push(window.location.href + '/questions')
        }
        else if (this.state.project['People Pledged'] >= this.state.project['Maximum People']) {
          this.addToWaitingList()
        }
        else {
          this.createEngagement()
          if (this.state.challenge) {
            this.addChallengeMember()
          }
          if (window.location.pathname.includes('/joined')) {
            Router.push(window.location.pathname)
          } else {
            Router.push(`/joined?project=${this.state.project._id}`, window.location.pathname + '/joined')
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

  addToWaitingList = () => {
    db.collection("Project").doc(this.state.project._id).collection("WaitingList").add({
      user: fire.auth().currentUser.uid
    }).then(
      () => this.setState({waitingListAdded: true})
    )
  }

  handleRequestClose = () => {
    this.setState({waitingListAdded: false})
  }

  onComplete = () => {
    if (this.state.conditionalStatus) {
      this.setState({conditionalOpen: true, conditionalStatus: false, modalOpen: false})
    }
    else if (this.state.questions) {
      browserHistory.push(window.location.href + '/questions')
    } else if (this.state.project['People Pledged'] >= this.state.project['Maximum People']) {
      this.addToWaitingList()
    } else {
      this.createEngagement()
      Router.push(`/joined?project=${this.state.project._id}`, window.location.pathname + '/joined')
    }
  }

  createEngagement = () => {

    console.log(this.state.project)
    console.log(fire.auth().currentUser)
    db.collection("User").doc(fire.auth().currentUser.uid).get().then((doc) => {
      var body = {
        "Project": this.state.project._id,
        "Project Name": this.state.project.Name,
        "User": fire.auth().currentUser.uid,
        "Project Photo": this.state.project['Featured Image'],
        "Charity": this.state.project['Charity Name'] ? this.state.project['Charity Name'] : null,
        "Charity Number": this.state.project.Charity ? this.state.project.Charity : null,
        "Name": doc.data().Name.replace(/ .*/,''),
        "Email": doc.data().Email,
        "Volunteer Picture": doc.data().Picture ? doc.data().Picture : null,
        "Location": doc.data().Location ? doc.data().Location : null,
        "created": new Date()
      }
      db.collection("Engagement").where("Project", "==", this.state.project._id)
      .where("User", "==", fire.auth().currentUser.uid).get().then((querySnapshot) => {
          if (querySnapshot.size === 0) {
            var engRef = db.collection("Engagement").doc()
            engRef.set(body)
            .then(data => engRef.collection("Private").doc(this.state.project._id).
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

  deleteEngagement = () => {
      db.collection("Engagement").where("Project", "==", this.state.project._id)
      .where("User", "==", fire.auth().currentUser.uid).get().then((querySnapshot) => {
          querySnapshot.forEach(function(doc) {
            doc.ref.delete();
          })
      })
    .catch(error => {this.setState({error: error}); console.log(error)})
    this.forceUpdate()
  }

  handleChangeTab = (value) => {
    this.setState({selected: value})
  }

  handleUnJoin = (e) => {
    e.preventDefault()
    this.deleteEngagement()
    Router.push(`/declined?project=${this.state.project._id}`, window.location.pathname + '/declined')
  }

  changeAttendees = (attendees) => {
    var project = this.state.project
    project['People Pledged'] = attendees
    this.setState({project: project})
  }

  render () {



    console.log(this.state)
    if (this.state.loading) {
      return (
        <App>
          <Loading/>
        </App>
      )
    } else if (this.state.project['End Time'] < new Date()) {
      return (
        <App>
          <CaseStudy projectId={this.state.project._id}/>
        </App>
      )
    } else {
      var required = this.state.project['People Pledged'] ?
      Math.max(Number(this.state.project['Target People']) - this.state.project['People Pledged'],0)
      : this.state.project['Target People']

      return (

      <App>
        <Head>
          <title>{this.state.project.Name}</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
            <meta property="og:title" content={this.state.project.Name}/>
            <meta property="twitter:title" content={this.state.project.Name}/>
            <meta property="og:type" content="article" />
            <meta property="og:description" content={this.state.project.Summary} />
            <meta property="og:image" content={changeImageAddress(this.state.project['Featured Image'], '750xauto')} />
            <meta name="twitter:card" content="summary" />
        </Head>
        <Snackbar
          open={this.state.waitingListAdded}
          message="We've added you to the waiting list"
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
        <div>
        {this.state.loading ?

          <Loading/>
            :
          <DocumentTitle title={this.state.project.Name}>



            <div>
              {this.state.chooseDates ?
              <div style={{zIndex: 5, height: '100vh',
                boxSizing: 'border-box', width: '100vw', padding: 32,
                position: 'fixed',backgroundColor: 'white'}}>
                <ChooseDates
                  subProjects={this.state.subProjects}
                  closeModal={() => this.setState({chooseDates: false})}
                  />
              </div>
              :
              null}
          <MediaQuery minDeviceWidth={700}>
            <DesktopProject project={this.state.project}
              joined={this.state.joined}
              creator={this.state.creator}
              projectReviews={this.state.projectReviews}
              challengeExists={this.state.challengeExists}
              challenge = {this.state.challenge}
              challengeUser={this.state.challengeUser}
              charity={this.state.charity} questions={this.state.questions}/>
          </MediaQuery>

          <MediaQuery maxDeviceWidth = {700}>
              {fire.auth().currentUser &&
                (this.state.project.Admin && this.state.project.Admin[fire.auth().currentUser.uid]
                || this.state.project.Creator === fire.auth().currentUser.uid) ?
                <BottomNavigationExampleSimple />
                :
                null
              }
            <img className='mobile-cover-image' src={changeImageAddress(this.state.project['Featured Image'], '500xauto')}
              style={{height: '222px', width: '100%', objectFit: 'cover'}}/>

            <div style={{padding: '20px 35px 20px 35px'}} className='mobile-project-container'>

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
                <Link  className='charity-link' as={`/profile/${this.state.project.Creator}`}
                  href={`/profile?user=${this.state.project.Creator}`}
                  >
                  <div className='charity-link-content'
                     style={{display: 'flex', marginTop: 6, alignItems: 'center', color: '#65A1e7'}}>
                    <div style={{marginRight: 10}} className='charity-icon'>
                      <Avatar>{this.state.creator ? this.state.creator.Name.substring(0,1) : null}</Avatar>
                    </div>
                    <p className='charity-name' style={{margin: 0, fontSize: '14px'}}>
                        {this.state.creator ? this.state.creator.Name : null}
                    </p>
                  </div>
                </Link>
              }

              <LinearProgress  style={{height: '5px', borderRadius: '1.5px', marginTop: 20}} color={'#00ABE8'} mode="determinate"
                min={0} max={this.state.project['Target People']}
                value={this.state.project['People Pledged'] === null ? 0 : this.state.project['People Pledged']} />
              <div style={{textAlign: 'right', paddingTop: 6, fontWeight: 'lighter'}} className='to-go-text'>
                {required} more {required === 1 ? 'person' : 'people'} needed
              </div>
            </div>


            <div style={{backgroundColor: 'rgba(216,216,216,0.2)', padding: '20px 35px 20px 35px', textAlign: 'left'}}
              className='datetime-container'>

              {this.state.project['Start Time'] ?
              <div className='date-container' style={{display: 'flex'}}>
                <div className='date-icon'>
                  <CalendarIcon color={'black'} style={{height: 20, width: 20, marginRight: 16}}/>
                </div>
                <div>
                  {this.state.project['Start Time'].toLocaleString('en-gb',
                    {weekday: 'long', month: 'long', day: 'numeric'})}
                </div>
              </div>
              : null}

              {this.state.project['Start Time'] ?
              <div className='time-container' style={{display: 'flex', marginTop: 10}}>
                <div className='time-icon'>
                  <Clock color={'black'} style={{height: 20, width: 20, marginRight: 16}}/>
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
                <div className='location-container' style={{display: 'flex', marginTop: 10}}>
                  <div className='location-icon'>
                    <Place color={'black'} style={{height: 20, width: 20, marginRight: 16}}/>
                  </div>
                  <div style={{textAlign: 'left'}}>
                    {
                      this.state.project.Location ?
                      <a href={`https://www.google.com/maps/?q=${this.state.project.Location}`} target='_blank' rel='noopener' style={{color: '#65A1e7', textAlign: 'left'}}>
                        {this.state.project.Location}
                      </a>
                      :
                      'Remote'
                    }
                  </div>
                </div>
                : null
              }
            </div>


            <div style={{display: 'flex',
              bottom: 0,position: 'fixed', zIndex: 4, boxSizing: 'border-box',
              backgroundColor: 'white', width: '100%', borderTop: '1px solid rgb(216, 216, 216)',
              justifyContent: 'center', padding: '20px 15px 20px 15px'}}>
              {this.state.subProjects ?
                <div style={{display: 'flex', width: '100%', alignItems: 'center'}}>
                  <div style={{flex: 1, textAlign: 'left', fontSize: '14px',
                  color: '#65A1e7'}}>
                    265 reviews
                  </div>
                  <div style={{width: 140}}>
                     <RaisedButton
                      primary={true} fullWidth={true}
                       labelStyle={{letterSpacing: '0.6px', fontWeight: 'bold',fontSize: '18px'}}
                      label='See Dates' onClick={() => this.setState({chooseDates: true})} />
                   </div>
               </div>
                 :

                !this.state.joined && this.state.project['People Pledged'] >= this.state.project['Maximum People']?
                <div>
                  <RaisedButton
                     primary={true} fullWidth={true}
                      labelStyle={{letterSpacing: '0.6px', fontWeight: 'bold'}}
                     label="Join Waiting List" onTouchTap={this.handleModal} />
                 </div>

                 :
                 !this.state.joined ?
                <div>
                   <RaisedButton
                    primary={true} fullWidth={true}
                     labelStyle={{letterSpacing: '0.6px', fontWeight: 'bold',fontSize: '18px'}}
                    label='Join Now' onTouchTap={this.handleModal} />
                   </div>
             :
             <RaisedButton
                 fullWidth={true}
                 labelStyle={{letterSpacing: '0.6px', fontWeight: 'bold', fontSize: '18px'}}
                label="I can't come anymore" onTouchTap={this.handleUnJoin} />}



                  </div>

                  <div style={{paddingLeft: 10, paddingRight: 10}}>
                    <Suggest projectId={this.state.project._id}/>
                  </div>
                  <div style={{position: 'sticky'}}>
                    <SignupModal
                      type={this.state.modalType}
                      _id={this.state.project._id}

                      open={this.state.modalOpen}
                      changeOpen={this.handleModalChangeOpen}
                    onComplete={this.onComplete}/>
                </div>

                <h2 style={{paddingLeft: 10, paddingTop: 16,textAlign: 'left', fontSize: '16px'}}>
                   What's going on?</h2>
            <div style={{padding: '0px 10px 20px 10px', textAlign: 'left'}}>

                 <div dangerouslySetInnerHTML={this.descriptionMarkup()}/>


            </div>


                        <p style={{fontSize: '16px', fontWeight: 700, margin:0, paddingBottom : 20,
                          paddingLeft: 10, textAlign: 'left'}}>
                          Where this will be
                        </p>
                          {this.state.project.Geopoint ?
                            <div style={{marginBottom: 16}}>
                              <MyMapComponent
                                Geopoint={this.state.project.Geopoint}
                                address={this.state.project.Location}
                                isMarkerShown
                                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyBnLdq8kJzE87Ba_Q5NEph7nD6vkcXmzhA&v=3.exp&libraries=geometry,drawing,places"
                                loadingElement={<div style={{ height: `100%` , borderRadius: 6}} />}
                                containerElement={<div style={{ height: `350px`}} />}
                                mapElement={<div style={{ height: `100%`, borderRadius: 6 }} />} />
                            </div>
                          : null}

            {this.state.subProjects ?
              <div>
              <p style={{fontSize: '16px', fontWeight: 700, margin:0,
                paddingLeft: 10, textAlign: 'left'}}>
                Upcoming Dates
              </p>
              <div style={{paddingLeft: 10, paddingRight: 10, paddingBottom: 20}}>
                <ChooseDates
                  limit={3}
                  subProjects={this.state.subProjects}/>
                <div
                  style={{color: '#65A1e7', paddingTop: 24, paddingBottom: 24,
                    textAlign: 'left',
                  borderBottom: '1px solid rgb(219, 219, 219)'}}
                  onClick={() => this.setState({chooseDates: true})}>
                  See all available dates
                </div>
                <div
                  style={{color: '#65A1e7', paddingTop: 24, paddingBottom: 24,
                    textAlign: 'left',
                  borderBottom: '1px solid rgb(219, 219, 219)'}}
                  onClick={() => this.setState({chooseDates: true})}>
                  Contact organiser
                </div>
              </div>
            </div>
            :
            null}






              {this.state.projectReviews ?

                  <div style={{padding: 16, textAlign: 'left'}}>
                    <p style={{fontSize: '16px', fontWeight: 700, margin:0,
                      paddingLeft: 10, textAlign: 'left'}}>
                      Reviews
                    </p>

                    {this.state.projectReviews.map((review) => (
                      <ProjectReviewComponent review={review}/>
                    ))}
                  </div>

                :
                null
              }




            <div style={{boxSizing: 'border-box', padding: 10}}>
              <div style={{height: '36px', borderBottom: 'solid 1px #DDDDDD'}}/>
              <h1 style={{fontFamily: 'Permanent Marker', textAlign: 'left'}}>Who's In?</h1>
              <li>

                <WhosIn
                  setAttendeeCount={this.changeAttendees}
                  project={this.state.project}/>

              </li>
            </div>


          </MediaQuery>

          </div>
      </DocumentTitle >
      }
    </div>

    </App>
      )
    }
  }
}
