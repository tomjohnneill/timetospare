import React from 'react'
import App from '../../components/App.js'
import Router from 'next/router'
import withMui from '../../components/hocs/withMui';
import OutlookIntegrate from '../../components/outlook/integrate';

export class Outlook extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div>
        <OutlookIntegrate/>
      </div>
    )
  }
}

export default withMui(Outlook)
