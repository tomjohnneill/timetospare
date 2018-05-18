import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Router from 'next/router'
import fire from '../../fire';

let db = fire.firestore()

export default class Suggest extends React.Component{
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount(props) {

    if (fire.auth().currentUser) {
      db.collection("Group").where("members." + fire.auth().currentUser.uid, "==", true)
      .get().then((querySnapshot) => {
        let data = []
        querySnapshot.forEach((doc) => {
          var elem = doc.data()
          elem._id = doc.id
          data.push(elem)
        })
        this.setState({groups: data, value: data[0] ? data[0]._id : null})
      })
    }

    fire.auth().onAuthStateChanged((user) => {
      if (user === null) {

      } else {
        db.collection("Group").where("members." + fire.auth().currentUser.uid, "==", true)
        .get().then((querySnapshot) => {
          let data = []
          querySnapshot.forEach((doc) => {
            var elem = doc.data()
            elem._id = doc.id
            data.push(elem)
          })
          this.setState({groups: data, value: data[0] ? data[0]._id : null})
        })
      }
    })

  }

  handleSuggest = () => {
    console.log(this.state.groups)
    var group = this.state.value
    db.collection("Group").doc(group).collection("Projects").doc(this.props.projectId).set({
      Interested: {
      [fire.auth().currentUser.uid] : true,
    },
     Leader: {
        [fire.auth().currentUser.uid] : true,
      }
    }).then(() => {
      Router.push(`/groups/${group}`)
    })
  }

  handleChange = (event, index, value) => this.setState({value})

  render() {
    if (this.state.groups) {
      return (
        <div style={{marginTop: 20, padding: 10, background: 'linear-gradient(0deg, rgb(255, 255, 255), rgb(247, 247, 247))',
        borderLeft: '3px solid rgb(33, 150, 243)', borderRadius: 6}}>
          <h2 style={{textAlign: 'left', marginBottom: 6,paddingLeft: 10, marginTop: 0}}>
            Want to go with friends?
          </h2>
          {
            this.state.groups.length === 0 ?
            <div style={{paddingTop: 10}}>
              <RaisedButton
                labelStyle={{fontWeight: 'bold', letterSpacing: '0.6px'}}
                secondary={true}
                label='Create a group'
                onClick={() => Router.push('/groups')}/>
            </div>
            :
            <div>
              <SelectField

                value={this.state.value}
                onChange={this.handleChange}
              >
                {
                  this.state.groups.map((group) => (
                    <MenuItem value={group._id} primaryText={group.Name} />
                  ))
                }
              </SelectField>
              <RaisedButton
              labelStyle={{fontWeight: 'bold', letterSpacing: '0.6px'}}
              secondary={true}
              label='Suggest to Group'
              onClick={this.handleSuggest}/>
            </div>
          }

        </div>
      )
    } else {
      return (
        <div style={{marginTop: 20, padding: 10, background: 'linear-gradient(0deg, rgb(255, 255, 255), rgb(247, 247, 247))',
        borderLeft: '3px solid rgb(33, 150, 243)', borderRadius: 6}}>
          <h2 style={{textAlign: 'left', marginBottom: 6,paddingLeft: 10, marginTop: 0}}>
            Want to go with friends?
          </h2>

            <div style={{paddingTop: 10}}>
              <RaisedButton
                labelStyle={{fontWeight: 'bold', letterSpacing: '0.6px'}}
                secondary={true}
                label='Create a group'
                onClick={() => Router.push('/groups')}/>
            </div>
          </div>

      )
    }

  }
}
