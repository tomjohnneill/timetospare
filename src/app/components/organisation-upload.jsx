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
import {buttonStyles, headerStyles} from './styles.jsx';
import * as math from 'mathjs'
import * as firebase from 'firebase';
import 'handsontable/dist/handsontable.full.css';
import {styles} from './data-validation';

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

  }

  handleEdit = (changes) => {
      if (changes) {
        var orgs = this.state.organisations.slice()
        var uniqueOrgs = uniq(orgs)
        this.setState({uniqueOrgs: uniqueOrgs})
      }
  }

  lookUpOrgs = () => {
    // match organistions where organisations are not in separate columns

    console.log(this.props.columns)
    var orgIndices = []
    for (var i = 0; i < this.props.columns.length; i ++) {
      if (this.props.columns[i].category === 'Organisations') {
        orgIndices.push(i)
      }
    }
    console.log(orgIndices)
    var newGrid = this.props.data
    var data = []
    newGrid.forEach((row) => {
      var organisations = []
      var dataRow = {}
      for (let j = 0; j < row.length; j++) {
        if (this.props.columns[j].category) {
          if (dataRow[this.props.columns[j].category]) {
            var elem = row[j].toLowerCase().trim().replace(/(\r\n|\n|\r)/gm, '')
            dataRow[this.props.columns[j].category].push(elem)
          } else {
            var elem = row[j].toLowerCase().trim().replace(/(\r\n|\n|\r)/gm, '')
            dataRow[this.props.columns[j].category] = [elem]
          }
        } else {
          dataRow[this.props.columns[j].name] = row[j]
        }
        if (orgIndices.includes(j)) {
          this.state.uniqueOrgs.forEach((org) => {
            if (row[j].trim().toLowerCase().replace(/(\r\n|\n|\r)/gm, '').includes(org[0].trim().toLowerCase().replace(/(\r\n|\n|\r)/gm, ''))) {
              organisations.push(org[0])
            }
          })
        }
      }
      console.log(organisations)
      dataRow.organisations = organisations
      data.push(dataRow)
    })


    this.setState({grid: newGrid, data: data})

    var cleanOrgs = []
    this.state.uniqueOrgs.forEach((orgArray) => {
      cleanOrgs.push(orgArray[0].toLowerCase().replace(/(\r\n|\n|\r)/gm, ''))
    })
    console.log(cleanOrgs)
    console.log(data)
    var newColumns = this.props.columns
    newColumns.push({name: 'organisations'})
    this.props.updateDataAndColumns(data, this.props.columns, cleanOrgs)
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
    console.log(this.state)

    const HotTable = this.HotTable

    return (
      <div style={{paddingLeft: 100, paddingRight: 100}}>
      <div style={{position: 'fixed', zIndex: -1, top: 50, borderRadius: '30% 0 0 90%',
        transform: 'skewX(-10deg)', backgroundColor: '#FFCB00', right: -200,
         width: '30vw', height: '100vw'}}/>
       <div style={{position: 'fixed', zIndex: -1, top: 50, borderRadius: '0 30% 90% 0%',
         transform: 'skewX(-10deg)', backgroundColor: '#FFCB00', left: -150,
          width: '20vw', height: '100vw'}}/>
        <div style={headerStyles.desktop}>
          Copy and paste in a list of your organisations.
        </div>
        <p style={{marginTop: 0, fontWeight: 200, textAlign: 'left'}}>
          Make sure each row only has one organisation name in it.
        </p>
        {typeof window !== 'undefined' && HotTable ?
          <div id="org-hot-app" style={{width: '100%', paddingTop: 30, boxSizing: 'border-box',
             minWidth: '300px'}}>
            <HotTable
              data={this.state.organisations}
              contextMenu={true}

              afterChange={this.handleEdit}
              colHeaders={['Organisations']}
              rowHeaders={true} width="100%" height="400" stretchH="all" />
          </div>
          : null}
          <div style={{height: 20}}/>
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
            disabled={!this.state.uniqueOrgs}
            onClick={this.lookUpOrgs}
            label='Next'/>
        </div>
      </div>
    )
  }
}
