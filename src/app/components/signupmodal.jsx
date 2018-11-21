import React from 'react';
import ReactDOM from 'react-dom'
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import CircularProgress from 'material-ui/CircularProgress';
import {Plant, Spiral, Tick} from './icons.jsx';
import {grey500} from 'material-ui/styles/colors'
import MediaQuery from 'react-responsive';
import fire from '../fire';
import IconButton from 'material-ui/IconButton';
import Close from 'material-ui/svg-icons/navigation/close';
import firebase from "firebase/app";
import 'firebase/auth';
import {textFieldStyles} from './styles.jsx';

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
  }
}



export default  class SignupModal extends React.Component {
  constructor(props) {
    super(props)

    this.state = {type: this.props.type ? this.props.type : 'signup', loading: false, pwned: null,
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
                  this.setState({type: 'phone', createdClicked: false})
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

      this.setState({phoneNumberInState: phoneNumber})
      var appVerifier = window.recaptchaVerifier;


      fire.auth().currentUser.linkWithPhoneNumber(phoneNumber, appVerifier)
          .then((confirmationResult) => {

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

      var credential = firebase.auth.PhoneAuthProvider.credential(window.confirmationResult.verificationId, this.state.confirmationCode);
      fire.auth().currentUser.updatePhoneNumber(credential)
      .then((result) => {
          // User signed in successfully.

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
          <Dialog
            open={this.props.open && (!fire.auth().currentUser || !fire.auth().currentUser.phoneNumber) ? true : false}
            modal={false}

            onRequestClose={this.props.changeOpen}
            contentStyle={{width: '90%', maxWidth: '350px', overflowY: 'auto'}}
            >
            {this.state.loading  ?
            <div style={{width: '100%', height: '100%', position: 'absolute', top: '0px',left: '0px',zIndex: '20', boxSizing: 'border-box', backgroundColor: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <CircularProgress/>
            </div>
            : null }
            <div>
              {this.state.type === 'signup' ?
            <span
                style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>


                  <Plant color={"#3B9E74"} style={{marginBottom: '16px', height: '80px'}}/>
                  <div style={{paddingBottom: '16px'}}>
                    Create your Account
                  </div>
                  <div style={{width: '100%',  paddingBottom: '16px',
                     boxSizing: 'border-box'}}>
                    <TextField fullWidth={true}
                      inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                        paddingLeft: '12px',  boxSizing: 'border-box'}}
                      underlineShow={false}

                      hintText={'Name'}
                      hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                      key='name'
                      onChange={this.handleName}
                      style={styles.textfield}/>
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
                  <div style={{width: '100%', boxSizing: 'border-box', backfaceVisibility: 'inherit'
                    ,borderRadius: '10px', paddingBottom: '20px'}}>
                    <RaisedButton fullWidth={true}
                      backgroundColor={this.state.email && this.state.password && this.state.name ?  '#000AB2' : '#C5C8C7'}
                      buttonStyle={{borderRadius: '6px'}}
                      onClick={this.handleCreateAccount}

                      labelStyle={{textTransform: 'none',display: 'inline-flex', alignItems: 'center', height: '100%'}}
                      labelColor='white' label='Complete' style={{height: '50px'}}
                      />
                  </div>
                  <div>
                    Or switch to <b onTouchTap={this.handleSwitchType} style={{color: '#000AB2'}}>Login</b>
                  </div>

            </span>

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

          </Dialog>
        </MediaQuery>
        <MediaQuery maxDeviceWidth={700}>
          <div style={{backgroundColor: 'white', zIndex: 4000,
            display: this.props.open && (!fire.auth().currentUser || !fire.auth().currentUser.phoneNumber) ? 'inherit' : 'none',
             width: '100vw', position: 'absolute', height: '100vh', zIndex: 4000,
          boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px', borderRadius: 6, padding: 10, boxSizing: 'border-box'}}>
          <div style={{position: 'absolute', top: 10, left: 10}}>
            <IconButton
              onClick={this.props.changeOpen}
              tooltip='Exit'
              style={{padding: 0, width: 54, height: 54, cursor: 'pointer'}}
               iconStyle={{width: 54, height: 30}}>
              <Close  color={'#484848'}/>
            </IconButton>
          </div>

          {this.state.loading  ?
          <div style={{width: '100%', height: '100%', position: 'absolute', top: '0px',left: '0px',zIndex: '20', boxSizing: 'border-box', backgroundColor: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <CircularProgress/>
          </div>
          : null }
          <div>
            {this.state.type === 'signup' ?
          <span
              style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>


                <Plant color={"#3B9E74"} style={{marginBottom: '16px', height: '80px'}}/>
                <div style={{paddingBottom: '16px', fontWeight: 700, fontSize: '30px'}}>
                  Create your account
                </div>
                <div style={{width: '100%',  paddingBottom: '16px',
                   boxSizing: 'border-box'}}>
                  <TextField fullWidth={true}
                    inputStyle={textFieldStyles.input}
                    underlineShow={false}
                    hintText={'Name'}
                    hintStyle={textFieldStyles.hint}
                    key='name'
                    onChange={this.handleName}
                    style={textFieldStyles.style}/>
                </div>
                <div style={{width: '100%',paddingBottom: '16px',
                  boxSizing: 'border-box'}}>
                  <TextField fullWidth={true}
                    inputStyle={textFieldStyles.input}
                    underlineShow={false}
                    hintText={'Email'}
                    value={this.state.email}
                    onChange={this.handleEmail}
                    hintStyle={textFieldStyles.hint}
                    key='email'
                    style={textFieldStyles.style}/>
                </div>
                <div style={{width: '100%',  paddingBottom: '16px',
                   boxSizing: 'border-box'}}>
                  <TextField fullWidth={true}
                    inputStyle={textFieldStyles.input}
                    underlineShow={false}
                    onChange={this.handlePassword}
                    errorStyle={{marginTop: 6, textAlign: 'center'}}
                    errorText={this.state.pwned === null  ? null : `That password has been leaked ${this.state.pwned.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} times, try something else`}
                    onChange={this.handlePassword}
                    type='password'
                    hintText={'Password'}
                    onKeyPress={this.handleKeyPress}
                    hintStyle={textFieldStyles.hint}
                    key='password'
                    style={textFieldStyles.style}/>
                </div>
                <div style={{width: '100%', boxSizing: 'border-box', backfaceVisibility: 'inherit'
                  ,borderRadius: '10px', paddingBottom: '20px'}}>
                  <RaisedButton fullWidth={true}
                    backgroundColor={this.state.email && this.state.password && this.state.name ?  '#000AB2' : '#C5C8C7'}
                    buttonStyle={{borderRadius: '6px'}}
                    onClick={this.handleCreateAccount}

                    labelStyle={{textTransform: 'none',display: 'inline-flex', alignItems: 'center', height: '100%'}}
                    labelColor='white' label='Complete' style={{height: '50px'}}
                    />
                </div>
                <div>
                  Or switch to <b onTouchTap={this.handleSwitchType} style={{color: '#000AB2'}}>Login</b>
                </div>

          </span>

        :  this.state.type === 'login' ?

          <span
              style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column'}}>


                <Spiral style={{marginBottom: '16px', height: '80px'}}/>
                <div style={{paddingBottom: '16px', fontWeight: 700, fontSize: '30px'}}>
                  Login
                </div>


                <div style={{width: '100%',paddingBottom: '16px',
                  boxSizing: 'border-box'}}>
                  <TextField fullWidth={true}
                    inputStyle={textFieldStyles.input}
                    underlineShow={false}
                    hintText={'Email'}
                    value={this.state.email}
                    onChange={this.handleEmail}
                    hintStyle={textFieldStyles.hint}
                    key='email'
                      style={textFieldStyles.style}/>
                </div>
                <div style={{width: '100%',  paddingBottom: '16px',
                   boxSizing: 'border-box'}}>
                  <TextField fullWidth={true}
                    inputStyle={textFieldStyles.input}
                    underlineShow={false}
                    onChange={this.handlePassword}
                    type='password'
                    hintText={'Password'}
                    onKeyPress={this.handleLoginKeyPress}
                    hintStyle={textFieldStyles.hint}
                    key='password'
                    style={textFieldStyles.style}/>
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
                    labelColor='white' label='Log in' style={{height: '50px'}}
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
              key='code'
              onChange={(e,nv) => this.setState({confirmationCode: nv})} hintText='Confirmation code'/>

            <RaisedButton
              style={{height: '36px', boxShadow: ''}} overlayStyle={{height: '36px'}}
              buttonStyle={{height: '36px'}}
              labelStyle={{ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                   letterSpacing: '0.6px', fontWeight: 'bold'}}
              primary={true} onClick={this.handleConfirmPhone} label='Confirm'/>
          </div>
        }
      </div>
      </div>



        </MediaQuery>
      </div>
    )
  }
}
