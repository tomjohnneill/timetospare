import React from 'react'
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {amber500} from 'material-ui/styles/colors';
import Link from "next/link"
import Router from 'next/router'
import AutoComplete from 'material-ui/AutoComplete';
import CircularProgress from 'material-ui/CircularProgress';
import Search from 'material-ui/svg-icons/action/search';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import MediaQuery from 'react-responsive';
import DocumentTitle from 'react-document-title';
import Dialog from 'material-ui/Dialog';
import fire from '../fire';
import {buttonStyles, headerStyles} from './styles.jsx';

var algoliasearch = require('algoliasearch/lite')

let db = fire.firestore()

export const styles = {
  textfield: {
    height: '40px',
    backgroundColor: 'white',
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

class CharitybaseLookup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {searchText: '', charities: [], loading: false, stage: 0,
      CharityList: [], WhosinCharities: []
    }
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
      db.collection("Organisations").doc(string.Number).get().then((charityDoc) => {
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
        this.props.updateParent(this.state)
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
        this.props.updateParent(this.state)
      })
    }
    console.log(this.state)
    //this.props.updateParent(this.state)
  };

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
      <div style={{textAlign: 'left'}}>
        <AutoComplete
          fullWidth={true}
          inputStyle={styles.inputStyle}
          hintText="Type your organisation name or charity number"
          searchText={this.state.searchText}
          underlineShow={false}
          hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
          onUpdateInput={this.handleUpdateInput}
          onNewRequest={this.handleNewRequest}
          style={styles.inputStyle}
          dataSource={charityList}
          openOnFocus={true}
          menuStyle={{textAlign: 'left'}}
          dataSourceConfig={{text: 'Name', value: 'Number', source: 'Source'}}
          textFieldStyle={{height: '40px'}}
          style={styles.textfield}
          filter={(searchText, key) => true}
        />
    </div>
    )

  }
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
    console.log('submit clicked')
    if (this.props.handleSave) {
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
        "Admin": {
          [fire.auth().currentUser.uid] : true
        }
      }
      console.log(data)
      this.props.handleSave(data)
    } else {
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
        "Admin": {
          [fire.auth().currentUser.uid] : true
        }
      }
      var docRef = db.collection("Organisations").doc()
      docRef.set(data)
      .then(() => {
        Router.push(`/import-volunteers?organisation=${docRef.id}`, `/import-volunteers/${docRef.id}`)
      })
    }

  }

  handleCharityCheck = (e, status) => {
    this.setState({charityStatus: status})
  }

  handleLookupData = (state) => {
    console.log(state)
    this.setState({
      activities: state.activities,
      email: state.email,
      website: state.website,
      phone: state.phone,
      address: state.address,
      postcode: state.postcode,
      charityNumber: state.charityNumber,
      name: state.searchText
    })
  }

  componentDidMount(props) {
    Router.prefetch('/import-volunteers')
  }

  render() {
    return (
      <div>
        <div style={{marginTop: '20px', textAlign: 'left'}}>
          <div style={headerStyles.desktop}>
            Add your details
          </div>
          <div style ={{width: 100, height: 4, backgroundColor: '#000AB2', marginBottom: 30}}/>
          <div style={{display :'flex',  alignItems: 'center'}}>
            <p style={{  margin: '0px',

              fontWeight: 700, width: 300}}>
              Are you a charity?
            </p>
            <Checkbox
              onCheck={this.handleCharityCheck}

              />
          </div>
          <div style={{fontWeight: 'lighter',marginBottom: 20, marginTop: 20}}>
            If you are, we can autofill some of your details for you
          </div>


          {this.state.loadedFromDatabase ?
            <div style={{color: amber500}}>
              You can't edit these details because someone else already 'owns' this charity profile
            </div>
            :
            null
          }
          <div>
            <p style={{fontWeight: 700, marginBottom: 20, marginTop: 40}}>
            Organisation Name*
            </p>
            {
              this.state.charityStatus ?
              <CharitybaseLookup
                updateParent = {this.handleLookupData}
                 />
              :
              <TextField fullWidth={true}
                inputStyle={styles.inputStyle}
                underlineShow={false}
                hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                key='name'
                onChange={this.changeCharityInfo.bind(this, 'name')}
                style={styles.whiteTextfield}/>
            }

          </div>

          <div style={{height: 100}}/>
          <RaisedButton label='Save and Continue'
            disabled={this.state.submitting}
            onClick={this.handleSubmit}
            fullWidth={true}
            style={buttonStyles.bigSize} primary={true}
             labelStyle={buttonStyles.bigLabel}
            />
          <div style={{height: 50}}/>
        </div>
      </div>
    )
  }
}
