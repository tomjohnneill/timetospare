import React from 'react';
// import 'cropperjs/dist/cropper.css';
import Cropper from 'react-cropper';
import Link from "next/link"
import Router from 'next/router'
import RaisedButton from 'material-ui/RaisedButton';
import App from "../components/App"
import fire from '../fire';

let db = fire.firestore()

export default class ImageCrop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  _crop(){
    // image in dataUrl
    console.log(this.refs.cropper.getData());
    this.setState({crop: this.refs.cropper.getData()})
  }

  handleSaveCrop = () => {
    console.log(this.refs.cropper.getImageData())
    var imageHeight = this.refs.cropper.getImageData().naturalHeight
    var absoluteY = this.refs.cropper.getData().y
    var cropHeight =  this.refs.cropper.getData().height
    var imageY = (absoluteY/ (imageHeight - cropHeight) * 100) + '%'
    console.log(imageY)
    db.collection("Project").doc(this.props.params._id).update({
      imageY: imageY
    })
    .then(() => {
      localStorage.removeItem('project-image');
      Router.back()})


  }

  render() {
    return (
      <App>
        <Cropper
                ref='cropper'
                src={localStorage.getItem('project-image')}
                style={{height: 500, width: '100%'}}
                // Cropper.js options
                aspectRatio={15 / 4}
                minWidth={100}
                viewMode={2}
                autoCropArea={1}
                scalable={false}
                zoomable={false}
                cropBoxResizable={false}
                guides={false}
                crop={this._crop.bind(this)} />
              <div style={{height: 40}}/>
              <RaisedButton label='Save crop' primary={true} onClick={this.handleSaveCrop}/>
              <div style={{height: 40}}/>
              <RaisedButton label='Cancel' secondary={true} onClick={() => {
                  localStorage.removeItem('project-image');
                  Router.back()}}/>
      </App>
    )
  }
}
