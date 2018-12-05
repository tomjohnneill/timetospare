import React from 'react';
import App from '../components/App.js';
import OrganisationDetails from '../components/organisation-details.jsx';
import withMui from '../components/hocs/withMui';
import Router from 'next/router'
import fire from '../fire';
import {textFieldStyles, chipStyles} from '../components/styles.jsx';
import TextField from 'material-ui/TextField';
import * as firebase from 'firebase';
import Chip from 'material-ui/Chip'

let db = fire.firestore()
var functions = firebase.app().functions('europe-west1');

export class Explore extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
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

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.getTopics()
    }
  }

  render() {
    return (
      <App>
        <div style={{position: 'fixed', zIndex: -1, top: 50, borderRadius: '0 30% 90% 0%',
          transform: 'skewX(-10deg)', backgroundColor: '#FFCB00', left: -150,
           width: '30vw', height: '100vw'}}/>
         <div style={{display: 'flex', justifyContent: 'center', padding: 16, minHeight: '100vh'}}>
          <div style={{width: '100%', maxWidth: 600}}>
            <h2 style={{textAlign: 'left', fontSize: '60px', fontWeight: 200}}>
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
          </div>

        </div>

      </App>
    )
  }
}

export default withMui(Explore)
