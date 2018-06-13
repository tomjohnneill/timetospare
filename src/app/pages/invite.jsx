import React from 'react';
import App from '../components/App';
import Router from 'next/router';
import CustomInvite from '../components/custom-invite.jsx';
import fire from '../fire';
import TextField from 'material-ui/TextField';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Share from '../components/share.jsx';

let db = fire.firestore()

var SITE = `https://whosin-next.firebaseapp.com/`

const styles = {
  line: {
    padding: "0.625em 0",
    borderTop: "1px solid #dbd9db",
    boxSizing: 'border-box',
    textAlign: 'left',
    display: 'flex',
    cursor: 'pointer'
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

export default class Invite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
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
      <div style={{paddingTop: 20}}>
        <App>
          <div style={{display: 'flex', flexWrap: 'wrap' ,justifyContent: 'center'
            ,textAlign: 'left',}}>
              <div style={{ maxWidth: 700, width: '100%', padding: 20, boxSizing: 'border-box'}}>
                <h2 style={{width: '100%'}}>Send invites to your volunteers</h2>
                <p style={{fontWeight: 'lighter'}}>
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
                </div>

              </div>
              <div style={{width: 100}}/>
              <div style={{width: 500, maxWidth: '100vw', boxSizing: 'border-box', padding: 20}}>
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

          </div>
        </App>
      </div>
    )
  }
}
