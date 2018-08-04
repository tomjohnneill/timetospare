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
import {PaperAirplane, Clock} from '../components/icons.jsx';

let mobile = require('is-mobile');
let db = fire.firestore()
let functions = fire.functions('europe-west1')



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

  handleChangeList = (e, key, value) => {
    console.log(key, value)
    this.setState({list: value, listName: this.props.lists[key].Name})
    db.collection("Members").where("lists." + value, "==", true).get()
    .then((querySnapshot) => {
      console.log(querySnapshot)
      this.setState({listSnapshot: querySnapshot, size: querySnapshot.size})
    })

  }

  handleSave = () => {
    this.props.updateParent(this.state.list, this.state.listName, this.state.listSnapshot)
  }

  render() {
    console.log(this.props)
    console.log(this.state)
    return (
      <div style={{padding: '20px 0px'}}>
        <div style={{display: 'flex', alignItems: 'top', justifyContent: 'space-between'}}>
          <div style={{color: this.props.focus === null || this.props.focus === 'recipients'? 'inherit' : '#DBDBDB'}}>
            <span style={{fontWeight: 700, fontSize: '24px'}}>
              To
            </span>
            <br/>
            {
              this.state.list ?
              <span style={{fontWeight: 200}}>
                Sending to all members in the list <b>{this.state.listName}</b>
              <i>{this.state.size ? `${this.state.size} recipients` : null}</i>
              </span>
              :
              <span style={{fontWeight: 200, fontStyle: this.props.focus === 'recipients' ? "inherit" : 'italic'}}>
                Who are you sending this message to?
              </span>
            }

          </div>
          {
            this.props.focus === 'recipients' ?
            null :
            <RaisedButton style={buttonStyles.smallSize}
              labelStyle={buttonStyles.smallLabel}
              disabled={this.props.focus !== null &&  this.props.focus !== 'recipients'}
              primary={this.state.list ? false : true}
              secondary={this.state.list ? true : false}
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
                  onChange={this.handleChangeList}
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
                onClick={this.handleSave}
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

  handleSave = () => {
    this.props.updateParent(this.state.subject)
  }

  render() {
    console.log(this.state)
    return (
      <div style={{padding: '20px 0px'}}>
        <div style={{display: 'flex', alignItems: 'top', justifyContent: 'space-between'}}>
          <div style={{color: this.props.focus === null || this.props.focus === 'subject' ? 'inherit' : '#DBDBDB'}}>
            <span style={{fontWeight: 700, fontSize: '24px'}}>
              Subject
            </span>
            <br/>
            {
              this.state.subject ?
              <span style={{fontWeight: 700}}>
                {this.state.subject}
              </span>
              :
              <span style={{fontWeight: 200, fontStyle: this.props.focus === 'subject' ? "inherit" : 'italic'}}>
                What's the subject line for this message?
              </span>
            }

          </div>
          {
            this.props.focus === 'subject' ?
            null :
            <RaisedButton style={buttonStyles.smallSize}
              labelStyle={buttonStyles.smallLabel}
              primary={this.state.subject ? false : true}
              secondary={this.state.subject ? true : false}
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
                value={this.state.subject}
                onChange={this.handleSubject}
                hintStyle={textFieldStyles.hint}
                inputStyle={textFieldStyles.input}
                hintText={'Add a subject line'}/>
            </div>
            <div style={{display: 'flex'}}>
              <RaisedButton style={buttonStyles.smallSize}
                labelStyle={buttonStyles.smallLabel}
                primary={true}
                disabled={this.state.subject.length === 0}
                onClick={this.handleSave}
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

  handleQuillBody = (value) => {

    this.setState({body: value})
  }

  handleSave = () => {
    this.props.updateParent(this.state.body)
  }

  descriptionMarkup() {
    return {__html: this.state.body ?
      this.state.body.replace('<img', '<img style="width:100%;height:auto"') : null}
  }

  render() {
    console.log(this.state.body)
    const ReactQuill = this.ReactQuill
    return (
      <div style={{padding: '20px 0px'}}>
        <div style={{display: 'flex', alignItems: 'top', justifyContent: 'space-between'}}>
          <div style={{color: this.props.focus === null || this.props.focus === 'body' ? 'inherit' : '#DBDBDB'}}>
            <span style={{fontWeight: 700, fontSize: '24px'}}>
              Message
            </span>
            <br/>
            {
              this.state.body && this.props.type === 'sms' && this.props.focus === null ?
              <div>
                <div style={{padding: 10, maxWidth: 150, margin: 20}} className='speech-bubble'>
                  {this.state.body}
                </div>
              </div>
              :
              this.state.body && this.props.focus === null ?
              <div>
                <div style={{padding: 10, maxWidth: 450, width: '100%', margin: '20px 0px', borderRadius: 4, border: '1px solid #DBDBDB'}}>
                  <div dangerouslySetInnerHTML={this.descriptionMarkup()}/>
                </div>
              </div>
              :
              this.props.focus === null ?
              <span style={{fontWeight: 200, fontStyle: this.props.focus === 'body' ? "inherit" : 'italic'}}>
                What do you want to say?
              </span>
              :
              null
            }

          </div>
          {
            this.props.focus === 'body' ?
            null :
            <RaisedButton style={buttonStyles.smallSize}
              labelStyle={buttonStyles.smallLabel}
              primary={this.state.body ? false : true}
              secondary={this.state.body ? true : false}
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
              onChange={this.handleQuillBody}
              value={this.state.body}
                 />
              :
              <TextField
                underlineShow={false}
                style={textFieldStyles.style}
                textFieldStyle={textFieldStyles.style}
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
                onClick={this.handleSave}
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

  handleRecipients = (list, listName, snapshot) => {
    this.setState({focus: null, list: list, listName: listName, snapshot: snapshot})
    console.log(list, listName, snapshot)
    var getMemberInList = functions.httpsCallable('users-getMemberInListEurope')
    getMemberInList({list: list, organisation: Router.query.organisation})
    .then((result) => {
      this.setState({recipients: result.data})
    })
    .catch((err) => {
      console.log(err)
    })
  }

  handleSend = () => {
    console.log(this.state.recipients)
    var sendEmail = functions.httpsCallable('messaging-sendCustomEmail')
    var sendText = functions.httpsCallable('messaging-sendCustomSMS')
    var emails = []
    var emailMembers = []
    var recipientVariables = {}
    this.state.recipients.forEach((person) => {
      if (person.Email) {
        emails.push(person.Email)
        emailMembers.push(person._id)
        recipientVariables[person.Email] = {_id: person._id}
      }
    })
    var phones = []
    var phoneMembers = []
    this.state.recipients.forEach((person) => {
      if (person.Phone) {
        phones.push(person.Phone)
        phoneMembers.push(person._id)
      }
    })
    if (this.props.url.query.type === 'email') {
      var data = {
        from: 'Jack <jack@mg.timetospare.com>',
        to: emails,
        Members: emailMembers,
        Organisation: Router.query.organisation,
        subject: this.state.subject,
        html: this.state.body,
        ListId: this.state.list,
        recipientVariables: recipientVariables
      };
      console.log(data)
      sendEmail(data).then((result) => {
        console.log(result)
        // Router.push('/organisat')
      })
      .catch((err) => {
        console.log(err)
      })
    } else {
      var data = {
        to: phones,
        Members: phoneMembers,
        Organisation: Router.query.organisation,
        ListId: this.state.list,
        body: this.state.body
      };
      sendText(data).then((result) => {
        // Router.push('/organisat')
      })
      .catch((err) => {
        console.log(err)
      })
    }
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
              <div style={{display: 'flex'}}>
                {
                  this.props.url.query.type === 'sms' ?
                  null :
                  <RaisedButton
                    icon={<Clock style={{height: 20, width: 30}}
                    fill={'white'}/>}
                    label='Schedule'
                    primary={true}
                    disabled={!(this.state.list && this.state.body && (this.props.url.query.type === 'sms' || this.state.subject))}
                    style={buttonStyles.smallSize}
                    labelStyle={buttonStyles.smallLabel}
                    />
                }

                <div style={{width: 20}}/>
                <RaisedButton
                  icon={<PaperAirplane style={{height: 30}}
                  fill={'white'}/>}
                  label='Send'
                  primary={true}
                  onClick={this.handleSend}
                  disabled={!(this.state.list && this.state.body && (this.props.url.query.type === 'sms' || this.state.subject))}
                  style={buttonStyles.smallSize}
                  labelStyle={buttonStyles.smallLabel}
                  />
              </div>
            </div>
            {
              this.props.url.query.type === 'sms' ?
              <div style={{padding: '0px 20px', border: '1px solid #DBDBDB', borderRadius: 6}}>
                <Recipients
                  focus={this.state.focus}
                  updateParent={this.handleRecipients}
                  lists={this.state.lists}
                  changeFocus={() => this.setState({focus: 'recipients'})}
                  cancelFocus={() => this.setState({focus: null})}
                  />
                <Divider/>
                <Body
                  focus={this.state.focus}
                  type={this.props.url.query.type}
                  updateParent={(body) => this.setState({body: body, focus: null})}
                  changeFocus={() => this.setState({focus: 'body'})}
                  cancelFocus={() => this.setState({focus: null})}
                />
              </div>
              :
              <div style={{padding: '0px 20px', border: '1px solid #DBDBDB', borderRadius: 6}}>
                <Recipients
                  focus={this.state.focus}
                  lists={this.state.lists}
                  updateParent={this.handleRecipients}
                  changeFocus={() => this.setState({focus: 'recipients'})}
                  cancelFocus={() => this.setState({focus: null})}
                  />
                <Divider/>
                <Subject
                  focus={this.state.focus}
                  updateParent={(subject) => this.setState({subject: subject, focus: null})}
                  changeFocus={() => this.setState({focus: 'subject'})}
                  cancelFocus={() => this.setState({focus: null})}
                />
                <Divider/>
                <Body
                  focus={this.state.focus}
                  updateParent={(body) => this.setState({body: body, focus: null})}
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
