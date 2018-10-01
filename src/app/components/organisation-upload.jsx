import React from 'react'
import MediaQuery from 'react-responsive';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import Router from 'next/router';
import fire from '../fire';
import {buttonStyles} from './styles.jsx';
import * as math from 'mathjs'
import * as firebase from 'firebase';
import 'handsontable/dist/handsontable.full.css';

function uniq(a) {
    var seen = {};
    return a.filter(function(item) {
        return seen.hasOwnProperty(item) ? false : (seen[item] = true);
    });
}

export default class OrganisationUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      organisations: [['Example organisation'],
        [''],
        [''],
        [''],
        ['']

    ]
    }
  }

  componentDidMount (props) {
    if (typeof window !== 'undefined') {
      this.HotTable = require('@handsontable/react').HotTable
      this.Handsontable = require('handsontable')
      this.setState({shouldRemount: true})
    }
    console.log(this.props.columns)
  }

  handleEdit = (changes) => {
      if (changes) {

        var orgs = this.state.organisations.slice()
        console.log(orgs)
        var uniqueOrgs = uniq(orgs)

        this.setState({uniqueOrgs: uniqueOrgs})
      }
  }

  lookUpOrgs = () => {
    var orgIndices = []
    for (var i = 0; i < this.props.columns.length; i ++) {
      if (this.props.columns[i].category === 'organisations') {
        orgIndices.push(i)
      }
    }

    var newGrid = this.props.data
    var data = []
    newGrid.forEach((row) => {
      var organisations = []
      var dataRow = {}
      for (let j = 0; j < row.length; j++) {
        if (this.props.columns[j].category) {
          if (dataRow[this.props.columns[j].category]) {
            dataRow[this.props.columns[j].category].push(row[j].toLowerCase().trim())
          } else {
            dataRow[this.props.columns[j].category] = [row[j].toLowerCase().trim()]
          }
        } else {
          dataRow[this.props.columns[j].name] = row[j]
        }
        if (orgIndices.includes(j)) {
          this.state.uniqueOrgs.forEach((org) => {
            if (row[j].trim().toLowerCase().includes(org[0].trim().toLowerCase())) {
              organisations.push(org[0])
            }
          })
        }
      }
      dataRow.organisations = organisations
      data.push(dataRow)
    })


    this.setState({grid: newGrid, data: data})

    console.log(data)
    this.props.updateDataAndColumns(data, this.props.columns)
  }

  convertGridToData = (grid) => {
    var data = []
    grid.forEach((row) => {
      var dataRow = {}
      for (var i = 0; i < row.length; i ++ ) {
        dataRow[this.props.columns[i].name] = row[i]
      }
      data.push(dataRow)
    })
  }

  render() {
    const HotTable = this.HotTable
    console.log(HotTable)
    return (
      <div style={{paddingLeft: 100, paddingRight: 100}}>
        <h2 style={{textAlign: 'left'}}>
          Copy and paste in a list of your organisations.
        </h2>
        <p style={{marginTop: 0, fontWeight: 200, textAlign: 'left'}}>
          Make sure each row only has one organisation name in it.
        </p>
        {typeof window !== 'undefined' && HotTable ?
          <div id="org-hot-app" style={{width: '50%', paddingTop: 30, boxSizing: 'border-box',
             minWidth: '300px'}}>
            <HotTable
              data={this.state.organisations}
              contextMenu={true}
              allowInsertColumn={false}
              allowRemoveColumn={false}
              afterChange={this.handleEdit}
              colHeaders={['Organisations']}
              rowHeaders={true} width="100%" height="400" stretchH="all" />
          </div>
          : null}
          <div style={{height: 20}}/>
          <RaisedButton
            style={buttonStyles.smallSize}
            labelStyle={buttonStyles.smallLabel}
            primary={true}
            disabled={!this.state.uniqueOrgs}
            onClick={this.lookUpOrgs}
            label='Next'/>
      </div>
    )
  }
}
