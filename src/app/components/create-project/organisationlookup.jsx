import React from 'react';
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
//import {CharityPhotoUpload} from '../editcharity.jsx';
import Dialog from 'material-ui/Dialog';


import fire from '../../fire';

let db = fire.firestore()


var algoliasearch = require('algoliasearch/lite')

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

function parseISOString(s) {
  var b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

export function changeImageAddress(file, size) {
  if (file && file.includes('https://d3kkowhate9mma.cloudfront.net')) {
    var str = file, replacement = '/' + size + '/';
    str = str.replace(/\/([^\/]*)$/,replacement+'$1');
    return(str + '?pass=this')
  } else {
    return (file)
  }
}


export default class OrganisationLookup extends React.Component{
  constructor(props) {
    super(props);
    this.state = {searchText: '', charities: [], loading: false, stage: 0,
      CharityList: [], WhosinCharities: []
    }
  }

  loadPlacesApi() {

  }

  componentDidMount(props) {
    this.loadPlacesApi()
  }

  handleClose = () => {
    this.setState({error: null});
  };

   debounce = function(func, wait, immediate) {
  	var timeout;
  	return function() {
  		var context = this, args = arguments;
  		var later = function() {
  			timeout = null;
  			if (!immediate) func.apply(context, args);
  		};
  		var callNow = immediate && !timeout;
  		clearTimeout(timeout);
  		timeout = setTimeout(later, wait);
  		if (callNow) func.apply(context, args);
  	};
  };

  fetchCharities = () => {

    fetch('https://charitybase.uk/api/v0.2.0/charities?search=' + encodeURIComponent(this.state.searchText))
    .then(response => response.json())
    .then(function(data) {
      console.log(data)
      var charities = []
      for (let i = 0; i < data.charities.length; i++) {
        charities.push({Name: data.charities[i].name, Number: data.charities[i].charityNumber.toString()})
      }
      this.setState({CharityList: charities})
    }.bind(this))
    .catch(error => this.setState({error}))
  }

  handleUpdateInput = (searchText) => {
    this.setState({
      searchText: searchText,
    });
    var newCharities = []
    const client = algoliasearch('52RYQZ0NQK', 'b10f7cdebfc189fc6f889dbd0d3ffec2');
    var index
    if (process.env.REACT_APP_ENVIRONMENT === "staging" || process.env.NODE_ENV === 'development') {
      index = client.initIndex('staging_organisations');
    } else {
      index = client.initIndex('organisations');
    }
    var query = searchText
    index.search({
            query
        })
        .then(responses => {
            // Response from Algolia:
            // https://www.algolia.com/doc/api-reference/api-methods/search/#response-format
            var charities = this.state.charities
            this.setState({charities: []})
            console.log(responses.hits)
            var toBeConcatted = []
            for (let i = 0; i < responses.hits.length; i++) {
              let matches = charities.filter(charity => charity['Charity Number'] === responses.hits[i].objectID)

                toBeConcatted.push({Number: responses.hits[i].objectID, Name: responses.hits[i].Name, source: "whosin"})

            }
            newCharities = newCharities.concat(toBeConcatted)
            this.setState({WhosinCharities: newCharities})
        });
    this.debounce(this.fetchCharities(), 500)

    /*
    fetch('https://charitybase.uk/api/v0.2.0/charities?search=' + encodeURIComponent(this.state.searchText))
    .then(response => response.json())
    .then(function(data) {
      console.log(data)
      var charities = []
      for (let i = 0; i < data.charities.length; i++) {
        charities.push({Name: data.charities[i].name, Number: data.charities[i].charityNumber.toString(), source: "charities"})
      }
      console.log(charities)
      var stateCharities = this.state.charities
      stateCharities = stateCharities.concat(charities)
      this.setState({charities: stateCharities})
    }.bind(this))
    .catch(error => this.setState({error}))

    */
    };

  handleNewRequest = (string, v) => {
    console.log(string)

    if (string.source === 'whosin') {
      console.log('going to our database')
      db.collection("Charity").doc(string.Number).get().then((charityDoc) => {
        var charity = charityDoc.data()
        this.setState({
          loading: false,
          facebook: charity.Facebook && charity.Facebook.includes('https://www.facebook.com/') ?
                charity.Facebook.replace('https://www.facebook.com/', '') : charity.Facebook,
          name: charity.Name,
          activities: charity.Description,
          website: charity.Website,
          email: charity.Email,
          address: charity.Address,
          phone: charity.Phone,
          postcode: charity.Postcode,
          charityNumber: charity['Charity Number'] ? charity['Charity Number'].toString() : charity.id,
          instagram: charity.Instagram,
          twitter: charity.Twitter && charity.Twitter.includes('https://twitter.com/') ?
                charity.Twitter.replace('https://twitter.com/', '') : charity.Twitter,
          loadedFromDatabase: fire.auth().currentUser.uid === charity.Owner ? false : true
        })
      })
    } else {
      this.setState({loading: true})
      fetch(`https://charitybase.uk/api/v0.2.0/charities?search=${string.Name}&fields=beta.activities,favicon,mainCharity,charityNumber,contact&limit=1`)
      .then(response => response.json())
      .then(data => {this.setState({details: data.charities ? data.charities[0] : {}});
        var charity = data.charities[0]
        this.setState({
          activities: charity.beta ? charity.beta.activities : null,
          email: charity.mainCharity ? charity.mainCharity.email : null,
          website: charity.mainCharity ? charity.mainCharity.website : null,
          phone: charity.contact ? charity.contact.phone : null,
          address: charity.contact ? charity.contact.address.toString() : null,
          postcode: charity.contact ? charity.contact.postcode : null,
          charityNumber: charity.charityNumber,
          logo: charity.favicon,
          loading: false,

        })
      })
    }
  };

  changeCharityInfo (id, e, nv) {
    console.log(id)
    console.log(nv)
    console.log(e)
    this.setState({[id]: nv})
  }


  handleNext = (e) => {
    e.preventDefault()

    var charityBody = {
      'Name': this.state.name ? this.state.name : this.state.searchText,
      'Summary': this.state.activities ? this.state.activities : null,
      'Description': this.state.activities ? this.state.activities : null ,
      'Website': this.state.website ? this.state.website : null ,
      'Email': this.state.email ? this.state.email : null,
      'Address': this.state.address ? this.state.address: null,
      'Logo': this.state.logo ? this.state.logo : null,
      'Phone': this.state.phone ? this.state.phone : null,
      'Postcode': this.state.postcode ? this.state.postcode : null,
      'Charity Number': this.state.charityNumber ? this.state.charityNumber : null,
      'Facebook': this.state.facebook ? this.state.facebook : null,
      'Instagram': this.state.instagram ? this.state.instagram : null,
      'Twitter': this.state.twitter ? this.state.twitter: null,
      "Owner": fire.auth().currentUser.uid,
      'Featured Image': this.state.picture ? this.state.picture : null
    }

    if (this.state.loadedFromDatabase) {
      charityBody._id = charityBody['Charity Number']
      localStorage.setItem('charity', JSON.stringify(charityBody))
      Router.push('/create-project?stage=1')
    }
    else if (this.state.charityNumber) {
      db.collection("Charity").doc(this.state.charityNumber.toString()).set(charityBody, {merge: true})
      .then(docRef => {
        charityBody._id = this.state.charityNumber.toString()
        localStorage.setItem('charity', JSON.stringify(charityBody))
        Router.push('/create-project?stage=1')
      })
      .catch(error => {this.setState({error: error}); alert(error); console.log(error)})

    } else {
      db.collection("Charity").add(charityBody)
      .then(docRef => {
        charityBody._id = docRef.id
        localStorage.setItem('charity', JSON.stringify(charityBody))
        Router.push('/create-project?stage=1')
          })
      .catch(error => {this.setState({error: error}); alert(error); console.log(error)})
    }


  }

  handleFill = (e) => {
    console.log(this.state.details)
    e.preventDefault()
    if (!this.state.details && !this.state.loadedFromDatabase) {
      this.setState({loading: true})
    }
    this.setState({stage: 1})
  }

  render() {
    var tempList = this.state.WhosinCharities
    for (let i = 0; i < this.state.CharityList.length; i++) {
      let matches = tempList.filter(charity => charity['Number'] === this.state.CharityList[i])
      if (matches.length === 0) {
        tempList.push(this.state.CharityList[i])
      }
    }
    var charityList = tempList
    return (
      <div>
        <DocumentTitle title='Create Organisation'/>
        <MediaQuery minDeviceWidth={700}>
          <div style={{display: 'flex', paddingLeft: '100px', paddingTop: '50px', paddingRight: '100px'}}>
            <div style={{width: '500px', display: 'flex'
              , justifyContent: 'center'}} className='basics-container'>
              <div className='form' style={{textAlign: 'center', paddingLeft: '50px', paddingRight: '50px'}}>
                <p className='desktop-header'>
                  Add your details</p>
                <div style={{width: '100%', paddingBottom: '16px', boxSizing: 'border-box'}}>
                  <p style={{margin: '0px', paddingRight: '24px', paddingBottom: '16px', textAlign: 'left'}}>
                  First, type your organisation's name, then we'll see if we can find your details for you.
                  </p>
                  <AutoComplete
                    fullWidth={true}
                    inputStyle={styles.inputStyle}
                    hintText="Type your organisation name or charity number"
                    searchText={this.state.searchText}
                    underlineShow={false}
                    hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                    onUpdateInput={this.handleUpdateInput}
                    onNewRequest={this.handleNewRequest}
                    dataSource={charityList}
                    openOnFocus={true}
                    dataSourceConfig={{text: 'Name', value: 'Number', source: 'Source'}}
                    textFieldStyle={{height: '40px'}}
                    style={styles.textfield}
                    filter={(searchText, key) => true}
                  />
                </div>
                <div >
                  {this.state.stage === 1 && !this.state.loading ?
                    <div>
                    <div style={{height: '40px'}}/>
                  <RaisedButton label='Save and Continue'
                    onTouchTap={this.handleNext}
                    fullWidth={true}
                    style={{height: '36px', marginTop: '16px', boxShadow: ''}} primary={true} overlayStyle={{height: '36px'}}
                    buttonStyle={{height: '36px'}}
                     labelStyle={{height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          letterSpacing: '0.6px', fontWeight: 'bold'}}
                    />

                  </div>
                  :
                  <div>
                    <RaisedButton label='Smart Fill'
                      onTouchTap={this.handleFill}
                      fullWidth={true}
                      disabled={!this.state.searchText}
                      style={{height: '36px', marginTop: '16px', boxShadow: ''}} primary={true} overlayStyle={{height: '36px'}}
                      buttonStyle={{height: '36px'}}
                       labelStyle={{height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            letterSpacing: '0.6px', fontWeight: 'bold'}}/>
                    <FlatButton style={{marginTop: '16px'}} label='Fill in by hand'
                      labelStyle={{color: '#4A90E2', textTransform: 'none'}}
                      onTouchTap={(e) => {this.setState({stage: 1, loading: false, details: {}})}}
                      fullWidth={true}/>
                  </div>
                }
                </div>
              </div>
            </div>
            <div style={{flex: 1, width: '100%', marginLeft: '50px', boxSizing: 'border-box', minHeight: '70vh'}} className='basics-image'>
              {this.state.stage === 0 ?
                <div style={{backgroundColor: '#F5F5F5',display: 'flex', alignItems: 'center', flexDirection: 'column', height: '70vh', justifyContent: 'center'}} >

                    <Search style={{height: '100px', width: '100px'}} color='rgb(0,0,0)'/>
                    <p style={{width: '100%', marginTop: '16px'}}>
                      We'll try and find your details for you
                    </p>
                </div>
                :
                this.state.loading ?
                <div style={{minHeight: '70vh', display: 'flex', flexDirection: 'column',
                   justifyContent: 'center', alignItems: 'center', backgroundColor:'#F5F5F5' }}>
                  <CircularProgress size={80} thickness={5} />
                  <div style={{paddingTop: '16px'}}>
                    We're just seeing if we can find your details
                  </div>
                </div>
                :
                <div style={{marginTop: '-10px', paddingLeft: '50px', paddingRight: '50px', textAlign: 'left'}}>
                  <div style={{padding: '10px', backgroundColor: '#F5F5F5',marginBottom: '16px'}} className='desktop-header'>
                    Check your details
                  </div>
                  {this.state.loadedFromDatabase ?
                    <div style={{color: amber500}}>
                      You can't edit these details because someone else already 'owns' this charity profile
                    </div>
                    :
                    null
                  }
                  /*
                  <CharityPhotoUpload changeImage={(imageUrl) => this.setState({picture: imageUrl})}/>
                  */
                  <div style={{padding: '6px'}}>
                    <p style={styles.header}>
                    Organisation Name*
                    </p>
                    <TextField fullWidth={true}
                      inputStyle={styles.inputStyle}
                      underlineShow={false}
                      value={this.state.name ? this.state.name : this.state.details.name}
                      hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                      key='name'
                      disabled={this.state.loadedFromDatabase}
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
                          defaultValue={this.state.phone}
                          hintText={'Phone'}
                          disabled={this.state.loadedFromDatabase}
                          hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                          key='location3'
                          style={styles.whiteTextfield}/>
                        <div style={{height: 6}}/>
                        <TextField fullWidth={true}
                          inputStyle={styles.inputStyle}
                          underlineShow={false}
                          onChange={this.changeCharityInfo.bind(this, 'address')}
                          defaultValue={this.state.address}
                          hintText={'Address'}
                          disabled={this.state.loadedFromDatabase}
                          hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                          key='location3'
                        style={styles.whiteTextfield}/>
                      <div style={{height: 6}}/>
                        <TextField fullWidth={true}
                          inputStyle={styles.inputStyle}
                          underlineShow={false}
                          onChange={this.changeCharityInfo.bind(this, 'postcode')}
                          defaultValue={this.state.postcode}
                          hintText={'Postcode'}
                          disabled={this.state.loadedFromDatabase}
                          hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                          key='location3'
                        style={styles.whiteTextfield}/>


                    </div>

                    <div style={{flex: 1, padding: '6px'}}>
                      <p style={styles.header}>
                      Charity Number
                      </p>
                      <TextField fullWidth={true}
                        inputStyle={styles.inputStyle}
                        underlineShow={false}
                        disabled={this.state.loadedFromDatabase}
                        defaultValue={this.state.charityNumber}
                        onChange={this.changeCharityInfo.bind(this, 'charityNumber')}
                        hintText={'Charity Number'}
                        hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                        key='location3'
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
                      disabled={this.state.loadedFromDatabase}
                      defaultValue={this.state.activities}
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
                      disabled={this.state.loadedFromDatabase}
                      onChange={this.changeCharityInfo.bind(this, 'email')}
                      defaultValue={this.state.email}
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
                      defaultValue={this.state.facebook}
                      disabled={this.state.loadedFromDatabase}
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
                    onTouchTap={this.handleNext}
                    fullWidth={true}
                    style={{height: '36px', marginTop: '16px', boxShadow: ''}} primary={true} overlayStyle={{height: '36px'}}
                    buttonStyle={{height: '36px'}}
                     labelStyle={{height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          letterSpacing: '0.6px', fontWeight: 'bold'}}
                    />

                  <Dialog
                    modal={false}
                    open={this.state.error ? true : false}
                    onRequestClose={this.handleClose}>
                    <b>Error:</b>
                    <br/>
                    {this.state.error ? this.state.error.toString() :null}
                    <br/><br/>
                    Try again, or contact us at help@whosin.io
                  </Dialog>
                </div>
              }
            </div>
          </div>
        </MediaQuery>
        <MediaQuery maxDeviceWidth={700}>
          <div style={{padding: 16}}>
            <div style={{justifyContent: 'center'}} className='basics-container'>
              <div className='form' style={{textAlign: 'center'}}>
                <p className='desktop-header'>
                  Add your details</p>
                <div style={{width: '100%', paddingBottom: '16px', boxSizing: 'border-box'}}>
                  <p style={{margin: '0px', paddingRight: '24px', paddingBottom: '16px', textAlign: 'left'}}>
                  First, type your organisation's name, then we'll see if we can find your details for you.
                  </p>
                  <AutoComplete
                    fullWidth={true}
                    inputStyle={styles.inputStyle}
                    hintText="Type your organisation name"
                    searchText={this.state.searchText}
                    underlineShow={false}
                    hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                    onUpdateInput={this.handleUpdateInput}
                    onNewRequest={this.handleNewRequest}
                    dataSource={charityList}
                    openOnFocus={true}
                    dataSourceConfig={{text: 'Name', value: 'Number', source: 'Source'}}
                    textFieldStyle={{height: '40px'}}
                    style={styles.textfield}
                    filter={(searchText, key) => true}
                  />
                </div>
                <div >
                  {this.state.stage === 1 && !this.state.loading ?
                    <div>
                    <div style={{height: '40px'}}/>
                  <RaisedButton label='Save and Continue'
                    onTouchTap={this.handleNext}
                    fullWidth={true}
                    style={{height: '36px', marginTop: '16px', boxShadow: ''}} primary={true} overlayStyle={{height: '36px'}}
                    buttonStyle={{height: '36px'}}
                     labelStyle={{height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          letterSpacing: '0.6px', fontWeight: 'bold'}}
                    />

                  </div>
                  :
                  <div>
                    <RaisedButton label='Smart Fill'
                      onTouchTap={this.handleFill}
                      fullWidth={true}
                      disabled={!this.state.searchText}
                      style={{height: '36px', marginTop: '16px', boxShadow: ''}} primary={true} overlayStyle={{height: '36px'}}
                      buttonStyle={{height: '36px'}}
                       labelStyle={{height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            letterSpacing: '0.6px', fontWeight: 'bold'}}/>
                    <FlatButton style={{marginTop: '16px'}} label='Fill in by hand'
                      labelStyle={{color: '#4A90E2', textTransform: 'none'}}
                      onTouchTap={(e) => {this.setState({stage: 1, loading: false, details: {}})}}
                      fullWidth={true}/>
                  </div>
                }
                </div>
              </div>
            </div>
            <div style={{flex: 1, width: '100%', boxSizing: 'border-box', minHeight: '70vh'}} className='basics-image'>
              {this.state.stage === 0 ?
                <div style={{backgroundColor: '#F5F5F5',display: 'flex', alignItems: 'center', flexDirection: 'column', height: '70vh', justifyContent: 'center'}} >

                    <Search style={{height: '100px', width: '100px'}} color='rgb(0,0,0)'/>
                    <p style={{width: '100%', marginTop: '16px'}}>
                      We'll try and find your details for you
                    </p>
                </div>
                :
                this.state.loading ?
                <div style={{minHeight: '70vh', display: 'flex', flexDirection: 'column',
                   justifyContent: 'center', alignItems: 'center', backgroundColor:'#F5F5F5' }}>
                  <CircularProgress size={80} thickness={5} />
                  <div style={{paddingTop: '16px'}}>
                    We're just seeing if we can find your details
                  </div>
                </div>
                :
                <div style={{marginTop: '20px', textAlign: 'left'}}>
                  <div style={{padding: '10px', backgroundColor: '#F5F5F5',marginBottom: '16px'}} className='desktop-header'>
                    Check your details
                  </div>
                  {this.state.loadedFromDatabase ?
                    <div style={{color: amber500}}>
                      You can't edit these details because someone else already 'owns' this charity profile
                    </div>
                    :
                    null
                  }
                  /*
                  <CharityPhotoUpload changeImage={(imageUrl) => this.setState({picture: imageUrl})}/>
                  */
                  <div style={{padding: '6px'}}>
                    <p style={styles.header}>
                    Organisation Name*
                    </p>
                    <TextField fullWidth={true}
                      inputStyle={styles.inputStyle}
                      underlineShow={false}
                      value={this.state.name ? this.state.name : this.state.details.name}
                      hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                      key='name'
                      disabled={this.state.loadedFromDatabase}
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
                          defaultValue={this.state.phone}
                          hintText={'Phone'}
                          disabled={this.state.loadedFromDatabase}
                          hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                          key='location3'
                          style={styles.whiteTextfield}/>

                        <TextField fullWidth={true}
                          inputStyle={styles.inputStyle}
                          underlineShow={false}
                          onChange={this.changeCharityInfo.bind(this, 'address')}
                          defaultValue={this.state.address}
                          hintText={'Address'}
                          disabled={this.state.loadedFromDatabase}
                          hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                          key='location3'
                        style={styles.whiteTextfield}/>

                        <TextField fullWidth={true}
                          inputStyle={styles.inputStyle}
                          underlineShow={false}
                          onChange={this.changeCharityInfo.bind(this, 'postcode')}
                          defaultValue={this.state.postcode}
                          hintText={'Postcode'}
                          disabled={this.state.loadedFromDatabase}
                          hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                          key='location3'
                        style={styles.whiteTextfield}/>


                    </div>

                    <div style={{flex: 1, padding: '6px'}}>
                      <p style={styles.header}>
                      Charity Number
                      </p>
                      <TextField fullWidth={true}
                        inputStyle={styles.inputStyle}
                        underlineShow={false}
                        disabled={this.state.loadedFromDatabase}
                        defaultValue={this.state.charityNumber}
                        onChange={this.changeCharityInfo.bind(this, 'charityNumber')}
                        hintText={'Charity Number'}
                        hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                        key='location3'
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
                      disabled={this.state.loadedFromDatabase}
                      defaultValue={this.state.activities}
                      hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                      onChange={this.changeCharityInfo.bind(this, 'activities')}
                      key='activities'
                      rows={3}
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
                      disabled={this.state.loadedFromDatabase}
                      onChange={this.changeCharityInfo.bind(this, 'email')}
                      defaultValue={this.state.email}
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
                      defaultValue={this.state.facebook}
                      disabled={this.state.loadedFromDatabase}
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
                    onTouchTap={this.handleNext}
                    fullWidth={true}
                    style={{height: '36px', marginTop: '16px', boxShadow: ''}} primary={true} overlayStyle={{height: '36px'}}
                    buttonStyle={{height: '36px'}}
                     labelStyle={{height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          letterSpacing: '0.6px', fontWeight: 'bold'}}
                    />

                  <Dialog
                    modal={false}
                    open={this.state.error ? true : false}
                    onRequestClose={this.handleClose}>
                    <b>Error:</b>
                    <br/>
                    {this.state.error ? this.state.error.toString() :null}
                    <br/><br/>
                    Try again, or contact us at help@whosin.io
                  </Dialog>
                </div>
              }
            </div>
          </div>
        </MediaQuery>
      </div>
    )
  }
}
