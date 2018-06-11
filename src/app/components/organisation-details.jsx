import React from 'react'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {amber500} from 'material-ui/styles/colors';
import Link from "next/link"
import Router from 'next/router'
import AutoComplete from 'material-ui/AutoComplete';
import CircularProgress from 'material-ui/CircularProgress';
import Search from 'material-ui/svg-icons/action/search';
import FlatButton from 'material-ui/FlatButton';
import MediaQuery from 'react-responsive';
import DocumentTitle from 'react-document-title';
import {CharityPhotoUpload} from '../pages/editcharity.jsx';
import Dialog from 'material-ui/Dialog';
import fire from '../fire';

let db = fire.firestore()

const styles = {
  textfield: {
    height: '40px',
    fontsize: '20px',
    boxSizing: 'border-box'
  },
  whiteTextfield : {
    backgroundColor: 'rgb(255,255,255)',
    height: '40px',

  },
  unfilledTextField: {
    backgroundColor: 'rgba(101, 161, 231, 0.15)',
    height: '40px',
    borderRadius: 6
  },
  header : {
    margin: '0px',
    padding: '6px',
    fontWeight: 700
  },
  inputStyle :
  {borderRadius: '2px', border: '1px solid #aaa',
    paddingLeft: '12px',  boxSizing: 'border-box'}
}

export default class OrganisationDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  changeCharityInfo (id, e, nv) {
    this.setState({[id]: nv})
  }

  handleSubmit = () => {
    this.setState({submitting: true})
    var data = {
      'Name': this.state.name ? this.state.name : this.state.searchText,
      'Summary': this.state.activities ? this.state.activities : null,
      'Description': this.state.activities ? this.state.activities : null ,
      'Website': this.state.website ? this.state.website : null ,
      'Email': this.state.email ? this.state.email : null,
      'Address': this.state.address ? this.state.address: null,
      'Logo': this.state.logo ? this.state.logo : null,
      'Phone': this.state.phone ? this.state.phone : null,
      'Postcode': this.state.postcode ? this.state.postcode : null,
      'Facebook': this.state.facebook ? this.state.facebook : null,
      'Instagram': this.state.instagram ? this.state.instagram : null,
      'Twitter': this.state.twitter ? this.state.twitter: null,
      "Owner": fire.auth().currentUser.uid,
      'Featured Image': this.state.picture ? this.state.picture : null
    }
    var docRef = db.collection("Charity").doc()
    docRef.set(data)
    .then(() => {
      Router.push(`/onboarding?organisation=${docRef.id}`, `/onboarding/${docRef.id}`)
    })
  }

  render() {
    return (
      <div>
        <div style={{marginTop: '20px', textAlign: 'left'}}>
          <div style={{padding: '10px', backgroundColor: '#F5F5F5',marginBottom: '16px'}} className='desktop-header'>
            Add your details
          </div>
          {this.state.loadedFromDatabase ?
            <div style={{color: amber500}}>
              You can't edit these details because someone else already 'owns' this charity profile
            </div>
            :
            null
          }
          <div style={{padding: 6}}>
            <CharityPhotoUpload changeImage={(imageUrl) => this.setState({picture: imageUrl})}/>
          </div>
          <div style={{padding: '6px'}}>
            <p style={styles.header}>
            Organisation Name*
            </p>
            <TextField fullWidth={true}
              inputStyle={styles.inputStyle}
              underlineShow={false}
              hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
              key='name'
              onChange={this.changeCharityInfo.bind(this, 'name')}
              style={styles.whiteTextfield}/>
          </div>


          <div style={{display: 'flex'}}>
            <div style={{flex: '2', padding: '6px'}}>
              <p style={styles.header}>
              Contact
            </p>
                <TextField fullWidth={true}
                  inputStyle={styles.inputStyle}
                  underlineShow={false}
                  onChange={this.changeCharityInfo.bind(this, 'phone')}
                  hintText={'Phone'}
                  hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                  key='location1'
                  style={styles.whiteTextfield}/>
                <div style={{height: 10}}/>
                <TextField fullWidth={true}
                  inputStyle={styles.inputStyle}
                  underlineShow={false}
                  onChange={this.changeCharityInfo.bind(this, 'address')}
                  hintText={'Address'}
                  hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                  key='location3'
                style={styles.whiteTextfield}/>
              <div style={{height: 10}}/>
                <TextField fullWidth={true}
                  inputStyle={styles.inputStyle}
                  underlineShow={false}
                  onChange={this.changeCharityInfo.bind(this, 'postcode')}
                  hintText={'Postcode'}
                  hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                  key='location5'
                style={styles.whiteTextfield}/>


            </div>


          </div>

          <div style={{padding: '6px'}}>
            <p style={styles.header}>
            What does your organisation do?*
            </p>
            <TextField fullWidth={true}
              inputStyle={styles.inputStyle}
              underlineShow={false}
              hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
              onChange={this.changeCharityInfo.bind(this, 'activities')}
              key='activities'
              multiLine={true}
              style={styles.whiteTextfield}/>
          </div>

          <div style={{display: 'flex'}}>
            <div style={{flex: 1, padding: '6px'}}>
              <p style={styles.header}>
              Email
            </p>
            <TextField fullWidth={true}
              inputStyle={styles.inputStyle}
              underlineShow={false}
              hintText={'Email'}
              onChange={this.changeCharityInfo.bind(this, 'email')}
              hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
              key='location2'
              style={styles.whiteTextfield}/>
            <p style={styles.header}>
              Facebook
            </p>
            <TextField fullWidth={true}
              inputStyle={styles.inputStyle}
              underlineShow={false}
              hintText={'Facebook'}
              onChange={this.changeCharityInfo.bind(this, 'facebook')}
              hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
              key='location2'
              style={styles.whiteTextfield}/>
            <p style={styles.header}>
              Instagram
            </p>
            <TextField fullWidth={true}
              inputStyle={styles.inputStyle}
              underlineShow={false}
              hintText={'@Username'}
              defaultValue={this.state.instagram}
              disabled={this.state.loadedFromDatabase}
              onChange={this.changeCharityInfo.bind(this, 'instagram')}
              hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
              key='location2'
              style={styles.whiteTextfield}/>
            </div>
            <div style={{flex: 1, padding: '6px', marginBottom: 60}}>
              <p style={styles.header}>
                Website
              </p>
            <TextField fullWidth={true}
              inputStyle={styles.inputStyle}
              underlineShow={false}
              disabled={this.state.loadedFromDatabase}
              onChange={this.changeCharityInfo.bind(this, 'website')}
              defaultValue={this.state.website}
              hintText={'Website'}
              hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
              key='location3'
              style={styles.whiteTextfield}/>
            <p style={styles.header}>
              Twitter
            </p>
            <TextField fullWidth={true}
              inputStyle={styles.inputStyle}
              underlineShow={false}
              disabled={this.state.loadedFromDatabase}
              hintText={'@Username'}
              onChange={this.changeCharityInfo.bind(this, 'twitter')}
              defaultValue={this.state.twitter}
              hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
              key='location2'
              style={styles.whiteTextfield}/>
            </div>

          </div>
          <div style={{height: 20}}/>
          <RaisedButton label='Save and Continue'
            disabled={this.state.submitting}
            onTouchTap={this.handleSubmit}
            fullWidth={true}
            style={{height: '36px', marginTop: '16px', boxShadow: ''}} primary={true} overlayStyle={{height: '36px'}}
            buttonStyle={{height: '36px'}}
             labelStyle={{height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  letterSpacing: '0.6px', fontWeight: 'bold'}}
            />
        </div>
      </div>
    )
  }
}
