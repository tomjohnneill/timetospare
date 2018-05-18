import React , {PropTypes} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Snackbar from 'material-ui/Snackbar';

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
    marginLeft: '6px'
  }
}

export default class Share extends React.Component{
  constructor(props) {
    super(props);
    this.state = {mobile: false, copied: false}
  }

  loadFbLoginApi() {

   window.fbAsyncInit = function() {
       window.FB.init({
           appId      : '535993046799422',
           cookie     : true,  // enable cookies to allow the server to access
           // the session
           xfbml      : true,  // parse social plugins on this page
           version    : 'v2.1' // use version 2.1
       });
   };

   console.log("Loading fb api");
     // Load the SDK asynchronously
   (function(d, s, id) {
       var js, fjs = d.getElementsByTagName(s)[0];
       if (d.getElementById(id)) return;
       js = d.createElement(s); js.id = id;
       js.src = "//connect.facebook.net/en_US/sdk.js";
       fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
}

  componentDidMount(props) {
    this.loadFbLoginApi()
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf("mobi") > -1) {
      this.setState({mobile:true})
    }


  }

  handleFacebook = () => {
        this.props.buttonClicked('facebook')
    window.FB.ui({
      method: 'send',
      link: this.props.url,
    });
  }

  handleEmail = () => {
    this.props.buttonClicked('email')
    window.location.href = `mailto:?subject=${this.props.Name}&body=` + this.props.emailbody
  }

  handleSMS = () => {
    this.props.buttonClicked('sms')
    var ua = navigator.userAgent.toLowerCase();
    var url;

    if (ua.indexOf("iphone") > -1 || ua.indexOf("ipad") > -1)
        url = "sms:;body=" + this.props.smsbody;
    else
        url = "sms:?body=" + this.props.smsbody;

    console.log (url);
    window.location.href = url

  }

  handleWhatsapp = () => {
    this.props.buttonClicked('whatsapp')
    window.location.href = 'whatsapp://send?text=' + this.props.smsbody
  }

  render() {
    return(
      <div>
        <Snackbar
          open={this.state.copied}
          message="Link added to your clipboard"
          autoHideDuration={2000}
        />
        {this.state.mobile ?
          <div>
            <ul style={{margin: 0}}>

              <li style={styles.line} onTouchTap={this.handleEmail}>
                <FontIcon style={styles.icon} className={"far fa-envelope"}/>
                Send an email
              </li>
              <li style={styles.line} onTouchTap={this.handleWhatsapp}>
                <FontIcon style={styles.icon} color={'#25d366'} className={'fab fa-whatsapp'}/>
                Send a message via Whatsapp
              </li>
              <li style={styles.line} onTouchTap={this.handleSMS}>
                <FontIcon style={styles.icon} className={'far fa-comment'}/>
                Send an SMS
              </li>
              <CopyToClipboard onCopy={() => {this.setState({copied: true});
                this.props.buttonClicked('link')
              }}
                text={this.props.url}
                >
                <li style={styles.line} >
                  <FontIcon style={styles.icon} className={'far fa-copy'}/>
                  <span>Copy link</span>
                </li>
              </CopyToClipboard>

            </ul>
            <hr style={{margin: 0, border: 'none',borderBottom: '1px solid #dbd9db'}}/>
          </div>
          :
          <div>
            <ul style={{margin: 0, cursor: 'pointer'}}>
              <li style={styles.line} onTouchTap={this.handleEmail}>
                <FontIcon style={styles.icon} className={"far fa-envelope"}/>
                Send an email
              </li>
              <li style={styles.line} onTouchTap={this.handleFacebook}>
                <FontIcon color={'#0084ff'} style={styles.icon} className={'fab fa-facebook-messenger'}/>
                Send a Facebook Message
              </li>
              <CopyToClipboard onCopy={() => {this.setState({copied: true});
                this.props.buttonClicked('link')
              }}
                text={this.props.url}
                >
                <li style={styles.line} >
                  <FontIcon style={styles.icon} className={'far fa-copy'}/>
                  <span>Copy link</span>
                </li>
              </CopyToClipboard>


            </ul>
            <hr style={{margin: 0, border: 'none',borderBottom: '1px solid #dbd9db'}}/>
          </div>
        }
      </div>
    )
  }
}
