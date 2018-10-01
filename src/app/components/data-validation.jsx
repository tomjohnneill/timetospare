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
import {buttonStyles, iconButtonStyles} from './styles.jsx';
import Close from 'material-ui/svg-icons/navigation/close'
import * as math from 'mathjs'
import Phone from 'material-ui/svg-icons/communication/phone';
import EmailIcon from 'material-ui/svg-icons/communication/email';
import OrganisationsIcon from 'material-ui/svg-icons/communication/business';
import RolesIcon from 'material-ui/svg-icons/action/supervisor-account';
import Home from 'material-ui/svg-icons/action/home';
import IconButton from 'material-ui/IconButton';
import OrganisationUpload from './organisation-upload.jsx';
import * as firebase from 'firebase';
import 'handsontable/dist/handsontable.full.css';
import { DragDropContainer, DropTarget } from 'react-drag-drop-container';
import Deduplication from './deduplication.jsx';
//import { HotTable } from '@handsontable/react';

var standardColumns = ["Email", "Full Name", "Address", "Phone"]

var colors = {
  Email: '#03a9f4',
  Postcode: '#f44336',
  Roles: '#ff9800',
  Organisations: '#64dd17',
  Phone: '#c51162'
}

var icons = {
  Email: <EmailIcon color='white'/>,
  Postcode: <Home color='white'/>,
  Roles: <RolesIcon color='white'/>,
  Organisations: <OrganisationsIcon color='white'/>,
  Phone: <Phone color='white'/>
}

