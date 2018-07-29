import React from "react"
import RaisedButton from 'material-ui/RaisedButton';
import App from "../components/App"
import MediaQuery from 'react-responsive';
import EmbeddedProject from '../components/embeddedproject.jsx';
import Search from 'material-ui/svg-icons/action/search';
import Divider from 'material-ui/Divider';
import Chip from 'material-ui/Chip';
import Snackbar from 'material-ui/Snackbar';
import Masonry from 'react-masonry-css';
import Loading from '../components/loading.jsx';
import SignupModal from '../components/signupmodal.jsx';
import Router from 'next/router';
import fire from '../fire';
import TextField from 'material-ui/TextField';
import RegisterInterest from '../components/registerinterest.jsx';
import Subheader from 'material-ui/Subheader';
import withMui from '../components/hocs/withMui';

let mobile = require('is-mobile');

let db = fire.firestore()

var algoliasearch = require('algoliasearch/lite')


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

export function changeImageAddress(file, size) {
  if (file && file.includes('https://d3kkowhate9mma.cloudfront.net')) {
    var str = file, replacement = '/' + size + '/';
    str = str.replace(/\/([^\/]*)$/,replacement+'$1');
    return(str + '?pass=this')
  } else {
    return (file)
  }
}



class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {projects: this.props.projects, upcoming: this.props.upcoming,
      successful: this.props.successful}

  }

  getPrivateProjects = (uid) => {
    db.collection("Project").where("View." + fire.auth().currentUser.uid, "==", true)
    .get().then((querySnapshot) => {
      var data = []
      querySnapshot.forEach((project) => {
        var elem = project.data()
        elem._id = project.id
        data.push(elem)
      })
      this.setState({private: data})
    })
  }

  handleImIn = () => {
    Router.push('/signup')
  }

  componentDidMount(props) {
    if (fire.auth().currentUser) {
      this.getPrivateProjects(fire.auth().currentUser.uid)
    }
    fire.auth().onAuthStateChanged((user) => {
      if (user !== null) {
        this.getPrivateProjects(fire.auth().currentUser.uid)
      }
    })
  }

  static async getInitialProps() {
    const res = await db.collection("Project").get()
    .then((querySnapshot) => {
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
      return({projects: projects,
        upcoming: upcoming, successful: successful,
        loading: false});
    })
    return res

/*
    const client = algoliasearch('52RYQZ0NQK', 'b10f7cdebfc189fc6f889dbd0d3ffec2');
    const index = client.initIndex('projects');
    var query = ''
    const res = await index
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
            console.log(responses.hits)
            return({projects: responses.hits,
              upcoming: upcoming, successful: successful,
              loading: false});
        });
      return {data: res}
      */
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
    var isMobile = mobile(this.props.userAgent)
    return (
      <App>
        <MediaQuery
          values={{deviceWidth: isMobile ? 600 : 1400}}
          minDeviceWidth={700}>
          <img
                  style={{height: '70vh',objectPosition: '50% 0%', width: '100%',
                   objectFit: 'cover', position: 'relative', marginTop: '-51px'}}
                  src={'https://images.unsplash.com/photo-1472289065668-ce650ac443d2?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=cdff4c62302fd44491d4850202323d11&auto=format&fit=crop&w=1050&q=80'}/>
                <div style={{position: 'absolute',top:'-51px',  height: '80%', width: '100%',
                flexDirection: 'column',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',paddingRight: '20px', boxSizing: 'border-box', paddingLeft: 80}}>
                  <div style={{width: '600px', paddingLeft: 200}}>
                    <h2 style={{textAlign: 'left', color: 'black', fontSize: '48px',
                  marginBottom: 15}}>Do good, better.</h2>


                  <p style={{fontSize: '20px', marginTop: 25, color: 'black' , fontWeight: 'lighter', textAlign: 'left'}}>
                    All the tools you need to better engage your volunteers.
                  </p>
                  {
                    !fire.auth().currentUser ?

                  <div style={{paddingTop: 0, width: '100%', display: 'flex', justifyContent: 'flex-start'}}>
                  <RaisedButton label="Sign Up Free"
                    primary={true}
                    style={{height: 44, width: 150,
                      boxShadow: '0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.2)',
                      borderRadius: 4}}
                    onClick={this.handleImIn}
                    labelStyle={{letterSpacing: 0.3, fontWeight: 700, fontSize: '16px', textTransform: 'none'}}
                    />
                  </div>
                  :
                  null
                }
                  </div>

                </div>

              <div style={{position: 'relative'}}>
                <img
                    style={{height: '70vh',objectPosition: '50% 60%', width: '100%',
                     objectFit: 'cover', position: 'relative', marginTop: '-51px'}}
                    src={'https://images.unsplash.com/photo-1492999104346-cabaa757be8f?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=e0e3f3e765bde2f5094873747a695c85&auto=format&fit=crop&w=1051&q=80'}/>
                  <div style={{position: 'absolute',top:'-51px',  height: '80%', width: '100%',
                  flexDirection: 'column',
                    display: 'flex', justifyContent: 'center',paddingRight: '20px', boxSizing: 'border-box', paddingLeft: 80}}>
                    <div style={{width: '600px'}}>
                      <h2 style={{textAlign: 'left', color: 'black', fontSize: '48px',
                    marginBottom: 15}}>Inspire your volunteers</h2>


                    <p style={{fontSize: '20px', marginTop: 25, color: 'black' , fontWeight: 'lighter', textAlign: 'left'}}>
                      Let them see all the great projects your organisation does. Let them sign up to extra if they have time to spare.
                      <br/>
                      <br/>
                      Let volunteers create groups, and come with their friends.
                      <br/>
                      <br/>
                      But you're in control, if a project is sensitive, you can restrict who can see it.




                    </p>

                    </div>

                  </div>
                </div>


                <div style={{position: 'relative'}}>
                  <img
                      style={{height: '70vh',objectPosition: '50% 100%', width: '100%',
                       objectFit: 'cover', position: 'relative', marginTop: '-51px'}}
                      src={'https://images.unsplash.com/photo-1530220616-3f1c5a86e6cb?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=29d3687e117dd607197b051ac2009473&auto=format&fit=crop&w=1191&q=80'}/>
                    <div style={{position: 'absolute',top:'-51px',  height: '80%', width: '100%',
                    flexDirection: 'column', alignItems: 'flex-end',
                      display: 'flex', justifyContent: 'center',paddingRight: '20px', boxSizing: 'border-box', paddingLeft: 80}}>
                      <div style={{width: '600px', paddingRight: 100}}>
                        <h2 style={{textAlign: 'left', color: 'black', fontSize: '48px',
                      marginBottom: 15}}>Save yourself time</h2>


                      <p style={{fontSize: '20px', marginTop: 25, color: 'black' , fontWeight: 'lighter', textAlign: 'left'}}>
                        Don't waste hours on boring admin. Save your time for the things that make a real difference.
                        <br/>
                        <br/>
                        We do reminder emails, calendar, and invite management all for you.
                      </p>

                      </div>

                    </div>
                  </div>

                  <div style={{position: 'relative', color: 'white'}}>
                    <img
                        style={{height: '70vh',objectPosition: '50% 60%', width: '100%',
                         objectFit: 'cover', position: 'relative', marginTop: '-51px'}}
                        src={'https://images.unsplash.com/photo-1517728848779-e95acb6ac40f?ixlib=rb-0.3.5&s=66620169dac15962f051322abe54d4b6&auto=format&fit=crop&w=1050&q=80'}/>
                      <div style={{position: 'absolute',top:'-51px',  height: '80%', width: '100%',
                      flexDirection: 'column',
                        display: 'flex', justifyContent: 'center',paddingRight: '20px', boxSizing: 'border-box', paddingLeft: 80}}>
                        <div style={{width: '600px'}}>
                          <h2 style={{textAlign: 'left',fontSize: '48px',
                        marginBottom: 15}}>Do better together</h2>


                        <p style={{fontSize: '20px', marginTop: 25,fontWeight: 'lighter', textAlign: 'left'}}>
                          Receive feedback to help you improve your projects.<br/><br/>
                          Help your volunteers showcase their effort.

                        </p>

                        </div>

                      </div>
                    </div>
                  </MediaQuery>

                  {/*Mobile version */}

            <MediaQuery
              values={{deviceWidth: isMobile ? 600 : 1400}}
              maxDeviceWidth={700}>
              <img
                      style={{height: '90vh',objectPosition: '40% 0%', width: '100%',
                       objectFit: 'cover', position: 'relative', marginTop: '-51px'}}
                      src={'https://images.unsplash.com/photo-1472289065668-ce650ac443d2?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=cdff4c62302fd44491d4850202323d11&auto=format&fit=crop&w=1050&q=80'}/>
                    <div style={{position: 'absolute',top:'-51px',  height: '90vh', width: '100%',
                    flexDirection: 'column',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <div style={{width: '100%', paddingLeft: '20%',  boxSizing: 'border-box'}}>
                        <h2 style={{textAlign: 'left', color: 'black', fontSize: '40px',
                      marginBottom: 15}}>Do good, <br/> better.</h2>


                      <p style={{fontSize: '20px', marginTop: 25, color: 'black' , fontWeight: 'lighter', textAlign: 'left'}}>
                        All the tools you need to better engage your volunteers.
                      </p>
                      {
                        !fire.auth().currentUser ?

                      <div style={{paddingTop: 0, width: '100%', display: 'flex', justifyContent: 'flex-start'}}>
                      <RaisedButton label="Sign Up Free"
                        primary={true}
                        style={{height: 44, width: 150,
                          boxShadow: '0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.2)',
                          borderRadius: 4}}
                        onClick={this.handleImIn}
                        labelStyle={{letterSpacing: 0.3, fontWeight: 700, fontSize: '16px', textTransform: 'none'}}
                        />
                      </div>
                      :
                      null
                    }
                      </div>

                    </div>

                  <div style={{position: 'relative'}}>
                    <img
                        style={{height: '90vh',objectPosition: '40% 60%', width: '100%',
                         objectFit: 'cover', position: 'relative', marginTop: '-51px'}}
                        src={'https://images.unsplash.com/photo-1492999104346-cabaa757be8f?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=e0e3f3e765bde2f5094873747a695c85&auto=format&fit=crop&w=1051&q=80'}/>
                      <div style={{position: 'absolute',top:'-51px',  height: '80%', width: '95%',
                      flexDirection: 'column',
                        display: 'flex', justifyContent: 'center',paddingRight: '20px',
                        boxSizing: 'border-box', paddingLeft: 20}}>
                        <div style={{width: '100%'}}>
                          <h2 style={{textAlign: 'left', color: 'black', fontSize: '48px',
                        marginBottom: 15}}>Inspire your volunteers</h2>


                        <p style={{fontSize: '20px', marginTop: 25, color: 'black' , fontWeight: 'lighter', textAlign: 'left'}}>
                          Let them see all the great projects your organisation does. Let them sign up to extra if they have time to spare.
                          <br/>
                          <br/>
                          Let volunteers create groups, and come with their friends.
                          <br/>
                          <br/>
                          But you're in control, if a project is sensitive, you can restrict who can see it.

                        </p>

                        </div>

                      </div>
                    </div>


                    <div style={{position: 'relative'}}>
                      <img
                          style={{height: '90vh',objectPosition: '55% 100%', width: '100%',
                           objectFit: 'cover', position: 'relative', marginTop: '-51px'}}
                          src={'https://images.unsplash.com/photo-1530220616-3f1c5a86e6cb?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=29d3687e117dd607197b051ac2009473&auto=format&fit=crop&w=1191&q=80'}/>
                        <div style={{position: 'absolute',top:'-51px',  height: '80%', width: '100%',
                        flexDirection: 'column', alignItems: 'flex-end',
                          display: 'flex', justifyContent: 'center',paddingRight: '20px',
                           boxSizing: 'border-box', paddingLeft: 20}}>
                          <div style={{ paddingRight: 10}}>
                            <h2 style={{textAlign: 'left', color: 'black', fontSize: '48px',
                          marginBottom: 15}}>Save yourself time</h2>


                          <p style={{fontSize: '20px', marginTop: 25, color: 'black' , fontWeight: 'lighter', textAlign: 'left'}}>
                            Don't waste hours on boring admin. Save your time for the things that make a real difference.

                        </p>
                          <p style={{fontSize: '20px', paddingLeft: 40,  color: 'black' , fontWeight: 'lighter', textAlign: 'left'}}>
                              We do reminder emails, calendar, and invite management all for you.</p>


                          </div>

                        </div>
                      </div>

                      <div style={{position: 'relative', color: 'white'}}>
                        <img
                            style={{height: '90vh',objectPosition: '50% 60%', width: '100%',
                             objectFit: 'cover', position: 'relative', marginTop: '0px'}}
                            src={'https://images.unsplash.com/photo-1517728848779-e95acb6ac40f?ixlib=rb-0.3.5&s=66620169dac15962f051322abe54d4b6&auto=format&fit=crop&w=1050&q=80'}/>
                          <div style={{position: 'absolute',top:'0px',  height: '100%', width: '100%',
                          flexDirection: 'column',
                            display: 'flex', justifyContent: 'center',paddingRight: '20px', boxSizing: 'border-box',
                            paddingLeft: 30}}>
                            <div style={{width: '100%'}}>
                              <h2 style={{textAlign: 'left',fontSize: '48px',
                                marginTop: 0, paddingBottom: 105,
                            marginBottom: 65}}>Do better together</h2>


                          <p style={{fontSize: '20px',paddingTop: 50, marginTop: 25,fontWeight: 'lighter', textAlign: 'left'}}>
                              Receive feedback to help you improve your projects.</p>
                            <p style={{fontSize: '20px',fontWeight: 'lighter', textAlign: 'left'}}>
                              Help your volunteers showcase their effort.
                            </p>


                            </div>

                          </div>
                        </div>

            </MediaQuery>

                    <div style={{display: 'flex', height: 300, width: '100%', fontSize: '48px',
                      padding: 10, boxSizing: 'border-box',
                      flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center'}}>
                      Get started today
                      <div style={{display: 'block', width: 300, marginTop: 30, fontSize: '16px'}}>
                        <div style={{paddingTop: 0, width: '100%', display: 'flex', justifyContent: 'center'}}>
                        <RaisedButton label="Sign Up Free"
                          primary={true}
                          style={{height: 44, width: 150,
                            boxShadow: '0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.2)',
                            borderRadius: 4}}
                          onClick={this.handleImIn}
                          labelStyle={{letterSpacing: 0.3, fontWeight: 700, fontSize: '16px', textTransform: 'none'}}
                          />
                        </div>
                      </div>
                    </div>


                <div>
            <MediaQuery
              values={{deviceWidth: isMobile ? 600 : 1400}}
              minDeviceWidth={700}>
              <div style={{position: 'sticky', top: '50px', display: 'flex', alignItems: 'center',
                 paddingLeft: 100, zIndex: 10, paddingRight: 100
                , background: 'linear-gradient(0deg, #ffffff, #f7f7f7)', paddingTop: 6,
                paddingBottom: 6, borderBottom: '1px solid #DDDDDD'}}>

                <Search style={{marginRight: 6}}/>
                <TextField hintText={'Search'} onChange={this.handleSearch}/>
              </div>

            </MediaQuery>
            <MediaQuery
              values={{deviceWidth: isMobile ? 600 : 1400}}
              maxDeviceWidth={700}>
              <div style={{position: 'sticky', top: '50px', display: 'flex', alignItems: 'center', paddingLeft: 16, zIndex: 10, paddingRight: 10
                , background: 'linear-gradient(0deg, #ffffff, #f7f7f7)', paddingTop: 6, paddingBottom: 6, borderBottom: '1px solid #DDDDDD'}}>

                <Search style={{marginRight: 6}}/>
                <TextField hintText={'Search'} onChange={this.handleSearch}/>
              </div>
            </MediaQuery>
            <div>
              <MediaQuery
                values={{deviceWidth: isMobile ? 600 : 1400}}
                minDeviceWidth={700}>
                {this.state.private ?
                  <div>
                <h1 className='desktop-header' style={{paddingLeft: '100px', marginTop: 16}}>
                  Private Projects</h1>
                  <div style={{display: 'flex', flexWrap: 'wrap', paddingLeft: 100, paddingRight:100}}>
                    {this.state.private.map((project) => (
                      <div style={{padding: 20, minWidth: 280, boxSizing: 'border-box', width: '33%', position: 'relative'}}>
                        <EmbeddedProject
                          isMobile={isMobile}
                          style={{position: 'relative'}} noLogo={true} project={project}/>
                      </div>
                    ))}
                  </div>
                  </div>
                :
                null}
                <h1 className='desktop-header' style={{paddingLeft: '100px', marginTop: 16}}>
                  Upcoming Projects</h1>
                {this.props.loading ?
                  <Loading/>
                  :
                  this.state.upcoming ?

                  <div style={{display: 'flex', flexWrap: 'wrap', paddingLeft: 100, paddingRight:100}}>
                    {this.state.upcoming.map((project) => (
                      <div style={{padding: 20, minWidth: 280, boxSizing: 'border-box', width: '33%', position: 'relative'}}>
                        <EmbeddedProject
                          isMobile={isMobile}
                          style={{position: 'relative'}} noLogo={true} project={project}/>
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
              <MediaQuery
                values={{deviceWidth: isMobile ? 600 : 1400}}
                maxDeviceWidth={700}>

                        <div style={{textAlign: 'left', paddingLeft: '18px', paddingRight: '18px', paddingBottom: '64px'}}>
                          {this.state.private ?
                            <div>
                              <Subheader style={{fontSize: '25px', letterSpacing: '-0.6px', lineHeight: '30px', color: '#484848',
                              fontWeight: 700, marginTop: '48px', marginBottom: '24px', paddingLeft: '0px'}}>
                                Private Projects
                              </Subheader>
                              <div style={{display: 'flex', flexWrap: 'wrap',
                              textAlign: 'left'}}>
                                {this.state.private.map((project) => (
                                  <div style={{paddingTop: 10, paddingBottom: 10, width: '100%', boxSizing: 'border-box'}}>
                                    <EmbeddedProject noLogo={true}
                                      project={project}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          :
                          null}

                          <Subheader style={{fontSize: '25px', letterSpacing: '-0.6px', lineHeight: '30px', color: '#484848',
                          fontWeight: 700, marginTop: '48px', marginBottom: '24px', paddingLeft: '0px'}}>
                            Upcoming Projects
                          </Subheader>
                          {this.props.loading ?
                            <Loading/>
                            :
                            this.state.upcoming ?
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
                        {this.props.loading ?
                          <Loading/>
                          :
                          this.state.successful ?
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
          </div>
      </App>
    )
  }

}

export default withMui(Index)
