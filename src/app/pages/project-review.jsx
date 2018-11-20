import React from 'react';
import MediaQuery from 'react-responsive';
import {grey200, grey500, red500, red100, orange500, orange100, yellow500,
  yellow100, limeA200, limeA700, green300} from 'material-ui/styles/colors'
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Link from "next/link"
import Router from 'next/router'
import App from "../components/App"
import fire from '../fire';
import withMui from '../components/hocs/withMui';

let db = fire.firestore()

const styles = {
  smallIcon: {
    width: 36,
    height: 36,
  },
  mediumIcon: {
    width: 48,
    height: 48,
  },
  tickMed: {
    width: 58,
    height:58
  },
  largeIcon: {
    width: 60,
    height: 60,
  },
  small: {
    width: 72,
    height: 72,
    padding: 16,
  },
  medium: {
    width: 96,
    height: 96,
  },
  large: {
    width: 96,
    height: 96,

  },
  circle : {
    borderRadius: '50%',
    border: '2px solid ' + grey200,
    color: grey500,
    width: 36,
    fontWeight: 700,
    height: 36,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  },
  badRating : {
    borderRadius: '50%',
    border: '2px solid rgb(182,48,43)',
    color: 'white',
    width: 36,
    fontWeight: 700,
    height: 36,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(182,48,43)',
    cursor: 'pointer'
  },
  middleRating : {
    borderRadius: '50%',
    border: '2px solid ' + yellow500,
    color: 'inherit',
    width: 36,
    fontWeight: 700,
    height: 36,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: yellow500,
    cursor: 'pointer'
  },
  goodRating : {
    borderRadius: '50%',
    border: '2px solid ' + 'rgb(59,158,116)',
    color: 'white',
    width: 36,
    fontWeight: 700,
    height: 36,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(59,158,116)',
    cursor: 'pointer'
  }
}

