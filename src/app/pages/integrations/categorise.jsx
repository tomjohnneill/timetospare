import React from 'react';
import Router from 'next/router'
import App from '../../components/App';
import fire from '../../fire';
import withMui from '../../components/hocs/withMui';

export class Categorise extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div>
        <App>
          <div>
            This is where interactions we've just found will go
          </div>
        </App>
      </div>
    )
  }
}

export default withMui(Categorise)
