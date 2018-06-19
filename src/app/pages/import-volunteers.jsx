import React from 'react';
import App from '../components/App';
import Router from 'next/router'
import withMui from '../components/hocs/withMui';

class ImportVolunteers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount(props) {
    this.setState({organisation: Router.query.organisation})
  }

  render() {
    if (typeof window !== 'undefined') {
      Router.prefetch('/csv-upload')
      Router.prefetch('/mailchimp')
    }


    return (
      <div>
        <App>
        <h2>Where do you want to import volunteers from?</h2>
        <div style={{padding: 20}} onClick={() => Router.push(`/mailchimp?organisation=${this.state.organisation}`,
              `/mailchimp/${this.state.organisation}`)}>
          From Mailchimp
        </div>
        <div style={{padding: 20}} onClick={() => Router.push(`/csv-upload?organisation=${this.state.organisation}`,
              `/csv-upload/${this.state.organisation}`)}>
          Copy and Paste from Excel/Google Sheets
        </div>
        </App>
      </div>
    )
  }
}

export default withMui(ImportVolunteers)
