import React from 'react';
import fire from '../fire.js';
import Router from 'next/router';
import AutoComplete from 'material-ui/AutoComplete';

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

export default class OrganisationAutocomplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {searchText: ''}
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

  render() {
    console.log(this.state)
    if (!this.state.orgs) {
      return (
        <div/>
      )
    }
    else {
      return (
        <div>
          <AutoComplete
            fullWidth={true}
            inputStyle={styles.inputStyle}
            hintText="What organisations are they part of?"
            searchText={this.state.searchText}
            underlineShow={false}
            hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
            onUpdateInput={this.handleUpdateInput}
            onNewRequest={this.handleNewRequest}
            style={styles.inputStyle}
            dataSource={this.state.orgs}
            openOnFocus={true}
            menuStyle={{textAlign: 'left'}}
            dataSourceConfig={{text: 'name', value: '_id'}}
            textFieldStyle={{height: '40px'}}
            style={styles.textfield}

          />
        </div>
      )
    }

  }
}
