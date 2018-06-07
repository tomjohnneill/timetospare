import React from 'react';
import App from '../components/App.js';

export default class Onboarding extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <App>
        <div>
          <p>Set admin accounts</p>
          <p>Import your volunteers</p>
          <p>Quick create projects</p>

        </div>
      </App>
    )
  }
}
