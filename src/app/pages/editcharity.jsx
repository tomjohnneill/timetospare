import React from 'react';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import {Tabs, Tab} from 'material-ui/Tabs';
import Dropzone from 'react-dropzone';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import Link from "next/link"
import Router from 'next/router'
import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import {grey500} from 'material-ui/styles/colors';
import {changeImageAddress} from '../components/desktopproject.jsx';
import Snackbar from 'material-ui/Snackbar';
import App from "../components/App"
import CircularProgress from 'material-ui/CircularProgress';
import fire from '../fire';
import CloudUpload from 'material-ui/svg-icons/file/cloud-upload';
import withMui from '../components/hocs/withMui';

let db = fire.firestore()

const styles = {
  selectedTab: {
    height: '60px',
    backgroundColor: 'white',
    color: '#000AB2',
    textTransform: 'none',
    fontSize: '16px',
    letterSpacing: '0.4px',
    lineHeight: '16px',
    paddingLeft: '20px',
    paddingRight: '20px',
    fontWeight: 600
  },
  tab: {
    height: '60px',
    backgroundColor: 'white',
    color: '#484848',
    textTransform: 'none',

    fontSize: '16px',
    letterSpacing: '0.4px',
    lineHeight: '16px',
    paddingLeft: '20px',
    paddingRight: '20px',

  },
  textfield: {
    height: '40px',
    fontsize: '20px',
    boxSizing: 'border-box'
  },
  whiteTextfield : {
    backgroundColor: 'rgb(255,255,255)',
    height: '40px',

  },
  unfilledTextField: {
    backgroundColor: 'rgba(101, 161, 231, 0.15)',
    height: '40px',
    borderRadius: 6
  },
  header : {
    margin: '0px',
    padding: '6px',
    fontWeight: 700
  },
  title : {
    fontWeight: 700, marginBottom: 6, marginTop: 16, display: 'flex', paddingLeft: 12
  }
}


export class CharityPhotoUpload extends React.Component {
  constructor(props) {
    super(props)
    this.state = {uploading: false}
  }

  handleDropzoneEnter = () => {
    this.setState({dropzoneHover: true})
  }

  handleDropzoneLeave = () => {
    this.setState({dropzoneHover: false})
  }

