import React , {PropTypes} from 'react';
import Dropzone from 'react-dropzone';
import Place from 'material-ui/svg-icons/maps/place';
import {grey200, grey500, grey100, amber500, grey300, lightBlue50, grey700} from 'material-ui/styles/colors'
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import {Tabs, Tab} from 'material-ui/Tabs';
import FlatButton from 'material-ui/FlatButton';
import {Spiral, World} from '../components/icons.jsx';
import Social from 'material-ui/svg-icons/social/notifications';
import RaisedButton from 'material-ui/RaisedButton';
import DocumentTitle from 'react-document-title';
import MediaQuery from 'react-responsive';
import EmbeddedProject from '../components/embeddedproject.jsx';
import FontIcon from 'material-ui/FontIcon';
import Link from "next/link"
import Router from 'next/router'
import Loading from '../components/loading.jsx';
import SignupModal from '../components/signupmodal.jsx';
import CharityProjectList from '../components/charityprojectlist.jsx';
import IconButton from 'material-ui/IconButton';
import Code from 'material-ui/svg-icons/action/code';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField'
import App from "../components/App"
import {ProjectReviewComponent} from '../components/casestudy.jsx';
import fire from '../fire';
import withMui from '../components/hocs/withMui';

let db = fire.firestore()

const styles = {
  selectedTab: {
    height: '60px',
    backgroundColor: 'white',
    color: '#E55749',
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
  secondHeader: {
    fontWeight: 200,
    fontSize: '48px',
    marginTop: 25,
    marginBottom: 25
  },
  secondBody: {
    fontWeight: 200,
    fontSize: '20px'
  },
  projectBox: {
    margin: 15,
    maxWidth: 350
  },
  mobileProjectBox: {
    marginTop: 15,
    marginBottom: 15
  },
  mobileSecondHeader: {
    fontWeight: 200,
    fontSize: '30px',
    marginTop: 25,
    marginBottom: 25
  },
  mobileSecondBody: {
    fontWeight: 200,
    fontSize: '15px'
  },
}

export function changeImageAddress(file, size) {
  var str = file, replacement = '/' + size + '/';
  str = str.replace(/\/([^\/]*)$/,replacement+'$1');
  return(str + '?pass=this')
}

class About extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{display: 'flex', padding: 24}}>
        <div style={{flex: 2, marginRight: 32}}>
          <h2>{this.props.charity.Name}</h2>
          {this.props.charity.Summary}
        </div>
        <div style={{flex: 1, textAlign: 'right'}}>
          <h2>
            Contact Us
          </h2>
          <div>
            {this.props.charity.Email}<br/>
            {this.props.charity.Phone}<br/>
            {this.props.charity.Postcode}<br/>
            {this.props.charity.Website}
          </div>
        </div>
      </div>
    )
  }
}


class Supporters extends React.Component {
  constructor(props) {
    super(props);
    this.state = {supporters: []}
  }

  componentDidMount(props) {
    var data = []
    db.collection("Engagement").where("Charity Number", "==", this.props.charityId).get().then((engSnapshot) => {
      console.log(engSnapshot)
      console.log(engSnapshot.size)
      engSnapshot.forEach((engDoc) => {
        console.log(engDoc.data())
        var elem = engDoc.data()
        elem['_id'] = engDoc.id
        data.push(elem)
      })
    })
    this.setState({supporters: data, loading: false})

  }

