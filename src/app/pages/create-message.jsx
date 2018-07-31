import React from 'react'
import App from '../components/App.js'
import withMui from '../components/hocs/withMui.js'
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {buttonStyles, textFieldStyles} from '../components/styles.jsx'
import Add from 'material-ui/svg-icons/content/add';
import TextField from 'material-ui/TextField';
import Divider from 'material-ui/Divider';
import Router from 'next/router';
import DropDownMenu from 'material-ui/DropDownMenu';
import 'react-quill/dist/quill.snow.css';
import MenuItem from 'material-ui/MenuItem';
import fire from '../fire';

let mobile = require('is-mobile');
let db = fire.firestore()

const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ]
  }

class Recipients extends React.Component{
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div style={{padding: '20px 0px'}}>
        <div style={{display: 'flex', alignItems: 'top', justifyContent: 'space-between'}}>
          <div style={{color: this.props.focus === null || this.props.focus === 'recipients'? 'inherit' : '#DBDBDB'}}>
            <span style={{fontWeight: 700, fontSize: '24px'}}>
              To
            </span>
            <br/>
            <span style={{fontWeight: 200, fontStyle: this.props.focus === 'recipients' ? "inherit" : 'italic'}}>
              Who are you sending this message to?
            </span>
          </div>
          {
            this.props.focus === 'recipients' ?
            null :
            <RaisedButton style={buttonStyles.smallSize}
              labelStyle={buttonStyles.smallLabel}
              primary={true}
              onClick={this.props.changeFocus}
              label='Add recipients'/>
          }

        </div>
        {
          this.props.focus === 'recipients' ?
          <div>
            <div style={{padding: '20px 0px'}}>
              <DropDownMenu
                  style={{textAlign: 'left', height: 40}}
                  onChange={(e, key, value) => this.setState({list: value})}
                  labelStyle={{backgroundColor: 'white', height: 40, border: '1px solid #aaa',
                    borderRadius: 2, display: 'flex', alignItems: 'center'}}
                  iconStyle={{height: 40}}
                  underlineStyle={{border: 'none'}}
                  selectedMenuItemStyle={ {backgroundColor: '#f5f5f5', color: '#000AB2', fontWeight: 'bold'} }
                  menuStyle={{textAlign: 'left'}}
                  value={this.state.list ? this.state.list : 'norepeat'} >

                  {
                    this.props.lists ? this.props.lists.map((list) => (
                      <MenuItem value={list._id} primaryText={list.Name} />
                    ))
                    :
                    null
                  }


                </DropDownMenu>
              </div>
            <div style={{display: 'flex'}}>
              <RaisedButton style={buttonStyles.smallSize}
                labelStyle={buttonStyles.smallLabel}
                primary={true}
                onClick={this.props.changeFocus}
                label='Save'/>
              <div style={{width: 20}}/>
              <FlatButton style={buttonStyles.smallSize}
                labelStyle={buttonStyles.smallLabel}
                primary={true}
                onClick={this.props.cancelFocus}
                label='Cancel'/>
            </div>

          </div>
          :
          null
        }
      </div>
    )
  }
}

class Subject extends React.Component{
  constructor(props) {
    super(props);
    this.state = {subject: ""}
  }

  handleSubject = (e, nv) => {
    this.setState({subject: nv})
  }

  render() {
    return (
      <div style={{padding: '20px 0px'}}>
        <div style={{display: 'flex', alignItems: 'top', justifyContent: 'space-between'}}>
          <div style={{color: this.props.focus === null || this.props.focus === 'subject' ? 'inherit' : '#DBDBDB'}}>
            <span style={{fontWeight: 700, fontSize: '24px'}}>
              Subject
            </span>
            <br/>
            <span style={{fontWeight: 200, fontStyle: this.props.focus === 'subject' ? "inherit" : 'italic'}}>
              What's the subject line for this message?
            </span>
          </div>
          {
            this.props.focus === 'body' ?
            null :
            <RaisedButton style={buttonStyles.smallSize}
              labelStyle={buttonStyles.smallLabel}
              primary={true}
              disabled={this.props.focus !== null}
              onClick={this.props.changeFocus}
              label='Change subject'/>
          }

        </div>
        {
          this.props.focus === 'subject' ?
          <div>
            <div style={{padding: '20px 0px'}}>
              <TextField
                underlineShow={false}
                style={textFieldStyles.style}
                fullWidth={true}
                onChange={this.handleSubject}
                multiLine={true}
                hintStyle={textFieldStyles.hint}
                inputStyle={textFieldStyles.input}
                hintText={'Add a subject line'}/>
            </div>
            <div style={{display: 'flex'}}>
              <RaisedButton style={buttonStyles.smallSize}
                labelStyle={buttonStyles.smallLabel}
                primary={true}
                disabled={this.state.subject.length === 0}
                onClick={this.props.changeFocus}
                label='Save'/>
              <div style={{width: 20}}/>
              <FlatButton style={buttonStyles.smallSize}
                labelStyle={buttonStyles.smallLabel}
                primary={true}
                onClick={this.props.cancelFocus}
                label='Cancel'/>
            </div>

          </div>
          :
          null
        }
      </div>
    )
  }
}

