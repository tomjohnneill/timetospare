import React from 'react';
import TextField from 'material-ui/TextField';
import {grey200, grey500, grey100, amber500} from 'material-ui/styles/colors'
import RaisedButton from 'material-ui/RaisedButton';
import Link from "next/link"
import Router from 'next/router'
import Dropzone from 'react-dropzone';
import CircularProgress from 'material-ui/CircularProgress';
import MediaQuery from 'react-responsive';
import {Cross} from './icons.jsx'
import IconButton from 'material-ui/IconButton'
import CloudUpload from 'material-ui/svg-icons/file/cloud-upload';

const styles = {
  textfield: {
    height: '40px',
    fontsize: '20px'
  },
  header : {
    margin: '0px',
    padding: '6px',
    fontWeight: 500
  }
}

export function changeImageAddress(file, size) {
  var str = file, replacement = '/' + size + '/';
  str = str.replace(/\/([^\/]*)$/,replacement+'$1');
  return(str + '?pass=this')
}

export default class UploadPhoto extends React.Component{
  constructor(props) {
    super(props);
    this.state = {uploadComplete: false, uploading: false, dropzoneHover: false}
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
        localStorage.setItem('coverPhoto', imageUrl)
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                console.log(xhr.responseText);
                if (this.props.changeParentState) {
                  this.props.changeParentState()
                }
                this.setState({uploadComplete: true, uploading: false})
            }
        }.bind(this)

        xhr.open('PUT', data , true);
        xhr.setRequestHeader('Content-Type', file[0].type);
        xhr.send(file[0]);

      }.bind(this))
      .catch(error => this.setState({ error }));

  }

  handleRemovePicture = () => {
    this.setState({imageUrl: null})
    localStorage.removeItem('coverPhot')
  }

  handleDropzoneEnter = () => {
    this.setState({dropzoneHover: true})
  }

  handleDropzoneLeave = () => {
    this.setState({dropzoneHover: false})
  }

  render() {
    console.log(this.state)
    console.log(this.props)
    var imageUrl
     if(this.state.imageUrl) {
       imageUrl = this.state.imageUrl
     } else if (this.props.imageUrl) {
       imageUrl = this.props.imageUrl
     } else if (localStorage.getItem('coverPhoto') === 'undefined') {
       imageUrl = null
     } else {
       imageUrl = localStorage.getItem('coverPhoto')
     }
     console.log(imageUrl)

    return (
      <div>
        <MediaQuery minDeviceWidth={700}>
          <div style={{boxSizing: 'border-box', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{width: this.props.width ? this.props.width : '500px', display: 'flex'
              , justifyContent: 'center'}} className='basics-container'>
              <div className='form' style={{textAlign: 'left', width: '100%'}}>
                {!this.props.edit ?
                <p className='desktop-header'>
                  Upload a cover photo</p>
                : null }
                <div style={{width: '100%', paddingBottom: this.props.edit ? 0 : '40px',
                  paddingRight: this.props.edit ? 0 :'50px', boxSizing: 'border-box'}}>
                  <Dropzone key={'photos'} onDrop={this.upload.bind(this)}
                    onMouseEnter={this.handleDropzoneEnter}
                    onMouseLeave={this.handleDropzoneLeave}
                     style={{}}>
                        {({ isDragActive, isDragReject }) => {
                          let styles = {
                            width: this.props.width ? this.props.width : '40vw',
                            height: this.props.height ? this.props.height : '40vh',
                            textAlign: 'center',
                            justifyContent: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: 'white',
                            border: '1px solid #aaa',
                            borderRadius: 6,
                            color: grey500,
                            flexDirection: 'column'

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
                                (localStorage.getItem('coverPhoto') && !this.state.uploadComplete) || this.props.imageUrl ?
                                <div style={{position: 'relative', height: '100%', width: '100%'}}>
                                  <img src={imageUrl}
                                  style={{padding: 16, boxSizing: 'border-box', position: 'relative', width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px'}}/>
                                {this.state.dropzoneHover ?
                                  <RaisedButton label='Change Photo'
                                    style={{padding: 0, position: 'absolute', top: 'calc(50% - 20px)', right: 'calc(50% - 98px)', height: 40, zIndex: 10}}
                                    icon={<CloudUpload />}
                                    labelStyle={{textTransform: 'none', fontWeight: 700, fontSize: '18px'}}
                                    primary={true}
                                    />
                                  :
                                  null}

                                </div>
                                :
                                this.state.uploadComplete  ?
                                <div style={{position: 'relative', height: '100%', width: '100%'}}>
                                  <img src={imageUrl}
                            style={{padding: 16, boxSizing: 'border-box', position: 'relative', width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px'}}/>
                            {this.state.dropzoneHover ?
                              <RaisedButton label='Change Photo'
                                style={{padding: 0, position: 'absolute', top: 'calc(50% - 20px)', right: 'calc(50% - 98px)', height: 40, zIndex: 10}}
                                icon={<CloudUpload />}
                                labelStyle={{textTransform: 'none', fontWeight: 700, fontSize: '18px'}}
                                primary={true}
                                />
                              :
                              null}
                                </div>
                                :
                                <div>
                                  <RaisedButton label='Upload Photo'
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

              </div>
            </div>
            <div style={{flex: 1, paddingLeft: '50px', boxSizing: 'border-box'}} className='basics-image'>


            </div>
          </div>
        </MediaQuery>
        <MediaQuery maxDeviceWidth={700}>
          <div style={{boxSizing: 'border-box', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div style={{width: '100%', display: 'flex'
              , justifyContent: 'center'}} className='basics-container'>
              <div className='form' style={{textAlign: 'left', width: '100%'}}>
                {!this.props.edit ?
                <p className='desktop-header'>
                  Upload a cover photo</p>
                : null }
                <div style={{width: '100%', paddingBottom: 24, boxSizing: 'border-box'}}>
                  <Dropzone key={'photos'} onDrop={this.upload.bind(this)}
                    onMouseEnter={this.handleDropzoneEnter}
                    onMouseLeave={this.handleDropzoneLeave}
                     style={{}}>
                        {({ isDragActive, isDragReject }) => {
                          let styles = {
                            width: this.props.width ? this.props.width : '40vw',
                            height: this.props.height ? this.props.height : '40vh',
                            textAlign: 'center',
                            justifyContent: 'center',
                            boxSizing: 'border-box',
                            display: 'flex',
                            alignItems: 'center',
                            border: '2px dashed rgb(133, 137, 135)',
                            borderRadius: 6,
                            color: grey500,
                            flexDirection: 'column'

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
                                localStorage.getItem('coverPhoto') && !this.state.uploadComplete ?
                                <div style={{position: 'relative', height: '100%', width: '100%'}}>
                                  <img src={imageUrl}
                                  style={{padding: 16, boxSizing: 'border-box', position: 'relative', width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px'}}/>
                                {this.state.dropzoneHover ?
                                  <RaisedButton label='Change Photo'
                                    style={{padding: 0, position: 'absolute', top: 'calc(50% - 20px)', right: 'calc(50% - 98px)', height: 36, zIndex: 10}}
                                    icon={<CloudUpload />}
                                    primary={true} overlayStyle={{height: '36px'}}
                                    buttonStyle={{height: '36px'}}
                                     labelStyle={{height: '36px', display: 'flex', alignItems: 'center',
                                          letterSpacing: '0.6px', fontWeight: 'bold'}}
                                    />
                                  :
                                  null}

                                </div>
                                :
                                this.state.uploadComplete  ?
                                <div style={{position: 'relative', height: '100%', width: '100%'}}>
                                  <img src={imageUrl}
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
                                  <RaisedButton label='Upload Photo'
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

              </div>
            </div>
          </div>
        </MediaQuery>
      </div>
    )
  }
}
