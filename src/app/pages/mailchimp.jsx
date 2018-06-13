import React from 'react';
import MailchimpIntegrate from '../components/mailchimp/integrate.jsx';
import MailchimpSuccess from '../components/mailchimp/success.jsx';
import App from '../components/App.js'
import Router from 'next/router'

export default class Mailchimp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount(props) {
    if (Router.query.access_token) {
      this.setState({access_token: Router.query.access_token,
        api_endpoint: Router.query.api_endpoint
      })
    }
  }

  render() {
    return (
      <div>
        <App>
          {this.state.access_token ?
            <MailchimpSuccess access_token={this.state.access_token}
              api_endpoint = {this.state.api_endpoint}
               />
            :
            <MailchimpIntegrate/>
          }
        </App>
      </div>
    )
  }
}
