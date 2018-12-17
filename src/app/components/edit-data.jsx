import React from 'react';
import fire from '../fire';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {buttonStyles, iconButtonStyles, headerStyles, chipStyles, textFieldStyles} from '../components/styles.jsx';
import TextField from 'material-ui/TextField';
import Router from 'next/router';
import Popover from 'material-ui/Popover'

let db = fire.firestore()

var emptyObject = {}

export default class EditData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  handleAddFieldSave = (isArray) => {
    var fieldName = this.state.fieldName ? this.state.fieldName : this.props.fieldName
    if (fieldName) {
      if (isArray) {
        var fieldValues = this.state.fieldValues ? this.state.fieldValues : this.props.fieldValue
        if (this.state.addedValue) {
          fieldValues.push(this.state.addedValue)
        }
        db.collection("PersonalData").doc(Router.query.member).update({
          [fieldName] : fieldValues
        }).then(() => {
          this.setState({addedValue: null})
          this.props.onFinish()
          this.setState({fieldValues : null})
        })
      } else {
        db.collection("PersonalData").doc(Router.query.member).update({
          [this.state.fieldName] : this.state.fieldValue
        }).then(() => {
          this.props.onFinish()
          this.setState(emptyObject)
        })
      }


    }
  }

  handleArrayEdit = (originalvalue, newvalue, fieldValues) => {
    var indexPosition = fieldValues.indexOf(originalvalue)
    fieldValues[indexPosition] = newvalue
    this.setState({fieldValues: fieldValues})
  }

  handleArrayAdd = (value, fieldValues) => {
    this.setState({addedValue: value})
  }



  render() {
    var fieldValues = []
    var isArray = false
    if (this.props.fieldValue && Array.isArray(this.props.fieldValue)) {
      isArray = true
      var arrayFieldValues
      if (this.state.fieldValues) {
        arrayFieldValues = this.state.fieldValues
      } else {
        arrayFieldValues = this.props.fieldValue
      }
      arrayFieldValues.forEach((value) => {
        fieldValues.push(value)
      })
    }
    return (
      <Popover
        open={this.props.addFieldOpen}
        anchorEl={this.props.fieldAnchorEl}
        anchorOrigin={{horizontal: 'left', vertical: 'top'}}
        targetOrigin={{horizontal: 'left', vertical: 'top'}}
        onRequestClose={this.props.handleRequestClose}
      >
        <div style={{padding: 20}}>
          <div style={{display: 'flex', textAlign: 'left'}}>
            <div style={{padding: 10, flex: 1}}>
              <b style={{marginBottom: 5}}>Field</b>
              <div style={{height: 5}}/>
              <TextField
                underlineShow={false}
                value={this.state.fieldName ? this.state.fieldName: this.props.fieldName}
                onChange={(e, nv) => this.setState({fieldName: nv})}
                fullWidth={true}
                disabled={this.props.existing}
                style={textFieldStyles.style}
                inputStyle={textFieldStyles.input}
                hintStyle={textFieldStyles.hint}
                />
            </div>
            <div style={{padding: 10, flex: 1}}>
              <b style={{marginBottom: 5}}>{isArray ? 'Values' : 'Value'}</b>
              <div style={{height: 5}}/>
              {
                isArray ?
                <div>
                  {fieldValues.map((value) => (
                    <div style={{marginBottom: 5}}>
                      <TextField
                        underlineShow={false}
                        fullWidth={true}
                        value={value}
                        onChange={(e, nv) => this.handleArrayEdit(value, nv, fieldValues)}
                        style={textFieldStyles.style}
                        inputStyle={textFieldStyles.input}
                        hintStyle={textFieldStyles.hint}
                        />
                    </div>
                  ))}

                  <TextField
                    underlineShow={false}
                    fullWidth={true}
                    hintText={'Add new value'}
                    onChange={(e, nv) => this.handleArrayAdd(nv, fieldValues)}
                    style={textFieldStyles.style}
                    inputStyle={textFieldStyles.input}
                    hintStyle={textFieldStyles.hint}
                    />
                </div>
                :
                <TextField
                  underlineShow={false}
                  fullWidth={true}
                  value={this.state.fieldValue ? this.state.fieldValue : this.props.fieldValue}
                  onChange={(e, nv) => this.setState({fieldValue: nv})}
                  style={textFieldStyles.style}
                  inputStyle={textFieldStyles.input}
                  hintStyle={textFieldStyles.hint}
                  />
              }
            </div>
          </div>
          <div style={{width: '100%', display: 'flex', textAlign: 'right'}}>
            <div styles={{float: 'right', display: 'flex'}}>
              <FlatButton
                label='Cancel'
                primary={true}
                onClick={this.props.handleRequestClose}
                labelStyle={buttonStyles.smallLabel}
                style={buttonStyles.smallSize}/>
              <RaisedButton
                label='Confirm'
                primary={true}
                onClick={() => this.handleAddFieldSave(isArray)}
                labelStyle={buttonStyles.smallLabel}
                style={buttonStyles.smallSize}/>
            </div>
          </div>
        </div>

      </Popover>
    )
  }
}
