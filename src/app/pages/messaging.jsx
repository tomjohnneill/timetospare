import React from 'react'
import App from '../components/App.js'
import withMui from '../components/hocs/withMui.js'
import {List, ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import Email from 'material-ui/svg-icons/communication/email';
import {buttonStyles, textFieldStyles} from '../components/styles.jsx';
import SMS from 'material-ui/svg-icons/communication/textsms';
import Add from 'material-ui/svg-icons/content/add';
import TextField from 'material-ui/TextField';
import CommunicationChatBubble from 'material-ui/svg-icons/av/play-arrow';
import Avatar from 'material-ui/Avatar';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider'
import Router from 'next/router';
import Search from 'material-ui/svg-icons/action/search';

const emails = [
  {
    _id: "aosdifj049c2",
    subject: "This is the subject",
    type: "Email",
    date: new Date()
  },
  {
    _id: "aosdifdsdff049c2",
    subject: "The second subject",
    type: "SMS",
    date: new Date()
  }
]

export class Messaging extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <App>
        <Dialog
          onRequestClose={() => this.setState({new: false})}
          contentStyle={{maxWidth: 500}}
          open={this.state.new}>
          <div>
            <div style={{textAlign: 'left', paddingBottom: 10, fontWeight: 200, fontSize: '30px'}}>
              What kind of message?
            </div>


            <ListItem
              style={{display: 'flex', height: 80, alignItems: 'center'}}
              primaryText="Send a standard email"

              leftIcon={<Email color={'#000AB2'}/>}
              rightIcon={<CommunicationChatBubble color={'#000AB2'} />}
            />
          <Divider/>
            <ListItem
              style={{display: 'flex', height: 80, alignItems: 'center'}}
              primaryText="Send a text"

              leftIcon={<SMS color={'#FFCB00'}/>}
              rightIcon={<CommunicationChatBubble color={'#FFCB00'}/>}
            />
          <Divider/>
            <ListItem
              style={{display: 'flex', height: 80, alignItems: 'center'}}
              primaryText="Send using mailchimp"
              onClick={() => Router.push(`/csv-upload?organisation=${this.state.organisation}`,
                    `/csv-upload/${this.state.organisation}`)}
                    leftIcon={<Avatar src="https://static.mailchimp.com/web/brand-assets/logo-freddie-fullcolor.svg" />}
                    rightIcon={<CommunicationChatBubble />}
            />
          </div>
        </Dialog>
        <div style={{width: '100%', display: 'flex', justifyContent: 'center',
        paddingTop: 20}}>
          <div style={{maxWidth: 1000, width: '100%', minHeight: '100vh',
            textAlign: 'left', boxSizing: 'border-box', padding: 10}}>
            <div style={{paddingBottom: 30, alignItems: 'center',
                display: 'flex', justifyContent: 'space-between',}}>
              <span style={{ fontWeight: 200, fontSize: '30px'}}>Messaging</span>
              <RaisedButton
                style={buttonStyles.smallSize}
                icon={<Add/>}
                labelStyle={buttonStyles.smallLabel}
                primary={true}
                onClick={() => this.setState({new: true})}
                label='Create new'/>
            </div>
            <div style={{display: 'flex'}}>

              <div style={{flex: 1}}>
                <div style={{display: 'flex', alignItems: 'center',
                   zIndex: 10
                  , paddingTop: 6,
                  paddingBottom: 30}}>

                  <Search style={{marginRight: 6}}/>
                  <TextField
                    style={textFieldStyles.style}
                    inputStyle={textFieldStyles.input}
                    hintStyle={textFieldStyles.hint}
                    underlineShow={false}
                    hintText={'Search for a message by name'} onChange={this.handleSearch}/>
                </div>
                <div style={{width: '100%', fontSize: '16px', paddingBottom: 6,
                  fontWeight: 200, borderBottom: '1px solid #DBDBDB'}}>
                  Your messages
                </div>
                {
                  emails.map((email) => (
                    <ListItem
                      leftIcon={email.type === 'Email' ? <Email/> : <SMS/>}
                      style={{paddingBottom: 10, borderBottom: '1px solid #DBDBDB'}}
                      primaryText={<span style={{fontWeight: 700, color: '#000AB2'}}>{email.subject}</span>}
                      secondaryText={email.date.toLocaleString('en-gb',
                        {weekday: 'long', month: 'long', day: 'numeric'})}
                        />
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </App>
    )
  }
}

export default withMui(Messaging)