  upload(file, rej) {
    console.log(this.state)
    console.log(file)
    console.log(rej)
    this.setState({uploading: true, uploadComplete: false})
    fetch('https://3ymyhum5sh.execute-api.eu-west-2.amazonaws.com/prod/getS3Url')
      .then(response => response.json())
      .then(function(data) {
        var stripped = data.substring(data.indexOf('amazonaws.com/') + 14, data.indexOf('?'))
        var imageUrl = 'https://d3kkowhate9mma.cloudfront.net/' + stripped


        console.log(changeImageAddress(imageUrl, '250xauto'))
        this.setState({imageUrl: imageUrl})
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                console.log(xhr.responseText);
                var body = {
                  'Featured Image': imageUrl
                }
                if (this.props.charityId) {
                  db.collection("Charity").doc(this.props.charityId).update(body)
                }
                this.props.changeImage(imageUrl)
                this.setState({uploadComplete: true, uploading: false})
            }
        }.bind(this)

        xhr.open('PUT', data , true);
        xhr.setRequestHeader('Content-Type', file[0].type);
        xhr.send(file[0]);
      }.bind(this))

      .catch(error => this.setState({ error }));

  }

  render() {
    console.log(this.props)


    return (
      <div>
        <Dropzone key={'photos'} onDrop={this.upload.bind(this)}  style={{}}>
              {({ isDragActive, isDragReject }) => {
                let styles = {
                  width: 'auto',
                  height: 200,
                  textAlign: 'center',
                  justifyContent: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #aaa',
                  backgroundColor: 'white',
                  borderRadius: 2,
                  color: grey500,
                  padding: 16,
                  boxSizing: 'border-box',
                  width: 250,
                  marginBottom: 16

                }

                const acceptedStyles = {
                  ...styles,
                  borderStyle: 'solid',
                  borderColor: '#6c6',
                  backgroundColor: '#eee'
                }

                const rejectStyles = {
                  ...styles,
                  borderStyle: 'solid',
                  borderColor: '#c66',
                  backgroundColor: '#eee'
                }

                if (isDragActive) {
                  return (
                    <div style={acceptedStyles}>
                      File will be accepted
                    </div>
                  )
                }
                if (isDragReject) {
                  return (
                    <div style={rejectStyles}>
                      File will be rejected
                    </div>
                  )
                }
                // Default case
                return (
                  <div style={styles}>
                  {this.state.uploading ?
                  <div style={{height: '70vh', width: '100%', display: 'flex',
                    alignItems: 'center', justifyContent: 'center'}}>
                    <CircularProgress size={80} thickness={5} />
                  </div>
                  :
                    !this.state.uploadComplete && this.props.imageUrl ?
                    <div style={{position: 'relative', height: '100%', width: '100%'}}>
                      <img src={this.props.imageUrl}
                      style={{padding: 16, boxSizing: 'border-box', position: 'relative', width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px'}}/>
                    {this.state.dropzoneHover ?
                      <RaisedButton label='Change Photo'
                        style={{padding: 0, position: 'absolute', top: 'calc(50% - 20px)', right: 'calc(50% - 98px)', height: 40, zIndex: 10}}
                        icon={<CloudUpload />}
                        labelStyle={{textTransform: 'none', fontFamily: 'Permanent Marker', fontSize: '20px'}}
                        primary={true}
                        />
                      :
                      null}

                    </div>
                    :
                    this.state.uploadComplete  ?
                    <div style={{position: 'relative', height: '100%', width: '100%'}}>
                      <img src={this.state.imageUrl}
                style={{padding: 16, boxSizing: 'border-box', position: 'relative', width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px'}}/>
                {this.state.dropzoneHover ?
                  <RaisedButton label='Change Photo'
                    style={{padding: 0, position: 'absolute', top: 'calc(50% - 20px)', right: 'calc(50% - 98px)', height: 40, zIndex: 10}}
                    icon={<CloudUpload />}
                    labelStyle={{textTransform: 'none', fontFamily: 'Permanent Marker', fontSize: '20px'}}
                    primary={true}
                    />
                  :
                  null}
                    </div>
                    :
                    <div>
                      <RaisedButton label='Upload Logo'
                        icon={<CloudUpload />}
                        labelStyle={{textTransform: 'none', fontWeight: 700}}
                        primary={true}
                        />
                      <div style={{marginTop: '20px', fontWeight: 700}}>or drag one in</div>
                    </div>
                }



                </div>
              )

            }}
            </Dropzone>
      </div>
    )
  }
}

class EditCharity extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: true, details: {}}
  }

  changeCharityInfo (id, e, nv) {
    console.log(id)
    console.log(nv)
    console.log(e)
    var charity = this.state.charity
    charity[id] = nv

    this.setState({charity: charity})
  }

  componentDidMount(props) {
    db.collection("Charity").doc(this.props.params.charityId).get().then((doc) => {
      var data = doc.data()
      this.setState({charity: data, loading: false, snackbar: false})
    })
  }

  handleTwoTabClick = (value) => {
    this.setState({selected: value})
  }

  changeAnchorEl = (e) => {
    console.log('handleMultipleChoiceClick')
    e.preventDefault()
    console.log(e)
    var rect = e.target.getBoundingClientRect()
    console.log(rect)
    this.setState({inkBarLeft: (rect.width-100)/2  + rect.x - (window.document.body.clientWidth - 1000) /2,
    })
  }

  handleRequestClose = () => {
    this.setState({snackbar: false})
  }

  updateCheck(type) {
    var privacy = this.state.user.privacy
    var user = this.state.user
    privacy[type] = !privacy[type]
    user.privacy = privacy
    this.setState({user : user})
  }

  changeImage = (imageUrl) => {
    var charity = this.state.charity
    charity['Featured Image'] = imageUrl
    this.setState({charity: charity})
  }

  handleSaveChanges = () => {
    var body = this.state.charity
    db.collection("Charity").doc(this.props.params.charityId).update(
      body)
    .then(data => {this.setState({snackbar: true})})
    .catch(error => {console.log('Error', error)})
  }

  render() {
    return (
      <App>
        <Snackbar
          open={this.state.snackbar}
          message="Profile Updated"
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose}
        />
        {this.state.loading ?
          null
          :
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 30}}>
            <div style={{width: '100%', maxWidth: '1000px', position: 'relative',
              backgroundColor: 'white'}}>
              <h2 style={{textAlign: 'left', position: 'relative'}}>Charity Profile</h2>
              <div style={{position: 'absolute', right: 0, top:20}}>
                <RaisedButton
                  label='Back to Profile'
                  labelStyle={{fontWeight: 700, textTransform: 'none'}}
                  secondary={true} onClick={() => Router.push(window.location.pathname.replace('/edit', ''))}/>
              </div>
              <Tabs
                  tabItemContainerStyle={{height: '60px', backgroundColor: 'white', borderBottom: '1px solid #DDDDDD'}}
                  value={this.props.params.tab}
                  onChange={this.handleTwoTabClick}
                  inkBarStyle={{zIndex: 2, backgroundColor: '#000AB2',
                  left:this.state.inkBarLeft, width: '100px'}}
                >
                  <Tab label="Public Profile"
                    style={{width: 'auto', fontSize: '16px'}}
                      onTouchTap={this.changeAnchorEl}
                        buttonStyle={this.state.selected === 'projects' ? styles.selectedTab : styles.tab}
                     value="projects">
                    <div style={{width: '50%', minWidth: '300px', padding: 16}}>
                      <span style={styles.title}>Picture</span>

                      <div style={{display: 'flex', alignItems: 'center', padding: 6}}>
                        <div style={{width: '100%'}}>
                        {this.state.charity['Featured Image']?
                        <img style={{height: '200px', width: 'auto', objectFit: 'cover', borderRadius: '4px'}}
                          src={this.state.charity ? this.state.charity['Featured Image'] : null}/>
                        :
                        !this.state.publicProfile ?
                        <CharityPhotoUpload changeImage={this.changeImage} charityId={this.props.params.charityId}/>
                        :
                        <div style={{height: '200px', width: '200px', backgroundColor: '#DDDDDD'}}/>
                        }
                        </div>

                      </div>

                      <div style={{padding: '6px'}}>
                        <p style={styles.header}>
                        Display Name
                        </p>
                        <TextField fullWidth={true}
                          inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                            paddingLeft: '12px',  boxSizing: 'border-box'}}
                          underlineShow={false}
                          value={this.state.charity.Name}
                          hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                          key='name'
                          onChange={this.changeCharityInfo.bind(this, 'Name')}
                          style={this.state.details.name ? styles.whiteTextfield : styles.unfilledTextField}/>
                      </div>


                      <div style={{display: 'flex'}}>
                        <div style={{flex: '2', padding: '6px'}}>
                          <p style={styles.header}>
                          Contact
                        </p>
                            <TextField fullWidth={true}
                              inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                                paddingLeft: '12px',  boxSizing: 'border-box'}}
                              underlineShow={false}
                              onChange={this.changeCharityInfo.bind(this, 'Phone')}
                              defaultValue={this.state.charity.Phone}
                              hintText={'Phone'}
                              hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                              key='location3'
                              style={this.state.details.phone ? styles.whiteTextfield : styles.unfilledTextField}/>

                            <TextField fullWidth={true}
                              inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                                paddingLeft: '12px',  boxSizing: 'border-box'}}
                              underlineShow={false}
                              onChange={this.changeCharityInfo.bind(this, 'Address')}
                              defaultValue={this.state.charity.Address}
                              hintText={'Address'}
                              hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                              key='location3'
                              style={this.state.address ? styles.whiteTextfield : styles.unfilledTextField}/>

                            <TextField fullWidth={true}
                              inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                                paddingLeft: '12px',  boxSizing: 'border-box'}}
                              underlineShow={false}
                              onChange={this.changeCharityInfo.bind(this, 'Postcode')}
                              defaultValue={this.state.charity.Postcode}
                              hintText={'Postcode'}
                              hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                              key='location3'
                              style={this.state.postcode ? styles.whiteTextfield : styles.unfilledTextField}/>


                        </div>

                        <div style={{flex: 1, padding: '6px'}}>
                          <p style={styles.header}>
                          Charity Number
                          </p>
                          <TextField fullWidth={true}
                            inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                              paddingLeft: '12px',  boxSizing: 'border-box'}}
                            underlineShow={false}
                            defaultValue={this.state.charity['Charity Number']}
                            onChange={this.changeCharityInfo.bind(this, 'Charity Number')}
                            hintText={'Charity Number'}
                            hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                            key='location3'
                            style={styles.whiteTextfield}/>
                        </div>
                      </div>

                      <div style={{padding: '6px'}}>
                        <p style={styles.header}>
                        Description
                        </p>
                        <TextField fullWidth={true}
                          inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                            paddingLeft: '12px',  boxSizing: 'border-box'}}
                          underlineShow={false}
                          defaultValue={this.state.charity.Description}
                          hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                          onChange={this.changeCharityInfo.bind(this, 'Description')}
                          key='activities'
                          rows={3}
                          multiLine={true}
                          style={this.state.activities ? styles.whiteTextfield : styles.unfilledTextField}/>
                      </div>

                      <div style={{display: 'flex'}}>
                        <div style={{flex: 1, padding: '6px'}}>
                          <p style={styles.header}>
                          Email
                        </p>
                        <TextField fullWidth={true}
                          inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                            paddingLeft: '12px',  boxSizing: 'border-box'}}
                          underlineShow={false}
                          hintText={'Email'}
                          onChange={this.changeCharityInfo.bind(this, 'Email')}
                          defaultValue={this.state.charity.Email}
                          hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                          key='location2'
                          style={this.state.email ? styles.whiteTextfield : styles.unfilledTextField}/>
                        <p style={styles.header}>
                          Facebook
                        </p>
                        <TextField fullWidth={true}
                          inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                            paddingLeft: '12px',  boxSizing: 'border-box'}}
                          underlineShow={false}
                          hintText={'Facebook'}
                          defaultValue={this.state.charity.Facebook}
                          onChange={this.changeCharityInfo.bind(this, 'Facebook')}
                          hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                          key='location2'
                          style={styles.whiteTextfield}/>
                        <p style={styles.header}>
                          Instagram
                        </p>
                        <TextField fullWidth={true}
                          inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                            paddingLeft: '12px',  boxSizing: 'border-box'}}
                          underlineShow={false}
                          hintText={'@Username'}
                          defaultValue={this.state.charity.Instagram}
                          onChange={this.changeCharityInfo.bind(this, 'Instagram')}
                          hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                          key='location2'
                          style={styles.whiteTextfield}/>
                        </div>
                        <div style={{flex: 1, padding: '6px', marginBottom: 60}}>
                          <p style={styles.header}>
                            Website
                          </p>
                        <TextField fullWidth={true}
                          inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                            paddingLeft: '12px',  boxSizing: 'border-box'}}
                          underlineShow={false}
                          onChange={this.changeCharityInfo.bind(this, 'Website')}
                          defaultValue={this.state.charity.Website}
                          hintText={'Website'}
                          hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                          key='location3'
                          style={styles.whiteTextfield}/>
                        <p style={styles.header}>
                          Twitter
                        </p>
                        <TextField fullWidth={true}
                          inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                            paddingLeft: '12px',  boxSizing: 'border-box'}}
                          underlineShow={false}
                          hintText={'@Username'}
                          onChange={this.changeCharityInfo.bind(this, 'Twitter')}
                          defaultValue={this.state.charity.Twitter}
                          hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                          key='location2'
                          style={styles.whiteTextfield}/>
                        </div>
                      </div>
                      <div style={{height: 50}}/>

                      <RaisedButton style={{marginBottom: 30}} label='Save Changes'
                        labelStyle={{fontWeight: 700, textTransform: 'none'}}
                        primary={true}
                        onClick={this.handleSaveChanges}
                        />
                    </div>
                  </Tab>


                </Tabs>
            </div>
          </div>
        }
      </App>
    )
  }
}

export default withMui(EditCharity)
