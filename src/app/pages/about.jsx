import React from 'react'
import MediaQuery from 'react-responsive';
import {World, Person2, Person3, Person1, Ass, Muscle, ReviewIcon, Jenga} from '../components/icons.jsx';
import {grey200, grey500, red500, red100, orange500, orange100, yellow500,
  yellow100, limeA200, limeA700, green300} from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';
import DocumentTitle from 'react-document-title';
import {changeImageAddress} from '../components/desktopproject.jsx';
import Link from "next/link"
import App from "../components/App"
import Router from 'next/router'
import withMui from '../components/hocs/withMui';

const styles = {
  title: {
    fontSize: '64px',
    fontWeight: 700,
    fontFamily: 'Permanent Marker',
    textAlign: 'left',
    color: 'white'
  },
  mobileTitle: {
    fontSize: '56px',
    fontWeight: 700,
    fontFamily: 'Permanent Marker',
    textAlign: 'left',
    color: 'white'
  },
  summary: {
    fontWeight: 700,
    fontSize: '40px',
    color: 'white',
    maxWidth: '80%',
    textAlign: 'left'
  },
  mobileSummary: {
    fontWeight: 700,
    fontSize: '36px',
    color: 'white',
    textAlign: 'left'
  },
  header: {
    fontFamily: 'Permanent Marker',
    textAlign: 'left',
    fontSize: '36px'
  },
  inkbar: {
    height: 6,
    marginTop: 10,
    marginBottom: 10,
    width: '100px',
    backgroundColor: 'rgba(250,250,250,0.5)'
  },
  blackInkbar: {
    height: 6,
    marginTop: 10,
    width: '100px',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  redInkbar: {
    height: 6,
    marginTop: 10,
    marginBottom: 10,
    width: '100px',
    backgroundColor: '#E55749'
  },
  para: {
    marginTop: 16,
    fontWeight: 300,
    fontSize: '24px'
  },
  inside: {
    width: '100%',
    boxSizing: 'border-box',
    padding: 24,
    maxWidth: '800px',
    display: 'flex',
    alignItems: 'center',
    textAlign: 'center',
    flexDirection: 'column'
  },
  step: {
    fontSize: '40px',
    fontWeight: 700
  },
  ticHeader: {
    fontSize: '48px',
    fontWeight: 700,
    lineHeight: '48px'
  },
  ticSummary: {
    fontSize: '22px'
  },
  ticSummaryLight: {
    fontSize: '22px',
    fontWeight: 200
  },
  aboutIcon: {
    height: 100,
    width: 100,
    padding: 24,
  },
  aboutText: {
    padding: 10,
    fontSize: '24px'
  },
  aboutLeft: {
    width: '50%',
    marginRight: 50,
    paddingLeft: 20,
    paddingRight:20,
    boxSizing: 'border-box'
  },
  bigIcon: {
    width: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  aboutRight: {
    width: '50%',
    marginLeft: 50,
    paddingLeft: 20,
    paddingRight:20,
    boxSizing: 'border-box'
  },
  mobileAbout : {
    width: '100%'
  },
  mobileBigIcon: {
    marginTop: 50,
    marginBottom: 50
  }
}

let mobile = require('is-mobile');

class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    var isMobile = mobile(this.props.userAgent)
    return (
      <App>
      <div className='aboutContainer' style={{width: '100%', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', textAlign: 'left', backgroundColor: '#E55749',
      overflowX: 'hidden'}}>
      <DocumentTitle title='About'/>

        <MediaQuery
          values={{deviceWidth: isMobile ? 600 : 1400}}
           minDeviceWidth={700}>
          <div style={{backgroundColor: 'white', height: 450, paddingLeft: 100, paddingRight: 100,
          boxSizing: 'border-box', width: '100%'}}>
            <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
              <div style={styles.aboutLeft}>
                <div className='tongue-in-cheek-header' style={styles.ticHeader}>
                  Get up off your ass and do a good thing
                </div>
                <div style={styles.redInkbar}/>
                <div className='description-summary' style={styles.ticSummaryLight}>
                  I’m sure you’d have done this already if you had found the
                  right project, but it’s difficult, we get it.
                  That’s why we built Who’s In. <br/><b>Doing good shouldn’t be hard.</b>
                </div>
              </div>

              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50%'}}>
                <div>
                  <Ass style={{height: 300}} color={'#484848'}/>
                </div>
              </div>
            </div>
          </div>

          <div style={{backgroundColor: '#E55749', height: 450, paddingLeft: 100, paddingRight: 100,
              width: '100%', boxSizing: 'border-box', color: 'white'}}>
            <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
              <div style={styles.bigIcon}>
                <div>
                  <Jenga style={{height: 300}} color={'white'}/>
                </div>
              </div>

              <div style={styles.aboutRight}>
                <div className='tongue-in-cheek-header' style={styles.ticHeader}>
                  Crowd funding <br/>
                meet crowd doing
                </div>
                <div style={styles.inkbar}/>
                <div className='description-summary' style={styles.ticSummary}>
                  Only do a project if it meets its target.
                </div>
              </div>
            </div>
          </div>

          <div style={{backgroundColor: '#65A1e7', height: 450,color: 'white', paddingLeft: 100, paddingRight: 100}}>
            <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>


              <div style={styles.aboutLeft}>
                <div className='tongue-in-cheek-header' style={styles.ticHeader}>
                  One off projects
                </div>
                <div style={styles.inkbar}/>
                <div className='description-summary' style={styles.ticSummary}>
                  It’s hard to commit longer than a few days to a project,
                  so we’re collecting as many one-off projects as we can find.
                </div>
              </div>

              <div style={styles.bigIcon}>
                <div>
                  <img src='https://i.imgur.com/vRF33ES.gif'
                    style={{width: '100%', height: 'auto'}}/>
                </div>
              </div>

            </div>
          </div>

          <div style={{backgroundColor: 'white', height: 450, paddingLeft: 100, paddingRight: 100,
          boxSizing: 'border-box', width: '100%'}}>
            <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>

              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50%'}}>
                <div>
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <div className='about-icon' style={styles.aboutIcon}>
                      <Muscle style={{height: 100, width: 100}} color={'#484848'}/>
                    </div>
                    <div className='about-reviews' style={styles.aboutText}>
                      Fred has joined 10 projects
                    </div>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <div className='about-icon' style={styles.aboutIcon}>
                      <ReviewIcon style={{height: 100, width: 100}} color={'#484848'}/>
                    </div>
                    <div className='about-reviews' style={styles.aboutText}>
                      Fred has recommended 10 projects
                    </div>
                  </div>
                </div>
              </div>


              <div style={styles.aboutRight}>
                <div className='tongue-in-cheek-header' style={styles.ticHeader}>
                  Reviews for you and you and you and you
                </div>
                <div style={styles.redInkbar}/>
                <div className='description-summary' style={styles.ticSummaryLight}>
                  You can leave a review for the charity you worked with, and they can leave one for you.
                </div>
              </div>


            </div>
          </div>


            <div style={{backgroundColor: '#3B9E74', height: 450, paddingLeft: 100, paddingRight: 100,
            boxSizing: 'border-box', width: '100%', color: 'white'}}>

            <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
              <div style={styles.aboutLeft}>
                <div className='tongue-in-cheek-header' style={styles.ticHeader}>
                  Bring friends! If you have them
                </div>
                <div style={styles.inkbar}/>
                <div className='description-summary' style={styles.ticSummary}>
                  Don’t want to sign up unless your friends have? Done. We’ve built that feature for you.
                </div>
              </div>

              <div style={styles.bigIcon}>
                <div>
                  <img
                    style={{width: '100%', height: 'auto'}}
                    src='https://i.imgur.com/eYnBLEB.gif'/>
                </div>
              </div>
            </div>
          </div>

          <div style={{backgroundColor: 'white', height: 450, width: '100%', paddingLeft: 100, paddingRight: 100}}>
            <div style={{display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'center',
            flexDirection: 'column'}}>
              <div style={{width: '100%', textAlign: 'center', fontSize: '52px', fontWeight: 700}}>
                Go forth and do good
              </div>
              <div style={{marginTop: 25}}>
                <RaisedButton primary={true}
                  onClick={() => Router.push('/projects')}
                  style={{height: '36px', marginTop: '16px', boxShadow: ''}} primary={true} overlayStyle={{height: '36px'}}
                  buttonStyle={{height: '36px'}}
                   labelStyle={{height: '36px', display: 'flex', alignItems: 'center',
                        letterSpacing: '0.6px', fontWeight: 'bold'}}
                  label='Find a project'

                  />
              </div>
            </div>
          </div>


        </MediaQuery>


        <MediaQuery
          values={{deviceWidth: isMobile ? 600 : 1400}}
          maxDeviceWidth={700}>
          <div style={{backgroundColor: 'white', padding: 24}}>
            <div style={{height: 50}}/>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div>
                <Ass style={{height: 300}} color={'#484848'}/>
              </div>
            </div>
            <div style={{height: 50}}/>

            <div style={{ alignItems: 'center'}}>
              <div style={styles.mobileAbout}>
                <div className='tongue-in-cheek-header' style={styles.ticHeader}>
                  Get up off your ass and do a good thing
                </div>
                <div style={styles.redInkbar}/>
                <div className='description-summary' style={styles.ticSummaryLight}>
                  I’m sure you’d have done this already if you had found the
                  right project, but it’s hard, we get it.
                  That’s why we built Who’s In. <br/><b>Doing good shouldn’t be hard.</b>
                </div>
              </div>


            </div>
            <div style={{height: 50}}/>
          </div>

          <div style={{backgroundColor: '#E55749', padding: 24,
              width: '100%', boxSizing: 'border-box', color: 'white'}}>
            <div style={{ alignItems: 'center', height: '100%'}}>
              <div style={styles.mobileBigIcon}>
                <div>
                  <Jenga style={{height: 300}} color={'white'}/>
                </div>
              </div>

              <div style={styles.mobileAbout}>
                <div className='tongue-in-cheek-header' style={styles.ticHeader}>
                  Crowd funding <br/>
                meet crowd doing
                </div>
                <div style={styles.inkbar}/>
                <div className='description-summary' style={styles.ticSummary}>
                  Only do a project if it meets its target.
                </div>
              </div>
            </div>
            <div style={{height: 50}}/>
          </div>

          <div style={{backgroundColor: '#65A1e7', color: 'white',padding: 24}}>
            <div style={{height: 50}}/>
            <div style={{ alignItems: 'center', height: '100%'}}>


              <div style={styles.mobileAbout}>
                <div className='tongue-in-cheek-header' style={styles.ticHeader}>
                  One off projects
                </div>
                <div style={styles.inkbar}/>
                <div className='description-summary' style={styles.ticSummary}>
                  It’s hard to commit longer than a few days to a project,
                  so we’re collecting as many one-off projects as we can find.
                </div>
              </div>

              <div style={styles.mobileBigIcon}>
                <div>
                  <img src='https://i.imgur.com/vRF33ES.gif'
                    style={{width: '100%', height: 'auto'}}/>
                </div>
              </div>

            </div>
          </div>

          <div style={{backgroundColor: 'white', padding:24}}>
            <div style={{height: 50}}/>
            <div style={{alignItems: 'center', height: '100%'}}>

              <div style={styles.mobileAbout}>
                <div className='tongue-in-cheek-header' style={styles.ticHeader}>
                  Reviews for you and you and you and you
                </div>
                <div style={styles.redInkbar}/>
                <div className='description-summary' style={styles.ticSummaryLight}>
                  You can leave a review for the charity you worked with, and they can leave one for you.
                </div>
              </div>
              <div style={{height: 50}}/>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <div>
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <div className='about-icon' style={styles.aboutIcon}>
                      <Muscle style={{height: 100, width: 100}} color={'#484848'}/>
                    </div>
                    <div className='about-reviews' style={styles.aboutText}>
                      Fred has joined 10 projects
                    </div>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <div className='about-icon' style={styles.aboutIcon}>
                      <ReviewIcon style={{height: 100, width: 100}} color={'#484848'}/>
                    </div>
                    <div className='about-reviews' style={styles.aboutText}>
                      Fred has recommended 10 projects
                    </div>
                  </div>
                </div>
              </div>
              <div style={{height: 50}}/>


            </div>
          </div>

          <div style={{backgroundColor: '#3B9E74',color: 'white', padding: 24}}>
            <div style={{height: 50}}/>
            <div style={{ alignItems: 'center', height: '100%'}}>
              <div style={styles.mobileAbout}>
                <div className='tongue-in-cheek-header' style={styles.ticHeader}>
                  Bring friends! If you have them
                </div>
                <div style={styles.inkbar}/>
                <div className='description-summary' style={styles.ticSummary}>
                  Don’t want to sign up unless your friends have? Done. We’ve built that feature for you.
                </div>
              </div>

              <div style={styles.mobileBigIcon}>
                <div>
                  <img
                    style={{width: '100%', height: 'auto'}}
                    src='https://i.imgur.com/eYnBLEB.gif'/>
                </div>
              </div>
            </div>
          </div>

          <div style={{backgroundColor: 'white', width: '100%', padding: 24}}>
            <div style={{height: 50}}/>
            <div style={{display: 'flex', alignItems: 'center', height: '100%', justifyContent: 'center',
            flexDirection: 'column'}}>
              <div style={{width: '100%', textAlign: 'center', fontSize: '52px', fontWeight: 700}}>
                Go forth and do good
              </div>
              <div style={{marginTop: 25}}>
                <RaisedButton
                  onClick={() => Router.push('/projects')}
                  label='Find a project'
                  style={{height: '36px', marginTop: '16px', boxShadow: ''}} primary={true} overlayStyle={{height: '36px'}}
                  buttonStyle={{height: '36px'}}
                   labelStyle={{height: '36px', display: 'flex', alignItems: 'center',
                        letterSpacing: '0.6px', fontWeight: 'bold'}}
                  />
              </div>
            </div>
            <div style={{height: 50}}/>
          </div>


        </MediaQuery>


      </div>
      </App>
    )
  }
}

export default withMui(About)
