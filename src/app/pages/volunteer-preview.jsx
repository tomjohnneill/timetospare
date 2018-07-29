import React from 'react'
import Router from 'next/router'
import Link from 'next/link'
import VolunteerTable from '../components/admin-tools/table.jsx';
import App from '../components/App.js';
import withMui from '../components/hocs/withMui';
import RaisedButton from 'material-ui/RaisedButton';
import Breadcrumbs from '../components/onboarding/breadcrumbs.jsx';
import {buttonStyles} from '../components/styles.jsx';

export  class VolunteerPreview extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount(props) {
    this.setState({organisation: Router.query.organisation})
    Router.prefetch('/project-calendar')
  }

  render() {
    return (
      <div>
        <App>
          <Breadcrumbs stepIndex={1}/>
          <div style={{width: '100%', display: 'flex', flexDirection: 'column',
            alignItems: 'center', backgroundColor: '#F5F5F5',padding: '20px 0px 50px 0px'}}>
            <h2 style={{maxWidth: 1000,width: '100%', textAlign: 'left', marginLeft: 5}}>
              Your volunteers
            </h2>
            <div style={{maxWidth: 1000, width: '100%', backgroundColor: 'white'}}>
              {this.state.organisation ?
              <VolunteerTable
                defaultPageSize={7}
                organisation={this.state.organisation}/>
              :
              null}
            </div>
            <div style={{display: 'flex', maxWidth: 1000, width: '100%', marginTop: 20}}>
              <RaisedButton label='Next'
                primary={true}
                style={buttonStyles.smallSize}
                labelStyle={buttonStyles.smallLabel}
                href={'/project-calendar?onboarding=true'}
                />
            </div>
          </div>
        </App>
      </div>
    )
  }
}

export default withMui(VolunteerPreview)
