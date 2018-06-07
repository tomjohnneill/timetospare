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
import fire from '../fire';
import TextField from 'material-ui/TextField';
import RegisterInterest from '../components/registerinterest.jsx';
import Subheader from 'material-ui/Subheader';
import "../static/style.css"

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



export default class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {projects: this.props.projects, upcoming: this.props.upcoming,
      successful: this.props.successful}
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
    console.log(this.props)
    return (
      <App>
          <img
                  style={{height: '90vh', width: '100%', objectFit: 'cover', position: 'relative', marginTop: '-51px'}}
                  src={changeImageAddress('https://d3kkowhate9mma.cloudfront.net/important/jeremy-bishop-170994-unsplash.jpg', '750xauto')}/>
                <div style={{position: 'absolute',top:'-51px',  height: '100%', width: '100%',
                  background: 'radial-gradient(ellipse closest-side, rgba(0,0,0,0.75), rgba(0,0,0,0))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                paddingLeft: '20px', paddingRight: '20px', boxSizing: 'border-box'}}>
                  <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'
                    , justifyContent: 'center', width: '300px'}}>
                    <h2 style={{color: 'white', fontSize: '36px'}}>Get up off your ass and do something good</h2>
                    <span style={{fontWeight: 'lighter', color: 'white'}}>
                      Doing good shouldn't be hard. Find a project near you to get involved with.

                    </span>
                    {
                      !fire.auth().currentUser ?

                    <div style={{paddingTop: 20}}>
                    <RaisedButton label="I'm In."
                      primary={true}
                      onClick={this.handleImIn}
                      labelStyle={{letterSpacing: 0.3, fontWeight: 700}}
                      />
                    <div style={{width: '80vw'}}>

                    </div>
                    </div>
                    :
                    null
                  }
                  </div>
                </div>

                <div>
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
                {this.props.loading ?
                  <Loading/>
                  :
                  this.state.upcoming ?

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
