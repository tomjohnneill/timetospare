import React from 'react';
import App from '../components/App';
import Router from 'next/router';
import CustomInvite from '../components/custom-invite.jsx';
import fire from '../fire';
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Share from '../components/share.jsx';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import withMui from '../components/hocs/withMui';

let db = fire.firestore()

var SITE = `https://whosin-next.firebaseapp.com/`

const styles = {
  line: {
    padding: "0.625em 0",
    borderTop: "1px solid #dbd9db",
    boxSizing: 'border-box',
    textAlign: 'left',
    display: 'flex',
    cursor: 'pointer',
    alignItems: 'center'
  },
  icon: {
    marginRight: '16px',
    width: '24px',
    marginLeft: '6px',
    cursor: 'pointer'
  },
  inputStyle :
  {borderRadius: '2px', border: '1px solid #aaa',
    paddingLeft: '12px',  boxSizing: 'border-box'},
    whiteTextfield : {
      backgroundColor: 'rgb(255,255,255)',
      height: '40px',

    },
}

class Invite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {allow: true}
  }

  handleBack = () => {
    Router.back()
  }

  handleSave = () => {
    Router.back()
  }

  componentDidMount(props) {
    if (Router.query.organisation) {
      this.setState({link: SITE + 'invitation?organisation=' + Router.query.organisation})
      db.collection("Charity").doc(Router.query.organisation).get()
      .then((doc) => {
        var elem = doc.data()
        elem._id = doc.id
        this.setState({organisation: elem})
      })
    }


  }

  render() {
    console.log(this.state.link)
    return (
      <div>
        <App>
          <div style={{display: 'flex', flexWrap: 'wrap' ,justifyContent: 'center'
            ,textAlign: 'left',backgroundColor: '#F5F5F5', paddingBottom: 200}}>
            <div style={{width: 500, maxWidth: '100vw', boxSizing: 'border-box'
              ,backgroundColor: 'white', padding: 20, marginTop: 20}}>
              {
                this.state.organisation ?
                <div>
                  <h2>Customise your signup form</h2>
                  <div style={{borderRadius: 2, border: '1px solid #DBDBDB', maxWidth: 400}}>
                    <CustomInvite demo={true} organisation={this.state.organisation}/>
                  </div>
                </div>
                :
                null
              }
            </div>

              <div style={{ maxWidth: 600, width: '100%', padding: 20, backgroundColor: 'white',
                 boxSizing: 'border-box', marginTop: 20}}>
                <h2 style={{width: '100%'}}>Send invites to your volunteers</h2>
                <p style={{fontWeight: 'lighter', maxWidth: 500}}>
                  Once your volunteers are signed up, they will be able to look
                  through all your projects and choose what they would most like to do.
                </p>

                <div style={{display: 'flex', alignItems: 'center', marginBottom: 20,
                   maxWidth: 400}}>
                  <TextField value={this.state.link}
                    inputStyle={styles.inputStyle}
                    underlineShow={false}
                    fullWidth={true}
                    style={styles.whiteTextfield}
                    />
                  <div style={{width: 20}}/>
                    <CopyToClipboard
                      text={this.state.link}
                      onCopy={() => console.log('copy')}
                      >
                      <div style={{cursor: 'pointer'}}>
                        <FontIcon  className={'far fa-copy'}/>
                      </div>
                    </CopyToClipboard>
                </div>
                <div style={{maxWidth: 400}}>
                  <Share
                    buttonClicked={() => {}}
                    emailBody={this.state.link}
                    smsbody={this.state.link}
                    url={this.state.link}/>
                    <li style={styles.line} >
                      <div style={{width: 40, paddingLeft: 6}}>
                        <Checkbox
                          checked={this.state.allow}
                          onCheck={() => this.setState({allow: !this.state.allow})}
                          />
                      </div>
                      Allow us to send invites
                    </li>
                </div>
                <div style={{height: 50}}/>
                <FlatButton secondary={true}
                  label='Back'
                  onClick={this.handleBack}/>

              <RaisedButton primary={true}
                  onClick={this.handleSave}
                  label='Save and send'/>

              </div>



          </div>
        </App>
      </div>
    )
  }
}

export default withMui(Invite)
