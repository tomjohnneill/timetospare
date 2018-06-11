import React from 'react';
import {Plant, Spiral, Tick} from '../components/icons.jsx';
import {grey500} from 'material-ui/styles/colors'
import RaisedButton from 'material-ui/RaisedButton';
import App from '../components/App';
import TextField from 'material-ui/TextField';
import fire from '../fire';
import firebase from "firebase/app";
import 'firebase/auth';
let db = fire.firestore()
import {changeImageAddress} from '../components/desktopproject.jsx';
import Head from 'next/head'

const styles = {
  number: {
    color: '#E55749',
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


export default class Invitation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {type: this.props.type ? this.props.type : 'signup', loading: false, pwned: null,
      forgotPassword: false, sendPasswordClicked: false}
  }

  static async getInitialProps({req, pathname, query}) {
    const res =  await db.collection("Charity").doc(query.organisation).get()
    .then((doc) => {
          var project = doc.data()
          project._id = doc.id
          console.log(project)
          return({loading: false, organisation: project})
        })
    return res

  }

  render() {
    return (
      <App>
        <Head>
          <title>{this.props.organisation.Name + " wants you to join their team"}</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
            <meta property="og:title" content={this.props.organisation.Name + " wants you to join their team"}/>
            <meta property="twitter:title" content={this.props.organisation.Name + " wants you to join their team"}/>
            <meta property="og:type" content="article" />
            <meta property="og:description" content={this.props.organisation.Invite} />
            <meta property="og:image" content={this.props.organisation['Logo'] ? changeImageAddress(this.props.organisation['Logo'], '750xauto') : null} />
            <meta name="twitter:card" content="summary" />
        </Head>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>


      <div style={{maxWidth: 400, width: '100%', padding: 20, boxSizing: 'border-box'}}>
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
                backgroundColor={this.state.email && this.state.password && this.state.name ?  '#E55749' : '#C5C8C7'}
                buttonStyle={{borderRadius: '6px'}}
                onClick={this.handleCreateAccount}

                labelStyle={{textTransform: 'none',display: 'inline-flex', alignItems: 'center', height: '100%'}}
                labelColor='white' label='Complete' style={{height: '50px'}}
                />
            </div>
            <div>
              Or switch to <b onTouchTap={this.handleSwitchType} style={{color: '#E55749'}}>Login</b>
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
                backgroundColor={this.state.email && this.state.password  ?  '#E55749' : '#C5C8C7'}
                buttonStyle={{borderRadius: '6px'}}
                onTouchTap={this.handleLogin}
                labelStyle={{textTransform: 'none',display: 'inline-flex', alignItems: 'center', height: '100%'}}
                labelColor='white' label='Go' style={{height: '50px'}}
                />
            </div>
            <div>
              Or switch to <b onTouchTap={this.handleSwitchType} style={{cursor: 'pointer',color: '#E55749'}}>
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
  </div>
    </App>

    )
  }
}
