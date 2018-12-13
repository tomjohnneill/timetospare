import React from 'react';
import App from '../components/App.js';
import OrganisationDetails from '../components/organisation-details.jsx';
import withMui from '../components/hocs/withMui';
import Router from 'next/router'
import fire from '../fire';
import {BUILD_LEVEL} from '../fire';
import {textFieldStyles, chipStyles} from '../components/styles.jsx';
import TextField from 'material-ui/TextField';
import * as firebase from 'firebase';
import Chip from 'material-ui/Chip'
import Link from 'next/link';
import Interaction from '../components/interaction.jsx';

let db = fire.firestore()
var functions = firebase.app().functions('europe-west1');

export class Explore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount(props) {
    if (Router.query.q) {
        this.setState({search: Router.query.q})

        this.runSearch()
        this.runOrgSearch()
    }
  }

  getTopics = () => {
    var wrapCors = functions.httpsCallable('integrations-wrapCors')
    wrapCors({
      url: `https://api.wit.ai/message?v=20181204&q=${this.state.search}`,
      method: 'GET',
      headers: {
        Authorization: 'Bearer 5RLJPSWJ27BMDFSHZHBQSFRJ4AC5UJEX'
      }
    }).then((result) => {
      console.log(result.data)
      this.setState({
        local_search_query: result.data.entities.local_search_query,
        locations: result.data.entities.location,
        datetime: result.data.entities.datetime
        })
    })
  }

  runSearch = () => {
    var q = this.state.search ? this.state.search : decodeURIComponent(Router.query.q)
    var basicSearch = functions.httpsCallable('elastic-basicSearch')
    basicSearch({
      index: BUILD_LEVEL === 'production' ? 'interactions' : 'staging-interactions',
      query: { "multi_match" : {
      "query" : q
    } }
    }).then((result) => {
      console.log(result)
      if (result.data && result.data.hits && result.data.hits.hits) {
        var editedHits = []
        result.data.hits.hits.forEach((hit) => {
          var newHit = hit
          newHit._source.Date = new Date(hit._source.Date)
          editedHits.push(newHit)
        })
        this.setState({hits: editedHits})
        Router.push(`/explore?q=${q}`)
      }
    })
  }

  runOrgSearch = () => {
    var q = this.state.search ? this.state.search : decodeURIComponent(Router.query.q)
    var basicSearch = functions.httpsCallable('elastic-basicSearch')
    basicSearch({
      index: BUILD_LEVEL === 'production' ? 'orgs' : 'staging-orgs',
      query: { "multi_match" : {
      "query" : q
    } }
    }).then((result) => {
      console.log(result)
      if (result.data && result.data.hits && result.data.hits.hits) {
        var editedHits = []
        result.data.hits.hits.forEach((hit) => {
          var newHit = hit
          newHit._source.Date = new Date(hit._source.Date)
          editedHits.push(newHit)
        })
        this.setState({orghits: editedHits})
        console.log('orgs', editedHits)
        Router.push(`/explore?q=${q}`)
      }
    })
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      //this.getTopics()
      this.runSearch()
      this.runOrgSearch()
    }
  }

  render() {
    return (
      <App>
        <div style={{position: 'fixed', zIndex: -1, top: 50, borderRadius: '0 30% 90% 0%',
          transform: 'skewX(-10deg)', backgroundColor: '#FFCB00', left: -150,
           width: '30vw', height: '100vw'}}/>
         <div style={{display: 'flex', justifyContent: 'center', padding: 16, minHeight: '100vh'}}>
          <div style={{width: '100%', maxWidth: 600, textAlign: 'left'}}>
            <h2 style={{textAlign: 'left', fontSize: '60px', fontWeight: 200, marginTop: 20, marginBottom: 20}}>
              Explore...
            </h2>
            <TextField
              underlineShow={false}
              value={this.state.search}
              onChange={(e, nv) => this.setState({search: nv})}
              fullWidth={true}
              onKeyPress={this.handleKeyPress}
              hintText='What are you looking for?'
              style={textFieldStyles.style}
              inputStyle={textFieldStyles.input}
              hintStyle={textFieldStyles.hint}
              />
            <div style={{height: 20}}/>
              {
                this.state.local_search_query ?
                <div>
                  We're looking for...
                  {this.state.local_search_query.map((entity) => (
                    <Chip
                      style={chipStyles.chip}
                      labelStyle={chipStyles.chipLabel}>
                      {entity.value}
                    </Chip>
                  ))}
                </div>
                :
                null
              }
              {
                this.state.locations ?
                <div>
                  Near:
                  {this.state.locations.map((location) => (
                    <div>
                      {location.resolved.values[0].coords.lat.toString()}
                      {location.resolved.values[0].coords.long.toString()}
                    </div>
                  ))}
                </div>
                :
                null
              }
              {
                this.state.orghits && this.state.orghits.length > 0?
                <div>
                  <div style={{fontWeight: 200, fontSize: '20px', paddingBottom: 20}}>Organisations</div>
                  <div style={{display: 'flex', flexWrap: 'wrap', marginBottom: 20}}>
                  {
                    this.state.orghits.map((hit) => (
                      <Link href={`/organisation?view=${localStorage.getItem('ttsOrg')}&targetorganisation=${hit._id}`}>
                        <div style={{cursor: 'pointer', margin: 2}}>
                          <Chip
                            style={chipStyles.chip}
                            labelStyle={chipStyles.chipLabel}>
                            {hit._source.details.name}
                          </Chip>
                        </div>
                      </Link>
                    ))
                  }
                  </div>
                </div>

                :
                null
              }
              {
                this.state.hits && this.state.hits.length > 0 ?
                <div>
                  <div style={{fontWeight: 200, fontSize: '20px', paddingBottom: 20}}>Interactions</div>
                  {
                  this.state.hits.map((hit) => (
                    <Interaction
                      interactionUsers={this.state.interactionUsers}
                      adminMap={this.state.adminMap}
                      membersLoaded={this.state.membersLoaded}
                      interaction={hit._source}/>
                  ))
                  }
                </div>

                :
                null
              }
          </div>

        </div>

      </App>
    )
  }
}

export default withMui(Explore)
