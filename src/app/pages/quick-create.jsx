import React from 'react';
import App from '../components/App';

export default class QuickCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div>
        <h2>Recurring events</h2>
        <div>
          Create an event
        </div>
      </div>
    )
  }
}
