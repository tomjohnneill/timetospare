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
      this.setState({access_token: Router.query.access_token})
    }
  }

  render() {
    return (
      <div>
        <App>
          {this.state.access_token ?
            <MailchimpSuccess access_token={this.state.access_token} />
            :
            <MailchimpIntegrate/>
          }
        </App>
      </div>
    )
  }
}
