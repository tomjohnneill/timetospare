import React from 'react';
import App from '../components/App';
import Router from 'next/router'
import withMui from '../components/hocs/withMui';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider'
import Breadcrumbs from '../components/onboarding/breadcrumbs.jsx';
import CommunicationChatBubble from 'material-ui/svg-icons/av/play-arrow';

class ImportVolunteers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount(props) {
    this.setState({organisation: Router.query.organisation})
  }

  onMailchimpClick = () => {
    var client_id = 806258378783
    var redirect_uri = encodeURIComponent(`https://us-central1-whosin-next.cloudfunctions.net/greetings-mailchimpAuth`)
    window.location.href = `https://login.mailchimp.com/oauth2/authorize?
    response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}`
  }

  render() {
    if (typeof window !== 'undefined') {
      Router.prefetch('/csv-upload')
      Router.prefetch('/mailchimp')
    }

    return (
      <div>
        <App>
          <Breadcrumbs stepIndex={1}/>
          <div style={{backgroundColor: '#F5F5F5',padding: 20,
            width: '100%', display: 'flex', justifyContent: 'center'}}>
            <div style={{  textAlign: 'left',
              maxWidth: 600, width: '100%'}}>
              <h2>Where do you want to import volunteers from?</h2>
                <List style={{backgroundColor: 'white', borderRadius: 4}}>

                  <ListItem
                    style={{display: 'flex', height: 80, alignItems: 'center'}}
                    primaryText="Import from Mailchimp"
                    onClick={this.onMailchimpClick}
                    leftAvatar={<Avatar src="https://static.mailchimp.com/web/brand-assets/logo-freddie-fullcolor.svg" />}
                    rightIcon={<CommunicationChatBubble />}
                  />
                  <Divider/>
                  <ListItem
                    style={{display: 'flex', height: 80, alignItems: 'center'}}
                    primaryText="Copy and paste from a spreadsheet"
                    onClick={() => Router.push(`/csv-upload?organisation=${this.state.organisation}`,
                          `/csv-upload/${this.state.organisation}`)}
                    leftAvatar={<Avatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuLVCgqTLxBFELkcZJ1b7_xsV7mOVQxcVVmAp-tFD2dYBhLDG7YQ" />}
                    rightIcon={<CommunicationChatBubble />}
                  />

                </List>
                <div style={{height: '100vh'}}/>
            </div>
          </div>
        </App>
      </div>
    )
  }
}

export default withMui(ImportVolunteers)
