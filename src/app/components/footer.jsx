import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import MediaQuery from 'react-responsive';
import Link from "next/link"
import Router from 'next/router'
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import Snackbar from 'material-ui/Snackbar';
import fire from '../fire';

let db = fire.firestore()

const styles = {
  selectedTab: {
    height: '60px',
    backgroundColor: 'white',
    color: '#000AB2',
    textTransform: 'none',
    fontSize: '16px',
    letterSpacing: '0.4px',
    lineHeight: '16px',
    paddingLeft: '20px',
    paddingRight: '20px',
    fontWeight: 600
  },
  tab: {
    height: '60px',
    backgroundColor: 'white',
    color: '#484848',
    textTransform: 'none',

    fontSize: '16px',
    letterSpacing: '0.4px',
    lineHeight: '16px',
    paddingLeft: '20px',
    paddingRight: '20px',

  },
  mobileSelectedTab: {
    height: '60px',
    backgroundColor: 'white',
    color: '#000AB2',
    textTransform: 'none',
    fontSize: '16px',
    letterSpacing: '0.4px',
    lineHeight: '16px',
    paddingLeft: '10px',
    paddingRight: '10px',
    fontWeight: 600
  },
  mobileTab: {
    height: '60px',
    backgroundColor: 'white',
    color: '#484848',
    textTransform: 'none',

    fontSize: '16px',
    letterSpacing: '0.4px',
    lineHeight: '16px',
    paddingLeft: '10px',
    paddingRight: '10px',

  },
  textfield: {
    height: '40px',
    fontsize: '20px'
  },
  button: {
    fontFamily: 'Pacifico',
    fontSize: '18px'
  }
}


  const style = {margin: 5};

export default class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {signedUp: false}
  }

  handleSignUp = () => {
     db.collection("Newsletter").add({email: this.state.emailSignup})
     .then(() => this.setState({signedUp: true, emailSignup: ''}))
  }

  handleRequestClose = () => {
    this.setState({
      signedUp: false,
    });
  };


  render() {
    return (
      <div className='footer-parent' style={{
            display: typeof window !== 'undefined' && window.location.pathname.includes('/embed/') ? 'none' : 'inherit',
            textAlign: 'left'}}>
            <Snackbar
              open={this.state.signedUp}
              message="We've added you to the mailing list"
              autoHideDuration={4000}
              onRequestClose={this.handleRequestClose}
            />
        <MediaQuery minDeviceWidth={700}>
          <div
            className='footer-container'
            style={{height: '311px', backgroundColor: '#F9F9F9', paddingTop: '81px',
            marginTop: 50, paddingLeft: '100px', paddingRight: '100px', display: 'flex'}}>
            <div style={{width: '100%', display: 'flex', justifyContent: 'center'}} className='footer-data'>
              <div style={{flex: 3, maxWidth: 400}}>
                <div style={{fontSize: '24px', fontFamily: 'Pacifico', color: '#000AB2'}}>
                  Time to Spare
                </div>
                <div style={{paddingTop: 10, paddingBottom: '20px', textAlign: 'left', fontWeight: 700}}>
                  Newsletter
                </div>
                <TextField fullWidth={true}
                  onChange={(e, nv) => this.setState({emailSignup: e.target.value})}
                  inputStyle={{borderRadius: '2px', border: '1px solid #858987',
                    paddingLeft: '12px',  boxSizing: 'border-box'}}
                  underlineShow={false}
                  type='email'
                  value={this.state.emailSignup}
                  hintText={'Email Address'}
                  hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                  key='email'
                  style={styles.textfield}/>
                <div style={{paddingTop: 6}}>
                We won't share this with anyone else
              </div>
                <div style={{width: '100%', display: 'flex', alignItems: 'left', paddingTop: '16px'}}>
                  <RaisedButton label='Subscribe'
                    onClick={this.handleSignUp}
                    style={{height: '36px', boxShadow: ''}} primary={true} overlayStyle={{height: '36px'}}
                    buttonStyle={{height: '36px'}}
                     labelStyle={{height: '36px', display: 'flex', alignItems: 'center',
                          letterSpacing: '0.6px', fontWeight: 'bold'}}/>
                </div>
              </div>
              <div style={{flex: 2}}/>
              <div style={{flex: 2, marginLeft: 24, display: 'flex', justifyContent: 'center'}}>
                <div style={{width: '100%'}}>

                  <div style={{display: 'block'}}>

                    <Link style={{width: '100%', display: 'block', cursor: 'pointer'}} href='/terms'><div>Terms</div></Link>

                  </div>
                </div>

              </div>
            </div>


          </div>
        </MediaQuery>
        <MediaQuery maxDeviceWidth={700}>
          <div
            className='footer-container'
            style={{height: '311px', backgroundColor: '#F9F9F9', paddingTop: '81px',
            marginTop: 50, paddingLeft: '24px', paddingRight: '24px', display: 'flex'}}>
            <div style={{width: '100%', maxWidth: '700px',  justifyContent: 'center'}} className='footer-data'>
              <div style={{flex: 3}}>
                <div style={{paddingBottom: '16px', textAlign: 'left'}}>
                  Newsletter
                </div>
                <TextField fullWidth={true}
                  onChange={(e, nv) => this.setState({emailSignup: e.target.value})}
                  inputStyle={{borderRadius: '2px', border: '1px solid #858987',
                    paddingLeft: '12px',  boxSizing: 'border-box'}}
                  underlineShow={false}
                  type='email'
                  value={this.state.emailSignup}
                  hintText={'Email Address'}
                  hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                  key='email'
                  style={styles.textfield}/>
                <div style={{width: '100%', display: 'flex', alignItems: 'left', paddingTop: '16px'}}>
                  <RaisedButton label='Subscribe'
                    onClick={this.handleSignUp}
                    style={{height: '36px', marginTop: '16px', boxShadow: ''}} primary={true} overlayStyle={{height: '36px'}}
                    buttonStyle={{height: '36px'}}
                     labelStyle={{height: '36px', display: 'flex', alignItems: 'center',
                          letterSpacing: '0.6px', fontWeight: 'bold'}}/>
                </div>
              </div>
              <div style={{flex: 2, marginTop: 24}}>

                Contact Us: support@timetospare.org.uk
                <br/>
              </div>
            </div>


          </div>
        </MediaQuery>
      </div>
    )
  }
}