class ShortReview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  handleRating = (rating) => {
    this.setState({rating: rating})
  }

  componentDidMount(props) {
    if (fire.auth().currentUser) {
      db.collection("User").doc(fire.auth().currentUser.uid).get().then((doc) => {
        this.setState({user: doc.data()})
      })
    }

    fire.auth().onAuthStateChanged((user) => {
      if (user === null) {

      } else {
        db.collection("User").doc(fire.auth().currentUser.uid).get().then((doc) => {
          this.setState({user: doc.data()})
        })
      }
    })


    db.collection("Project").doc(Router.query.project).get().then((doc) => {
      var project = doc.data()
      project._id = doc.id
      this.setState({project: project})
      if (project.Charity) {
        db.collection("Organisations").doc(project.Charity).get().then((charityDoc) => {
          var charity = charityDoc.data()
          charity._id = charityDoc.id
          this.setState({project: project, charity: charity, loading: false})
        })
      }

    })
  }

  handleSetPrivate = (e, nv) => {
    this.setState({private: nv})
  }

  handleSetReview = (e, nv) => {
    this.setState({review: nv})
  }

  handleSaveReview = (e) => {
    e.preventDefault()
    var body = {
      Project: Router.query.project,
      Charity: this.state.charity ? this.state.charity._id : null,
      "Project Creator": this.state.project.Creator,
      User: fire.auth().currentUser.uid,
      "User Name": this.state.user.Name,
      "User Picture": this.state.user.Picture ? this.state.user.Picture : null,
      Review: this.state.review,
      Rating: this.state.rating,
      "Project Name": this.state.project.Name,
      created: new Date()
    }
    console.log(body)

    var reviewRef
    if (!this.state.reviewRef) {
      reviewRef = db.collection("ProjectReview").doc()
      this.setState({reviewRef: reviewRef})
    } else {
      reviewRef = this.state.reviewRef
    }
    console.log(reviewRef)
    reviewRef.set(body).then((docRef) => {
      console.log('project added')
      console.log(reviewRef.id)
      console.log(this.state.project._id)
      console.log(fire.auth().currentUser.uid)
      db.collection("ProjectReview").doc(reviewRef.id).collection("private")
        .doc(this.state.project._id).set({
          Feedback: this.state.private,
          User: fire.auth().currentUser.uid
        })
        .then(() => {
          if (this.state.rating > 3) {
            Router.push(`/review-status?status=good-thanks&project=${Router.query.project}`,
              `/projects/p/${Router.query.project}/review/good-thanks`)
          } else {
            Router.push(`/review-status?status=sorry&project=${Router.query.project}`,
              `/projects/p/${Router.query.project}/review/sorry`)
          }

        })
        .catch(error => console.log(error))

    })
    .catch(error => console.log(error))

  }

  render() {
    return (
      <App>
      <div style={{display: 'flex', minHeight: 700,flexDirection: 'column', alignItems: 'center', width: '100%'}}>
        <div style={{width: '100%', boxSizing: 'border-box', padding: 24, maxWidth: '500px', textAlign: 'left'}}>
          <h2 style={{marginBottom: 20}}>
            Was it worth it?
          </h2>

          <div style={{color: grey500, fontSize: '16px', marginLeft: 20, marginBottom: 10, marginTop: 15}}>
            Tbh, not really
          </div>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginLeft: 20, marginRight: 20}}>
            <span onTouchTap={() => this.handleRating(1)}
                style={this.state.rating > 3 ? styles.goodRating : this.state.rating === 3 ? styles.middleRating : this.state.rating < 3 ? styles.badRating :  styles.circle}>
              1
            </span>
            <span onTouchTap={() => this.handleRating(2)}
                style={this.state.rating > 3 ? styles.goodRating : this.state.rating === 3 ? styles.middleRating : this.state.rating === 2 ? styles.badRating :  styles.circle}>
              2
            </span>
            <span onTouchTap={() => this.handleRating(3)}
                style={this.state.rating > 3 ? styles.goodRating : this.state.rating === 3 ? styles.middleRating : styles.circle}>
              3
            </span>
            <span onTouchTap={() => this.handleRating(4)}
                style={this.state.rating > 3 ? styles.goodRating : styles.circle}>
              4
            </span>
            <span onTouchTap={() => this.handleRating(5)}
              style={this.state.rating === 5 ? styles.goodRating : styles.circle}>
              5
            </span>
          </div>
          <div style={{color: grey500, fontSize: '16px', textAlign: 'right', marginRight: 20, marginTop: 10}}>
            Yes, definitely
          </div>

          {this.state.rating ?
          <div>
            <h2 style={{marginTop: 36, marginBottom: 6}}>
              How could it have been better?
            </h2>
            <div style={{color: grey500}}>

            </div>
            <div style={{width: '100%', paddingBottom: 15}}>
              <TextField
                inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                  paddingLeft:  '12px',  boxSizing: 'border-box'}}
                underlineShow={false}
                hintText={`Don't worry, this is private feedback`}
                multiLine={true}
                fullWidth={true}
                value={this.state.private}
                onChange={this.handleSetPrivate}
                rows={3}
                hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                />
            </div>

            <h2 style={{marginBottom: 6}}>
              What would you say about it to others?
            </h2>
            <div style={{color: grey500}}>

            </div>
            <div style={{width: '100%', paddingBottom: 15}}>
              <TextField
                inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                  paddingLeft: '12px',  boxSizing: 'border-box'}}
                underlineShow={false}
                hintText={`We'll show this publicly`}
                multiLine={true}
                fullWidth={true}
                value={this.state.review}
                onChange={this.handleSetReview}
                rows={3}
                hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                />
            </div>
            <RaisedButton
              onTouchTap={this.handleSaveReview}
              style={{marginTop: 36}}
               primary={true} fullWidth={true}
                labelStyle={{letterSpacing: '0.6px', fontWeight: 'bold'}}
               label="Finish"  />
          </div>
          :
          null}

        </div>

    </div>
    </App>
    )
  }
}

export default withMui(ShortReview)
