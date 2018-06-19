import React from 'react';
import EmailEditor from 'react-email-editor';
import Snackbar from 'material-ui/Snackbar';
import fire from '../fire';
import Link from "next/link"
import Router from 'next/router'
import TextField from 'material-ui/TextField';
import App from "../components/App"
import withMui from '../components/hocs/withMui';

let db = fire.firestore()

class EmailTemplateBuilder extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      autoHideDuration: 4000,
      message: 'Event added to your calendar',
      open: false,
      mergeTags: [],
      loading: true
    };
  }

  componentDidMount (props) {
    var dateObj = new Date(Date.now() + 86400000 /2)
    console.log(dateObj)
    if (Router.query.id) {
        db.collection("emailTemplates").doc(this.props.params.templateId).get().then((doc) => {
          console.log(doc.data())
        this.setState({loading: false, sample: doc.data().design ? JSON.parse(doc.data().design) : null,
          mergeTags: doc.data().mergeTags ? doc.data().mergeTags : []})
        console.log(this.state.sample)
      })
    } else {
      this.setState({loading: false})
    }
  }

    exportHtml = () => {
      this.setState({open: true})
      if (Router.query.id) {
        this.editor.exportHtml(data => {
          const { design, html } = data
          if (this.state.name) {
            db.collection("emailTemplates").doc(Router.query.id).update({
              html: html,
              design: JSON.stringify(design),
              name: this.state.name,
              mergeTags: this.state.mergeTags,
            }).then(() => this.setState({name: null}) )
          } else {
            db.collection("emailTemplates").doc(Router.query.id).update({
              html: html,
              design: JSON.stringify(design),
              mergeTags: this.state.mergeTags,
            })
            .then(() => this.setState({name: null}) )
          }



      })
      } else {
        this.editor.exportHtml(data => {
          const { design, html } = data
          db.collection("emailTemplates").add({
            html: html,
            design: JSON.stringify(design),
            mergeTags: this.state.mergeTags,
            name: this.state.name
          })
          .then(() => this.setState({name: null}) )
      })
      }


  }

      handleRequestClose = () => {
      this.setState({
        open: false,
      });
    };

    handleAddTag = (e, nv) => {
      this.setState({newTag: e.target.value})
    }

    handleKeyPress = (e) => {
      if (e.key === 'Enter') {
        var tags = this.state.mergeTags
        tags.push(this.state.newTag)
        this.setState({mergeTags: tags, newTag: null})
        e.target.value = null
      }
    }

    handleNameChange = (e, nv) => {
      this.setState({name: e.target.value})
    }

    onDesignLoad = (data) => {
      console.log('onDesignLoad', data)
    }

    onLoad = () => {
  // this.editor.addEventListener('onDesignLoad', this.onDesignLoad)
  this.editor.loadDesign(this.state.sample ? this.state.sample : null)
}

  render() {
    return(
      <App>
        <h1>react-email-editor Demo</h1>

        <div>
          <button onClick={this.exportHtml}>Export HTML</button>
        </div>
        <TextField onChange={this.handleNameChange} value={this.state.name} onKeyPress={this.handleNamePress}/>
        {this.state.loading ? null :
        <EmailEditor
          onLoad={this.onLoad}
          onDesignLoad={this.onDesignLoad}
          ref={editor => this.editor = editor}
        />
        }

      <div style={{display: 'flex', width: '1000px'}}>
        <div style={{flex: 1}}>
          {this.state.mergeTags.map((tag) => (
            <div>
              {`{{ ${tag} }}`}
            </div>
          ))}
        </div>
        <div style={{flex: 1}}>
          <h2>Merge tags:</h2>
          <TextField onChange={this.handleAddTag} onKeyPress={this.handleKeyPress}/>
        </div>
      </div>

        <Snackbar
          open={this.state.open}
          message={this.state.message}
          action="undo"
          autoHideDuration={this.state.autoHideDuration}
          onActionClick={this.handleActionClick}
          onRequestClose={this.handleRequestClose}
        />
    </App>
    )
  }
}

export default withMui(EmailTemplateBuilder)
