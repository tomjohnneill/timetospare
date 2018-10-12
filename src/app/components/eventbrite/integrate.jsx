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

  onMailchimpClick = () => {
    localStorage.setItem('ttsOrg', this.props.organisation)
    console.log(this.props.organisation)
    var client_id = 'CVMW6D7X3KP4GSF2JB'
    console.log(localStorage)
    window.location.href = `https://www.eventbrite.com/oauth/authorize?response_type=token&client_id=${client_id}`
  }

  render() {
    return (
      <div>


        <RaisedButton
          style={buttonStyles.smallSize}
            labelStyle={buttonStyles.smallLabel}
            primary={true}
          onClick={this.onMailchimpClick}
          label='Link to Eventbrite'
          />

      </div>
    )
  }
}