export default class DataValidation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {columns: this.props.columns, selected: this.props.columns[0],
        modifiedGrid: [],
                  columnNames: [], grid: this.props.grid}
  }

  componentDidMount (props) {
    if (typeof window !== 'undefined') {
      this.HotTable = require('@handsontable/react').HotTable
      this.Handsontable = require('handsontable')
    }
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

  handleChange = (e, index, value, item) => {
    var columns = this.state.columns
    var position = columns.indexOf(item)
    if (value === "New") {

      this.setState({newColumn: true})
      if (this.state.selected.name) {
        this.setState({defaultName: this.state.selected.name})
      }
    } else {
      columns[position] = {name: value}
      this.setState({selected: columns[position]})
      this.setState({columns: columns})
    }
  }

  handleNewColumnText = (e, nv, item) => {
    this.setState({newColumnName: nv})
  }

  handleSkip = (item) => {
    var columns = this.state.columns
    console.log(columns, item)
    var position = columns.indexOf(item)
    console.log(position)
    var columnNames = this.state.columns ? this.state.columns : []
    columnNames[position] = {name: item.name, selected: false}
    console.log(columnNames)
    this.setState({selected: columns[position + 1], columns: columnNames, newColumn: false})
  }

  handleBack = (item) => {
    var columns = this.state.columns
    var position = columns.indexOf(item)
    this.setState({selected: columns[position - 1], newColumn: false})
  }

  checkAllData = () => {
    this.removeUnselectedColumns()
    this.setState({checks: null})
    var allColumns = {}

    var newGrid
    if (this.state.removals) {
      var removals = this.state.removals
      removals = removals.sort(function(a,b){ return a - b; });
      newGrid = this.state.grid.slice()
      for (let i = removals.length -1; i >= 0; i--)
      {
        newGrid.splice(removals[i],1);
      }



      this.setState({grid: newGrid})
    }
    for (var i = 1; i < this.state.grid[0].length; i++) {
      let column = []
      if (this.state.removals) {
          newGrid.forEach((row) => {
          column.push(row[i])
        })
      } else {
        this.state.grid.forEach((row) => {
          column.push(row[i])
        })
      }

      var toCheck = this.lookForStrangeData(column)

      Object.keys(toCheck).forEach((key) => {

        if (allColumns[key]) {
          allColumns[key].push(i+1)
        } else {
          allColumns[key] = [i+1]

        }

      })
    }
    var checks = []
    Object.keys(allColumns).forEach((key) => {
      checks.push({[key]: allColumns[key]})
    })
    this.setState({checks: checks, stage:'validation', removals: []})


  }

  removeUnselectedColumns = () => {
    var newGrid = this.state.grid.slice()
    var toBeRemoved = []
    var columnsHeaders = []
    for (var i = 0; i < this.state.columns.length; i++) {
      if (this.state.columns[i].selected === false) {
        toBeRemoved.push(i)
      } else {
        columnsHeaders.push(this.state.columns[i].name)
      }
    }
    newGrid.forEach((row) => {
      for (let i = toBeRemoved.length -1; i >= 0; i--) {
        row.splice(toBeRemoved[i],1);
      }
    })
    var columns = this.state.columns
    this.state.columns.forEach((column) => {
      if (column.selected === false) {
        columns.splice(columns.indexOf(column), 1)
      }
    })
    this.setState({columns: columns})

    this.setState({grid: newGrid, colHeaders: columnsHeaders})
  }

  lookForStrangeData = (column) => {
    var totalChars = 0
    var totalNums = 0
    var totalLength = 0
    var totalSpecials = 0
    var totalWords = 0
    var counter = 0
    var relevantCounter = 0
    var lookup = {}

    var charDetails = []
    var numDetails = []
    var lenDetails = []
    var specDetails = []
    var wordDetails = []

    var characteristics = []
    column.forEach((piece) => {
      var piece = String(piece)
      if (String(piece).length > 0) {
        let chars = piece.replace(/[^a-zA-Z]/g, '')
        totalChars += chars.length
        let nums = piece.replace(/[^0-9]/g, '')
        totalNums += nums.length
        let special = piece.replace(/[^(!@#\$%\^\&*\)]/g, "")
        totalSpecials += special.length
        let words = piece.split(' ')
        totalWords += words.length
        totalLength += piece.length

        characteristics.push({
          chars: chars.length,
          nums: nums.length,
          special: special.length,
          words: words.length,
          length: piece.length
        })
        lookup[relevantCounter] = counter
        relevantCounter += 1
        charDetails.push(chars.length/piece.length)
        numDetails.push(nums.length/piece.length)
        lenDetails.push(piece.length)
        specDetails.push(special.length)
        wordDetails.push(words.length)

      }
      counter += 1
    })

    var outliers = {}
    if (charDetails) {
      var charStats = {stdev: math.std(charDetails), mean: math.mean(charDetails)}
      var counter = 0
      charDetails.forEach((value) => {
        if (Math.abs((value - charStats.mean)/charStats.stdev) > 2) {
          if (outliers[lookup[counter]]) {
             outliers[lookup[counter]]  += Math.abs((value - charStats.mean)/charStats.stdev)
          } else {
             outliers[lookup[counter]]  = Math.abs((value - charStats.mean)/charStats.stdev)
          }
        }
        counter += 1
      })
    }
    if (numDetails) {
      var numStats = {stdev: math.std(numDetails), mean: math.mean(numDetails)}
      var counter = 0
      numDetails.forEach((value) => {
        if (Math.abs((value - numStats.mean)/numStats.stdev) > 2) {
          if (outliers[lookup[counter]]) {
             outliers[lookup[counter]]  += Math.abs((value - numStats.mean)/numStats.stdev)*2
          } else {
             outliers[lookup[counter]]  = Math.abs((value - numStats.mean)/numStats.stdev)
          }
        }
        counter += 1
      })
    }
    if (specDetails) {
      var specStats = {stdev: math.std(specDetails), mean: math.mean(specDetails)}
      var counter = 0
      specDetails.forEach((value) => {
        if (Math.abs((value - specStats.mean)/specStats.stdev) > 2) {
          if (outliers[lookup[counter]]) {
             outliers[lookup[counter]]  += Math.abs((value - specStats.mean)/specStats.stdev)
          } else {
             outliers[lookup[counter]]  = Math.abs((value - specStats.mean)/specStats.stdev)
          }
        }
        counter += 1
      })
    }
    if (lenDetails) {
      var lenStats = {stdev: math.std(lenDetails), mean: math.mean(lenDetails)}
      var counter = 0
      lenDetails.forEach((value) => {
        if (Math.abs((value - lenStats.mean)/lenStats.stdev) > 2) {
          if (outliers[lookup[counter]]) {
             outliers[lookup[counter]]  += Math.abs((value - lenStats.mean)/lenStats.stdev)/2
          } else {
             outliers[lookup[counter]]  = Math.abs((value - lenStats.mean)/lenStats.stdev)
          }
        }
        counter += 1
      })
    }
    if (wordDetails) {
      var wordStats = {stdev: math.std(wordDetails), mean: math.mean(wordDetails)}
      var counter = 0
      wordDetails.forEach((value) => {
        if (Math.abs((value - wordStats.mean)/wordStats.stdev) > 2) {
          if (outliers[lookup[counter]]) {
             outliers[lookup[counter]]  += Math.abs((value - wordStats.mean)/wordStats.stdev)
          } else {
             outliers[lookup[counter]]  = Math.abs((value - wordStats.mean)/wordStats.stdev)
          }
        }
        counter += 1
      })
    }

    var toCheckRows = this.state.checkRows ? this.state.checkRows : {}
    Object.keys(outliers).forEach((key) => {
      if (outliers[key] > 15) {
        if (toCheckRows[key]) {
          toCheckRows[key].append(key)
        } else {
          toCheckRows[key] = [key]
        }


      }
    })
    return toCheckRows
  }

  groupingRenderer  (instance, td, row, col, prop, value,  cellProperties)  {

    var checkRow = this.state.checks[row]
    if (checkRow) {
      var checkColumns = Object.values(checkRow)[0]

      if (checkColumns.includes(col+1)) {
        td.style.background = 'yellow';
      }
    }

      this.Handsontable.renderers.TextRenderer.apply(this, arguments);
    }

  handleRowDelete = (index, amount, physicalRows) => {

    var removals = this.state.removals ? this.state.removals : []
    for (let i = 0 ; i < amount ; i ++ ) {
      let gridIndex = Object.keys(this.state.checks[index + i])[0]
      removals.push(gridIndex)
    }
    this.state.checks.splice(index, amount)
    this.setState({removals: removals})
  }

  handleEdit = (changes) => {
    if (changes) {
      var grid = this.state.grid
      var allChecks = this.state.checks
      changes.forEach((change) => {
        var check = this.state.checks[change[0]]
        var gridIndex = Object.keys(check)[0]
        grid[gridIndex][change[1]] = change[3]
        allChecks[change[0]][gridIndex].splice(allChecks[change[0]][gridIndex].indexOf(change[1]+1), 1)
      })
      this.setState({grid: grid, checks: allChecks})
    }
  }


  handleDrop = (dropEvent) => {
    console.log(dropEvent)
    var targetZone = dropEvent.dropData.target
    var highlighted = this.state.columns
    var indexOf = highlighted.map(e => e.name).indexOf(targetZone)
    highlighted[indexOf].category = dropEvent.dragData.data
    console.log(highlighted[indexOf])
    this.setState({columns: highlighted})
    console.log(this.state.columns)
  }

  handleRemoveCategory = (column) => {
    var highlighted = this.state.columns
    var indexOf = highlighted.map(e => e.name).indexOf(column.name)
    delete highlighted[indexOf].category
    this.setState({columns: highlighted})
  }


  updateFromChild = (data, columns) => {
    console.log(data)
    this.setState({grid: data, columns: columns, stage: 'deduplication'})
    console.log(this.state)
  }

  renderCorrectStage = () => {
    const HotTable = this.HotTable
    var tableRows = []
    if (this.state.checks) {

      for (let i = 0; i < this.state.checks.length ; i ++) {
        tableRows.push([])
        if (this.state.grid[Object.keys(this.state.checks[i])[0]]) {
          for (let j = 0 ; j < this.state.grid[Object.keys(this.state.checks[i])[0]].length ; j++) {
            tableRows[i].push(this.state.grid[Object.keys(this.state.checks[i])[0]][j])
          }
        }
      }

    }

    switch(this.state.stage) {
      case 'validation': {
        return (
          <div>
            <h2 style={{textAlign: 'left', paddingLeft: 100}}>
              We think some of your data looks a bit unusual. You can change it here if you agree.
            </h2>
            {typeof window !== 'undefined' && HotTable ?
              <div id="hot-app">
                <HotTable
                  renderer={this.groupingRenderer.bind(this)}
                  data={tableRows} colHeaders={true}
                  contextMenu={true}
                  autoWrapCol={false}
                  autoWrapRow={false}
                  afterChange={this.handleEdit}
                  colHeaders={this.state.colHeaders}
                  afterRemoveRow={this.handleRowDelete}
                  rowHeaders={true} width="100%" height="600" stretchH="all" />
              </div>
              : null}
              <RaisedButton label='Next'
                primary={true}
                style={buttonStyles.smallSize}
                labelStyle={buttonStyles.smallLabel}
                onClick={() => this.setState({stage: 'highlight-columns'})}
                />
          </div>
        )
        break;
      }
      case 'org-upload': {
        return  <OrganisationUpload
            columns={this.state.columns}
            data={this.state.grid}
            updateDataAndColumns={this.updateFromChild}
          />
        break;
      }
      case 'deduplication': {
        return  <Deduplication
            data={this.state.grid}
          />
        break;
      }
      case 'highlight-columns' : {
        return (
          <div style={{paddingLeft: 100, paddingRight: 100}}>
            <h2 style={{textAlign: 'left'}}>
              We need your help to categorise a few of these columns
            </h2>

            <div >
              <p>Drag and drop the icons onto the right columns</p>
              <DragDropContainer
                onDrop={this.handleDrop}
                targetKey="foo"
                dragData={{data: 'Email'}}
                 >
                 <div style={{height: 60, display: 'flex',
                   flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center',
                   width: 120, backgroundColor: colors.Email,
                   color: 'white', fontWeight: 700, margin: 10}}>
                   <EmailIcon color='white'/>
                  Email
                </div>
              </DragDropContainer>

              <DragDropContainer
                onDrop={this.handleDrop}
                targetKey="foo"
                dragData={{data: 'Phone'}}
                 >
                 <div style={{height: 60, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexDirection: 'column',
                   width: 120, backgroundColor: colors.Phone,
                   color: 'white', fontWeight: 700, margin: 10}}>
                   <Phone color='white'/>
                  Phone No.
                </div>
              </DragDropContainer>

              <DragDropContainer
                onDrop={this.handleDrop}
                targetKey="foo"
                dragData={{data: 'Roles'}}
                 >
                 <div style={{height: 60, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexDirection: 'column',
                   width: 120, backgroundColor: colors.Roles,
                   color: 'white', fontWeight: 700, margin: 10}}>
                   <RolesIcon color='white'/>
                  Roles
                </div>
              </DragDropContainer>

              <DragDropContainer
                onDrop={this.handleDrop}
                targetKey="foo"
                dragData={{data: 'Postcode'}}
                 >
                 <div style={{height: 60, display: 'flex', alignItems: 'center',
                   justifyContent: 'center', flexDirection: 'column',
                   width: 120, backgroundColor: colors.Postcode,
                   color: 'white', fontWeight: 700, margin: 10}}>
                   <Home color='white'/>
                  Postcode
                </div>
              </DragDropContainer>

              <DragDropContainer
                onDrop={this.handleDrop}
                targetKey="foo"
                dragData={{data: 'Organisations'}}
                 >
                 <div style={{height: 60, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', flexDirection: 'column',
                   width: 120, backgroundColor: colors.Organisations,
                   color: 'white', fontWeight: 700, margin: 10}}>
                   <OrganisationsIcon color='white'/>
                  Organisations
                </div>
              </DragDropContainer>
            </div>

            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
              {
                this.state.columns.map((column) => (
                  column.selected !== false ?
                  <DropTarget
                    dropData={{target: column.name}}
                    targetKey="foo">
                    <div  style={{
                        position: 'relative',
                      height: 100, width: '100px', padding: 10, margin: 10,
                      border: '2px solid #DBDBDB', borderRadius: 2,
                      color: column.category ? 'white' : null,
                      fontWeight: column.category ? 700 : null,
                      backgroundColor: column.category ? colors[column.category] : null}}>
                      <div style={{width: '100%', overflow: 'hidden', display: 'flex',
                          justifyContent: 'space-between', flexDirection: 'column',
                         paddingBottom: 10}}>
                        {column.name}
                        <div style={{width: '100%'}}>
                        {
                          column.category ?
                          icons[column.category]
                          :
                          null
                        }
                        </div>
                      </div>
                      {
                        column.category ?
                        <div style={{position: 'absolute', height: 30, width: 30,
                          top: -15, right: -15, borderRadius: '50%',
                        backgroundColor: '#dd2c00'}}>
                          <IconButton
                            onClick={() => this.handleRemoveCategory(column)}
                            style={{width: 30, padding: 0, height: 30}}
                            iconStyle={{width: 30, padding: 0, height: 30, color: 'white'}}
                            tooltip="Remove category">
                            <Close />
                          </IconButton>
                        </div>
                        :
                        null
                      }

                    </div>

                  </DropTarget>
                  :
                  null
                ))
              }
            </div>
            <RaisedButton label='Next'
              primary={true}
              style={buttonStyles.smallSize}
              labelStyle={buttonStyles.smallLabel}
              onClick={this.getOrgUpload}
              />

          </div>
        )
      }
      default : {
        return (
          <div style={{paddingLeft: 100, paddingRight: 50}}>
            <h2 style={{textAlign: 'left'}}>Which columns do you want to import?</h2>
            <div style={{display: 'flex', maxWidth: '100vw',
               overflow: 'auto', flexWrap: 'wrap'}}>
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

                      <div style={{display: 'flex', paddingBottom: 6, height: 104,
                          boxSizing: 'border-box', alignItems: 'center'}}>
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
                        {item.selected === false ?
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
                        {row[this.state.columns.indexOf(item)]}
                      </div>
                    </div>
                  ))}
                </div>
              ))}

            </div>
            <RaisedButton label='Next'
              primary={true}
              style={buttonStyles.smallSize}
              labelStyle={buttonStyles.smallLabel}
              onClick={this.checkAllData}
              />
          </div>
        )
      }
    }
  }


  getOrgUpload = () => {
    console.log(this.state)
    var columns = this.state.columns
    columns.forEach((col) => {
      if (col.selected === false) {
        columns.splice(columns.indexOf(col), 1)
      }
    })
    this.setState({stage: 'org-upload', columns: columns})
  }

  render() {

    return (
      <div>
        <div>
          {
            this.renderCorrectStage()
          }








        </div>
      </div>
    )
  }
}
