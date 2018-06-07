import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {changeImageAddress} from '../components/desktopproject.jsx';
import LinearProgress from 'material-ui/LinearProgress';
import Link from "next/link"
import EmbeddedProject from '../components/embeddedproject.jsx';
import Router from 'next/router'
import MediaQuery from 'react-responsive';
import {GridList, GridTile} from 'material-ui/GridList';
import Subheader from 'material-ui/Subheader';
import {grey200, grey500, grey100, amber500} from 'material-ui/styles/colors'
import {List, ListItem} from 'material-ui/List';
import Search from 'material-ui/svg-icons/action/search';
import Divider from 'material-ui/Divider';
import Chip from 'material-ui/Chip';
import Snackbar from 'material-ui/Snackbar';
import Masonry from 'react-masonry-css';
import Loading from '../components/loading.jsx';
import SignupModal from '../components/signupmodal.jsx';
import App from "../components/App"

import fire from '../fire';

let db = fire.firestore()

var algoliasearch = require('algoliasearch/lite')

var placeholderTiles = [0,1,2,3,4,5,6,7]



const styles = {
  button : {
    fontFamily: 'Permanent Marker',
    fontSize: '20px',
    lineHeight: '36px'
  },
  textfield: {
    height: '40px',
    fontsize: '20px'
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
        margin: 4,
        cursor: 'pointer'
      },
  selectedChip: {
    margin: 4
  },
}

var categories = ["Environment",
"Refugees",
"Equality",
"Poverty",
"Education",
"Healthcare",
"Disabilities",
"Young people",
"Old people",
"Loneliness",
"Animals",
"Mental Health",
"Homelessness",
"Democracy",
"Technology",
"Journalism",
"Conservation",
"Arts and culture",
"Women",
"LGBT+",
"Human rights",
"Justice"
]

export class RegisterInterest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      allTags: categories
    }
  }

  handleStartProject = () => {
    if (fire.auth().currentUser) {
      Router.push('/create-project?stage=0')
    } else {
      this.setState({modalOpen: true})
    }
  }

  handleModalChangeOpen = (e) => {
    this.setState({modalOpen: false})
  }

  handleCapture = () => {
    var email = this.state.emailSignup
    var location = this.state.location
    console.log(this.state.tags)
    db.collection("Newsletter").add({
      email: this.state.emailSignup,
      issues: this.state.tags ? this.state.tags : null,
      location: this.state.location ? this.state.location: null
    }).then(() => {
      this.setState({signedUp: true, emailSignup: ''})
    })
  }

  handleRequestDelete = (key) => {
    const chipToDelete = this.state.tags.indexOf(key);
    var newTags = this.state.tags
    newTags.splice(chipToDelete, 1);
    var allTags = this.state.allTags
    allTags.push(key)
    this.setState({tags: newTags, allTags: allTags});
  };

  handleAddTag = (key) => {
    const chipToDelete = this.state.allTags.indexOf(key);
    var newAllTags = this.state.allTags
    newAllTags.splice(chipToDelete, 1);
    this.setState({allTags: newAllTags});
    var tags = this.state.tags
    tags.push(key)
    this.setState({tags: tags})
  }

  handleRequestClose = () => {
    this.setState({
      signedUp: false,
    });
  };

  render() {
    return (
      <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
        <Snackbar
          open={this.state.signedUp}
          message="We've added you to the mailing list"
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
        <h2 >Can't find a project you like?</h2>


        <div style={{maxWidth: 800, display: 'flex', alignItems: 'left', flexDirection: 'column'}}>
          <div style={{paddingBottom: 16, paddingLeft: 4, textAlign: 'left',  fontWeight: 700}}>
            I care about...

          </div>
          <div style={styles.wrapper}>
            {this.state.tags.map((tag) => (
              <Chip
                key={tag}
                style={styles.selectedChip}
                backgroundColor={'#65A1e7'}
                onRequestDelete={() => this.handleRequestDelete(tag)}
              >
                {tag}
              </Chip>
            ))}
          </div>


          <div style={styles.wrapper}>
            {this.state.allTags.map((tag) => (
              <Chip
                key={tag}
                style={styles.chip}
                onTouchTap={() => this.handleAddTag(tag)}
              >
                {tag}
              </Chip>
            ))}
          </div>
          <div style={{height: 20}}/>
          <div style={{fontWeight: 700}}>
            Let me know when a relevant project comes up
          </div>
          <div style={{ paddingTop: '20px', width: 300, display: 'flex', alignItems: 'left', flexDirection: 'column'}}>





            <TextField fullWidth={true}
              onChange={(e, nv) => this.setState({emailSignup: e.target.value})}
              inputStyle={{borderRadius: '2px', border: '1px solid #858987',
                backgroundColor: 'white',
                paddingLeft: '12px',  boxSizing: 'border-box'}}
              underlineShow={false}
              type='email'
              value={this.state.emailSignup}
              hintText={'Email Address'}
              hintStyle={{ paddingLeft: '12px', bottom: '8px', zIndex: 5}}
              key='email'
              style={styles.textfield}/>
            <RaisedButton   style={{height: '36px', marginTop: '16px', boxShadow: ''}} primary={true} overlayStyle={{height: '36px'}}
              buttonStyle={{height: '36px'}}
               labelStyle={{height: '36px', display: 'flex', alignItems: 'center',
                    letterSpacing: '0.6px', fontWeight: 'bold'}}
              onClick={this.handleCapture} label='Sign up'/>
          </div>

          </div>


      </div>
    )
  }
}

