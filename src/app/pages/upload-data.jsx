import React from 'react'
import App from '../components/App.js';
import MediaQuery from 'react-responsive';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import SelectField from 'material-ui/SelectField';
import Divider from 'material-ui/Divider';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import CSVReader from 'react-csv-reader'
import Router from 'next/router';
import fire from '../fire';
import withMui from '../components/hocs/withMui';
import DataValidation from '../components/data-validation';
import {buttonStyles} from '../components/styles.jsx';
import * as firebase from 'firebase';

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

  render() {
    return (
      <App>
        <div style={{minHeight: '100vh'}}>

        {
          this.state.grid ?
          <DataValidation
            columns={this.state.columns}
            grid={this.state.grid}
            />
          :
          <div style={{padding: 40}}>
            <CSVReader
              cssClass="csv-input"
              label="Upload a csv with your contacts data"
              onFileLoaded={this.handleForce}
              onError={this.handleDarkSideForce}
              inputId="ObiWan"
            />
          </div>
        }

        </div>
      </App>
    )
  }
}

export default withMui(UploadData)