  render() {
    return (
      <div style={{display: 'flex', flexWrap: 'wrap', paddingLeft: '80px', paddingRight: '80px', paddingTop: '30px'}}>

        {this.state.supporters.length === 0 ?
          <div style={{margin: 20, borderRadius: 4, fontWeight: 700, height: '250px', width: '100%', display: 'flex', backgroundColor: 'rgb(247, 247, 247)', justifyContent: 'center' ,alignItems: 'center'}}>
            <div>
              This organisation does not yet have any supporters
            </div>
          </div>
          :
          this.state.supporters.map((supporter) => (
          <Link as={`/profile/${supporter.User}`} href={`/profile?user=${supporter.User}`}>
            <div style={{height: '200px', width: '150px', display: 'flex', alignItems: 'center', flexDirection: 'column',
            textAlign: 'center'}}>
              <img src={changeImageAddress(supporter['Volunteer Picture'], '250xauto')} style={{borderRadius: '50%',
                height: '100px', width: '100px'}}/>
              <div style={{width: '100%', marginTop: 16}}>
                <b>{supporter.Name}</b><br/>
                {supporter['Project Name']}
              </div>
            </div>
          </Link>
        ))}
      </div>
    )
  }
}

export class CharityProjects extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: true}
  }

  componentDidMount(props) {
    db.collection("Project").where("Charity", "==", this.props.charityId).where("Approved", "==", true)
    .get().then((querySnapshot) => {
      var data = []
      querySnapshot.forEach((doc) => {
        console.log(doc.data())
        var elem = doc.data()
        elem['_id'] = doc.id
        data.push(elem)
      });
      console.log(data)
      this.setState({loading: false, projects: data})
    })
  }

  render() {
    console.log(this.state.loading)
    return (
      <div className='project-boxes-container' style={{display: 'flex', flexWrap: 'wrap'}}>
        {
          this.state.loading ?
            null :
            this.state.projects ?
              this.state.projects.map((project) => (
                <div className='project-box' style={styles.projectBox}>
                  <EmbeddedProject noLogo={true} project={project}/>
                </div>
              ))
             :
            <div style={{height: 200, width: '100%', display: 'flex', alignItems: 'center'}}>
              No projects just yet
            </div>
        }
      </div>
    )
  }
}

export class RecentCharityReviews extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount(props) {
    console.log(this.props.charityId.toString())
    db.collection("ProjectReview").where("Charity", "==", this.props.charityId.toString()).get().then((querySnapshot) => {
      var data = []
      console.log(querySnapshot)
      querySnapshot.forEach((doc) => {
        console.log(doc.data())
        var elem = doc.data()
        elem['_id'] = doc.id
        data.push(elem)
      });
      this.setState({reviews: data})
      for (let i = 0; i < data.length; i++) {
        db.collection("User").doc(data[i].User).collection("public").doc(data[i].User).get().then((userDoc) => {
          data[i]['User Picture'] = userDoc.data().Picture
        })
      }
    })
  }

  render() {
    console.log(this.state.reviews)
    return (
      <div>
        {
          this.state.reviews && this.state.reviews.length > 0 ? this.state.reviews.map((review) => (
            <ProjectReviewComponent review={review}/>
          ))
          :
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: 60, backgroundColor: 'rgb(247,247,247)'}}>
            No reviews just yet
          </div>
        }
      </div>
    )
  }
}


export class CharitySubscribe extends React.Component {
  constructor(props) {
    super(props);
    this.state = {modalOpen: false}
  }

  componentDidMount(props) {
    if (fire.auth().currentUser) {
      db.collection("Charity").doc(this.props.charityId)
        .collection("Subscribers").doc(fire.auth().currentUser.uid).get().then((doc) => {
          if (doc.exists) {
            this.setState({subscribed: true})
          } else {
            this.setState({subscribed: false})
          }
        })
    }

    fire.auth().onAuthStateChanged((user) => {
      if (user === null) {

      } else {
        console.log('registering user as logged in')
        db.collection("Charity").doc(this.props.charityId)
          .collection("Subscribers").doc(fire.auth().currentUser.uid).get().then((doc) => {
            console.log(doc)
            if (doc.exists) {
              this.setState({subscribed: true})
            } else {
              this.setState({subscribed: false})
            }
          })
      }
    })
  }


  subscribeUser = () => {
    db.collection("User").doc(fire.auth().currentUser.uid).get().then((userDoc) => {
      var user = userDoc.data()
      db.collection("Charity").doc(this.props.charityId)
      .collection("Subscribers").doc(fire.auth().currentUser.uid).set({
        "Email": user.Email,
        "Name": user.Name
      })
      .then(() => this.setState({subscribed: true}))
    })
  }

