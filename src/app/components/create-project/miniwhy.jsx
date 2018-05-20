import React from 'react';
import Link from "next/link"
import Router from 'next/router'
import RaisedButton from 'material-ui/RaisedButton';
import MediaQuery from 'react-responsive';

const styles = {
  card : {
    height: '400px', width: '275px',
    marginRight: '30px',

    borderRadius: 10,
    overflow: 'hidden',
    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px',
    boxSizing: 'border-box'
  }
}

export default class MiniWhy extends React.Component {
  handleProject = () => {
    Router.push('/create-project?stage=choose-type')
  }

  render() {
    return (
      <div>
        <MediaQuery minDeviceWidth={700}>
          <div style={{paddingLeft: '100px', textAlign: 'left', paddingTop: 50}}>
            <h1 className='desktop-header'>
              Here's what you'll need to get started
            </h1>
            <div style={{paddingLeft: 16}}>
              * The number of people you’re looking for <br/>
            * The deadline to sign up <br/>
          * Address of the event <br/>
        * Date and time of your event <br/>
      * Project title, summary and description <br/>
              * A cover image
            </div>
              <p style={{fontWeight: 700}}>
              If you’re a charity or organisation you’ll also need:
              </p>
    <div style={{paddingLeft: 16}}>
              * Your logo
            </div>
            <p style={{fontWeight: 700}}>
            We will review and approve all projects before they are live.
            </p>

            <RaisedButton label='Start a Project' onClick={this.handleProject}
                style={{height: '36px', marginTop: '16px', boxShadow: ''}} primary={true} overlayStyle={{height: '36px'}}
                buttonStyle={{height: '36px'}}
                 labelStyle={{height: '36px', display: 'flex', alignItems: 'center',
                      letterSpacing: '0.6px', fontWeight: 'bold'}}
              />
          </div>
        </MediaQuery>
        <MediaQuery maxDeviceWidth={700}>
          <div style={{padding: 24, textAlign: 'left'}}>
            <h1 className='desktop-header'>
              Here's what you'll need to get started
            </h1>
            <div style={{paddingLeft: 16}}>
              * The number of people you’re looking for <br/>
            * The deadline to sign up <br/>
          * Address of the event <br/>
        * Date and time of your event <br/>
      * Project title, summary and description <br/>
              * A cover image
            </div>
              <p style={{fontWeight: 700}}>
              If you’re a charity or organisation you’ll also need:
              </p>
    <div style={{paddingLeft: 16}}>
              * Your logo
            </div>

            <p style={{fontWeight: 700}}>
            We will review and approve all projects before they are live.
            </p>
            <RaisedButton label='Start a Project' onClick={this.handleProject}
                style={{height: '36px', marginTop: '16px', boxShadow: ''}} primary={true} overlayStyle={{height: '36px'}}
                buttonStyle={{height: '36px'}}
                 labelStyle={{height: '36px', display: 'flex', alignItems: 'center',
                      letterSpacing: '0.6px', fontWeight: 'bold'}}
              />
          </div>
        </MediaQuery>
      </div>
    )
  }
}
