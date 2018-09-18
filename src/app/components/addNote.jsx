import React from 'react'
import 'react-quill/dist/quill.snow.css';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {buttonStyles} from './styles.jsx';

const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image'],
      ['clean']
    ]
  }

export default class AddNote extends React.Component {
  constructor(props) {
    super(props);
    this.state = {note: ''}
    if (typeof window !== 'undefined') {
        this.ReactQuill = require('react-quill')
      }
  }

  handleNoteChange = (value) => {
    this.setState({note: value})
  }

  render() {
    const ReactQuill = this.ReactQuill
    return (
      <div style={{padding: 10, marginBottom: 10, borderLeft: '3px solid rgb(253,216,53)', backgroundColor: 'rgb(255,249,196)'}}>
        <h2 style={{margin:0, marginBottom: 6}}>Type your note</h2>
        <ReactQuill
          style={{fontFamily: 'Nunito', backgroundColor: 'white'}}
          modules={modules}
          toolbar={{fontName: 'Nunito'}}
          onChange={this.handleNoteChange}
          value={this.state.note}

             />
           <div style={{display: 'flex', justifyContent: 'space-between', paddingTop: 10}}>
             <div style={{flex: 1}}/>
             <div style={{display: 'flex'}}>
               <FlatButton
                 style={buttonStyles.smallSize}
                 labelStyle={buttonStyles.smallLabel}
                 label='Cancel'
                 onClick={() => this.props.handleCancelNote()}
                 />
               <div style={{width: 20}}/>
               <RaisedButton
                 style={buttonStyles.smallSize}
                 labelStyle={buttonStyles.smallLabel}
                 label='Save'
                 onClick={() => this.props.handleSaveNote(this.state.note)}
                 primary={true}/>
             </div>
          </div>
       </div>
    )
  }
}
