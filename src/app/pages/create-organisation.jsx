import React from 'react'
import App from '../components/App.js';
import {World, AvatarIcon, Company} from '../components/icons.jsx';
import Link from "next/link"
import Router from 'next/router'
import DocumentTitle from 'react-document-title';
import MediaQuery from 'react-responsive';

export default class CreateOrganisation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {stage: 0}
  }

  handleAreaEnter = (side) => {
    this.setState({[side]: true})
  }

  handleAreaLeave = (side) => {
    this.setState({[side]: false})
  }

  render () {
    const styles = {
      leftIconBox: {
        margin: 35,
        height: 300,
        width: 300,
        backgroundColor: this.state.left ? 'rgba(101, 161, 231, 0.7)' : 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 6,
        color: 'rgb(101, 161, 231)',
        flexDirection: 'column',
        border: '3px solid #65A1e7',
        boxSizing: 'border-box',
        cursor: 'pointer',
        position: 'relative',
        boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px'
      },
      rightIconBox: {
        margin: 35,
        height: 300,
        width: 300,
        backgroundColor: this.state.right ? 'rgba(28, 28, 28, 0.7)' : 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        borderRadius: 6,
        border: '3px solid #484848',
        position: 'relative',
        boxSizing: 'border-box',
        cursor: 'pointer',
        boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px'
      },

      middleIconBox: {
        margin: 35,
        color: 'rgb(229, 87, 73)',
        height: 300,
        width: 300,
        backgroundColor: this.state.middle ? 'rgba(229, 87, 73, 0.7)' : 'white',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        borderRadius: 6,
        border: '3px solid #E55749',
        position: 'relative',
        boxSizing: 'border-box',
        cursor: 'pointer',
        boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px'
      },

      icon : {
        height: 150,
        paddingBottom: 10
      },
      leftChoiceText: {
        position: 'absolute',
        top: 25,
        fontSize: '24px',
        fontWeight: 700,
        color: this.state.left ? 'white' : 'inherit'
      },
      rightChoiceText: {
        position: 'absolute',
        top: 25,
        fontSize: '24px',
        fontWeight: 700,
        color: this.state.right ? 'white' : 'inherit'
      },
      rightMoreText: {
        position: 'absolute',
        bottom: 25,
        fontSize: '18px',
        fontWeight: 200,
        color: this.state.right ? 'white' : 'inherit'
      },
      leftMoreText: {
        position: 'absolute',
        bottom: 25,
        fontSize: '18px',
        fontWeight: 200,
        color: this.state.left ? 'white' : 'inherit'
      },
      middleChoiceText: {
        position: 'absolute',
        top: 25,
        fontSize: '24px',
        fontWeight: 700,
        color: this.state.middle ? 'white' : 'inherit'
      },
      middleMoreText: {
        position: 'absolute',
        bottom: 25,
        fontSize: '18px',
        fontWeight: 200,
        color: this.state.middle ? 'white' : 'inherit'
      },
      company : {
        height: 100
      }
    }

    return (
      <App>
        <div>
        <MediaQuery minDeviceWidth={700}>
          <div style={{paddingLeft: 100, paddingTop: 36, paddingRight: 100, paddingBottom: 200}}>
            <div className='desktop-header'>
              What kind of organisation are you creating?
            </div>
            <div style={{display: 'flex', width: '100%', justifyContent: 'center'}} className='choose-container'>
              <div className='choices' style={{display: 'flex'}}>
                <div className='icon-box'
                  onClick={() => Router.push('/create-project?stage=organisation')}
                  onMouseEnter={() => this.handleAreaEnter('left')}
                  onMouseLeave={() => this.handleAreaLeave('left')}
                  style={styles.leftIconBox}>
                  <World color={this.state.left ? 'white' : 'rgb(101, 161, 231)'}
                    style={{height: 80, paddingBottom: 10}}/>
                  <div style={styles.leftChoiceText}>
                    Charity
                  </div>
                  <div style={styles.leftMoreText}>
                    Registered with the Charity Commission
                  </div>
                </div>
                <div className='icon-box'
                  onClick={() => {Router.push('/create-other')}}
                  onMouseEnter={() => this.handleAreaEnter('middle')}
                  onMouseLeave={() => this.handleAreaLeave('middle')}
                  style={styles.middleIconBox}>
                  <Company color={this.state.middle ? 'white' : 'rgb(229, 87, 73)'} style={styles.company}/>
                  <div style={styles.middleChoiceText}>
                    Company
                  </div>
                  <div style={styles.middleMoreText}>
                    Registered in the UK with {`Companies' House`}
                  </div>
                </div>
                <div className='icon-box'
                  onClick={() =>  Router.push('/create-other')}
                  onMouseEnter={() => this.handleAreaEnter('right')}
                  onMouseLeave={() => this.handleAreaLeave('right')}
                  style={styles.rightIconBox}>
                  <AvatarIcon color={this.state.right ? 'white' : '#484848'} style={styles.icon}/>
                  <div style={styles.rightChoiceText}>
                    Other
                  </div>
                  <div style={styles.rightMoreText}>
                    Not registered with the charity commission or {`Companies' House`}
                  </div>
                </div>
              </div>
              <div className='illustrative-image'>
                <img src='' />
              </div>
            </div>
          </div>
        </MediaQuery>
        <MediaQuery maxDeviceWidth={700}>
          <div style={{paddingTop: 36}}>
            <div style={{paddingLeft: 24}} className='desktop-header'>
              Who you are creating this project for?
            </div>
            <div  className='choose-container'>
              <div className='choices' >
                <div className='icon-box'
                  onClick={() => Router.push('/create-project?stage=organisation')}
                  onMouseEnter={() => this.handleAreaEnter('left')}
                  onMouseLeave={() => this.handleAreaLeave('left')}
                  style={styles.leftIconBox}>
                  <World color={this.state.left ? 'white' : 'rgb(101, 161, 231)'}
                    style={{height: 80, paddingBottom: 10}}/>
                  <div style={styles.leftChoiceText}>
                    A Charity/Organisation
                  </div>
                  <div style={styles.leftMoreText}>
                    Organise a project for a charity you work for or are involved with
                  </div>
                </div>
                <div className='icon-box'
                  onClick={() => {localStorage.removeItem('charity'); Router.push('/create-project?stage=1')}}
                  onMouseEnter={() => this.handleAreaEnter('right')}
                  onMouseLeave={() => this.handleAreaLeave('right')}
                  style={styles.rightIconBox}>
                  <AvatarIcon color={this.state.right ? 'white' : 'rgb(229, 87, 73)'} style={styles.icon}/>
                  <div style={styles.rightChoiceText}>
                    Myself
                  </div>
                  <div style={styles.rightMoreText}>
                    Organise a project yourself for an issue you care about
                  </div>
                </div>
              </div>
              <div className='illustrative-image'>
                <img src='' />
              </div>
            </div>
          </div>
        </MediaQuery>
        </div>
    </App>
    )
  }
}
