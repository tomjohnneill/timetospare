import React from 'react'
import MediaQuery from 'react-responsive';
import {ReviewIcon, Engagement, Robot, CaseStudy, Jenga,  CriticalMass, Friends, Subscribers, Admin, ShareOnSocial, Reviews, SocialMedia} from '../components/icons.jsx';
import {grey200, grey500, red500, red100, orange500, orange100, yellow500,
  yellow100, limeA200, limeA700, green300} from 'material-ui/styles/colors';
import RaisedButton from 'material-ui/RaisedButton';
import DocumentTitle from 'react-document-title';
import {changeImageAddress} from '../components/desktopproject.jsx';
import Link from "next/link"
import Router from 'next/router'
import App from "../components/App"
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
    width: '60%',
    marginRight: 50,
    paddingLeft: 20,
    paddingRight:20,
    boxSizing: 'border-box'
  },
  bigIcon: {
    width: '40%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  aboutRight: {
    width: '60%',
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

class NewWhy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <App className='aboutContainer' >
      <div style={{width: '100%', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center', textAlign: 'left', backgroundColor: '#E55749',
      overflowX: 'hidden'}}>
      <DocumentTitle title='About'/>

        <MediaQuery minDeviceWidth={700}>
          <div style={{backgroundColor: 'white', height: 450, paddingLeft: 100, paddingRight: 100}}>
            <div style={{width: '100%', display: 'flex', alignItems: 'center', height: '100%'}}>
              <div style={styles.aboutLeft}>
                <div className='tongue-in-cheek-header' style={styles.ticHeader}>
                  Find new people, better engage your existing supporters
                </div>
                <div style={styles.redInkbar}/>
                <div className='description-summary' style={styles.ticSummaryLight}>
                  Reach out to new people who might not have heard of your charity or might not know what projects you run.
                  Show your existing supporters what they can do to get more involved
                </div>
              </div>

              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50%'}}>
                <div>
                  <Engagement style={{height: 200}} color={'#484848'}/>
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
                  Get to critical mass
                </div>
                <div style={styles.inkbar}/>
                <div className='description-summary' style={styles.ticSummary}>
                  Most projects don’t work if only 1 or 2 people turn up. You can set a minimum number of people needed for the project to go ahead.
                </div>
              </div>
            </div>
          </div>

          <div style={{backgroundColor: '#65A1e7', height: 450,color: 'white', width: '100%', boxSizing: 'border-box', paddingLeft: 100, paddingRight: 100}}>
            <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>


              <div style={styles.aboutLeft}>
                <div className='tongue-in-cheek-header' style={styles.ticHeader}>
                  People, not robots
                </div>
                <div style={styles.inkbar}/>
                <div className='description-summary' style={styles.ticSummary}>
                  Everyone who signs up is required to verify that they’re a real person, with a working phone.
                </div>
              </div>

              <div style={styles.bigIcon}>
                <div>
                  <Robot style={{height: 200}} color={'rgb(255,255,255)'}/>
                </div>
              </div>

            </div>
          </div>

          <div style={{backgroundColor: 'white', height: 450,color: 'inherit', paddingLeft: 100, paddingRight: 100}}>
            <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>

              <div style={styles.bigIcon}>
                <div>
                  <Friends style={{height: 200}} color={'#484848'}/>
                </div>
              </div>


              <div style={styles.aboutRight}>
                <div className='tongue-in-cheek-header' style={styles.ticHeader}>
                  Get people to bring their friends
                </div>
                <div style={styles.redInkbar}/>
                <div className='description-summary' style={styles.ticSummaryLight}>
                  Most people won’t turn up to a project if they don’t know anyone going. With our “Who’s In” panel at the side of every project, people can see exactly who has signed up already.
                <br/>
                  If they don’t recognise anyone, they can invite a couple of your friends before they sign up.

                </div>
              </div>


            </div>
          </div>

          <div style={{backgroundColor: '#3B9E74', height: 450,
            width: '100%', boxSizing: 'border-box',
            color: 'white', paddingLeft: 100, paddingRight: 100}}>
            <div style={{width: '100%', display: 'flex', alignItems: 'center', height: '100%'}}>
              <div style={styles.aboutLeft}>
                <div className='tongue-in-cheek-header' style={styles.ticHeader}>
                  Get subscribers
                </div>
                <div style={styles.inkbar}/>
                <div className='description-summary' style={styles.ticSummary}>
                  People can subscribe to your charity page, and will be emailed whenever you start a new project.
                </div>
              </div>

              <div style={styles.bigIcon}>
                <div>
                  <Subscribers style={{height: 200}} color={'white'}/>
                </div>
              </div>
            </div>
          </div>


          <div style={{backgroundColor: 'white', height: 450,color: 'inherit', paddingLeft: 100, paddingRight: 100}}>
            <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>

              <div style={styles.bigIcon}>
                <div>
                  <Admin style={{height: 200}} color={'#484848'}/>
                </div>
              </div>


              <div style={styles.aboutRight}>
                <div className='tongue-in-cheek-header' style={styles.ticHeader}>
                  Export your data or use our admin tools
                </div>
                <div style={styles.redInkbar}/>
                <div className='description-summary' style={styles.ticSummaryLight}>
                  We collect the email addresses and phone numbers from everyone who signs up, and we give you the tools needed to send a text or an email to everyone about the event.

                <br/><br/>
                  (For GDPR compliance, it’s important that you use this information only for project specific information.)

                </div>
              </div>


            </div>
          </div>

          <div style={{backgroundColor: '#E55749', height: 450, paddingLeft: 100, paddingRight: 100,
              width: '100%', boxSizing: 'border-box', color: 'white'}}>
            <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
              <div style={styles.aboutLeft}>
                <div className='tongue-in-cheek-header' style={styles.ticHeader}>
                  Share projects on social media, or your website
                </div>
                <div style={styles.inkbar}/>
                <div className='description-summary' style={styles.ticSummary}>
                  You can customise the description that appears on Facebook, LinkedIn or Twitter when you share your project – to save you the time in making nice social media posts.
                  <br/><br/>
                  If you want to put a link to the project on your own website, you can also embed the project, like you can with tweets or Instagram posts.

                </div>
              </div>

              <div style={styles.bigIcon}>
                <div>
                  <ShareOnSocial style={{height: 200}} color={'white'}/>
                </div>
              </div>


            </div>
          </div>

          <div style={{backgroundColor: '#65A1e7', height: 450,color: 'white', width: '100%', boxSizing: 'border-box', paddingLeft: 100, paddingRight: 100}}>
            <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>

              <div style={styles.bigIcon}>
                <div>
                  <Reviews style={{height: 200}} color={'rgb(255,255,255)'}/>
                </div>
              </div>

              <div style={styles.aboutRight}>
                <div className='tongue-in-cheek-header' style={styles.ticHeader}>
                  Continue the conversation with reviews
                </div>
                <div style={styles.inkbar}/>
                <div className='description-summary' style={styles.ticSummary}>
                  When the project is finished, leave a review for your volunteers, and they will leave one for your project.
                  It’s a great way to engage volunteers once the project is over, and increases the likelihood that they will turn up next time, become regular volunteers, or potentially donors.
                </div>
              </div>



            </div>
          </div>

          <div style={{backgroundColor: 'white', height: 450, paddingLeft: 100, paddingRight: 100,
          boxSizing: 'border-box', width: '100%'}}>
            <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
              <div style={styles.aboutLeft}>
                <div className='tongue-in-cheek-header' style={styles.ticHeader}>
                  See what was said on social media
                </div>
                <div style={styles.redInkbar}/>
                <div className='description-summary' style={styles.ticSummaryLight}>
                  Give your project a hashtag (as niche as possible), and we’ll find everything anyone posted on Instagram or Twitter about it.
                  <br/><br/>
                  We’ll even tell you how many likes and replies you got, and how many people could have seen the posts.

                </div>
              </div>

              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '50%'}}>
                <div>
                  <SocialMedia style={{height: 200}} color={'#484848'}/>
                </div>
              </div>
            </div>
          </div>

          <div style={{backgroundColor: '#3B9E74', height: 450,color: 'white', paddingLeft: 100, paddingRight: 100}}>
            <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>
              <div style={styles.bigIcon}>
                <div>
                  <CaseStudy style={{height: 200}} color={'white'}/>
                </div>
              </div>
              <div style={styles.aboutRight}>
                <div className='tongue-in-cheek-header' style={styles.ticHeader}>
                  Build shiny case study pages
                </div>
                <div style={styles.inkbar}/>
                <div className='description-summary' style={styles.ticSummary}>
                  After the project, we group together all the reviews people have left you, all the social media posts, the “Who’s In” panel, and what you wrote about the event.
                  <br/><br/>
                  You can use the page to advertise future projects, or show your current or future donors the impact your projects are making.

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
                  style={{height: '36px', marginTop: '16px', boxShadow: ''}} primary={true} overlayStyle={{height: '36px'}}
                  buttonStyle={{height: '36px'}}
                   labelStyle={{height: '36px', display: 'flex', alignItems: 'center',
                        letterSpacing: '0.6px', fontWeight: 'bold'}}
                  label='Start a project' onClick={() => Router.push('/create-project?stage=0')}
                  />
              </div>
            </div>
          </div>



        </MediaQuery>


        <MediaQuery maxDeviceWidth={700}>
          <div style={{backgroundColor: 'white', padding: 24}}>

            <div style={{ alignItems: 'center'}}>
              <div style={styles.mobileAbout}>
                <div className='tongue-in-cheek-header' style={styles.ticHeader}>
                  Find new people, better engage your existing supporters
                </div>
                <div style={styles.redInkbar}/>
                <div className='description-summary' style={styles.ticSummaryLight}>
                  Reach out to new people who might not have heard of your charity or might not know what projects you run.
                  Show your existing supporters what they can do to get more involved
                </div>
              </div>


            </div>
            <div style={{height: 50}}/>
          </div>

          <div style={{backgroundColor: '#E55749', padding: 24,
              width: '100%', boxSizing: 'border-box', color: 'white'}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%'}}>
              <div style={styles.mobileBigIcon}>
                <div>
                  <Jenga style={{height: 200}} color={'white'}/>
                </div>
              </div>

              <div style={styles.mobileAbout}>
                <div className='tongue-in-cheek-header' style={styles.ticHeader}>
                Get to critical mass
                </div>
                <div style={styles.inkbar}/>
                <div className='description-summary' style={styles.ticSummary}>
                  Most projects don’t work if only 1 or 2 people turn up. You can set a minimum number of people needed for the project to go ahead.
                </div>
              </div>
            </div>
            <div style={{height: 50}}/>
          </div>

          <div style={{backgroundColor: '#65A1e7', color: 'white',padding: 24}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%'}}>
              <div style={styles.mobileBigIcon}>
                <div>
                  <Robot style={{height: 200}} color={'white'}/>
                </div>
              </div>

              <div style={styles.mobileAbout}>
                <div className='tongue-in-cheek-header' style={styles.ticHeader}>
                  People, not robots
                </div>
                <div style={styles.inkbar}/>
                <div className='description-summary' style={styles.ticSummary}>
                  Everyone who signs up is required to verify that they’re a real person, with a working phone.
                </div>
              </div>
              <div style={{height: 50}}/>
            </div>
          </div>

          <div style={{backgroundColor: 'white', padding:24}}>
            <div style={{height: 50}}/>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%'}}>

              <div style={styles.mobileAbout}>
                <div className='tongue-in-cheek-header' style={styles.ticHeader}>
                    Get people to bring their friends
                </div>
                <div style={styles.redInkbar}/>
                <div className='description-summary' style={styles.ticSummaryLight}>
                  Most people won’t turn up to a project if they don’t know anyone going. With our “Who’s In” panel at the side of every project, people can see exactly who has signed up already.
                <br/><br/>
                  If they don’t recognise anyone, they can invite a couple of your friends before they sign up.
                </div>
              </div>
              <div style={{height: 50}}/>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>

              </div>

            </div>
          </div>

          <div style={{backgroundColor: '#3B9E74',color: 'white', padding: 24}}>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%'}}>
              <div style={styles.mobileBigIcon}>
                <div>
                  <Subscribers style={{height: 200}} color={'white'}/>
                </div>
              </div>
              <div style={styles.mobileAbout}>
                <div className='tongue-in-cheek-header' style={styles.ticHeader}>
                  Get subscribers
                </div>
                <div style={styles.inkbar}/>
                <div className='description-summary' style={styles.ticSummary}>
                  People can subscribe to your charity page, and will be emailed whenever you start a new project.
                </div>
              </div>

              <div style={{height: 50}}/>
            </div>
          </div>

          <div style={{backgroundColor: 'white', padding:24}}>
            <div style={{height: 50}}/>
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%'}}>

              <div style={styles.mobileAbout}>
                <div className='tongue-in-cheek-header' style={styles.ticHeader}>
                    Export your data or use our admin tools
                </div>
                <div style={styles.redInkbar}/>
                <div className='description-summary' style={styles.ticSummaryLight}>
                  We collect the email addresses and phone numbers from everyone who signs up, and we give you the tools needed to send a text or an email to everyone about the event.

                <br/><br/>
                  (For GDPR compliance, it’s important that you use this information only for project specific information.)
                </div>
              </div>
              <div style={{height: 50}}/>
            </div>
          </div>

          <div style={{backgroundColor: '#E55749', padding: 24, color: 'white'}}>

            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div>
                <ShareOnSocial style={{height: 200}} color={'white'}/>
              </div>
            </div>
            <div style={{height: 50}}/>

            <div style={{ alignItems: 'center'}}>
              <div style={styles.mobileAbout}>
                <div className='tongue-in-cheek-header' style={styles.ticHeader}>
                  Share projects on social media, or your website
                </div>
                <div style={styles.inkbar}/>
                <div className='description-summary' style={styles.ticSummaryLight}>
                  You can customise the description that appears on Facebook, LinkedIn or Twitter when you share your project – to save you the time in making nice social media posts.
                  <br/><br/>
                  If you want to put a link to the project on your own website, you can also embed the project, like you can with tweets or Instagram posts.
                </div>
              </div>


            </div>
            <div style={{height: 50}}/>
          </div>

          <div style={{backgroundColor: '#65A1e7', padding: 24, color: 'white'}}>
            <div style={{height: 50}}/>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div>
                <Reviews style={{height: 200}} color={'white'}/>
              </div>
            </div>
            <div style={{height: 50}}/>

            <div style={{ alignItems: 'center'}}>
              <div style={styles.mobileAbout}>
                <div className='tongue-in-cheek-header' style={styles.ticHeader}>
                  Continue the conversation with reviews
                </div>
                <div style={styles.inkbar}/>
                <div className='description-summary' style={styles.ticSummaryLight}>
                  When the project is finished, leave a review for your volunteers, and they will leave one for your project.
                  It’s a great way to engage volunteers once the project is over, and increases the likelihood that they will turn up next time, become regular volunteers, or potentially donors.
                </div>
              </div>


            </div>
            <div style={{height: 50}}/>
          </div>

          <div style={{backgroundColor: 'white', padding: 24}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div>
                <SocialMedia style={{height: 200}} color={'#484848'}/>
              </div>
            </div>
            <div style={{height: 50}}/>

            <div style={{ alignItems: 'center'}}>
              <div style={styles.mobileAbout}>
                <div className='tongue-in-cheek-header' style={styles.ticHeader}>
                  See what was said on social media
                </div>
                <div style={styles.redInkbar}/>
                <div className='description-summary' style={styles.ticSummaryLight}>
                  Give your project a hashtag (as niche as possible), and we’ll find everything anyone posted on Instagram or Twitter about it.
                  <br/><br/>
                  We’ll even tell you how many likes and replies you got, and how many people could have seen the posts.
                </div>
              </div>
            </div>
            <div style={{height: 50}}/>
          </div>

          <div style={{backgroundColor: '#3B9E74',color: 'white', padding: 24}}>
            <div style={{height: 50}}/>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <div>
                <CaseStudy style={{height: 200}} color={'white'}/>
              </div>
            </div>
            <div style={{height: 50}}/>

            <div style={{ alignItems: 'center'}}>
              <div style={styles.mobileAbout}>
                <div className='tongue-in-cheek-header' style={styles.ticHeader}>
                  Build shiny case study pages
                </div>
                <div style={styles.inkbar}/>
                <div className='description-summary' style={styles.ticSummaryLight}>
                  After the project, we group together all the reviews people have left you, all the social media posts, the “Who’s In” panel, and what you wrote about the event.
                  <br/><br/>
                  You can use the page to advertise future projects, or to show your current or future donors the impact your projects are making.
                </div>
              </div>
            </div>
            <div style={{height: 50}}/>
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
                  label='Start a project' onClick={() => Router.push('/create-project?stage=0')}
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

export default withMui(NewWhy)
