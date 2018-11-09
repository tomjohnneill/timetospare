import React from 'react'
import App from '../components/App.js';
import MediaQuery from 'react-responsive';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import Router from 'next/router';
import fire from '../fire';
import withMui from '../components/hocs/withMui';
import DataValidation from '../components/data-validation';
import {buttonStyles, headerStyles} from '../components/styles.jsx';
import * as firebase from 'firebase';
import Dropzone from 'react-dropzone';
import * as Papa from 'papaparse';

let db = fire.firestore()

export class UploadData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  handleForce = (data) => {
    console.log(data)
    var grid = data.slice(1)

    console.log(grid)
    var headers = data[0]
    var columns = []
    headers.forEach((each) => {
      columns.push({name: each})
    })
    this.setState({columns: columns, grid: grid})
  }

  handleDrop = (file, rej) => {
    console.log('hello')
    console.log(file)
    Papa.parse(file[0],  {
      complete: (result) => {
        var data = result.data

        var grid = data.slice(1)

        console.log(grid)
        var headers = data[0]
        var columns = []
        headers.forEach((each) => {
          columns.push({name: each})
        })
        this.setState({columns: columns, grid: grid})
      }
    })
  }

  render() {
    return (
      <App>

         <div style={{minHeight: '100vh', display: 'flex', alignItems: 'center', flexDirection: 'column'}}>

        {
          this.state.grid ?
          <DataValidation
            columns={this.state.columns}
            grid={this.state.grid}
            />
          :
          <div style={{padding: 40}}>
            <div style={{position: 'fixed', zIndex: -1, top: 50, borderRadius: '0 30% 90% 0%',
              transform: 'skewX(-10deg)', backgroundColor: '#FFCB00', left: -150,
               width: '30vw', height: '100vw'}}/>
            <div style={headerStyles.desktop}>
              Upload your CSV file
            </div>
          <Dropzone onDrop={this.handleDrop}>


          </Dropzone>


          </div>
        }

        </div>
      </App>
    )
  }
}

export default withMui(UploadData)
