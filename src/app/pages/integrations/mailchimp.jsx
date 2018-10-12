import React from 'react';
import MailchimpIntegrate from '../../components/mailchimp/integrate.jsx';
import MailchimpSuccess from '../../components/mailchimp/success.jsx';
import App from '../../components/App.js'
import Router from 'next/router'
import withMui from '../../components/hocs/withMui';
import Breadcrumbs from '../../components/onboarding/breadcrumbs.jsx';

class Mailchimp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount(props) {
    Router.prefetch('/volunteer-preview')
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
          <Breadcrumbs stepIndex={1}/>
            <div style={{backgroundColor: '#F5F5F5',padding: 20,
              width: '100%', display: 'flex', justifyContent: 'center'}}>
              <div style={{  textAlign: 'left',
                maxWidth: 600, width: '100%'}}>
                {this.state.access_token ?
                  <MailchimpSuccess access_token={this.state.access_token}
                    api_endpoint = {this.state.api_endpoint}
                     />
                  :
                  <MailchimpIntegrate/>
                }
                <div style={{height: '100vh'}}/>
            </div>
          </div>
        </App>
      </div>
    )
  }
}

export default withMui(Mailchimp)