class Body extends React.Component{
  constructor(props) {
    super(props);
    this.state = {body: ""}
    if (typeof window !== 'undefined') {
      this.ReactQuill = require('react-quill')
    }

  }

  handleBody = (e, nv) => {
    this.setState({body: nv})
  }

  render() {
    console.log(this.state.body.length)
    const ReactQuill = this.ReactQuill
    return (
      <div style={{padding: '20px 0px'}}>
        <div style={{display: 'flex', alignItems: 'top', justifyContent: 'space-between'}}>
          <div style={{color: this.props.focus === null || this.props.focus === 'body' ? 'inherit' : '#DBDBDB'}}>
            <span style={{fontWeight: 700, fontSize: '24px'}}>
              Message
            </span>
            <br/>
            <span style={{fontWeight: 200, fontStyle: this.props.focus === 'body' ? "inherit" : 'italic'}}>
              What do you want to say?
            </span>
          </div>
          {
            this.props.focus === 'body' ?
            null :
            <RaisedButton style={buttonStyles.smallSize}
              labelStyle={buttonStyles.smallLabel}
              primary={true}
              disabled={this.props.focus !== null}
              onClick={this.props.changeFocus}
              label='Write message'/>
          }

        </div>
        {
          this.props.focus === 'body' ?
          <div >
            <div style={{padding: '20px 0px'}}>
            {this.props.type === 'email' && typeof window !== 'undefined' && ReactQuill ?
            <ReactQuill
              style={{fontFamily: 'Nunito', backgroundColor: 'white'}}
              modules={modules}
              toolbar={{fontName: 'Nunito'}}
              onChange={this.handleStoryChange}
              value={this.state.story}
                 />
              :
              <TextField
                underlineShow={false}
                style={textFieldStyles.style}
                fullWidth={true}
                onChange={this.handleBody}
                multiLine={true}
                hintStyle={textFieldStyles.hint}
                inputStyle={textFieldStyles.input}
                hintText={'Write message'}/>

            }
            </div>
            <div style={{display: 'flex'}}>
              <RaisedButton style={buttonStyles.smallSize}
                labelStyle={buttonStyles.smallLabel}
                primary={true}
                disabled={this.state.body.length === 0}
                onClick={this.props.changeFocus}
                label='Save'/>
              <div style={{width: 20}}/>
              <FlatButton style={buttonStyles.smallSize}
                labelStyle={buttonStyles.smallLabel}
                primary={true}
                onClick={this.props.cancelFocus}
                label='Cancel'/>
            </div>

          </div>
          :
          null
        }
      </div>
    )
  }
}


export class CreateMessage extends React.Component {
  constructor(props){
    super(props);
    this.state = {focus: null}
  }

  componentDidMount(props) {
    db.collection("Lists").where("Organisation", "==", Router.query.organisation)
    .get().then((listSnapshot) => {
      var lists = []
      listSnapshot.forEach((list) => {
        var elem = list.data()
        elem._id = list.id
        lists.push(elem)
      })
      this.setState({lists: lists})
    })
  }

  render() {
    console.log(this.state)
    console.log(this.props)
    return (
      <App>
        <div style={{display: 'flex', width: '100%', justifyContent: 'center', paddingTop: 20}}>
          <div style={{maxWidth: 1000, width: '100%', minHeight: '100vh',
            textAlign: 'left', boxSizing: 'border-box', padding: 10}}>
            <div style={{paddingBottom: 30, alignItems: 'center',
                display: 'flex', justifyContent: 'space-between',}}>
              <span style={{ fontWeight: 200, fontSize: '30px'}}>Send a new {this.props.url.query.type.replace("sms", "SMS")} message</span>

            </div>
            {
              this.props.url.query.type === 'sms' ?
              <div style={{padding: '0px 20px', border: '1px solid #DBDBDB', borderRadius: 6}}>
                <Recipients
                  focus={this.state.focus}
                  lists={this.state.lists}
                  changeFocus={() => this.setState({focus: 'recipients'})}
                  cancelFocus={() => this.setState({focus: null})}
                  />
                <Divider/>
                <Body
                  focus={this.state.focus}
                  changeFocus={() => this.setState({focus: 'body'})}
                  cancelFocus={() => this.setState({focus: null})}
                />
              </div>
              :
              <div style={{padding: '0px 20px', border: '1px solid #DBDBDB', borderRadius: 6}}>
                <Recipients
                  focus={this.state.focus}
                  lists={this.state.lists}
                  changeFocus={() => this.setState({focus: 'recipients'})}
                  cancelFocus={() => this.setState({focus: null})}
                  />
                <Divider/>
                <Subject
                  focus={this.state.focus}
                  changeFocus={() => this.setState({focus: 'subject'})}
                  cancelFocus={() => this.setState({focus: null})}
                />
                <Divider/>
                <Body
                  focus={this.state.focus}
                  type={this.props.url.query.type}
                  changeFocus={() => this.setState({focus: 'body'})}
                  cancelFocus={() => this.setState({focus: null})}
                />
              </div>
            }
          </div>
        </div>
      </App>
    )
  }
}

export default withMui(CreateMessage)
