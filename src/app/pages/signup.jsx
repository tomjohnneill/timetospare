import React from 'react';
import ReactDOM from 'react-dom'
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import {Plant, Spiral, Tick} from '../components/icons.jsx';
import {grey500} from 'material-ui/styles/colors'
import MediaQuery from 'react-responsive';
import Router from 'next/router'
import fire from '../fire';
import firebase from "firebase/app";
import 'firebase/auth';
import withMui from '../components/hocs/withMui.js'

let db = fire.firestore()

const styles = {
  number: {
    color: '#000AB2',
    fontSize: '20px',
  },
  bottomBit: {
    color: grey500,
    marginTop: '-5px',
    fontSize: '12px'
  },
  textfield: {
    height: '40px',
    fontsize: '20px'
  },
  title: {
    fontFamily: 'Pacifico',
    color: '#000AB2',
    fontSize: '40px',
    paddingBottom: 20,
    marginRight: '10px'
  },
}

export class SignupModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {type: this.props.type ? this.props.type : 'signup', loading: false, pwned: null,
      email: this.props.url.query.email ? this.props.url.query.email : '',
      forgotPassword: false, sendPasswordClicked: false}
  }

  handleName = (e,  newValue) => {
    this.setState({name: newValue})
  }


  handleEmail = (e, newValue) => {
    this.setState({email: newValue})
  }

  handlePassword = (e, newValue) => {
    this.setState({password: newValue})
  }

  handleCreateAccount = () => {
    if (!this.state.createdClicked) {
      this.setState({pwned: null, createdClicked: true})
          fire.auth().onAuthStateChanged(user => {
            if (user) {
              db.collection('User').doc(user.uid).set(
                {
                  Email: user.email,
                  Name: this.state.name
                }
              )
              .then(docRef =>
                {
                return db.collection("User").doc(user.uid).collection("public").
                doc(user.uid).set({
                  Name: this.state.name
                })
              }
            )
              .then(data =>
                {
                  if (Router.query.organisation && Router.query.orgId) {
                    window.location.href = 'https://timetospare.com/dashboard'
                  } else {
                    Router.push('/create-other')
                  }


                })
              .catch(error => console.log('Error', error))
            } else {
              // No user is signed in.
            }
          });
          fire.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).catch(function(error) {
              // Handle Errors here.
              var errorCode = error.code;
              var errorMessage = error.message;
              if (errorCode == 'auth/weak-password') {
                alert('The password is too weak.');
              } else {
                alert(errorMessage);
              }
                        // ...
            })

      .catch(error => console.log('Error', error))
    }

  }

  handleLogin = () => {
    fire.auth().onAuthStateChanged(user => {
      if (user) {
        if (this.props.onComplete) {
          this.props.onComplete()
        }
      } else {
        // No user is signed in.
      }
    });
    fire.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/wrong-password') {
          alert('Wrong password.');
          this.setState({forgotPassword: true})
        } else {
          alert(errorMessage);
        }
        // ...
      });
  }

  handleSwitchType = (e) => {
    e.preventDefault()
    if (this.state.type === 'login') {
      this.setState({type: 'signup'})
    } else {
      this.setState({type: 'login'})
    }
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleCreateAccount()
    }
  }

  handleLoginKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleLogin()
    }
  }

  onSignInSubmit = () => {
    console.log('phone thing')
  }

  handlePhoneAuth = () => {
    if (!this.state.phoneClicked) {
      this.setState({phoneClicked: true})
      firebase.auth().languageCode = 'en-gb'
      const phoneTextRef = this.phoneText

      var phoneRaw = phoneTextRef.getValue()
      if (phoneRaw.substring(0,1) === '0') {
        var phoneNumber = "+44" + phoneRaw.substring(1)
      } else if (phoneRaw.substring(0,2) === "44"){
        var phoneNumber = "+" + phoneRaw
      } else {
        var phoneNumber = phoneRaw
      }
      console.log(phoneNumber)
      this.setState({phoneNumberInState: phoneNumber})
      var appVerifier = window.recaptchaVerifier;
      console.log(phoneNumber)
      console.log(appVerifier)

      fire.auth().currentUser.linkWithPhoneNumber(phoneNumber, appVerifier)
          .then((confirmationResult) => {
            console.log(confirmationResult)
            // SMS sent. Prompt user to type the code from the message, then sign the
            // user in with confirmationResult.confirm(code).
            window.confirmationResult = confirmationResult;
            this.setState({phoneClicked: false, type: 'enterCode'})
          }).catch(function (error) {
            alert(error)
            // Error; SMS not sent
            // ...
          });
      }
  }

  handleConfirmPhone = () => {
      console.log(this.state.confirmationCode)
      var credential = firebase.auth.PhoneAuthProvider.credential(window.confirmationResult.verificationId, this.state.confirmationCode);
      fire.auth().currentUser.updatePhoneNumber(credential)
      .then((result) => {
          // User signed in successfully.
          console.log(result)
          if (this.props.onComplete) {
            db.collection("User").doc(fire.auth().currentUser.uid).update({
              phoneNumber: this.state.phoneNumberInState
            })
            .then(() => {
              this.props.onComplete()
            })

          }
          // ...
        }).catch(function (error) {
          alert(error)
        });
  }

  loadRecaptcha = () => {
    console.log('times up')
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(this.recaptcha, {
       'size': 'normal',
       'callback': function (response) {
         // reCAPTCHA solved, allow signInWithPhoneNumber.
         // ...
       },
       'expired-callback': function () {
         // Response expired. Ask user to solve reCAPTCHA again.
         // ...
       }
    });
    window.recaptchaVerifier.render().then(function (widgetId) {
      window.recaptchaWidgetId = widgetId;
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.nameInput) {
      this.nameInput.focus()
    }

    if (this.props.type !== prevProps.type) {
      this.setState({type: this.props.type})
    }

    if (this.state.type === 'phone' && prevState.type != 'phone') {
      window.setTimeout(this.loadRecaptcha, 200)
    }
  }

  render() {
    return (
      <div>
        <MediaQuery minDeviceWidth={700}>

            {this.state.loading  ?
            <div style={{width: '100%', height: '100%', position: 'absolute', top: '0px',left: '0px',zIndex: '20', boxSizing: 'border-box', backgroundColor: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <CircularProgress/>
            </div>
            : null }
            <div style={{display: 'flex', justifyContent: 'center', textAlign: 'left'}}>
              {this.state.type === 'signup' ?
            <div style={{display: 'flex', maxWidth: 900, width: '100%', padding: 36, marginTop: 48}}>
              <div style={{height: 150, width: 270, display: 'flex', justifyContent: 'flex-end'}}>

                <span  className = 'whosin' style={styles.title}>
                  Time to Spare
                </span>
              </div>
            <span
                style={{display: 'flex', alignItems: 'baseline', justifyContent: 'flex-start',
                  boxSizing: 'border-box', marginLeft: 60,
                   flexDirection: 'column', flex: 1}}>



                  <div style={{fontSize: '36px', fontWeight: 700}}>
                    {
                      this.props.url.query.organisation ?
                      <div>
                        Join {decodeURIComponent(this.props.url.query.organisation)} on Time to Spare
                      </div>
                      :
                      <div>
                        Get started with a free account
                      </div>
                    }
                  </div>
                  <p style={{fontSize: '18px', marginBottom: 6}}>
                    {this.props.url.query.organisation ?
                      `${this.props.url.query.organisation} have invited you to join their organisation on Time to Spare.`
                      :
                     "Engage your volunteers. Save yourself time. Do it all with Time to Spare."
                   }
                  </p>
                  <p style={{fontSize: '18px', marginTop: 0}}>
                    Already have an account? <b onTouchTap={this.handleSwitchType} style={{color: '#000AB2'}}>Log in</b>
                  </p>
                  <div style={{width: '100%',
                     boxSizing: 'border-box'}}>
                     <p style={{fontWeight: 700}}>
                       Your Name
                     </p>
                    <TextField fullWidth={true}
                      inputStyle={{borderRadius: '4px', border: '1px solid #aaa',
                        paddingLeft: '12px',  boxSizing: 'border-box'}}
                      underlineShow={false}

                      hintText={'Name'}
                      hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                      key='name'
                      onChange={this.handleName}
                      style={styles.textfield}/>
                  </div>
                  <div style={{width: '100%',
                    boxSizing: 'border-box'}}>
                    <p style={{fontWeight: 700}}>
                      Email
                    </p>
                    <TextField fullWidth={true}
                      inputStyle={{borderRadius: '4px', border: '1px solid #aaa',
                        paddingLeft: '12px',  boxSizing: 'border-box'}}
                      underlineShow={false}
                      hintText={'Email'}
                      value={this.state.email}
                      onChange={this.handleEmail}
                      hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                      key='email'
                      style={styles.textfield}/>
                  </div>
                  <div style={{width: '100%',
                     boxSizing: 'border-box'}}>
                     <p style={{fontWeight: 700}}>
                       Password
                     </p>
                    <TextField fullWidth={true}
                      inputStyle={{borderRadius: '4px', border: '1px solid #aaa',
                        paddingLeft: '12px',  boxSizing: 'border-box'}}
                      underlineShow={false}
                      onChange={this.handlePassword}
                      errorStyle={{marginTop: 6, textAlign: 'center'}}
                      errorText={this.state.pwned === null  ? null : `That password has been leaked ${this.state.pwned.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} times, try something else`}
                      onChange={this.handlePassword}
                      type='password'
                      hintText={'Password'}
                      onKeyPress={this.handleKeyPress}
                      hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                      key='password'
                      style={styles.textfield}/>
                  </div>
                  <div style={{width: '100%', boxSizing: 'border-box', backfaceVisibility: 'inherit',
                    display: 'flex', alignItems: 'center',
                     marginTop: 30,paddingBottom: '20px'}}>
                    <div style={{width: '35%', marginRight: 10}}>
                      <RaisedButton fullWidth={true}
                        overlayStyle={{borderRadius: 6}}
                        backgroundColor={this.state.email && this.state.password && this.state.name ?  '#000AB2' : '#C5C8C7'}
                        buttonStyle={{borderRadius: '6px'}}
                        onClick={this.handleCreateAccount}
                        disabled={!this.state.email || !this.state.password || !this.state.name}
                        labelStyle={{textTransform: 'none',display: 'inline-flex',
                          fontWeight: 700, fontSize: '18px',
                          alignItems: 'center', height: '100%'}}
                        labelColor='white' label='Get Started!' style={{height: '50px'}}
                        />
                    </div>
                    <div style={{flex: 1, marginLeft: 20, marginRight: 30}}>
                      By clicking this button, you agree to Time to Spare's Terms of Use.
                    </div>

                  </div>
            </span>
            </div>

            :

            this.state.sendPasswordClicked ?

            <span
                style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>


                  <Tick style={{marginBottom: '16px', height: '80px'}}/>
                  <div style={{paddingBottom: '16px'}}>
                    We've sent you an email
                  </div>



            </span>

            :

            this.state.type === 'login' ?

            <span
                style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>


                  <Spiral style={{marginBottom: '16px', height: '80px'}}/>
                  <div style={{paddingBottom: '16px'}}>
                    Login
                  </div>

                  <div style={{width: '100%',paddingBottom: '16px',
                    boxSizing: 'border-box'}}>
                    <TextField fullWidth={true}
                      inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                        paddingLeft: '12px',  boxSizing: 'border-box'}}
                      underlineShow={false}
                      hintText={'Email'}

                      value={this.state.email}
                      onChange={this.handleEmail}
                      hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                      key='email'
                      style={styles.textfield}/>
                  </div>
                  <div style={{width: '100%',  paddingBottom: '16px',
                     boxSizing: 'border-box'}}>
                    <TextField fullWidth={true}
                      inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                        paddingLeft: '12px',  boxSizing: 'border-box'}}
                      underlineShow={false}
                      onChange={this.handlePassword}
                      type='password'
                      hintText={'Password'}
                      onKeyPress={this.handleLoginKeyPress}
                      hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                      key='password'
                      style={styles.textfield}/>
                  </div>
                  <div style={{textAlign: 'center', marginBottom: 10}}>
                    {this.state.forgotPassword ?
                      <div>
                        Forgotten your password? <br/><b
                        style={{cursor: 'pointer'}}
                        onClick={() => fire.auth().sendPasswordResetEmail(this.state.email, {
                          url: window.location.href
                        }).then(() => {
                          console.log('sending new password')
                          this.setState({sendPasswordClicked: true})
                        })}
                        >Send a reminder?</b>
                      </div> :
                      null
                    }
                  </div>
                  <div style={{width: '100%', boxSizing: 'border-box', backfaceVisibility: 'inherit'
                    ,borderRadius: '10px', paddingBottom: '20px'}}>
                    <RaisedButton fullWidth={true}
                      backgroundColor={this.state.email && this.state.password  ?  '#000AB2' : '#C5C8C7'}
                      buttonStyle={{borderRadius: '6px'}}
                      onTouchTap={this.handleLogin}
                      labelStyle={{textTransform: 'none',display: 'inline-flex', alignItems: 'center', height: '100%'}}
                      labelColor='white' label='Go' style={{height: '50px'}}
                      />
                  </div>
                  <div>
                    Or switch to <b onTouchTap={this.handleSwitchType} style={{cursor: 'pointer',color: '#000AB2'}}>
                    {this.state.type === 'login' ? 'Sign up' : 'Login'}</b>
                  </div>
            </span>
            :
            this.state.type === 'phone' ?

            <div style={{padding: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
              <h2>We need to check you're a real person (robots don't have phones)</h2>
              <TextField
                key='phoneno'
                ref={(ref)=>this.phoneText=ref} hintText='Phone Number (+44...)'/>
              <div style={{paddingTop: 24, paddingBottom: 24, display: this.state.type === 'phone' ? 'flex' : 'none',
                   justifyContent: 'center', width: '100%'}} ref={(ref)=>this.recaptcha=ref}>

              </div>

              <RaisedButton
                style={{height: '36px', boxShadow: ''}} overlayStyle={{height: '36px'}}
                buttonStyle={{height: '36px'}}
                labelStyle={{ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                     letterSpacing: '0.6px', fontWeight: 'bold'}}
                primary={true} onClick={this.handlePhoneAuth} label='Get Verification Code'/>
            </div>
            :
            <div style={{padding: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
              <h2>We've sent you a code, enter it here</h2>
              <TextField style={{marginBottom: 10}}
                value={this.state.confirmationCode}
                ref={input => input && input.focus()}
                key='code'
                onChange={(e,nv) => this.setState({confirmationCode: nv})} hintText='Confirmation code'/>

              <RaisedButton
                style={{height: '36px', boxShadow: ''}} overlayStyle={{height: '36px'}}
                buttonStyle={{height: '36px'}}
                labelStyle={{ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                     letterSpacing: '0.6px', fontWeight: 'bold'}}
                primary={true} onClick={this.handleConfirmPhone} label='Confirm'/>


              <div style={{paddingTop: 16}}>
                    <b
                    style={{cursor: 'pointer'}}
                    onClick={
                      () => this.setState({type: 'phone'})
                    }
                    >Didn't get a code?</b>
                  </div>



            </div>

          }

          </div>

        </MediaQuery>
        <MediaQuery maxDeviceWidth={700}>
          <div style={{backgroundColor: 'white', zIndex: 10, marginTop: 10,

             width: '100%', position: 'relative',
           borderRadius: 6, padding: 20, boxSizing: 'border-box'}}>
          {this.state.loading  ?
          <div style={{width: '100%', height: '100%', position: 'absolute', top: '0px',left: '0px'
            ,zIndex: '20', boxSizing: 'border-box', backgroundColor: 'rgba(255,255,255,0.8)'
            , display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <CircularProgress/>
          </div>
          : null }
          <div>

            <span
                style={{display: 'flex', alignItems: 'baseline', justifyContent: 'flex-start',
                  boxSizing: 'border-box', textAlign: 'left',
                   flexDirection: 'column', flex: 1}}>

                   <div style={styles.title}>
                     Time to Spare
                   </div>

                  <div style={{fontSize: '30px', fontWeight: 700}}>
                    Get started with a free account
                  </div>
                  <p style={{fontSize: '16px', marginTop: 20}}>
                    Already have an account? <b onTouchTap={this.handleSwitchType} style={{color: '#000AB2'}}>Log in</b>
                  </p>
                  <div style={{width: '100%',
                     boxSizing: 'border-box'}}>
                     <p style={{fontWeight: 700}}>
                       Your Name
                     </p>
                    <TextField fullWidth={true}
                      inputStyle={{borderRadius: '4px', border: '1px solid #aaa',
                        paddingLeft: '12px',  boxSizing: 'border-box'}}
                      underlineShow={false}

                      hintText={'Name'}
                      hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                      key='name'
                      onChange={this.handleName}
                      style={styles.textfield}/>
                  </div>
                  <div style={{width: '100%',
                    boxSizing: 'border-box'}}>
                    <p style={{fontWeight: 700}}>
                      Email
                    </p>
                    <TextField fullWidth={true}
                      inputStyle={{borderRadius: '4px', border: '1px solid #aaa',
                        paddingLeft: '12px',  boxSizing: 'border-box'}}
                      underlineShow={false}
                      hintText={'Email'}
                      value={this.state.email}
                      onChange={this.handleEmail}
                      hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                      key='email'
                      style={styles.textfield}/>
                  </div>
                  <div style={{width: '100%',
                     boxSizing: 'border-box'}}>
                     <p style={{fontWeight: 700}}>
                       Password
                     </p>
                    <TextField fullWidth={true}
                      inputStyle={{borderRadius: '4px', border: '1px solid #aaa',
                        paddingLeft: '12px',  boxSizing: 'border-box'}}
                      underlineShow={false}
                      onChange={this.handlePassword}
                      errorStyle={{marginTop: 6, textAlign: 'center'}}
                      errorText={this.state.pwned === null  ? null : `That password has been leaked ${this.state.pwned.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} times, try something else`}
                      onChange={this.handlePassword}
                      type='password'
                      hintText={'Password'}
                      onKeyPress={this.handleKeyPress}
                      hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                      key='password'
                      style={styles.textfield}/>
                  </div>
                  <div style={{width: '100%', boxSizing: 'border-box', backfaceVisibility: 'inherit',
                    display: 'flex', alignItems: 'center',
                     marginTop: 30,paddingBottom: '20px'}}>
                    <div style={{width: '100%'}}>
                      <RaisedButton fullWidth={true}
                        overlayStyle={{borderRadius: 6}}
                        backgroundColor={this.state.email && this.state.password && this.state.name ?  '#000AB2' : '#C5C8C7'}
                        buttonStyle={{borderRadius: '6px'}}
                        onClick={this.handleCreateAccount}
                        disabled={!this.state.email || !this.state.password || !this.state.name}
                        labelStyle={{textTransform: 'none',display: 'inline-flex',
                          fontWeight: 700, fontSize: '18px',
                          alignItems: 'center', height: '100%'}}
                        labelColor='white' label='Get Started!' style={{height: '50px'}}
                        />
                    </div>


                  </div>
                  <div style={{flex: 1}}>
                    By clicking this button, you agree to Time to Spare's Terms of Use.
                  </div>
            </span>


      </div>
      </div>



        </MediaQuery>
      </div>
    )
  }
}

export default withMui(SignupModal)
