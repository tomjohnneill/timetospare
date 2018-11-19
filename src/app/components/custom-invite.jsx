import React from 'react';
import {Plant, Spiral, Tick} from './icons.jsx';
import {grey500} from 'material-ui/styles/colors'
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import fire from '../fire';
import firebase from "firebase/app";
import 'firebase/auth';
let db = fire.firestore()
import Head from 'next/head'

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

const changeImageAddress = (file, size) => {
  if (file && file.includes('https://d3kkowhate9mma.cloudfront.net')) {
    var str = file, replacement = '/' + size + '/';
    str = str.replace(/\/([^\/]*)$/,replacement+'$1');
    return(str + '?pass=this')
  } else {
    return (file)
  }
}

export default class CustomInvite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {type: this.props.type ? this.props.type : 'signup', loading: false, pwned: null,
      forgotPassword: false, sendPasswordClicked: false, organisation: this.props.organisation}
  }

  changeTagline = (e, nv) => {
    var organisation = this.state.organisation
    organisation.tagline = nv
    this.setState({organisation: organisation})
  }

  render() {
    return (
      <div style={{maxWidth: 450, width: '100%', padding: 40, boxSizing: 'border-box',
      backgroundColor: 'white'}}>
        {this.state.type === 'signup' ?
      <span
          style={{display: 'flex', alignItems: 'center', textAlign: 'left',
            justifyContent: 'center', flexDirection: 'column'}}>

          {this.props.organisation['Logo'] ?
          <img src={this.props.organisation['Logo'] } style={{height: '80px', marginBottom: '16px'}}/>
          :
            <Plant color={"#3B9E74"} style={{marginBottom: '16px', height: '80px'}}/>
            }
            <div style={{ fontWeight: 'bold'}}>
              {this.props.organisation.Name} have invited you to join their team on Time to Spare
            </div>
            <div style={{fontWeight: 'lighter', width: '100%'}}>
              {
                this.props.demo ?
                <TextField
                  multiLine={true}
                  fullWidth={true}
                  onChange={this.changeTagline}
                  value={this.state.organisation.tagline !== null &&
                    this.state.organisation.tagline !== undefined ? this.state.organisation.tagline :
                    "Once you join, you'll be able to see all of " + this.props.organisation.Name + "'s projects. You can then choose what you want to get involved with."
                  }/>
                :
                <p>Once you join, you'll be able to see all of {this.props.organisation.Name + "'s"} projects.
                You can then choose what you want to get involved with.</p>
              }

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
                disabled={this.props.demo ? true : false}
                labelStyle={{textTransform: 'none',display: 'inline-flex', alignItems: 'center', height: '100%'}}
                labelColor='white' label='Complete' style={{height: '50px'}}
                />




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
                backgroundColor={this.state.email && this.state.password  ?  '#000AB2' : '#C5C8C7'}
                buttonStyle={{borderRadius: '6px'}}
                onTouchTap={this.handleLogin}
                labelStyle={{textTransform: 'none',display: 'inline-flex', alignItems: 'center', height: '100%'}}
                labelColor='white' label='Go' style={{height: '50px'}}
                />
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

    )
  }
}
