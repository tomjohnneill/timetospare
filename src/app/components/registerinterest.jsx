import React from 'react'
import Chip from 'material-ui/Chip';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import fire from '../fire';

let db = fire.firestore()

var categories = ["Environment",
"Refugees",
"Equality",
"Poverty",
"Education",
"Healthcare",
"Disabilities",
"Young people",
"Old people",
"Loneliness",
"Animals",
"Mental Health",
"Homelessness",
"Democracy",
"Technology",
"Journalism",
"Conservation",
"Arts and culture",
"Women",
"LGBT+",
"Human rights",
"Justice"
]

const styles = {
  button : {
    fontFamily: 'Permanent Marker',
    fontSize: '20px',
    lineHeight: '36px'
  },
  textfield: {
    height: '40px',
    fontsize: '20px'
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
        margin: 4,
        cursor: 'pointer'
      },
  selectedChip: {
    margin: 4
  },
}

export default class RegisterInterest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      allTags: categories
    }
  }

  handleStartProject = () => {
    if (fire.auth().currentUser) {
      Router.push('/create-project?stage=0')
    } else {
      this.setState({modalOpen: true})
    }
  }

  handleModalChangeOpen = (e) => {
    this.setState({modalOpen: false})
  }

  handleCapture = () => {
    var email = this.state.emailSignup
    var location = this.state.location
    console.log(this.state.tags)
    db.collection("Newsletter").add({
      email: this.state.emailSignup,
      issues: this.state.tags ? this.state.tags : null,
      location: this.state.location ? this.state.location: null
    }).then(() => {
      this.setState({signedUp: true, emailSignup: ''})
    })
  }

  handleRequestDelete = (key) => {
    const chipToDelete = this.state.tags.indexOf(key);
    var newTags = this.state.tags
    newTags.splice(chipToDelete, 1);
    var allTags = this.state.allTags
    allTags.push(key)
    this.setState({tags: newTags, allTags: allTags});
  };

  handleAddTag = (key) => {
    const chipToDelete = this.state.allTags.indexOf(key);
    var newAllTags = this.state.allTags
    newAllTags.splice(chipToDelete, 1);
    this.setState({allTags: newAllTags});
    var tags = this.state.tags
    tags.push(key)
    this.setState({tags: tags})
  }

  handleRequestClose = () => {
    this.setState({
      signedUp: false,
    });
  };

  render() {
    return (
      <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'}}>
        <Snackbar
          open={this.state.signedUp}
          message="We've added you to the mailing list"
          autoHideDuration={4000}
          onRequestClose={this.handleRequestClose}
        />
        <h2 >Can't find a project you like?</h2>


        <div style={{maxWidth: 800, display: 'flex', alignItems: 'left', flexDirection: 'column'}}>
          <div style={{paddingBottom: 16, paddingLeft: 4, textAlign: 'left',  fontWeight: 700}}>
            I care about...

          </div>
          <div style={styles.wrapper}>
            {this.state.tags.map((tag) => (
              <Chip
                key={tag}
                style={styles.selectedChip}
                backgroundColor={'#65A1e7'}
                onRequestDelete={() => this.handleRequestDelete(tag)}
              >
                {tag}
              </Chip>
            ))}
          </div>


          <div style={styles.wrapper}>
            {this.state.allTags.map((tag) => (
              <Chip
                key={tag}
                style={styles.chip}
                onTouchTap={() => this.handleAddTag(tag)}
              >
                {tag}
              </Chip>
            ))}
          </div>
          <div style={{height: 20}}/>
          <div style={{fontWeight: 700}}>
            Let me know when a relevant project comes up
          </div>
          <div style={{ paddingTop: '20px', width: 300, display: 'flex', alignItems: 'left', flexDirection: 'column'}}>





            <TextField fullWidth={true}
              onChange={(e, nv) => this.setState({emailSignup: e.target.value})}
              inputStyle={{borderRadius: '2px', border: '1px solid #858987',
                backgroundColor: 'white',
                paddingLeft: '12px',  boxSizing: 'border-box'}}
              underlineShow={false}
              type='email'
              value={this.state.emailSignup}
              hintText={'Email Address'}
              hintStyle={{ paddingLeft: '12px', bottom: '8px', zIndex: 5}}
              key='email'
              style={styles.textfield}/>
            <RaisedButton   style={{height: '36px', marginTop: '16px', boxShadow: ''}} primary={true} overlayStyle={{height: '36px'}}
              buttonStyle={{height: '36px'}}
               labelStyle={{height: '36px', display: 'flex', alignItems: 'center',
                    letterSpacing: '0.6px', fontWeight: 'bold'}}
              onClick={this.handleCapture} label='Sign up'/>
          </div>

          </div>


      </div>
    )
  }
}
