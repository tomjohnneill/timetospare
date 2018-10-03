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
import {styles} from './data-validation'

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

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
    this.findDuplicates(this.props.data)
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

  deleteEmptyColumns = (data) => {
    var tempEmptyColumns = {}
    data.forEach((row) => {
      for (var i = 0; i < row.length; i++) {
        if (row[i].length === 0) {
          tempEmptyColumns[i] = true
        } else {
          tempEmptyColumns[i] = false
        }
      }
    })
    var fullColumns = []
    Object.keys(tempEmptyColumns).forEach((key) => {
      if (!tempEmptyColumns[key]) {
        fullColumns.push(key)
      }
    })
    fullColumns = fullColumns.sort(function(a,b){ return a-b; });
    var newData = data.slice()
    var finishedData = []
    newData.forEach((row) => {
      var newRow = []
      for (var j = 0; j < fullColumns.length; j++) {
        newRow.push(row[fullColumns[j]])
      }
      finishedData.push(newRow)
    })
    return finishedData
  }

  getGridFromIndices = (indices) => {
    var data = []
    indices.forEach((index) => {
      var row = this.props.data.slice(index, index + 1)
      var rowGrid = this.convertRowToGrid(row)
      data.push(rowGrid)
    })
    return this.deleteEmptyColumns(data)
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

  highlightObvious = (duplicateGroup) => {
    var rowNamesMatch = true
    var baseName = null
    duplicateGroup.forEach((index) => {
      var dataRow = this.props.data[index]

      if (!baseName) {
        console.log(dataRow['Full Name'])
        baseName = dataRow['Full Name']
      } else {
        console.log(baseName, dataRow['Full Name'])
        if (!arraysEqual(baseName, dataRow['Full Name'])) {
          console.log('no match')
          rowNamesMatch = false
        }
      }
    })
    return rowNamesMatch
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
    var symmDuplicates = {}
    var emailDuplicates = this.runThroughOneField(data, symmDuplicates, 'Email', emails)
    var phoneDuplicates = this.runThroughOneField(data, emailDuplicates, 'Phone', phoneNos)
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
    this.setState({duplicates: duplicateArray})
  }

  render() {
    const HotTable = this.HotTable
    return (
      <div style={{display: 'flex'}}>

        {typeof window !== 'undefined' && HotTable ?
          <div style={{padding: 30, boxSizing: 'border-box',
            maxWidth: '100%',
             minWidth: '300px'}}>
             <h2 style={{textAlign: 'left', fontWeight: 200}}>We found
               <b style={{color: '#000AB2' }}> {this.state.duplicates.length}</b> potential duplicate groups</h2>
             {
               this.state.duplicates ?
               this.state.duplicates.map((group) => (
                 <div style={{width: "100%", overflowX: 'scroll'}}>
                   <table width="100%" style={{backgroundColor: this.highlightObvious(group) ? 'yellow' : null}} >
                     {this.getGridFromIndices(group).map((item) => (
                       <tr style={{width: '100vw', overflowX: 'scroll'}}>
                         {item.map((elem) => <td style={{padding: 2, border: '1px solid #DBDBDB'}}>{elem}</td>)}
                       </tr>
                     ))}
                  </table>
                  <div style={{height: 30}}/>
                 </div>
               ))
               :
               null
             }
          </div>
          : null}

          <div style={styles.nextContainer}>
            <FlatButton label='Back'
              style={buttonStyles.smallSize}
              labelStyle={buttonStyles.smallLabel}
              onClick={() => {
                this.props.goBack()
                window.scrollTo(0, 0)
              }}
              />
          <RaisedButton
            style={buttonStyles.smallSize}
            labelStyle={buttonStyles.smallLabel}
            primary={true}
            disabled={true}

            label='Next'/>
        </div>
      </div>
    )
  }
}
