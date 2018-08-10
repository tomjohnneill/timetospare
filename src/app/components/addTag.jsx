import React from 'react';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import FlatButton from 'material-ui/FlatButton';
import {buttonStyles, radioButtonStyles, textFieldStyles} from './styles.jsx';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import fire from '../fire.js';
import * as firebase from 'firebase';

let db = fire.firestore()
let functions = fire.functions('us-central1')

export default class AddTag extends React.Component {
  constructor(props) {
    super(props);
    this.state = {tagType: 'existing'}
  }

  componentDidMount(props) {
    db.collection("Charity").doc(this.props.organisation).get()
    .then((doc) => {
      this.setState({existingTags: doc.data().tags})
    })
  }

  handleSaveTag = () => {
    var sfDocRef = db.collection("Charity").doc(this.props.organisation)
    db.runTransaction((transaction) =>
      transaction.get(sfDocRef)
        .then((sfDoc) => {
          if (!sfDoc.exists) {
              throw "Document does not exist!";
          } else {
            return transaction.update(sfDocRef, {"tags": firebase.firestore.FieldValue.arrayUnion(this.state.tag)});
          }
        })
      )
      .then(() => {
        this.props.onRequestClose()
      })
    let functions = fire.functions('europe-west1')
    var addTagToMembers = functions.httpsCallable('users-addTagToMembers')
    addTagToMembers({tag: this.state.tag, members: this.props.selection, orgId: this.props.organisation})
    this.setState({tagUpdated: true})
    if (this.props.onTagAdded) {
       this.props.onTagAdded(this.state.tag)
    }
  }

  handleWriteTag = (e, nv) => {
    this.setState({tag: nv})
  }

  render() {
    console.log(this.props.selection)
    return (
      <div>
        <Dialog
          open={this.props.open}
          contentStyle={{maxWidth: 600}}
          onRequestClose={this.props.onRequestClose}>
          <div style={{width: '100%', boxSizing: 'border-box', padding: '20px 0px', fontSize: '30px'
          , textAlign: 'left'}}>
            {this.props.text ? this.props.text : `Tag these ${this.props.selection && this.props.selection.length} people`}
          </div>
          <div style={{backgroundColor: '#f5f5f5', padding: 10, display: 'flex', textAlign: 'left'}}>
            <div style={{width: 150, paddingTop: 8}}>
              <RadioButtonGroup
                onChange={(e,value) => this.setState({tagType: value})}
                 name="shipSpeed" valueSelected={this.state.tagType}>
                <RadioButton
                  value="existing"
                  label="Existing Tag"
                  style={{marginBottom: 30}}
                />
                <RadioButton
                  value="new"
                  label="New Tag"
                  style={radioButtonStyles.radioButton}
                />

              </RadioButtonGroup>
            </div>
            <div style={{display: 'block', flex: 1, paddingLeft: 30}}>
              <DropDownMenu
                style={{textAlign: 'left', height: 40, paddingBottom: 15, width: '100%'}}
                labelStyle={{backgroundColor:  this.state.tagType === 'existing' ? 'white' : '#f5f5f5'
                  , height: 40, border: '1px solid #aaa',
                  borderRadius: 2, display: 'flex', alignItems: 'center'}}
                iconStyle={{height: 40}}
                disabled={this.state.tagType !== 'existing'}
                selectedMenuItemStyle={ {backgroundColor: '#f5f5f5', color: '#000AB2'} }
                onChange={(e, key, value) => this.setState({tag: value})}
                value={this.state.tag ? this.state.tag : 'public'}
                underlineStyle={{border: 'none'}}
                menuStyle={{textAlign: 'left', width: '100%'}}
                  >
                  {
                    this.state.existingTags ? this.state.existingTags.map((tag) => (
                      <MenuItem value={tag} primaryText={tag} />

                    ))

                    :
                    null
                  }

              </DropDownMenu>
              <TextField
                hintText={'Enter new tag name'}
                underlineShow={false}
                fullWidth={true}
                disabled={this.state.tagType !== 'new'}
                style={this.state.tagType === 'new' ? textFieldStyles.style : {backgroundColor: '#f5f5f5', height: 40}}
                inputStyle={textFieldStyles.input}
                hintStyle={textFieldStyles.hint}
                onChange={this.handleWriteTag}/>
            </div>

          </div>
          <div style={{textAlign: 'right', paddingTop: 20}}>
            <FlatButton
              onClick={this.props.onRequestClose}
              style={buttonStyles.smallSize}
              labelStyle={buttonStyles.smallLabel}
              label='Cancel'
              />

            <RaisedButton
              primary={true}
              onClick={this.handleSaveTag}
              style={buttonStyles.smallSize}

              labelStyle={buttonStyles.smallLabel}
              label='Save this tag'/>
          </div>
        </Dialog>
      </div>
    )
  }
}
