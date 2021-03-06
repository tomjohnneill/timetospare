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
import {CSVLink} from 'react-csv';
import 'handsontable/dist/handsontable.full.css';
import {styles} from './data-validation'

let db = fire.firestore()

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
      toBeDeleted: [],
      mergedRows: [],
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
    setTimeout(
        () => {
            this.findDuplicates(this.props.data);
        },
        200
    );


    /*
    if (Router.query.view) {
      db.collection("OrgData").where("managedBy", "==", Router.query.view).get()
      .then((querySnapshot) => {
        var data = []
        querySnapshot.forEach((doc) => {
          var elem = doc.data()
          if (elem.details && elem.details.name) {
            data.push(elem.details.name)
          }
        })
        var allOrgs = data.concat(this.props.orgs)
        this.setState({allOrgs: allOrgs})
      })
    } else {

    }
    */
  }


  convertGridToData = (grid) => {
    var data = []
    grid.forEach((row) => {
      var dataRow = {}
      var notSelectedCounter = 0
      for (var i = 0; i < row.length; i ++ ) {
        if (this.props.columns[i].selected === false) {
          notSelectedCounter += 1
        }
        dataRow[this.props.columns[i - notSelectedCounter].name] = row[i]
      }
      data.push(dataRow)
    })
  }

  convertRowToKeys = (row) => {
    console.log('columns', this.props.columns)
    var keyedData = {}
    var notSelectedCounter = 0
    for (var i = 0; i < this.props.columns.length; i ++) {
      if (this.props.columns[i].selected === false) {
        notSelectedCounter += 1
      }
      var column = this.props.columns[i - notSelectedCounter]
      console.log(column)
      if (column.category) {
        keyedData[column.category] = row[i]
      } else {
        keyedData[column.name] = row[i]
      }
    }
    return keyedData
  }

  convertRowToGrid = (row) => {
    var rowData = []
    if (row[0]) {
      Object.keys(row[0]).forEach((key) => {
        rowData.push(row[0][key])
      })
    } else {
      console.log('row[0] was error', row)
    }

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

  getGridFromIndices = (indices, keepAllColumns) => {
    var data = []
    indices.forEach((index) => {
      var row = this.props.data.slice(index, index + 1)
      var rowGrid = this.convertRowToGrid(row)
      data.push(rowGrid)
    })
    if (keepAllColumns) {
      return data
    } else {
      return this.deleteEmptyColumns(data)
    }
  }

  runThroughOneField = (data, oldSymm, columnName, column) => {
    var symm = JSON.parse(JSON.stringify(oldSymm))
    Object.keys(column).forEach((item) => {

      if (column[item] > 1) {
        var possibleDuplicates = []
        var matchingLines = data.filter(obj => obj[columnName] && obj[columnName].includes(item))
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
      var dataRow = this.props.data.slice(index, index + 1)
      if (dataRow && dataRow[0]) {
        if (!baseName) {
          baseName = dataRow[0]['Full Name']
        } else {
          if (!arraysEqual(baseName, dataRow[0]['Full Name'])) {
            rowNamesMatch = false
          }
        }
      } else {
        rowNamesMatch = false
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

    for (var i = duplicateArray.length - 1; i >= 0; i--) {
      if (this.highlightObvious(duplicateArray[i])) {
        this.mergeRows(duplicateArray[i], duplicateArray)
      }
    }

  }

  getRichestRowIndex = (grid) => {
    var rowRichness = []
    for (var j = 0; j < grid.length; j ++) {
      var row = grid[j]
      var dataLength = 0
      for (var i = 0 ; i < row.length; i ++) {
          if (typeof row[i] === 'string' && row[i].length > 0) {
            dataLength += 1
          }
      }
      rowRichness[j] = dataLength
    }

    var richestRow = rowRichness.indexOf(Math.max.apply(null, rowRichness))
    return richestRow
  }

  mergeRows = (rows, duplicateArray) => {

    var duplicates
    if (duplicateArray) {
      duplicates = duplicateArray
    }
    else if (this.state.duplicates) {
      duplicates = this.state.duplicates
    }  else {
      throw new Error('No duplicate array was provided to the mergeRows function')
    }
    var position = duplicates.indexOf(rows)

    if (rows.length > 1) {
      let grid = this.getGridFromIndices(rows, true)

      // Save org to role map
      console.log(grid)
      var roleOrgMap = {}
      grid.forEach((gridRow) => {
        var keyedRow = this.convertRowToKeys(gridRow)
        console.log(keyedRow)
        if (keyedRow.Roles && keyedRow.organisations) {
          keyedRow.Roles.forEach((role) => {
            roleOrgMap[role] = keyedRow.organisations
          })
        }
      })
      console.log(roleOrgMap)

      var richestRowIndex = this.getRichestRowIndex(grid)

      var masterRow = []
      for (var i = 0; i < grid[richestRowIndex].length; i ++) {
        var column = grid[richestRowIndex][i]
        if (typeof column === 'string') {
          masterRow.push(column)
        } else if (typeof column === 'object') {
          var arrayData = []
          grid.forEach((row) => {
            row[i].forEach((dataPoint) => {
              if (!arrayData.includes(dataPoint)) {
                arrayData.push(dataPoint)
              }
            })
          })
          masterRow.push(arrayData)
        }
      }
      var mergedRows = this.state.mergedRows ? this.state.mergedRows : []

      var newMergeRow = this.convertRowToKeys(masterRow)
      newMergeRow.roleOrgMap = roleOrgMap

      mergedRows.push(newMergeRow)
      console.log(newMergeRow)
      var toBeDeleted = this.state.toBeDeleted ? this.state.toBeDeleted : []
      rows.forEach((row) => {
        if (!toBeDeleted.includes(row)) {
          toBeDeleted.push(row)
        }
      })
      this.setState({mergedRows: mergedRows, toBeDeleted: toBeDeleted})

      var position = duplicates.indexOf(rows)

      duplicates.splice(position, 1)
      this.setState({duplicates : duplicates})
    }
  }

  deleteRowsByIndex = (grid, indices) => {
    var newGrid = grid
    var sortedIndex = indices.sort(function(a, b){return b -a})
    sortedIndex.forEach((index) => {
      newGrid.splice(index, 1)
    })
    return newGrid
  }

  addToUploadList = (row, uploadList) => {
    var body = {}
    var orgs
    var valid = false
    Object.keys(row).forEach((key) => {
      if (row[key] && row[key].length > 0) {
        if (typeof row[key] === 'object') {
          row[key].forEach((option) => {
            if (option.length > 0) {
              valid = true
            }
          })
        } else {
          valid = true
        }
      }
    })

    if (valid) {
      Object.keys(row).forEach((key) => {
        body[key] = row[key]
      })
      if (Router.query.view) {
        body.managedBy = Router.query.view
      }
      uploadList.push(body)
    }
    return uploadList
  }


  checkIfUserExists = (index, record, userRefs) => {
    var emailChecks = []
    record.Email && record.Email.forEach((email) => {
      emailChecks.push(db.collection("PersonalData")
        .where("Email", "array-contains", email)
        .where("managedBy", "==", Router.query.view)
        .get()
        .then((resultSnapshot) => {
          if (!resultSnapshot.size > 0) {
            return false
          } else {
            var docRef
            resultSnapshot.forEach((doc) => {
              docRef = doc
            })
            return docRef
          }
        })
      )
    })
    return Promise.all(emailChecks)
      .then((results) => {
        var docRef = false
        results.forEach((one) => {
          if (one !== false) {
            docRef = one
          }
        })
        var usableDoc
        if (!docRef) {
          usableDoc = db.collection("PersonalData").doc()
        } else {
          usableDoc = db.collection("PersonalData").doc(docRef.id)
        }
        userRefs.push({index: index, ref: usableDoc})
      })
  }

  testUpload = (records) => {
    var orgKeys = {}
    var editedOrgs = []
    this.props.orgs.forEach((one) => {
      editedOrgs.push({
        managedBy: Router.query.view,
        details :{
          name: one
        }
      })
    })

    var checksList = []
    var updatesMasterList = []

    var userRefs = []
    var orgUpdateObjects = {}

    editedOrgs.map((org) => {
      // check if organisations already exist
      checksList.push(db.collection("OrgData").where("managedBy", "==", Router.query.view)
        .where("details.name", "==", org.details.name).get()
        .then((orgSnapshot) => {
          if (!orgSnapshot.size > 0) {
            return db.collection("OrgData").doc()
          } else {
            var docRef
            orgSnapshot.forEach((doc) => {
              docRef = doc
            })
            return docRef
          }
        })
        .then((docRef) => {
          orgUpdateObjects[org.details.name] = {ref: docRef, data: org }
        })
      )
      })
    for (let i = 0; i < records.length; i ++) {
      checksList.push(
          this.checkIfUserExists(i, records[i], userRefs)
        )
    }
    Promise.all(checksList).then(() => {
      userRefs.forEach((elem) => {
        console.log(elem)
        console.log(elem.ref)
        let record = records[elem.index]
        elem.ref.set(record, {merge: true})
        if (record.organisations) {
          var orgNames = {}, orgIds = {}
          console.log(record.organisations)
          console.log(orgUpdateObjects)
          record.organisations.forEach((org) => {
            let cleanOrg = org.trim().replace(/(\r\n|\n|\r)/gm, '').replace('  ', ' ').trim()
            orgNames[orgUpdateObjects[cleanOrg].ref.id] = org
            orgIds[orgUpdateObjects[cleanOrg].ref.id] = true
          })
          var roleOrgMap = {}
          if (record.roleOrgMap) {
            roleOrgMap = record.roleOrgMap
          } else if (record.Roles && record.organisations) {
            record.Roles.map((role) => {
              roleOrgMap[role] = record.organisations
            })
          }

          db.collection("Relationships").doc().set({
              Member: elem.ref.id,
              MemberName: record['Full Name'],
              OrgNames: orgNames,
              Organisations: orgIds,
              RoleMap: roleOrgMap,
              managedBy: Router.query.view
            })
        }
      })
      
      Object.values(orgUpdateObjects).forEach((orgObj) => {
        console.log(orgObj)
        db.collection("OrgData").doc(orgObj.ref.id).set(orgObj.data, {merge: true})

      })
      Router.push(`/people?view=${Router.query.view}`)
    })
  }



    addToDownloadList = (row, uploadList) => {
      var body = {}
      var orgs
      var valid = false
      Object.keys(row).forEach((key) => {
        if (row[key] && row[key].length > 0) {
          if (typeof row[key] === 'object') {
            row[key].forEach((option) => {
              if (option.length > 0) {
                valid = true
              }
            })
          } else {
            valid = true
          }
        }
      })

      if (valid) {
        Object.keys(row).forEach((key) => {
          body[key] = row[key]
        })
        uploadList.push(body)
      }
      return uploadList
    }



  prepareDownload = () => {
    var data = this.props.data
    var toBeUploaded = []
    data.forEach((row) => {
      if (!this.state.toBeDeleted.includes(data.indexOf(row))) {
        this.addToDownloadList(row, toBeUploaded)
      }
    })
    this.state.mergedRows.map((row) => {
      this.addToDownloadList(row, toBeUploaded)
    })
    return toBeUploaded
  }


  handleUpload = () => {
    var data = this.props.data
    var toBeUploaded = []
    data.forEach((row) => {
      if (!this.state.toBeDeleted.includes(data.indexOf(row))) {
        this.addToUploadList(row, toBeUploaded)
      }
    })
    this.state.mergedRows.map((row) => {
      this.addToUploadList(row, toBeUploaded)
    })

    this.testUpload(toBeUploaded)

  }

  render() {
    var downloadData = this.prepareDownload()
    console.log(this.props)
    return (
      <div style={{display: 'flex'}}>

        {typeof window !== 'undefined' && this.state.duplicates ?
          <div style={{padding: 30, boxSizing: 'border-box',
            maxWidth: '100%',
             minWidth: '300px'}}>
             <h2 style={{textAlign: 'left', fontWeight: 200}}>We found
               <b style={{color: '#000AB2' }}> {this.state.duplicates.length}</b> potential duplicate groups
              </h2>
              {this.state.mergedRows ?
              <p style={{textAlign: 'left'}}>
                We have already merged <b style={{color: '#000AB2' }}> {this.state.mergedRows.length}</b> definite duplicate groups
              </p>
              :
              null}
             {
               this.state.duplicates ?
               this.state.duplicates.map((group) => (
                 <div style={{width: "100%", overflowX: 'scroll'}}
                   onClick={() => this.mergeRows(group)}
                   >
                   <table width="100%"  >
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
            <CSVLink
              filename={`${new Date().toJSON().slice(0,10)} Contacts.csv`}
              target=""
              rel='noopener'
              data={downloadData}>
              <RaisedButton
                style={buttonStyles.smallSize}
                labelStyle={buttonStyles.smallLabel}
                secondary={true}
                onClick={this.prepareDownload}
                label='Download CSV'/>
            </CSVLink>

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
            onClick={this.handleUpload}
            label='Upload to Time to Spare'/>
        </div>
      </div>
    )
  }
}
