import React from "react"
import RaisedButton from 'material-ui/RaisedButton';
import App from "../components/App"
import MediaQuery from 'react-responsive';
import Search from 'material-ui/svg-icons/action/search';
import Divider from 'material-ui/Divider';
import Chip from 'material-ui/Chip';
import Snackbar from 'material-ui/Snackbar';
import Loading from '../components/loading.jsx';
import SignupModal from '../components/signupmodal.jsx';
import Router from 'next/router';
import fire from '../fire';
import TextField from 'material-ui/TextField';
import RegisterInterest from '../components/registerinterest.jsx';
import Subheader from 'material-ui/Subheader';
import withMui from '../components/hocs/withMui';
import Typing from 'react-typing-animation';
import {Network, GDPR} from '../components/icons.jsx';

let mobile = require('is-mobile');

let db = fire.firestore()

var algoliasearch = require('algoliasearch/lite')


const styles = {
  button : {
    fontFamily: 'Permanent Marker',
    fontSize: '20px',
    lineHeight: '36px'
  },
  textfield: {
    height: '40px',
    fontsize: '20px'
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
        margin: 4,
        cursor: 'pointer'
      },
  selectedChip: {
    margin: 4
  },
  curveBox: {
    width: '110%',
    height: '50vh',
    borderColor: '#000 transparent transparent transparent',
    borderRadius: '50% 50% 30% 5%',
    backgroundColor: '#FFCB00',
    transform: 'skewX(-20deg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -4
  },
  mobileCurveBox: {
    width: '110%',
    height: '30vh',
    borderColor: '#000 transparent transparent transparent',
    borderRadius: '50% 50% 30% 5%',
    backgroundColor: '#FFCB00',
    transform: 'skewX(-20deg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -4
  },
  miniBuilt: {
    fontWeight: 200,
    fontSize: '16px',
    color: 'rgba(0,0,0,0.5)',
    textAlign: 'left',
    width: '100%',
    display: 'block',
    textTransform: 'lowercase'
  },
  builtHead: {
    fontWeight: 200,
    fontSize: '36px',
    paddingTop: 20,
    paddingBottom: 20
  },
  builtCat: {
    minWidth: 300,
    width: '25%',
    marginTop: 50,
    textAlign: 'left',
    paddingBottom: 50
  },
  mobileBuiltCat: {
    width: '100%',
    boxSizing: 'border-box',
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 50,
    borderTop: '1px solid black',
    paddingTop: 20
  },
  easyBox: {
    padding: 80,
    marginBottom: 50,
    flex: 1,
    boxSizing: 'border-box'
  },
  easyHeader: {
    fontSize: '26px',
    lineHeight: 1.1,
    fontWeight: 700,
    height: 90
  },
  builtText: {
    fontSize: '18px'
  },
  integrationLogo: {
    height: 40, width: 'auto', padding: 20
  },
  mobileEasyBox: {
    padding: 10, marginBottom: 30, marginTop: 20
  }
}

const targets = [
  'charities',
  'funders',
  'local authorities',
  'volunteer managers',
  'communities',
  'volunteers'
]

export function changeImageAddress(file, size) {
  if (file && file.includes('https://d3kkowhate9mma.cloudfront.net')) {
    var str = file, replacement = '/' + size + '/';
    str = str.replace(/\/([^\/]*)$/,replacement+'$1');
    return(str + '?pass=this')
  } else {
    return (file)
  }
}



