import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Router from 'next/router'
import {buttonStyles} from '../styles.jsx'

export default class EventbriteIntegrate extends React.Component {
  constructor(props) {
    super(props);
    this.state =  {}
  }

  componentDidMount(props) {
    if (Router.query.access_token) {
      this.setState({access_token: Router.query.access_token})
    }
    console.log(Router.query.access_token)
  }

  render() {
    return (
      <div>

        <RaisedButton href={`/integrations/eventbrite`}
          style={buttonStyles.smallSize}
            labelStyle={buttonStyles.smallLabel}
            primary={true}

          label='Link to Eventbrite'
          />

      </div>
    )
  }
}
