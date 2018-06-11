import React from 'react';
import App from '../components/App';
import Router from 'next/router'

export default class ImportVolunteers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    Router.prefetch('/csv-upload')
    Router.prefetch('/mailchimp')

    return (
      <div>
        <App>
        <h2>Where do you want to import volunteers from?</h2>
        <div style={{padding: 20}} onClick={() => Router.push(`/mailchimp?organisation=${Router.query.organisation}`,
              `/mailchimp/${Router.query.organisation}`)}>
          From Mailchimp
        </div>
        <div style={{padding: 20}} onClick={() => Router.push(`/csv-upload?organisation=${Router.query.organisation}`,
              `/csv-upload/${Router.query.organisation}`)}>
          Copy and Paste from Excel/Google Sheets
        </div>
        </App>
      </div>
    )
  }
}
