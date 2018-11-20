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
import {buttonStyles, iconButtonStyles, headerStyles} from './styles.jsx';
import Close from 'material-ui/svg-icons/navigation/close'
import * as math from 'mathjs'
import Refresh from 'material-ui/svg-icons/navigation/refresh';
import {NameTag} from './icons.jsx';
import Phone from 'material-ui/svg-icons/communication/phone';
import Person from 'material-ui/svg-icons/social/person';
import EmailIcon from 'material-ui/svg-icons/communication/email';
import OrganisationsIcon from 'material-ui/svg-icons/communication/business';
import RolesIcon from 'material-ui/svg-icons/action/supervisor-account';
import Home from 'material-ui/svg-icons/action/home';
import IconButton from 'material-ui/IconButton';
import OrganisationUpload from './organisation-upload.jsx';
import * as firebase from 'firebase';
import 'handsontable/dist/handsontable.full.css';
import { DragDropContainer, DropTarget } from 'react-drag-drop-container';
import Checkbox from 'material-ui/Checkbox';
import {List, ListItem} from 'material-ui/List';
import Deduplication from './deduplication.jsx';
//import { HotTable } from '@handsontable/react';

var standardColumns = ["Email", "Full Name", "Address", "Phone"]

var colors = {
  Email: '#03a9f4',
  Postcode: '#f44336',
  Roles: '#ff9800',
  "Full Name": '#3f51b5',
  Organisations: '#64dd17',
  Phone: '#c51162'
}

var icons = {
  Email: <EmailIcon color='white'/>,
  Postcode: <Home color='white'/>,
"Full Name": <Person color='white'/>,
  Roles: <RolesIcon color='white'/>,
  Organisations: <OrganisationsIcon color='white'/>,
  Phone: <Phone color='white'/>
}

