import React from 'react';
import fire from '../fire.js';
import Router from 'next/router';
import AutoComplete from 'material-ui/AutoComplete';

let db = fire.firestore()
let functions = fire.functions('europe-west1')

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

export default class OrganisationAutocomplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {searchText: ''}
  }

  runSearch = () => {
    var q = this.state.search ? this.state.search : decodeURIComponent(Router.query.q)
    var basicSearch = functions.httpsCallable('elastic-basicSearch')
    basicSearch({
      index: BUILD_LEVEL === 'production' ? 'members' : 'staging-members',
      query: { "multi_match" : {
      "query" : q
    } }
    }).then((result) => {
      console.log(result)
      if (result.data && result.data.hits && result.data.hits.hits) {
        var editedHits = []
        result.data.hits.hits.forEach((hit) => {
          var newHit = hit
          newHit._source.Date = new Date(hit._source.Date)
          editedHits.push(newHit)
        })
        this.setState({hits: editedHits})
        Router.push(`/explore?q=${q}`)
      }
    })
  }

  componentDidMount(props) {
    db.collection("OrgData").where("managedBy", "==", this.props.org).get()
    .then((querySnapshot) => {
      var data = []
      querySnapshot.forEach((doc) => {
        var elem = doc.data()

        if (elem.details && elem.details.name) {
          var obj = {}
          obj.name = elem.details.name
          obj._id = doc.id
          data.push(obj)
        }

      })
      this.setState({orgs: data})
    })
  }

  handleUpdateInput = (searchText) => {
    this.setState({
      searchText: searchText,
    });
  }

  handleNewRequest = (one, two, three) => {
    this.props.handleNewRequest(one, two, three)
    if (this.props.multi) {
      this.setState({searchText: ''})
    }
  }



  render() {
    console.log(this.state)
    if (!this.state.orgs) {
      return (
        <div/>
      )
    }
    else {
      return (

          <AutoComplete
            fullWidth={true}
            inputStyle={styles.inputStyle}
            hintText={this.props.hintText ? this.props.hintText : "What organisations are they part of?"}
            searchText={this.state.searchText}
            underlineShow={false}
            hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
            onUpdateInput={this.handleUpdateInput}
            onNewRequest={this.handleNewRequest}
            style={styles.inputStyle}
            dataSource={this.state.orgs}
            filter={AutoComplete.fuzzyFilter}
            openOnFocus={true}
            menuStyle={{textAlign: 'left'}}
            dataSourceConfig={{text: 'name', value: '_id'}}
            textFieldStyle={{height: '40px'}}
            style={styles.textfield}

          />

      )
    }

  }
}
