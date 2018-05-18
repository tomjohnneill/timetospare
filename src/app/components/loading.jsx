import React from 'react';
import MediaQuery from 'react-responsive';
import CircularProgress from 'material-ui/CircularProgress';

export default class Loading extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        Loading...
      </div>
    )
  }
}
