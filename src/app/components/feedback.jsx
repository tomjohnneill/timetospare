import React from 'react';
import {List, ListItem} from 'material-ui/List';
import fire from '../fire';

let db = fire.firestore()

export default class PrivateFeedback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount(props) {
    db.collection("ProjectReview").where("Project", "==", this.props.projectId).get()
    .then((querySnapshot) => {
      let data = []
      let feedbacks = []
      querySnapshot.forEach((doc) => {
        let elem = doc.data()
        data.push(doc.id)
        db.collection("ProjectReview").doc(doc.id).collection("private").doc(this.props.projectId).get()
        .then((feedbackDoc) => {
          let docData = feedbackDoc.data()
          if (docData) {
            feedbacks.push({_id: doc.id, feedback : docData.Feedback})
          }
        })
      })
      this.setState({reviewIds: data, feedbacks: feedbacks})
    })
  }

  render() {
    return (
      <div>
        <List>
          {this.state.feedbacks ? this.state.feedbacks.map((feedback) => (
            <ListItem
              primaryText={feedback.feedback}
              />
          ))
          :
          <div style={{width: '100%', padding: 24,
            backgroundColor: 'rgba(216,216,216,0.2)',
             boxSizing: 'border-box', height: 60}}>
            You don't have any feedback just yet
          </div>
        }
        </List>
      </div>
    )
  }
}
