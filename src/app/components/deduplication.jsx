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


export default class Deduplication extends React.Component {
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
    console.log(this.props.data)
    if (typeof window !== 'undefined') {
      this.HotTable = require('@handsontable/react').HotTable
      this.Handsontable = require('handsontable')
      this.setState({shouldRemount: true})
    }
    console.log(this.props.columns)
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

  convertRowToGrid = (row) => {
    var rowData = []
    Object.keys(row[0]).forEach((key) => {
      rowData.push(row[0][key])
    })
    return rowData
  }

  getGridFromIndices = (indices) => {
    var data = []
    indices.forEach((index) => {

      var row = this.props.data.slice(index, index + 1)

      var rowGrid = this.convertRowToGrid(row)
      console.log(rowGrid)
      data.push(rowGrid)
    })
    return data
  }

  runThroughOneField = (data, oldSymm, columnName, column) => {
    var symm = JSON.parse(JSON.stringify(oldSymm))
    Object.keys(column).forEach((item) => {

      if (column[item] > 1) {
        var possibleDuplicates = []
        var matchingLines = data.filter(obj => obj[columnName] && obj[columnName].includes(item))
        //data.slice(0, 30).forEach((row) => console.log(row[columnName]))
        matchingLines.forEach((row) => {
          possibleDuplicates.push(data.indexOf(row))
        })

        possibleDuplicates.forEach((index) => {
          var others = possibleDuplicates.slice()

          //this row is really stupid - splicing a changing array you numpty?

          others.splice(possibleDuplicates.indexOf(index), 1)
          if (symm[index]) {
            symm[index].forEach((entry) => {
              if (!others.includes(entry)) {
                symm[index].push(entry)
              }
            })
          } else {
            symm[index] = others
          }
        })
      }
    })
    return symm
  }

  findDuplicates = (data) => {

    var postcodes = []
    var emails = []
    var phoneNos = []
    data.forEach((row) => {
      if (row.Postcode && row.Postcode[0] && row.Postcode[0].length > 0 && row.Postcode[0]  != '\"\"') {
        var postcodeCount = postcodes[row.Postcode] ? postcodes[row.Postcode] : 0
        postcodes[row.Postcode] = postcodeCount + 1
      }
      if (row.Email && row.Email[0] && row.Email[0].length > 0 && row.Email[0]  != '\"\"') {
        var emailCount = emails[row.Email] ? emails[row.Email] : 0
        emails[row.Email] = emailCount + 1
      }
      if (row.Phone && row.Phone[0] && row.Phone[0].length > 0 && row.Phone[0]  != '\"\"') {
        var phoneCount = phoneNos[row.Phone] ? phoneNos[row.Phone] : 0
        phoneNos[row.Phone] = phoneCount + 1
      }
    })
    console.log(postcodes)
    console.log(emails)
    console.log(phoneNos)
    var symmDuplicates = {}

    var emailDuplicates = this.runThroughOneField(data, symmDuplicates, 'Email', emails)
    var phoneDuplicates = this.runThroughOneField(data, emailDuplicates, 'Phone', phoneNos)
    console.log(phoneDuplicates)

    var duplicateArray = []
    var struckOffKeys = {}
    Object.keys(phoneDuplicates).forEach((key) => {
      if (!struckOffKeys[key]) {
        var duplicateGroup = []
        duplicateGroup.push(parseInt(key))
        struckOffKeys[parseInt(key)] = true
        phoneDuplicates[key].forEach((dupe) => {
          struckOffKeys[dupe] = true
          duplicateGroup.push(dupe)
        })
        duplicateArray.push(duplicateGroup)
      }
    })
    console.log(duplicateArray)
    this.setState({duplicates: duplicateArray})
  }

  render() {
    const HotTable = this.HotTable
    return (
      <div style={{display: 'flex'}}>

        {typeof window !== 'undefined' && HotTable ?
          <div id="org-hot-app" style={{padding: 30, boxSizing: 'border-box',
             minWidth: '300px'}}>
             {
               this.state.duplicates ?
               this.state.duplicates.map((group) => (
                 <div>
                  {this.getGridFromIndices(group).map((item) => (<p>{item.toString()}</p>))}
                  <div style={{height: 30}}/>
                 </div>
               ))
               :
               null
             }
          </div>
          : null}
          <div style={{flex: 1}}>

            <RaisedButton
              style={buttonStyles.smallSize}
              labelStyle={buttonStyles.smallLabel}
              primary={true}
              onClick={() => this.findDuplicates(this.props.data)}
              label='Look for these organisations'/>
          </div>
      </div>
    )
  }
}
