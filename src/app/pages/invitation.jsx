import React from 'react';
import {Plant, Spiral, Tick} from '../components/icons.jsx';
import {grey500} from 'material-ui/styles/colors'
import RaisedButton from 'material-ui/RaisedButton';
import App from '../components/App';
import TextField from 'material-ui/TextField';
import fire from '../fire';
import firebase from "firebase/app";
import 'firebase/auth';
let db = fire.firestore()
import {changeImageAddress} from '../components/desktopproject.jsx';
import Head from 'next/head'
import CustomInvite from '../components/custom-invite.jsx';
import withMui from '../components/hocs/withMui';

const styles = {
  number: {
    color: '#000AB2',
    fontSize: '20px',
  },
  bottomBit: {
    color: grey500,
    marginTop: '-5px',
    fontSize: '12px'
  },
  textfield: {
    height: '40px',
    fontsize: '20px'
  }
}


class Invitation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {type: this.props.type ? this.props.type : 'signup', loading: false, pwned: null,
      forgotPassword: false, sendPasswordClicked: false}
  }

  static async getInitialProps({req, pathname, query}) {
    const res =  await db.collection("Charity").doc(query.organisation).get()
    .then((doc) => {
          var project = doc.data()
          project._id = doc.id
          console.log(project)
          return({loading: false, organisation: project})
        })
    return res

  }

  render() {
    return (
      <App>
        <Head>
          <title>{this.props.organisation.Name + " wants you to join their team"}</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
            <meta property="og:title" content={this.props.organisation.Name + " wants you to join their team"}/>
            <meta property="twitter:title" content={this.props.organisation.Name + " wants you to join their team"}/>
            <meta property="og:type" content="article" />
            <meta property="og:description" content={this.props.organisation.Invite} />
            <meta property="og:image" content={this.props.organisation['Logo'] ? changeImageAddress(this.props.organisation['Logo'], '750xauto') : null} />
            <meta name="twitter:card" content="summary" />
        </Head>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center',
        paddingBottom: 200, paddingTop: 30, backgroundColor: '#F5F5F5'}}>
        <CustomInvite organisation={this.props.organisation}/>

        </div>
    </App>

    )
  }
}

export default withMui(Invitation)