class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {projects: this.props.projects, upcoming: this.props.upcoming,
      successful: this.props.successful, targetCount: 0}

  }



  handleImIn = () => {
    Router.push('/signup')
  }



  static async getInitialProps(ctx) {
    console.log(ctx)
    if(ctx && ctx.req && ctx.__session) {
      ctx.res.writeHead(301, {Location: `/dashboard`})
      ctx.res.end()
     }
  }

  changeTarget = () => {

    if (this.state.targetCount === targets.length - 1) {
      this.setState({targetCount: 0})
    } else {
      this.setState({targetCount: this.state.targetCount + 1})
    }

  }

  render() {
    if (typeof window !== 'undefined') {
      Router.prefetch('/signup')
    }

    var isMobile = mobile(this.props.userAgent)
    return (
      <App>
        <MediaQuery
          values={{deviceWidth: isMobile ? 600 : 1400}}
          minDeviceWidth={700}>

                <div style={{height: '50vh', width: '100%',flexDirection: 'column',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'}}>

                    <h2 style={{ color: 'black', fontSize: '48px', marginBottom: 15, fontWeight: 200}}>
                      A radically transparent CRM for civil society
                    </h2>


                  {
                    !fire.auth().currentUser ?

                  <RaisedButton label="Sign Up Free"
                    primary={true}
                    style={{height: 44, width: 150,
                      boxShadow: '0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.2)',
                      borderRadius: 4}}
                    onClick={this.handleImIn}
                    labelStyle={{letterSpacing: 0.3, fontWeight: 700, fontSize: '16px', textTransform: 'none'}}
                    />
                  :
                  null
                }
                </div>



                <div style={{overflowX: 'hidden', width: '100%', position: 'relative'}}>
                  <div style={styles.curveBox}/>
                </div>


                <div style={{width: '100%', marginTop: '-25vh', zIndex: 5,
                  boxSizing: 'border-box',backgroundColor: '#f6f6f4',
                  position: 'relative', color: 'black',

                  }}>
                  <div style={{paddingLeft: 200, paddingRight: 200,backgroundColor: '#FFCB00',
                    borderRadius: '0 0 30% 10%',
                  paddingBottom: '100px', }} >
                    <div style={{fontWeight: 200,  paddingBottom: 30,
                        fontSize: '48px', marginTop: '-20px', textAlign: 'left'}}>
                      <span>Built for </span>
                      <span   style={{display: 'inline-block', fontWeight: 700}}><Typing
                        style={{display: 'inline-block'}}
                        loop={true}
                         onFinishedTyping={this.changeTarget}>
                        <span style={{display: 'inline-block'}}>{targets[this.state.targetCount]}</span>
                        <Typing.Reset count={0} delay={900} />
                      </Typing>
                      </span>
                    </div>
                    <div style={{height: 4, width: 100, backgroundColor: 'black'}}/>
                    <div style={{
                        display: 'flex', justifyContent: 'space-between'}}>
                      <div style={styles.builtCat}>
                        <span style={styles.miniBuilt}>
                          BUILT TO BE...
                        </span>
                        <div style={styles.builtHead}>
                          Open
                        </div>
                        <div style={styles.builtText}>
                          A CRM that lets you share your contacts,
                          projects and events to help improve impact and understanding across the volunteer sector.
                        </div>
                      </div>

                      <div style={styles.builtCat}>
                        <span style={styles.miniBuilt}>
                          BUILT TO BE...
                        </span>
                        <div style={styles.builtHead}>
                          User-led
                        </div>
                        <div style={styles.builtText}>
                          A CRM that encourages input from your volunteers. Get their feedback,
                          find out how they want to help and let them update their own personal data.
                        </div>
                      </div>

                      <div style={styles.builtCat}>
                        <span style={styles.miniBuilt}>
                          BUILT to be...
                        </span>
                        <div style={styles.builtHead}>
                          Collaborative
                        </div>
                        <div style={styles.builtText}>
                          A CRM that lets you share your experience with other
                          organisations and lets your volunteers share their skills.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


                <div style={{minHeight: '70vh', paddingTop: 100, paddingBottom: 100,
                  width: '100%', display: 'flex', alignItems: 'center',backgroundColor: '#f6f6f4'
                ,justifyContent: 'center'}}>
                  <div style={{display: 'flex', height: '70vh', justifyContent: 'center', alignItems: 'center'}}>
                    <div style={{fontSize: '3.375rem', width: '40%', paddingRight: 50, letterSpacing: '-2px',
                    fontWeight: 500, color: 'black'}}
                      className='big-quote'>
                      "It really shows what is happening in your organisation, and let's us show other people too."
                    </div>
                    <div style={{height: '100%', width: '30%', minWidth: '300px'}}>
                      <img
                        style={{height: '100%', width: 'auto', borderRadius: 4}}
                        src='https://eep.io/images/yzco4xsimv0y/3sCnNKOu0gSuYuewKUw6G6/3873f76efc0a4e22eefceed5d0f139a3/Customer-Success_King-of-Pops-442.jpg?w=500&q=95'/>
                    </div>
                  </div>
                </div>

              <div style={{minHeight: '80vh'}}>
                <h2 style={{fontSize: '48px', fontWeight: 200, marginTop: 50}}>
                  Easy to get started
                </h2>
                <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                  <div style={{height: 4, width: 100, backgroundColor: '#000AB2'}}/>
                </div>

                <div style={{display: 'flex'}}>
                  <div style={styles.easyBox}>
                    <div style={{height: 195, boxSizing: 'border-box', padding: 20, width: '60%', display: 'flex', flexWrap: 'wrap', width: '100%',
                    alignItems: 'center', justifyContent: 'center'}}>
                      <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Microsoft_Outlook_2013_logo.svg/2000px-Microsoft_Outlook_2013_logo.svg.png'
                        style={styles.integrationLogo}
                        />
                      <img src='https://eep.io/images/yzco4xsimv0y/6TmBL4BHuo8mUawcCmQK6q/b7db5963dabd34cf87fe537a958c7218/brand-assets_logos_image-gray-1960x1060.png?w=980&q=95'
                        style={styles.integrationLogo}
                        />
                      <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTPFl8lWwPdrFlIZwxCER_EM0QMxsvdRBRDic8OZs1md4LKMoF'
                        style={styles.integrationLogo}
                        />
                      <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/New_Logo_Gmail.svg/2000px-New_Logo_Gmail.svg.png'
                        style={styles.integrationLogo}
                        />
                    </div>
                    <div style={styles.easyHeader}>
                      Works how you work
                    </div>
                    <div style={styles.easyText}>
                      Link to your Outlook or Gmail account. Link up your Eventbrite events.
                      Link up your calendars. Link to your Mailchimp. <br/><br/>
                    We’ll work with the tools you’re used to.
                    </div>
                  </div>

                  <div style={styles.easyBox}>
                    <div>
                      <img src='/scribble.png' style={{height: 150, padding: 20}}/>
                    </div>
                    <div style={styles.easyHeader}>
                      Works with messy data
                    </div>
                    <div style={styles.easyText}>
                      Broken email addresses? Duplicate records? Lots of different confusing spreadsheets?
                      <br/><br/>We'll keep your data neat and tidy.
                    </div>
                  </div>

                  <div style={styles.easyBox}>
                    <div>
                      <Network style={{height: 150, padding: 20}}/>
                    </div>
                    <div style={styles.easyHeader}>
                      Works with complicated relationships
                    </div>
                    <div style={styles.easyText}>
                      Your volunteers, trustees and contacts could belong to multiple community groups, charities and companies.
                      <br/><br/>That’s the kind of thing we’re made for.
                    </div>
                  </div>
                </div>
              </div>


                  </MediaQuery>

                  {/*Mobile version */}

            <MediaQuery
              values={{deviceWidth: isMobile ? 600 : 1400}}
              maxDeviceWidth={700}>
              <div style={{height: '50vh', width: '100%',flexDirection: 'column',
                display: 'flex', alignItems: 'center', justifyContent: 'center'}}>

                  <h2 style={{ color: 'black', fontSize: '48px', marginBottom: 15, fontWeight: 200}}>
                    A radically transparent CRM for civil society
                  </h2>


                {
                  !fire.auth().currentUser ?

                <RaisedButton label="Sign Up Free"
                  primary={true}
                  style={{height: 44, width: 150,
                    boxShadow: '0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.2)',
                    borderRadius: 4}}
                  onClick={this.handleImIn}
                  labelStyle={{letterSpacing: 0.3, fontWeight: 700, fontSize: '16px', textTransform: 'none'}}
                  />
                :
                null
              }
              </div>



              <div style={{overflowX: 'hidden', width: '100%', marginTop: 50, position: 'relative'}}>
                <div style={styles.mobileCurveBox}/>
              </div>


              <div style={{width: '100%', marginTop: '-15vh', zIndex: 5,
                boxSizing: 'border-box', paddingLeft: 10, paddingRight: 10,
                position: 'relative', paddingBottom: '100px', color: 'black',

                backgroundColor: '#FFCB00'}}>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center',}} >
                  <div style={{fontWeight: 200,  paddingBottom: 30,
                      fontSize: '36px', marginTop: '-20px', textAlign: 'center'}}>
                    <div>Built for </div>
                    <span   style={{display: 'inline-block', fontWeight: 700}}><Typing
                      style={{display: 'inline-block'}}
                      loop={true}
                       onFinishedTyping={this.changeTarget}>
                      <span style={{display: 'inline-block'}}>{targets[this.state.targetCount]}</span>
                      <Typing.Reset count={0} delay={900} />
                    </Typing>
                    </span>
                  </div>
                  <div style={{height: 4, width: 100, backgroundColor: 'black'}}/>
                  <div>
                    <div style={styles.mobileBuiltCat}>
                      <span style={styles.miniBuilt}>
                        BUILT TO BE...
                      </span>
                      <div style={styles.builtHead}>
                        Open
                      </div>
                      <div style={styles.builtText}>
                        A CRM that lets you share your contacts,
                        projects and events to help improve impact and understanding across the volunteer sector.
                      </div>
                    </div>

                    <div style={styles.mobileBuiltCat}>
                      <span style={styles.miniBuilt}>
                        BUILT TO BE...
                      </span>
                      <div style={styles.builtHead}>
                        User-led
                      </div>
                      <div style={styles.builtText}>
                        A CRM that encourages input from your volunteers. Get their feedback,
                        find out how they want to help and let them update their own personal data.
                      </div>
                    </div>

                    <div style={styles.mobileBuiltCat}>
                      <span style={styles.miniBuilt}>
                        BUILT to be...
                      </span>
                      <div style={styles.builtHead}>
                        Collaborative
                      </div>
                      <div style={styles.builtText}>
                        A CRM that lets you share your experience with other
                        organisations and lets your volunteers share their skills.
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              <div style={{minHeight: '70vh', paddingTop: 50, paddingBottom: 50,
                width: '100%', display: 'flex', flexDirection: 'column',
              backgroundColor: '#f6f6f4',alignItems: 'center'}}>
              <div style={{height: '100%', width: '30%', minWidth: '300px'}}>
                <img
                  style={{height: 'auto', width: '80vw', borderRadius: 4}}
                  src='https://eep.io/images/yzco4xsimv0y/3sCnNKOu0gSuYuewKUw6G6/3873f76efc0a4e22eefceed5d0f139a3/Customer-Success_King-of-Pops-442.jpg?w=500&q=95'/>
              </div>

                <div style={{display: 'flex', paddingTop: 50, justifyContent: 'center', alignItems: 'center'}}>
                  <div style={{fontSize: '28px', width: '80vw',  letterSpacing: '-2px',
                  fontWeight: 500, color: 'black'}}
                    className='big-quote'>
                    "It really shows what is happening in your organisation, and let's us show other people too."
                  </div>

                </div>
              </div>

            <div style={{minHeight: '80vh'}}>
              <h2 style={{fontSize: '48px', fontWeight: 200, marginTop: 50}}>
                Easy to get started
              </h2>
              <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
                <div style={{height: 4, width: 100, backgroundColor: '#000AB2'}}/>
              </div>

              <div style={{display: 'flex', flexDirection: 'column'}}>
                <div style={styles.mobileEasyBox}>
                  <div style={{height: 195, boxSizing: 'border-box', padding: 20, width: '60%', display: 'flex', flexWrap: 'wrap', width: '100%',
                  alignItems: 'center', justifyContent: 'center'}}>
                    <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Microsoft_Outlook_2013_logo.svg/2000px-Microsoft_Outlook_2013_logo.svg.png'
                      style={styles.integrationLogo}
                      />
                    <img src='https://eep.io/images/yzco4xsimv0y/6TmBL4BHuo8mUawcCmQK6q/b7db5963dabd34cf87fe537a958c7218/brand-assets_logos_image-gray-1960x1060.png?w=980&q=95'
                      style={styles.integrationLogo}
                      />
                    <img src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTPFl8lWwPdrFlIZwxCER_EM0QMxsvdRBRDic8OZs1md4LKMoF'
                      style={styles.integrationLogo}
                      />
                    <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/New_Logo_Gmail.svg/2000px-New_Logo_Gmail.svg.png'
                      style={styles.integrationLogo}
                      />
                  </div>
                  <div style={styles.easyHeader}>
                    Works how you work
                  </div>
                  <div style={styles.easyText}>
                    Link to your Outlook or Gmail account. Link up your Eventbrite events.
                    Link up your calendars. Link to your Mailchimp. <br/><br/>
                  We’ll work with the tools you’re used to.
                  </div>
                </div>

                <div style={styles.mobileEasyBox}>
                  <div>
                    <img src='/scribble.png' style={{height: 150, padding: 20}}/>
                  </div>
                  <div style={styles.easyHeader}>
                    Works with messy data
                  </div>
                  <div style={styles.easyText}>
                    Broken email addresses? Duplicate records? Lots of different confusing spreadsheets?
                    <br/><br/>We'll keep your data neat and tidy.
                  </div>
                </div>

                <div style={styles.mobileEasyBox}>
                  <div>
                    <Network style={{height: 150, padding: 20}}/>
                  </div>
                  <div style={styles.easyHeader}>
                    Works with complicated relationships
                  </div>
                  <div style={styles.easyText}>
                    Your volunteers, trustees and contacts could belong to multiple community groups, charities and companies.
                    <br/><br/>That’s the kind of thing we’re made for.
                  </div>
                </div>
              </div>
            </div>

            </MediaQuery>

                    <div style={{display: 'flex', height: 300, width: '100%', fontSize: '48px',
                      padding: 10, boxSizing: 'border-box', backgroundColor: '#FFCB00',
                      color: 'black',
                      flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center'}}>
                      Get started today
                      <div style={{display: 'block', width: 300, marginTop: 30, fontSize: '16px'}}>
                        <div style={{paddingTop: 0, width: '100%', display: 'flex', justifyContent: 'center'}}>
                        <RaisedButton label="Sign Up Free"
                          primary={true}
                          style={{height: 44, width: 150,
                            boxShadow: '0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.2)',
                            borderRadius: 4}}
                          onClick={this.handleImIn}
                          labelStyle={{letterSpacing: 0.3, fontWeight: 700, fontSize: '16px', textTransform: 'none'}}
                          />
                        </div>
                      </div>
                    </div>


                <div>


          </div>
      </App>
    )
  }

}

export default withMui(Index)