  unsubscribeUser = () => {
    db.collection("User").doc(fire.auth().currentUser.uid).get().then((userDoc) => {
      var user = userDoc.data()
      db.collection("Charity").doc(this.props.charityId)
      .collection("Subscribers").doc(fire.auth().currentUser.uid).delete().then(() => {
        console.log('subscriber deleted')
        this.setState({subscribed: false})
      }).catch(error => console.log('error', error))
    })
  }

  handleSubscribe = () => {
    if (fire.auth().currentUser) {
      this.subscribeUser()
    } else {
      this.setState({modalOpen: true})
    }
  }


    handleModalChangeOpen = (e) => {
      this.setState({modalOpen: false})
    }

  render() {
    return (
      <div>
        {this.state.subscribed ?
          <RaisedButton
            label='Unsubscribe'

            icon={<Social/>}
            onClick={this.unsubscribeUser}
            />
          :

        <RaisedButton
          label='Subscribe'
          labelStyle={{fontWeight: 700}}
          icon={<Social/>}
          onClick={this.handleSubscribe}
          secondary={true}/>
      }
      <SignupModal
        open={this.state.modalOpen}
          changeOpen={this.handleModalChangeOpen}
        onComplete={this.subscribeUser}/>
      </div>
    )
  }
}

class CharityProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {user: {}, loading: true, slideIndex: 0,
      charity: this.props.charity ? this.props.charity : null, loading: true,
      left: '10%', selected: 'projects', modalOpen: false}
  }

  static async getInitialProps() {
    const res = db.collection("Charity").doc(this.props.params.charityId).get().then((doc) => {
      var charity = doc.data()
      charity['_id'] = doc.id
      return {charity: charity}
    })
  }

  handleClick(index, e) {
    e.preventDefault()
    this.setState({slideIndex: index})
  }

  componentDidMount(props) {
    db.collection("Charity").doc(this.props.params.charityId).get().then((doc) => {
      var charity = doc.data()
      charity['_id'] = doc.id
      this.setState({charity: charity, loading: false})
    })
  }

  handleChange = (value) => {
    this.setState({
      slideIndex: value,
    });
  };


  handleTwoTabClick = (value) => {
    var lookup = ['projects','supporters']
    this.setState({
      value: value,
      slideIndex: lookup.indexOf(value),
      left: lookup.indexOf(value) * 50 + 10 + '%'
    });
  }

  upload(file, rej) {
    console.log(this.state)
    console.log(file)
    console.log(rej)

    fetch('https://3ymyhum5sh.execute-api.eu-west-2.amazonaws.com/prod/getS3Url')
      .then(response => response.json())
      .then(function(data) {
        var stripped = data.substring(data.indexOf('amazonaws.com/') + 14, data.indexOf('?'))
        var imageUrl = 'https://d3kkowhate9mma.cloudfront.net/' + stripped


        console.log(changeImageAddress(imageUrl, '250xauto'))
        this.setState({imageUrl: imageUrl})
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                console.log(xhr.responseText);
            }
        }

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
    this.setState({inkBarLeft: (rect.width-100)/2  + rect.x - (window.document.body.clientWidth - 1000) /2,
    })
  }

  handleTwoTabClick = (value) => {
    this.setState({selected: value})
  }


  render() {
    console.log(this.state.subscribed)
    return (
      <App>
        {this.state.loading ?
          <Loading/>
          :
          <div>
            <DocumentTitle title={this.state.charity.Name}/>
            <MediaQuery minDeviceWidth={700}>
              <div className='container' style={{paddingLeft: 100, paddingRight: 100, paddingTop: 32,
                  textAlign: 'left', boxSizing: 'border-box'}}>
                <div className='charity-header-container' style={{display: 'flex', alignItems: 'center'}}>
                  {this.state.charity['Featured Image'] ?
                    <img className='charity-logo-in-header'
                      src={changeImageAddress(this.state.charity['Featured Image'], '500xauto')}
                      style={{borderRadius: '6px', height: 'auto', width: 222, margin: 20}}/>
                    :
                    <div style={{margin: 20, height: 222, width: 222, borderRadius: '50%', backgroundColor: 'rgba(216,216,216,0.2)',
                        display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                      <World style={{height: 100, width: 100}}/>
                    </div>
                  }
                  <div className='charity-title-container' style={{paddingLeft: 50}}>
                    <div className='charity-title' style={{fontWeight: 'bold', fontSize: '54px'}}>
                      {this.state.charity.Name}
                    </div>
                    <div className='soc-media-container' style={{display: 'flex', alignItems: 'center'}}>
                      {this.state.charity.Facebook ?
                      <a style={{display: 'flex', alignItems: 'center'}} target='_blank' rel="noopener"
                         href={`https://www.facebook.com/${this.state.charity.Facebook.replace(/[^\x00-\x7F]/g, "")}`}>
                        <div className='fb-icon'>
                          <Avatar
                            icon={<FontIcon className="fab fa-facebook" />}
                            color={'white'}
                            backgroundColor={'#3b5998'}
                            size={25}
                            style={{marginRight: 10}}
                          />
                        </div>
                        <div className='fb-username'>
                          {this.state.charity.Facebook}
                        </div>
                      </a>
                      : null}
                      {this.state.charity.Twitter ?
                      <a style={{display: 'flex', alignItems: 'center'}} target='_blank' rel="noopener"
                        href={`https://www.twitter.com/${this.state.charity.Twitter.replace(/[^\x00-\x7F]/g, "")}`}>
                        <div className='twitter-icon'>
                          <Avatar
                            icon={<FontIcon className="fab fa-twitter" />}
                            color={'white'}
                            backgroundColor={'#00aced'}
                            size={25}
                            style={{marginRight: 10, marginLeft: 20}}
                          />
                        </div>
                        <div className='twitter-username'>
                          {this.state.charity.Twitter}
                        </div>
                      </a>
                      : null}
                    </div>

                    <div style={{paddingTop: 16, display: 'flex', alignItems: 'center'}}>
                      <CharitySubscribe charityId={this.props.params.charityId}/>
                      <IconButton
                        tooltip='Embed'
                        onClick={() => this.setState({embedOpen: true})}
                        style={{padding: 0, marginLeft: 30}}>
                        <Code/>
                      </IconButton>
                      <Dialog
                        onRequestClose={() => this.setState({embedOpen:false})}
                        modal={false}
                        open={this.state.embedOpen}
                        >
                        <b>Copy this code into your website</b>
                        <TextField
                          fullWidth={true}
                          multiLine={true}
                          defaultValue={`<iframe src="https://whosin.io/embed/o/${this.props.params.charityId}" style="width:100%; height:1000px; border:none"></iframe>`}
                          />
                      </Dialog>
                    </div>
                  </div>

                </div>
                <div style={{marginTop: 16}}>
                  {fire.auth().currentUser && fire.auth().currentUser.uid === this.state.charity.Owner  ?
                  <FlatButton
                    secondary={true}
                    label='Edit Profile' labelStyle={{textTransform: 'none', padding: '10px', fontSize: '16px'}}
                      onTouchTap={() => browserHistory.push(`/charity/${this.props.params.charityId}/edit`)}
                       />
                     :
                     null
                   }

                </div>
                <div className='about-review-container' style={{display: 'flex', width: '100%'}}>
                  <div className='about-container' style={{flex: 1, marginRight: 100}}>
                    <h2 className='about-header' style={styles.secondHeader}>
                      About
                    </h2>
                    <div className='about-body' style={styles.secondBody}>
                      {this.state.charity.Summary}
                    </div>
                  </div>
                  <div className='review-container' style={{flex: 1}}>
                    <h2 className='review-header' style={styles.secondHeader}>
                      Reviews
                    </h2>
                    <RecentCharityReviews charityId={this.state.charity._id} />
                  </div>
                </div>

                <div style={{height: 40}}/>
                <h2 className='project-header' style={styles.secondHeader}>
                  Projects
                </h2>

                <CharityProjects charityId={this.state.charity._id}/>

              </div>
            </MediaQuery>

            <MediaQuery maxDeviceWidth={700}>
              <div className='container' style={{paddingLeft: 24, paddingRight: 24,
                  textAlign: 'left', boxSizing: 'border-box'}}>
                <div className='charity-header-container'
                    style={{display: 'flex', flexDirection: 'column',alignItems: 'center'}}>
                    {this.state.charity['Featured Image'] ?
                      <img className='charity-logo-in-header'
                        src={changeImageAddress(this.state.charity['Featured Image'], '500xauto')}
                        style={{borderRadius: '6px', height: 'auto', width: 222, margin: 20}}/>
                      :
                      <div style={{height: 222, width: 222, borderRadius: '50%', backgroundColor: 'rgba(216,216,216,0.2)',
                            margin: 20, display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <World style={{height: 100, width: 100}}/>
                      </div>
                    }
                  <div className='charity-title-container'>
                    <div className='charity-title' style={{fontWeight: 'bold', fontSize: '45px', textAlign: 'center'}}>
                      {this.state.charity.Name}
                    </div>
                  </div>
                  <div className='soc-media-container' style={{display: 'flex', alignItems: 'center'}}>
                    {this.state.charity.Facebook ?
                    <a style={{display: 'flex', alignItems: 'center'}} target='_blank' rel="noopener"
                       href={`https://www.facebook.com/${this.state.charity.Facebook.replace(/[^\x00-\x7F]/g, "")}`}>
                      <div className='fb-icon'>
                        <Avatar
                          icon={<FontIcon className="fab fa-facebook" />}
                          color={'white'}
                          backgroundColor={'#3b5998'}
                          size={25}
                          style={{marginRight: 10}}
                        />
                      </div>
                      <div className='fb-username'>
                        {this.state.charity.Facebook}
                      </div>
                    </a>
                    : null}
                    {this.state.charity.Twitter ?
                    <a style={{display: 'flex', alignItems: 'center'}} target='_blank' rel="noopener"
                      href={`https://www.twitter.com/${this.state.charity.Twitter.replace(/[^\x00-\x7F]/g, "")}`}>
                      <div className='twitter-icon'>
                        <Avatar
                          icon={<FontIcon className="fab fa-twitter" />}
                          color={'white'}
                          backgroundColor={'#00aced'}
                          size={25}
                          style={{marginRight: 10, marginLeft: 20}}
                        />
                      </div>
                      <div className='twitter-username'>
                        {this.state.charity.Twitter}
                      </div>
                    </a>
                    : null}
                  </div>
                  <div style={{paddingTop: 16}}>
                    <CharitySubscribe charityId={this.props.params.charityId}/>
                  </div>
                </div>



                <div className='about-review-container' style={{display: 'flex', width: '100%'}}>
                  <div className='about-container' style={{flex: 1}}>
                    <h2 className='about-header' style={styles.mobileSecondHeader}>
                      About
                    </h2>
                    <div className='about-body' style={styles.mobileSecondBody}>
                      {this.state.charity.Summary}
                    </div>
                  </div>
                </div>

                <div>
                  <div className='review-container' style={{flex: 1}}>
                    <h2 className='review-header' style={styles.mobileSecondHeader}>
                      Reviews
                    </h2>
                    <RecentCharityReviews charityId={this.state.charity._id} />
                  </div>
                </div>

                <div style={{height: 40}}/>
                <h2 className='project-header' style={styles.mobileSecondHeader}>
                  Projects
                </h2>

                <CharityProjects charityId={this.state.charity._id}/>
              </div>
            </MediaQuery>
          </div>
        }
      </App>
    )
  }
}

export default withMui(CharityProfile)