export const styles = {
  nextContainer : {
    position: 'fixed',
    bottom: 0,
    height: 80,
    zIndex: 5,
    display: 'flex',
    backgroundColor: 'rgba(255,255,255,0.9)',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 100,
    boxSizing: 'border-box',
    left: 0
  }
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
    var position = columns.indexOf(item)
    var columnNames = this.state.columns ? this.state.columns : []
    columnNames[position] = {name: item.name, selected: false}
    this.setState({selected: columns[position + 1], columns: columnNames, newColumn: false})
  }

  handleToggleColumn = (e, check, item) => {
    var columns = this.state.columns
    var position = columns.indexOf(item)
    var columnNames = this.state.columns ? this.state.columns : []
    columnNames[position] = {name: item.name, selected: false}
    this.setState({columns: columnNames})
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

    window.scrollTo(0, 0)
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
    localStorage.setItem('grid', JSON.stringify(newGrid))
    localStorage.setItem('colHeaders', JSON.stringify(columnsHeaders))
    localStorage.setItem('columns', JSON.stringify(columns))
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
             outliers[lookup[counter]]  += Math.abs((value - numStats.mean)/numStats.stdev)
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
      if (outliers[key] >  Math.log(this.state.grid.length)) {
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
        td.style.backgroundColor = '#ffefb1';
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

    var targetZone = dropEvent.dropData.target
    var highlighted = this.state.columns
    var indexOf = highlighted.map(e => e.name).indexOf(targetZone)
    highlighted[indexOf].category = dropEvent.dragData.data

    this.setState({columns: highlighted})

  }

  handleRemoveCategory = (column) => {
    var highlighted = this.state.columns
    var indexOf = highlighted.map(e => e.name).indexOf(column.name)
    delete highlighted[indexOf].category
    this.setState({columns: highlighted})
  }


  updateFromChild = (data, columns, orgs) => {

    this.setState({grid: data, columns: columns, stage: 'deduplication', orgs: orgs})

    window.scrollTo(0, 0)
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
          <div >
            <div style={headerStyles.desktop}>
              Some of your data looks a bit unusual. You can change it here if you need to.
            </div>
            {typeof window !== 'undefined' && HotTable ?
              <div id="hot-app" style={{zIndex: 8, width: '90vw', boxSizing: 'border-box'}}>
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
              <div style={styles.nextContainer}>
                <FlatButton label='Back'
                  style={buttonStyles.smallSize}
                  labelStyle={buttonStyles.smallLabel}
                  onClick={() => {
                    this.setState({stage: null})
                    window.scrollTo(0, 0)
                  }}
                  />
                <RaisedButton label='Re-check data'
                    secondary={true}
                    icon={<Refresh/>}
                    style={buttonStyles.smallSize}
                    labelStyle={buttonStyles.smallLabel}
                    onClick={this.checkAllData}
                    />
                  <div style={{width: 10}}/>
                <RaisedButton label='Next'
                  primary={true}
                  style={buttonStyles.smallSize}
                  labelStyle={buttonStyles.smallLabel}
                  onClick={() => {
                    this.setState({stage: 'highlight-columns'})

                    window.scrollTo(0, 0)
                  }}
                  />
              </div>
          </div>
        )
        break;
      }
      case 'org-upload': {
        return  <OrganisationUpload
            columns={this.state.columns}
            data={this.state.grid}
            goBack={() => this.setState({stage: 'highlight-columns'})}
            updateDataAndColumns={this.updateFromChild}
          />
        break;
      }
      case 'deduplication': {
        return  <Deduplication
            data={this.state.grid}
            orgs={this.state.orgs}
            columns={this.state.columns}
            goBack={() => this.setState({stage: 'org-upload'})}
          />
        break;
      }
      case 'highlight-columns' : {
        return (
          <div style={{paddingLeft: 100, paddingRight: 100, minHeight: '100vh'}}>
            <div style={headerStyles.desktop}>
              We need your help to categorise a few of these columns
            </div>

               <div style={{position: 'fixed', zIndex: -1, top: 50, borderRadius: '30% 0 0 90%',
                 transform: 'skewX(-10deg)', backgroundColor: '#FFCB00', right: -200,
                  width: '30vw', height: '100vw'}}/>

                <div style={{marginBottom: 10}}>
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
                dragData={{data: 'Full Name'}}
                 >
                 <div style={{height: 60, display: 'flex',
                   flexDirection: 'column', alignItems: 'center',
                    justifyContent: 'center',
                   width: 120, backgroundColor: colors['Full Name'],
                   color: 'white', fontWeight: 700, margin: 10}}>
                   <Person color='white'/>
                  Full Name
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
                      backgroundColor: column.category ? colors[column.category] : 'white'}}>
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
            <div style={styles.nextContainer}>
              <FlatButton label='Back'
                style={buttonStyles.smallSize}
                labelStyle={buttonStyles.smallLabel}
                onClick={() => {
                  this.setState({stage: 'validation'})
                  window.scrollTo(0, 0)
                }}
                />
              <RaisedButton label='Next'
                primary={true}
                style={buttonStyles.smallSize}
                labelStyle={buttonStyles.smallLabel}
                onClick={this.getOrgUpload}
                />
            </div>
          </div>
        )
      }
      default : {
        return (
          <div style={{paddingLeft: 200, paddingRight: 200, paddingTop: 50, marginBottom: 200}}>
            <div style={{position: 'fixed', zIndex: -1, top: 50, borderRadius: '30% 0 0 90%',
              transform: 'skewX(-10deg)', backgroundColor: '#FFCB00', right: -150,
               width: '40vw', height: '100vw'}}/>
            <h2 style={{textAlign: 'left', fontWeight: 200, fontSize: '36px', marginBottom: 50}}>
              Which columns do you want to import?</h2>
            <div style={{ maxWidth: '500px', textAlign: 'left',
               overflow: 'auto'}}>
              {this.state.columns.map((item) => (
                <ListItem  primaryText={item.name}
                  key={item.name}
                  nestedItems={
                    this.state.grid.slice(0,5).map((row) => (
                      <ListItem
                        style={{borderBottom: '1px solid #DBDBDB'}}
                        primaryText={row[this.state.columns.indexOf(item)]}/>
                    ))
                  }
                  style={{borderBottom: '1px solid #DBDBDB'}}
                  leftCheckbox={<Checkbox
                    defaultChecked={true}
                    onCheck={(e, check) => this.handleToggleColumn(e, check, item)}
                    />}
                  />
              ))}

            </div>
            <div style={styles.nextContainer}>
              <RaisedButton label='Next'
                primary={true}
                style={buttonStyles.smallSize}
                labelStyle={buttonStyles.smallLabel}
                onClick={this.checkAllData}
                />
            </div>
          </div>
        )
      }
    }
  }


  getOrgUpload = () => {
    var columns = this.state.columns
    columns.forEach((col) => {
      if (col.selected === false) {
        columns.splice(columns.indexOf(col), 1)
      }
    })
    this.setState({stage: 'org-upload', columns: columns})
    window.scrollTo(0, 0)
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
