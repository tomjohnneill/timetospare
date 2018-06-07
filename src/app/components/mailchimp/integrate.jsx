import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Router from 'next/router'

export default class MailchimpIntegrate extends React.Component {
  constructor(props) {
    super(props);
    this.state =  {}
  }

  componentDidMount(props) {
    if (Router.query.access_token) {
      this.setState({access_token: Router.query.access_token})
    }
  }

  onMailchimpClick = () => {
    var client_id = 806258378783
    var redirect_uri = encodeURIComponent(`https://us-central1-whosin-next.cloudfunctions.net/greetings-mailchimpAuth`)
    window.location.href = `https://login.mailchimp.com/oauth2/authorize?
    response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}`
  }

  render() {
    return (
      <div>
        <h2>Mailchimp integration</h2>
        <p>Import your Mailchimp lists</p>
        <p>Automatically create lists of signups for each project</p>
        <p>Send custom automated emails</p>

        <RaisedButton
          onClick={this.onMailchimpClick}
          label='Link to Mailchimp'
          />

        {this.state.access_token ?
          <div>
            {this.state.access_token}
          </div>
          :
          null
        }
      </div>
    )
  }
}