export default class AllProjects extends React.Component {
  constructor(props) {
    super(props)
    console.log(this.props)
    this.state = {loading: true}
  }

  componentDidMount(props) {
    db.collection("Project").where("Approved", "==", true).get().then((querySnapshot) => {
      let upcoming = []
      let successful = []
      let projects = []
      querySnapshot.forEach((doc) => {
        var hit = doc.data()
        hit._id = doc.id
        projects.push(hit)
        if (hit['End Time'] && new Date(hit['End Time']) > new Date()) {
          upcoming.push(hit)
        } else if
          (hit['Deadline'] && new Date(hit['Deadline']) > new Date()) {
            upcoming.push(hit)
          }
          else {
          successful.push(hit)
        }


      })
      this.setState({projects: projects,
        upcoming: upcoming, successful: successful,
        loading: false});
      })
  }

  handleSearch = (e, input) => {
    const client = algoliasearch('52RYQZ0NQK', 'b10f7cdebfc189fc6f889dbd0d3ffec2');
    const index = client.initIndex('projects');
    var query = e.target.value
    index
        .search({
            query: query,
            filters: 'Approved:true'
        })
        .then(responses => {
            // Response from Algolia:
            // https://www.algolia.com/doc/api-reference/api-methods/search/#response-format
            let upcoming = []
            let successful = []
            responses.hits.forEach((hit) => {
              if (hit['End Time'] && new Date(hit['End Time']) > new Date()) {
                upcoming.push(hit)
              } else if
                (hit['Deadline'] && new Date(hit['Deadline']) > new Date()) {
                  upcoming.push(hit)
                }
                else {
                successful.push(hit)
              }
            })
            this.setState({projects: responses.hits,
              upcoming: upcoming, successful: successful,
              loading: false});
        });
  }

