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
        <MediaQuery minDeviceWidth={700}>
          <div className='loading-container'
            style={{display: 'flex', justifyContent: 'center', alignItems: 'center',
                      minHeight: '600px'}}>
            <CircularProgress color={'#000AB2'}/>
          </div>
        </MediaQuery>
        <MediaQuery maxDeviceWidth={700}>
          <div className='mobile-loading-container'
            style={{display: 'flex', justifyContent: 'center', alignItems: 'center',
                      minHeight: '600px'}}>
            <CircularProgress color={'#000AB2'}/>
          </div>
        </MediaQuery>
      </div>

    )
  }
}
