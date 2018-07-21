import React from 'react'
import ReactDataSheet from 'react-datasheet';
import App from '../components/App.js';
import MediaQuery from 'react-responsive';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import 'react-datasheet/lib/react-datasheet.css';
import Router from 'next/router';
import fire from '../fire';
import Breadcrumbs from '../components/onboarding/breadcrumbs.jsx';
import withMui from '../components/hocs/withMui';
import {buttonStyles} from '../components/styles.jsx';

let db = fire.firestore()

function encodeEmail (email) {
  return email.replace(/\./g, 'ASDFadf94nc1OKC')
}

function decodeEmail (email) {
  return email.replace(/ASDFadf94nc1OKC/g, '.')
}

function validateEmail(email)
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function parseExcelPaste(str) {
  var rows = str.split(/\r\n|\n|\r/)
  if (rows[rows.length - 1] === "") {
    rows.pop()
  }
  return rows.map((row) => {
    return row.split('\t')});
}

class UploadList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [
        [{value:  1}, {value:  3}],
        [{value:  2}, {value:  4}],
        [{value:  1}, {value:  3}],
      ],
      columns: [{name: 'Email'}, {name: "Full Name"}],
      listName: 'Volunteers'
    }
  }

  handleChange = (e, index, value, item) => {
    var columns = this.state.columns
    var position = columns.indexOf(item)
    if (value === "New") {
      this.setState({newColumn: true})
    } else {
      columns[position] = {name: value}
      this.setState({selected: columns[position]})
      console.log(value)
      this.setState({columns: columns})
    }
  }

  handleNewColumnText = (e, nv, item) => {
    this.setState({newColumnName: nv})
  }

  handleSave = (item) => {
    var columns = this.state.columns
    var position = columns.indexOf(item)
    if (this.state.newColumnName) {
      columns[position] = {name: this.state.newColumnName}
      this.setState({newColumnName: null})
    }
    var columnNames = this.state.columnNames ? this.state.columnNames : []
    columnNames[position] = columns[position]
    this.setState({selected: columns[position + 1], columnNames: columnNames, newColumn: false})
  }

  handleSkip = (item) => {
    var columns = this.state.columns

    var position = columns.indexOf(item)
    var columnNames = this.state.columnNames ? this.state.columnNames : []
    columnNames[position] = {name: null}
    this.setState({selected: columns[position + 1], columnNames: columnNames, newColumn: false})
    console.log(this.state)
    console.log(this.state.columns.indexOf(item))
  }

  handleBack = (item) => {
    var columns = this.state.columns
    var position = columns.indexOf(item)
    this.setState({selected: columns[position - 1], newColumn: false})
  }

  handleImportContacts = () => {
    var emailColumn = this.state.columnNames.filter(name => (name.name === "Email"))
    var emailColumnPosition = this.state.columnNames.indexOf(emailColumn[0])
    console.log(emailColumnPosition)
    var data = this.state.grid
    var error = false
    for (var i = 0; i < data.length; i++) {
      if (!validateEmail(data[i][emailColumnPosition].value)) {
        alert("Some of the records in the email field don't look like emails")
        error = true
        break;
      }
    }
    if (!error) {
      var batch = db.batch();
      var collRef = db.collection("Lists").doc()
      var columns = this.state.columns
      var Pending = {}
      console.log(columns)
      var emailPosition = columns.findIndex(x => x.name=="Email")
      data.forEach((row) => {
        Pending[encodeEmail(row[emailPosition].value)] = true
      })
      console.log(collRef)
      collRef.set({
        Organisation: Router.query.organisation,
        Pending: Pending,
        Columns: columns
        // set admins in here
      }).then(() => {
        db.collection("Charity").doc(Router.query.organisation).update({
        ['lists.' + collRef.id] : true
      })
    })
      .then(() => {
        console.log('got past charity bit')

        var memberCollection = collRef.collection("Members")
        console.log(memberCollection)
        data.forEach((row) => {
          var member = {}
          for (var j = 0; j < row.length; j++) {
            if (columns[j].name) {
              member[columns[j].name] = row[j].value
            }
          }
          batch.set(memberCollection.doc(), member)
        })
        batch.commit().then(function () {
            console.log("batch committed")
            Router.push(`/volunteer-preview?organisation=${Router.query.organisation}`,
                  `/volunteer-preview/${Router.query.organisation}`)
        });

      })
    }

  }

  handleChangeName = (e, nv) => {
    console.log(nv)
    this.setState({listName: nv})
  }

  render() {
    console.log(this.state.columnNames)
    var columns = [{name: 'Email'}, {name: "Full Name"}]
    return (
      <div style={{textAlign: 'left '}}>
        <App>
          <Breadcrumbs stepIndex={1}/>
          <div style={{backgroundColor: '#F5F5F5'}}>

            <div style={{display: 'flex',  flexDirection: 'column',
              justifyContent: 'left', padding: '20px 50px 50px 50px'}}>
              <h2 style={{textAlign: 'left', marginLeft: 5}}>Import your volunteer list</h2>
              <p style={{marginLeft: 5, marginTop: 0}}>
                Copy and paste directly from the spreadsheet. Include any extra details you want to store
              </p>
              {!this.state.clicked ?
                <div style={{display: 'flex'}}>
                  <div style={{maxWidth: '80vw',  maxHeight: '80vh', overflow: 'auto', marginLeft: 5}}>
                    <ReactDataSheet
                      sheetRenderer={theseProps => (
                        <table style={{backgroundColor: 'white', padding: 6}} className={theseProps.className}>
                            <thead>
                                <tr >
                                    {this.state.columns.map(col => (<th
                                      style={{paddingLeft: 6, paddingRight: 6, minWidth: 100}}>
                                      {col.name}</th>))}
                                </tr>
                            </thead>
                            <tbody>
                                {theseProps.children}
                            </tbody>
                        </table>
                      )}
                      data={this.state.grid}

                      parsePaste={parseExcelPaste}
                      valueRenderer={(cell) => cell.value}
                      onCellsChanged={(changes, outOfBounds) => {
                        const grid = this.state.grid.map(row => [...row])
                        changes.forEach(({cell, row, col, value}) => {
                          grid[row][col] = {...grid[row][col], value}
                        })

                        if (outOfBounds) {
                          var maxWidth = 1
                          console.log(outOfBounds)
                          outOfBounds.forEach((entry) => {
                            if (maxWidth < entry.col) {
                              maxWidth = entry.col
                            }
                          })
                          console.log('was out of bounds')


                          var columns = this.state.columns
                          console.log(maxWidth)
                          for (var i = 1; i < maxWidth + 1; i++) {

                            if (i > 1) {
                              columns[i] = {name: `Custom Column ${i-1}`}
                              this.setState({columns: columns})
                            }
                          }
                          console.log(columns)
                          outOfBounds.forEach(({row, col, value}) => {
                            if (grid[row]) {
                              grid[row][col] = {...grid[row][col], value}
                            } else {
                              grid[row] = []
                              for (var i = 0; i < maxWidth; i++) {
                                grid[row][i] = {value: ""}
                              }
                              grid[row][col] = {...grid[row][col], value}
                            }
                          })
                        }
                        this.setState({grid})
                      }}
                      />
                  </div>
                  <div style={{paddingLeft: 5, paddingRight: 5}}>
                    Custom columns...
                  </div>
                </div>
              :
              <div>
                <div style={{padding: 5, marginBottom: 10}}>
                  <p style={{fontWeight: 700, margin: 0, marginBottom: 5}}>Name this list</p>
                  <TextField
                    inputStyle={{borderRadius: '2px', border: '1px solid #aaa',
                      paddingLeft: '12px',  boxSizing: 'border-box'}}
                    underlineShow={false}
                    hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                    onChange={this.handleChangeName}
                    style={{
                      backgroundColor: 'rgb(255,255,255)',
                      height: '40px'
                    }}
                    value={this.state.listName}/>
                </div>
                <div style={{display: 'flex', maxWidth: '90vw', overflow: 'auto'}}>
                  {this.state.columns.map((item) => (
                    <div style={{width: 275, minWidth: 275, margin: 5,
                        backgroundColor: 'white',
                        borderColor: this.state.selected === item ?
                          '#65A1e7' :
                          this.state.columns.indexOf(item) <
                           this.state.columns.indexOf(this.state.selected) ||
                           this.state.columnNames && this.state.columnNames.length === this.state.columns.length ?
                          '#DBDBDB':
                           '#000AB2',
                        borderWidth: '2px',
                        borderStyle: 'solid'
                        }}>

                      {this.state.selected === item ?
                        <div style={{padding: 6, textAlign: 'center'}}>
                          <div style={{textAlign: 'left', fontWeight: 700}}>
                            {item.name.includes('Custom Column') ? 'Unnamed' : item.name}
                          </div>
                          <SelectField
                            value={item.name}
                            onChange={(e, index, value) => this.handleChange(e, index, value, item)}
                          >
                            <MenuItem
                              disabled={this.state.columnNames &&
                                this.state.columnNames.filter(column => (column.name === "Email")).length > 0}
                              value={"Email"} primaryText="Email" />
                            <MenuItem value={"Full Name"}
                              disabled={this.state.columnNames &&
                                this.state.columnNames.filter(column => (column.name === "Full Name")).length > 0}
                              primaryText="Full Name" />
                            <MenuItem value={"Address"}
                              disabled={this.state.columnNames &&
                                this.state.columnNames.filter(column => (column.name === "Address")).length > 0}
                              primaryText="Address" />
                            <MenuItem value={"Phone"}
                              disabled={this.state.columnNames &&
                                this.state.columnNames.filter(column => (column.name === "Phone")).length > 0}
                              primaryText="Phone" />
                            <Divider/>
                            <MenuItem value={"New"} primaryText="Create New Column"/>
                          </SelectField>
                          {
                            this.state.newColumn ?
                            <div style={{paddingBottom: 10}}>
                              <TextField
                                hintText={'New Column Name'}
                                onChange={this.handleNewColumnText}
                                />
                            </div>
                            :
                            null
                          }
                          <div style={{display: 'flex', paddingBottom: 6}}>
                            {
                              this.state.columns.indexOf(item) !== 0 ?
                            <FlatButton
                              style={buttonStyles.smallSize}
                            labelStyle={buttonStyles.smallLabel}
                                onClick={() => this.handleBack(item)}
                                label='Back'/>
                              :
                              null
                            }
                          <RaisedButton
                            style={buttonStyles.smallSize}
                            labelStyle={buttonStyles.smallLabel}
                            secondary={true}
                            disabled={item.name.includes('Custom Column') && !this.state.newColumnName}
                            onClick={() => this.handleSave(item)}
                            label='Save'/>
                          <FlatButton
                            style={buttonStyles.smallSize}
                            labelStyle={buttonStyles.smallLabel}
                            onClick={() => this.handleSkip(item)}
                              label='Skip'/>
                          </div>
                        </div>
                        :
                        <div style={{height: 138, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                          <div style={{textAlign: 'center', fontWeight: 700}}>
                            {item.name.includes('Custom Column') ? 'Unnamed' : item.name}
                            {this.state.columnNames &&
                              this.state.columnNames[this.state.columns.indexOf(item)]
                              && this.state.columnNames[this.state.columns.indexOf(item)].name === null ?
                              <div style={{fontStyle:'italic',fontWeight: 'lighter', color: '#000AB2'}}>
                              Will not be imported
                            </div> : null}
                          </div>
                        </div>}

                      {this.state.grid.slice(0, 5).map((row) => (
                        <div>

                          <div style={{textAlign: 'left',
                            height: 35,
                            display: 'flex',
                            paddingLeft: 6,
                            alignItems: 'center',
                            borderTopColor: this.state.selected === item ? 'rgba(101, 161, 231, 0.8)':
                            this.state.columns.indexOf(item) <
                             this.state.columns.indexOf(this.state.selected)||
                             this.state.columnNames && this.state.columnNames.length === this.state.columns.length  ?
                             'rgba(219, 219, 219, 0.8)'
                             :
                            'rgba(229, 87, 73, 0.8)',
                            borderTopWidth: 1,
                            borderTopStyle: 'solid',
                            backgroundColor: this.state.selected === item ? 'rgba(101, 161, 231, 0.4)':
                            this.state.columns.indexOf(item) <
                             this.state.columns.indexOf(this.state.selected) ||
                             this.state.columnNames && this.state.columnNames.length === this.state.columns.length ?
                             'rgba(219, 219, 219, 0.4)':
                            'rgba(229, 87, 73, 0.4)'
                          }}>
                            {row[this.state.columns.indexOf(item)].value}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}

                </div>
              </div>



            }

              <div style={{height: 50}}/>
              {this.state.clicked ?
                <div style={{display: 'flex'}}>
                <RaisedButton label='Back'
                  secondary={true}
                  style={buttonStyles.smallSize}
                  labelStyle={buttonStyles.smallLabel}
                  onClick={() => this.setState({clicked: false})}
                  />
                <div style={{width: 20}}/>
                <RaisedButton label='Import contacts'
                  primary={true}
                  style={buttonStyles.smallSize}
                  labelStyle={buttonStyles.smallLabel}
                  disabled={!this.state.columnNames || this.state.columnNames.length < this.state.columns.length}
                  onClick={this.handleImportContacts}
                  />
                </div>
              :
              <div style={{width: 'auto'}}>
              <RaisedButton label='Next'
                primary={true}
                style={buttonStyles.smallSize}
                labelStyle={buttonStyles.smallLabel}
                onClick={() => this.setState({clicked: true, selected: this.state.columns[0]})}
                />
              </div>
            }
            </div>
            </div>
        </App>
      </div>
    )
  }
}

export default withMui(UploadList)