  render() {
    if (this.state.projects) {
      console.log(this.state.projects)
    }
    if (this.state.upcoming) {
      this.state.upcoming.map((project) => {
        console.log(project)
      })
    }

    return (
      <App>
        <MediaQuery minDeviceWidth={700}>
          <div style={{position: 'sticky', top: '50px', display: 'flex', alignItems: 'center',
             paddingLeft: 100, zIndex: 10, paddingRight: 100
            , background: 'linear-gradient(0deg, #ffffff, #f7f7f7)', paddingTop: 6,
            paddingBottom: 6, borderBottom: '1px solid #DDDDDD'}}>

            <Search style={{marginRight: 6}}/>
            <TextField hintText={'Search'} onChange={this.handleSearch}/>
          </div>

        </MediaQuery>
        <MediaQuery maxDeviceWidth={700}>
          <div style={{position: 'sticky', top: '50px', display: 'flex', alignItems: 'center', paddingLeft: 16, zIndex: 10, paddingRight: 10
            , background: 'linear-gradient(0deg, #ffffff, #f7f7f7)', paddingTop: 6, paddingBottom: 6, borderBottom: '1px solid #DDDDDD'}}>

            <Search style={{marginRight: 6}}/>
            <TextField hintText={'Search'} onChange={this.handleSearch}/>
          </div>
        </MediaQuery>
        <div>
          <MediaQuery minDeviceWidth={700}>
            <h1 className='desktop-header' style={{paddingLeft: '100px', marginTop: 16}}>
              Upcoming Projects</h1>
            {this.state.loading ?
              <Loading/>
              :
              this.state.projects ?

              <div style={{display: 'flex', flexWrap: 'wrap', paddingLeft: 100, paddingRight:100}}>
                {this.state.upcoming.map((project) => (
                  <div style={{padding: 20, minWidth: 280, boxSizing: 'border-box', width: '33%', position: 'relative'}}>
                    <EmbeddedProject style={{position: 'relative'}} noLogo={true} project={project}/>
                  </div>
                ))}
              </div>

              :
              null
            }
            <RegisterInterest />
              <h1 className='desktop-header' style={{paddingLeft: '100px', marginTop: 30}}>
                Successful Projects</h1>
          {
              this.state.successful ?
              <div style={{display: 'flex', flexWrap: 'wrap', paddingLeft: 100, paddingRight:100}}>
                {this.state.successful.map((project) => (
                  <div style={{padding: 20, minWidth: 280, boxSizing: 'border-box', width: '33%', position: 'relative'}}>
                    <EmbeddedProject style={{position: 'relative'}} noLogo={true} project={project}/>
                  </div>
                ))}
              </div>
              :
              null
            }
          </MediaQuery>
          <MediaQuery maxDeviceWidth={700}>

                    <div style={{textAlign: 'left', paddingLeft: '18px', paddingRight: '18px', paddingBottom: '64px'}}>
                      <Subheader style={{fontSize: '25px', letterSpacing: '-0.6px', lineHeight: '30px', color: '#484848',
                      fontWeight: 700, marginTop: '48px', marginBottom: '24px', paddingLeft: '0px'}}>
                        Upcoming Projects
                      </Subheader>
                      {this.state.loading ?
                        <Loading/>
                        :
                        this.state.projects ?
                        <div style={{display: 'flex', flexWrap: 'wrap',
                        textAlign: 'left'}}>
                          {this.state.upcoming.map((project) => (
                            <div style={{paddingTop: 10, paddingBottom: 10, width: '100%', boxSizing: 'border-box'}}>
                              <EmbeddedProject noLogo={true}
                                project={project}
                              />
                            </div>
                          ))}
                        </div>
                             : null
                }
                  <RegisterInterest />
                    <Subheader style={{fontSize: '25px', letterSpacing: '-0.6px', lineHeight: '30px', color: '#484848',
                    fontWeight: 700, marginTop: '48px', marginBottom: '24px', paddingLeft: '0px'}}>
                      Successful Projects
                    </Subheader>
                    {this.state.loading ?
                      <Loading/>
                      :
                      this.state.projects ?
                      <div style={{display: 'flex', flexWrap: 'wrap',
                      textAlign: 'left'}}>
                        {this.state.successful.map((project) => (
                          <div style={{paddingTop: 10, paddingBottom: 10, width: '100%', boxSizing: 'border-box'}}>
                            <EmbeddedProject noLogo={true}
                              project={project}
                            />
                          </div>
                        ))}
                  </div>
                  :
                  null
                }
                <Divider style={{marginTop: 20}}/>
                <h2>Get involved, start your own project</h2>
                <div style={{height: 40, width: '100%', display: 'flex',
                    alignItems: 'center', justifyContent: 'center'}}>

                    <RaisedButton label='Start a Project'
                      onClick={this.handleStartProject}
                      style={{height: '36px', marginTop: '16px', boxShadow: ''}} primary={true} overlayStyle={{height: '36px'}}
                        buttonStyle={{height: '36px'}}
                         labelStyle={{height: '36px', display: 'flex', alignItems: 'center',
                              letterSpacing: '0.6px', fontWeight: 'bold'}}
                      />
                      <SignupModal
                        open={this.state.modalOpen}
                        changeOpen={this.handleModalChangeOpen}
                      />

                </div>
              </div>

          </MediaQuery>
        </div>
      </App>
    )
  }
}
