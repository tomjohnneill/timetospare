import React from 'react';
import App from '../components/App.js';
import OrganisationDetails from '../components/organisation-details.jsx';
import withMui from '../components/hocs/withMui';
import Breadcrumbs from '../components/onboarding/breadcrumbs.jsx';

export class CreateOther extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <App>
        <Breadcrumbs stepIndex={0}/>
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

export default withMui(CreateOther)
