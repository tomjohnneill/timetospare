import React from 'react';
import withMui from '../components/hocs/withMui.js';
import App from '../components/App.js';
import MediaQuery from 'react-responsive';
import Router from 'next/router';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';

let mobile = require('is-mobile');

export class Mission extends React.Component {
  handleImIn = () => {
    Router.push('/signup')
  }

  render() {
      var isMobile = mobile(this.props.userAgent)
    return (
      <App>
        <div style={{width: '100%'}}>
          <MediaQuery
            values={{deviceWidth: isMobile ? 600 : 1400}}
            minDeviceWidth={700}>


          <img src='https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=4cb6f0ee13e453a39c5490a47ea27f5e&auto=format&fit=crop&w=1050&q=80'
              style={{position: 'relative',width: '100%', height: '40vw', objectFit: 'cover',
              objectPosition: '50% 100%'}}/>



            <div style={{position: 'absolute', top: '30vw',
              height: 400, textAlign: 'left', padding: 20,
              fontSize: '20px',
              width: '40vw', left: '30vw', backgroundColor: 'white'}}>
              <h2 style={{marginBottom: 10, marginTop: 0}}>
                Redistribute power
              </h2>
              <div style={{height: 5, width: 100, backgroundColor: '#000AB2'}}/>
                <p>Everyone should have the opportunity and capability to make a difference.
                </p>
                <p>
                Your ability to do that shouldn’t depend on having the funding to buy expensive software, to hire expensive administrators or to spend a fortune on advertising.
                </p>
                <p>
                Our mission is to give everyone the power to automate the boring stuff and focus on what they’re good at.
                </p>
                <p>
                That’s why, whenever possible, our software will be free for all charities and not for profit organisations.
                </p>
            </div>
            <div style={{height: 300}}/>

            <img src='https://images.unsplash.com/photo-1461709444300-a6217cec3dff?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=338795c407dfe15fa8e88cdb6597b553&auto=format&fit=crop&w=1052&q=80'
                style={{position: 'relative',width: '100%', height: '40vw', objectFit: 'cover',
                objectPosition: '50% 80%'}}/>



              <div style={{position: 'absolute', top: 'calc(60vw + 400px)',
                height: 400, textAlign: 'left', padding: 20,
                fontSize: '20px',
                width: '40vw', left: '30vw', backgroundColor: 'white'}}>
                <h2 style={{marginBottom: 10, marginTop: 0}}>
                  Build community
                </h2>
                <div style={{height: 5, width: 100, backgroundColor: '#000AB2'}}/>
                  <p>Loneliness is terrible for your health and it's a plague that’s spreading.
                  </p>
                  <p>
                    We believe the strongest and most resilient communities are built on working together for a common goal. They are open, fair and everyone ‘does their bit’.
                  </p>
                  <p>
                    We’re not trying to create our own community, we’re aiming to strengthen the ones that already exist and help them to reach the people who are most in need.
                  </p>
                  <p>
                    That’s why our network is open, transparent and public by default.
                  </p>
              </div>
              <div style={{height: 300}}/>

                <img src='https://images.unsplash.com/photo-1518169709214-6d2fff4a8a4e?ixlib=rb-0.3.5&s=8e0294763ef6a9667d0197fdea955f7c&auto=format&fit=crop&w=1050&q=80'
                    style={{position: 'relative',width: '100%', height: '40vw', objectFit: 'cover',
                    objectPosition: '50% 80%'}}/>



                  <div style={{position: 'absolute', top: 'calc(90vw + 800px)',
                    height: 400, textAlign: 'left', padding: 20,
                    fontSize: '20px',
                    width: '40vw', left: '30vw', backgroundColor: 'white'}}>
                    <h2 style={{marginBottom: 10, marginTop: 0}}>
                      Create opportunity
                    </h2>
                    <div style={{height: 5, width: 100, backgroundColor: '#000AB2'}}/>
                      <p>Equality of opportunity is a nice fairytale.
                      </p>
                      <p>
                      The reality is that we are separated by geography, by history and by the opportunities provided by our parents.
                      </p>
                      <p>
                        We can’t fix that, but we can damn well try.
                      </p>
                      <p>
                        That’s one reason why we’re building ‘volunteer passports’, and that’s why, if people want us to, we’ll show them to employers and help people find new opportunities.
                      </p>
                  </div>
                  <div style={{height: 300}}/>

                  </MediaQuery>

                  <MediaQuery
                    values={{deviceWidth: isMobile ? 600 : 1400}}
                    maxDeviceWidth={700}>

                    <img src='https://images.unsplash.com/photo-1466611653911-95081537e5b7?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=4cb6f0ee13e453a39c5490a47ea27f5e&auto=format&fit=crop&w=1050&q=80'
                        style={{position: 'relative',width: '100%', height: '40vh', objectFit: 'cover',
                        objectPosition: '50% 100%'}}/>
                      <div style={{textAlign: 'left', padding: 10,
                          fontSize: '20px'}}>
                          <h2 style={{marginBottom: 10, marginTop: 0}}>
                            Redistribute power
                          </h2>
                          <div style={{height: 5, width: 100, backgroundColor: '#000AB2'}}/>
                            <p>Everyone should have the opportunity and capability to make a difference.
                            </p>
                            <p>
                            Your ability to do that shouldn’t depend on having the funding to buy expensive software, to hire expensive administrators or to spend a fortune on advertising.
                            </p>
                            <p>
                            Our mission is to give everyone the power to automate the boring stuff and focus on what they’re good at.
                            </p>
                            <p>
                            That’s why, whenever possible, our software will be free for all charities and not for profit organisations.
                            </p>
                        </div>

                    <img src='https://images.unsplash.com/photo-1461709444300-a6217cec3dff?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=338795c407dfe15fa8e88cdb6597b553&auto=format&fit=crop&w=1052&q=80'
                        style={{position: 'relative',width: '100%', height: '40vh', objectFit: 'cover',
                        objectPosition: '50% 100%'}}/>
                      <div style={{textAlign: 'left', padding: 10,
                          fontSize: '20px'}}>
                          <h2 style={{marginBottom: 10, marginTop: 0}}>
                            Build community
                          </h2>
                          <div style={{height: 5, width: 100, backgroundColor: '#000AB2'}}/>
                            <p>Loneliness is terrible for your health and it's a plague that’s spreading.
                            </p>
                            <p>
                              We believe the strongest and most resilient communities are built on working together for a common goal. They are open, fair and everyone ‘does their bit’.
                            </p>
                            <p>
                              We’re not trying to create our own community, we’re aiming to strengthen the ones that already exist and help them to reach the people who are most in need.
                            </p>
                            <p>
                              That’s why our network is open, transparent and public by default.
                            </p>
                        </div>

                    <img src='https://images.unsplash.com/photo-1518169709214-6d2fff4a8a4e?ixlib=rb-0.3.5&s=8e0294763ef6a9667d0197fdea955f7c&auto=format&fit=crop&w=1050&q=80'
                        style={{position: 'relative',width: '100%', height: '40vh', objectFit: 'cover',
                        objectPosition: '50% 100%'}}/>
                      <div style={{textAlign: 'left', padding: 10,
                          fontSize: '20px'}}>
                          <h2 style={{marginBottom: 10, marginTop: 0}}>
                            Create opportunity
                          </h2>
                          <div style={{height: 5, width: 100, backgroundColor: '#000AB2'}}/>
                            <p>Equality of opportunity is a nice fairytale.
                            </p>
                            <p>
                            The reality is that we are separated by geography, by history and by the opportunities provided by our parents.
                            </p>
                            <p>
                              We can’t fix that, but we can damn well try.
                            </p>
                            <p>
                              That’s one reason why we’re building ‘volunteer passports’, and that’s why, if people want us to, we’ll show them to employers and help people find new opportunities.
                            </p>
                        </div>
                  </MediaQuery>

                  <Divider/>

                    <div style={{display: 'flex', height: 300, width: '100%', fontSize: '48px',
                      padding: 10, boxSizing: 'border-box',
                      flexDirection: 'column',
                      alignItems: 'center', justifyContent: 'center'}}>
                      Agree? Get started now.
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

        </div>
      </App>
    )
  }
}

export default withMui(Mission)
