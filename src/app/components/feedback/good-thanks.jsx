import React from 'react'
import MediaQuery from 'react-responsive';
import {CharitySubscribe} from '../../pages/charity.jsx';
import Divider from 'material-ui/Divider';
import Masonry from 'react-masonry-css';
import EmbeddedProject from '../embeddedproject.jsx';
import Loading from '../loading.jsx';
import Subheader from 'material-ui/Subheader';
import {changeImageAddress} from '../desktopproject.jsx';
import fire from '../../fire';
let db = fire.firestore()
var algoliasearch = require('algoliasearch/lite')

export default class GoodThanks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount(props) {
    db.collection("Project").doc(this.props.projectId).get().then((doc) => {
      let data = doc.data()
      this.setState({charityId: data.Charity, charity: data['Charity Name']})
    })

    const client = algoliasearch('52RYQZ0NQK', 'b10f7cdebfc189fc6f889dbd0d3ffec2');
    if (process.env.REACT_APP_ENVIRONMENT === "staging" || process.env.NODE_ENV === 'development') {
      var index = client.initIndex('staging_projects');
    } else {
      var index = client.initIndex('projects');
    }
    var query = ''
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
              } else {
                successful.push(hit)
              }
            })
            this.setState({projects: responses.hits,
              upcoming: upcoming, successful: successful,
              loading: false});
        });
  }

  render() {
    return (
      <div style={{display: 'flex', alignItems: 'center', minHeight: 800, flexDirection: 'column'}}>
        <MediaQuery minDeviceWidth={700}>
          <img
          style={{height: 450, width: '100%', objectFit: 'cover', position: 'relative', marginTop: '-51px'}}
          src={changeImageAddress('https://d3kkowhate9mma.cloudfront.net/important/adam-jang-260876-unsplash.jpg', '1500xauto')}/>
        </MediaQuery>
        <MediaQuery maxDeviceWidth={700}>
          <img
          style={{height: 350, width: '100%',
            objectPosition: '25% 50%',
             objectFit: 'cover', position: 'relative', marginTop: '-51px'}}
          src={changeImageAddress('https://d3kkowhate9mma.cloudfront.net/important/adam-jang-260876-unsplash.jpg', '500xauto')}/>
        </MediaQuery>
        <div style={{maxWidth: 900, width: '100%', boxSizing: 'border-box', padding: 16}}>

          <div className='desktop-header' style={{paddingBottom: 30, paddingTop: 30}}>
            We're glad you had a good time
          </div>
          <Divider/>
          {this.state.charityId ?
            <div>
              <h2>Don't miss out next time...</h2>
              <div>
                <CharitySubscribe charityId={this.state.charityId}/>
              </div>
              <div style={{paddingTop: 24, paddingBottom: 24}}>
                We'll send you an email if {this.state.charity} organise another project.
              </div>
            </div>
            :
            null
          }
          <Divider/>
            <MediaQuery minDeviceWidth={700}>
              <h1 className='desktop-header' style={{marginTop: 16}}>
                Find another project</h1>
              {this.state.loading ?
                <Loading/>
                :
                this.state.projects ?

                <Masonry
                  breakpointCols={2}
                  className="my-masonry-grid"
                  columnClassName="my-masonry-grid_column">
                  {this.state.upcoming.map((project) => (
                    <div style={{padding: 20, minWidth: 280, boxSizing: 'border-box', width: '100%', position: 'relative'}}>
                      <EmbeddedProject style={{position: 'relative'}} noLogo={true} project={project}/>
                    </div>
                  ))}
                </Masonry>

                :
                null
              }

            </MediaQuery>
            <MediaQuery maxDeviceWidth={700}>

                      <div style={{textAlign: 'left', paddingBottom: '64px'}}>
                        <Subheader style={{fontSize: '25px', letterSpacing: '-0.6px', lineHeight: '30px', color: '#484848',
                        fontWeight: 700, marginTop: '48px', marginBottom: '24px', paddingLeft: '0px'}}>
                          Find another project
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

                    </div>

            </MediaQuery>
        </div>
      </div>
    )
  }
}
