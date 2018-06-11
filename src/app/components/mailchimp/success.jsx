import React from 'react';
import fire from '../../fire';
import Checkbox from 'material-ui/Checkbox';

let db = fire.firestore()

export default class MailchimpSuccess extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: {},
      members : []
    }
  }

  updateCheck = (value, id) => {
    var checked = this.state.checked
    console.log(id)
    checked[id] = !checked[id]
    this.setState({checked:checked})
    fire.auth().currentUser.getIdToken()
    .then((token) =>
    fetch(`https://us-central1-whosin-next.cloudfunctions.net/mailchimp-getContacts?listId=${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    }))
    .then(response => response.json())
    .then(data => {console.log(data)
      var members = this.state.members
      data.members.forEach((member) => {
        members.push(member)
      })
      this.setState({members: members})
    }
    )
    .catch(error => console.log('Error', error))
  }

  componentDidMount(props) {
    console.log(fire.auth())
    fire.auth().onAuthStateChanged((user) => {
      if (user === null) {

      } else {
        this.setState({loading: true})
        db.collection("User").doc(fire.auth().currentUser.uid).update({
          mailchimp_access_token : this.props.access_token
        })
        .then(() => fire.auth().currentUser.getIdToken())
        .then((token) =>
        fetch('https://us-central1-whosin-next.cloudfunctions.net/mailchimp-getListOfLists', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        }))
        .then(response => response.json())
        .then(data => this.setState({loading: false, lists: data.lists}))
        .catch(error => console.log('Error', error))
      }
    })

    if (fire.auth().currentUser) {
      this.setState({loading: true})
      db.collection("User").doc(fire.auth().currentUser.uid).update({
        mailchimp_access_token : this.props.access_token
      })
      .then(() => fire.auth().currentUser.getToken())
      .then((token) =>
      fetch('https://us-central1-whosin-next.cloudfunctions.net/mailchimp-getListOfLists', {
        headers: {
          'Authorization': 'Bearer ' + token
        }
      }))
      .then(response => response.json())
      .then(data => {
        console.log(data)
        this.setState({lists: data.lists, loading: false})
      })
      .catch(error => console.log('Error', error))
    }
  }

  render() {
    return (
      <div>
        Success!
        {
          this.state.loading ?
          <div style={{display: 'flex', alignItems: 'center', width: '100%',
            justifyContent: 'center', height: 200}}>
            Give us a sec, we're just finding your contact lists...
          </div>
          :
          null
        }
        {
          this.state.lists ?
          <div>
            <h2>Which lists do you want to import?</h2>
            {this.state.lists.map((list) => (
              <div style={{display: 'flex', padding: 20}}>
                <Checkbox
            label={list.name}
            checked={this.state.checked[list.id]}
            onCheck={(value) => this.updateCheck(value, list.id)}
          />
              </div>
            ))}
          </div>
          :
          null
        }
        {
          this.state.members.length > 0 ?
          this.state.members.map((member) => (
            member.email_address
          ))
          :
          null
        }
      </div>
    )
  }
}
