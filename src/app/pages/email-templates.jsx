import React from 'react';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import Router from 'next/router'
import fire from '../fire';
import App from "../components/App"
import withMui from '../components/hocs/withMui';

let db = fire.firestore()


class EmailTemplateFrontPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: true}
  }

  componentDidMount(props) {
    db.collection("emailTemplates").get().then((querySnapshot) => {
      var data = []
      querySnapshot.forEach((doc) => {

        var elem = doc.data()
        elem['_id'] = doc.id
        data.push(elem)
      });
      this.setState({emailTemplates: data, loading: false})
    })
  }

  handleGo = (id) => {
    Router.push(`email-template?id=${id}`)
  }

  handleNew = () => {
    db.collection("emailTemplates").add({
      html : '<html></html>'
    }).then((docRef) => {
      Router.push(`email-template?id=${docRef.id}`)
    })
  }

  render() {
    return (
      <App>
      <div style={{display: 'flex', padding: 24}}>
        <div style={{flex: 1}} >
          <p className='desktop-header'>Existing templates
            </p>
          {
            this.state.emailTemplates ?
              <Menu>
                {this.state.emailTemplates.map((template) => (
                  <MenuItem primaryText={template.name}
                      onClick={() => this.handleGo(template._id)}
                      />
                ))}
              </Menu>
              :
              null
          }
          <RaisedButton label='Start a new template'
            onClick={this.handleNew} primary={true}
            />
        </div>
        <div style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>

        </div>
      </div>
      </App>
    )
  }
}

export default withMui(EmailTemplateFrontPage)
