import React from 'react';
import DocumentTitle from 'react-document-title';
import MediaQuery from 'react-responsive';
import {changeImageAddress} from '../desktopproject.jsx';
import {CleanTick, Cross} from '../icons.jsx';
import {grey200} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import fire from '../../fire';

let db = fire.firestore()

export default class GroupSignUp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount(props) {
    db.collection("Group").doc(this.props.groupId).get().then((doc) => {
      var data = doc.data()
      this.setState({group: data})
    })

    db.collection("Group").doc(this.props.groupId).collection("Projects")
    .doc(this.props.projectId).get().then((doc) => {
      var data = doc.data()
      this.setState({signups: data})
    })
  }

  handleCross = () => {
    db.collection("Group").doc(this.props.groupId).collection("Projects")
    .doc(this.props.projectId).set({
      [fire.auth().currentUser.uid] : false
    })
    this.setState({signups: {[fire.auth().currentUser.uid] : false}})
  }

  handleTick = () => {
    db.collection("Group").doc(this.props.groupId).collection("Projects")
    .doc(this.props.projectId).set({
      [fire.auth().currentUser.uid] : true
    })
    this.setState({signups: {[fire.auth().currentUser.uid] : true}})
  }

  render() {

    console.log(this.state.signups)

    return (
      <div>
        {this.state.group ?
          <div>
            <MediaQuery minDeviceWidth={700}>
              <div style={{borderRadius: '50%', overflow: 'hidden', width: 300, height: 300,
              backgroundColor: 'white'}}>

                <div style={{display: 'flex', height: '50%', flexDirection: 'column',
                  boxSizing: 'border-box',
                  justifyContent: 'center', alignItems: 'center', paddingTop: 15}}>
                  Would you go if 3 <br/>of your friends did?
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'
                  ,paddingTop: 6}}>
                    <div style={{fontWeight: 'lighter', paddingLeft: 10, paddingRight: 10}}>
                      <IconButton iconStyle={{height: 40}}
                        onClick={this.handleCross}
                        style={{padding: 0}}>
                        <Cross color={
                            !fire.auth().currentUser ? 'rgb(182,48,43)' :
                            this.state.signups && this.state.signups[fire.auth().currentUser.uid] === false ?
                            'rgb(182,48,43)' : grey200
                          } style={{height: 40}}/>
                      </IconButton>
                      <div style={{width: '100%'}}>
                        No
                      </div>
                    </div>
                    <div style={{fontWeight: 'lighter', paddingLeft: 10, paddingRight: 10}}>
                      <IconButton iconStyle={{height: 40}}
                        onClick={this.handleTick}
                        style={{padding: 0}}>
                        <CleanTick color={
                          !fire.auth().currentUser ? '#3B9E74' :
                          this.state.signups && this.state.signups[fire.auth().currentUser.uid] === true ?
                          '#3B9E74' : grey200} style={{height: 40}}/>
                      </IconButton>
                      <div style={{width: '100%'}}>
                        Yes
                      </div>
                    </div>
                  </div>
                </div>
                <img src={changeImageAddress(this.state.group['Featured Image'],'500xauto')}
                  style={{position: 'relative',height: '50%', width: '100%', objectFit: 'cover'}}/>
                <div style={{position: 'absolute', top: 150, width: '100%',
                  fontSize: '20px', zIndex: 4, color: 'white',
                  paddingTop: 10, paddingBottom: 10,
                  background: 'radial-gradient(ellipse closest-side, rgba(0,0,0,0.75), rgba(0,0,0,0))'
                }}>
                  <b style={{letterSpacing: '0.4px'}}>{this.state.group.Name}</b>
                </div>
              </div>
            </MediaQuery>

          </div>
        :
        null}
      </div>
    )
  }
}
