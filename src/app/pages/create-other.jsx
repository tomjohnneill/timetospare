import React from 'react';
import App from '../components/App.js';
import OrganisationDetails from '../components/organisation-details.jsx';

export default class CreateOther extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <App>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        backgroundColor: '#F5F5F5'}}>
          <div style={{width: '100%', maxWidth: 600}}>
            <OrganisationDetails />
          </div>
        </div>
      </App>
    )
  }
}
