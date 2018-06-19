import React from 'react';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import {changeImageAddress} from '../components/desktopproject.jsx';
import {Tabs, Tab} from 'material-ui/Tabs';
import MediaQuery from 'react-responsive';
import App from "../components/App"
import Link from "next/link"
import Router from 'next/router'
import Dialog from 'material-ui/Dialog';
import {Card, CardHeader} from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import {grey200, grey500, red500, red100, orange500, orange100, yellow500,
  yellow100, limeA200, limeA700, green300} from 'material-ui/styles/colors'
import Chip from 'material-ui/Chip';
import UploadPhoto from '../components/uploadphoto.jsx';
import Snackbar from 'material-ui/Snackbar';
import Loading from '../components/loading.jsx';
import PrivateFeedback from '../components/feedback.jsx';
import {CleanTick, Cross} from '../components/icons.jsx';
import FileDownload from 'material-ui/svg-icons/file/file-download';
import {CSVLink} from 'react-csv';
import SignupModal from '../components/signupmodal.jsx';
import 'react-quill/dist/quill.snow.css';
import withMui from '../components/hocs/withMui';
import fire from '../fire';

let db = fire.firestore()


const defaultStyles = {
  root: {
    position: 'relative',
    paddingBottom: '0px',
    fontSize: '16px'
  },
  input: {
    display: 'inline-block',
    width: '100%',
    padding: '10px',
    fontSize: '16px',
    boxSizing: 'border-box',
    borderRadius: '6px',
    border: '1px solid rgb(133, 137, 135)'
  },
  autocompleteContainer: {
    position: 'absolute',
    top: '100%',
    backgroundColor: 'white',
    border: '1px solid #555555',
    width: '100%',
    zIndex: '5'
  },
  autocompleteItem: {
    backgroundColor: '#ffffff',
    padding: '10px',
    color: '#555555',
    cursor: 'pointer',
  },
  autocompleteItemActive: {
    backgroundColor: '#fafafa'
  },
}


const options = {
  location: typeof window !== 'undefined' && window.google ?
    new window.google.maps.LatLng(51.5, 0.12)
  :null,
  radius: 10000,
}

const styles = {
  selectedTab: {
    height: '60px',
    backgroundColor: 'white',
    color: '#E55749',
    textTransform: 'none',
    fontSize: '16px',
    letterSpacing: '0.4px',
    lineHeight: '16px',
    paddingLeft: '20px',
    paddingRight: '20px',
    fontWeight: 600
  },
  tab: {
    height: '60px',
    backgroundColor: 'white',
    color: '#484848',
    textTransform: 'none',

    fontSize: '16px',
    letterSpacing: '0.4px',
    lineHeight: '16px',
    paddingLeft: '20px',
    paddingRight: '20px',

  },
  textfield: {
    height: '40px',
    fontsize: '20px'
  },
  header : {
    margin: '0px',
    padding: '6px',
    fontWeight: 500
  },
  chip: {
        margin: 4,
        cursor: 'pointer'
      },
  selectedChip: {
    margin: 4
  },
      wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
      },
  title : {
    fontWeight: 700, marginBottom: 6, marginTop: 16, display: 'flex'
  },
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

var categories = ['Environment', 'Refugees', 'Equality', 'Poverty', 'Education', 'Healthcare',
                    'Disabilities', 'Young People', 'Old People', 'Isolation', 'Animals', 'Outdoor',
                    'Mental Health']

const { compose, withProps, lifecycle } = require("recompose");
const {
  withScriptjs,
} = require("react-google-maps");
const { StandaloneSearchBox } = require("react-google-maps/lib/components/places/StandaloneSearchBox");

export const PlacesWithStandaloneSearchBox = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBnLdq8kJzE87Ba_Q5NEph7nD6vkcXmzhA&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
  }),
  lifecycle({
    componentWillMount() {
      const refs = {}

      this.setState({
        places: [],
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();

          this.setState({
            places,
          });
          this.props.reportPlaceToParent(places)
        },
      })
    },
  }),
  withScriptjs
)(props =>
  <div data-standalone-searchbox="">
    <StandaloneSearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        type="text"
        disabled={props.disabled}
        defaultValue={props.currentLocation}
        placeholder="Location"
        style={{
          display: 'inline-block',
          width: '100%',
          color: '#484848',
          paddingTop: '10px',
          paddingBottom: '10px',
          paddingLeft: '12px',
          fontFamily: 'Nunito',
          fontSize: '16px',
          boxSizing: 'border-box',
          borderRadius: '2px',
          border: '1px solid #aaa'
        }}
      />
    </StandaloneSearchBox>

  </div>
);

class ReviewComponent extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props.existingReview)
    this.state = {review: this.props.existingReview ? this.props.existingReview.Review : undefined,
      rating: this.props.existingReview ? this.props.existingReview.Rating : undefined}
  }

  componentDidMount(props) {
    if (this.props.eng['Charity Number']) {
      db.collection("Charity").doc(this.props.eng['Charity Number'].toString()).get()
        .then((doc) => {
          this.setState({organiser: doc.data().Name})
        })
    } else {
      db.collection("User").doc(fire.auth().currentUser.uid).get()
      .then((doc) => {
        this.setState({organiser: doc.data().Name})
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props != nextProps) {
      this.setState({
        review: nextProps.existingReview ? nextProps.existingReview.Review : undefined,
          rating: nextProps.existingReview ? nextProps.existingReview.Rating : undefined
      })
      console.log(nextProps)
    }

  }

  handleRating = (rating) => {
    if (this.state.turnedUp !== false) {
      this.setState({rating: rating})
    }
  }

  handleSetAdditional = (e) => {
    this.setState({review: e.target.value})
  }

  handleSaveReview = () => {
    var body = {
      Project: this.props.projectId,
      User: this.props.eng.User,
      Rating: this.state.turnedUp === false ? 1 : this.state.rating,
      "Turned Up" : this.state.turnedUp === undefined ? true : this.state.turnedUp,
      "Charity Number": this.props.eng['Charity Number'] ? this.props.eng['Charity Number'] : null,
      "Project Name": this.props.eng['Project Name'],
      Review: this.state.turnedUp === false ? 'Did not turn up' : this.state.review,
      Organiser: this.state.organiser,
      created : new Date ()
    }
    db.collection("UserReview").add(body).then((doc) => {
      this.setState({reviewAdded: true})
    })
  }

  handleTurnedUp = (bool) => {
    this.setState({turnedUp : bool})
  }

  render() {
    console.log(this.state)
    return (
      <div>
        {!this.state.reviewAdded && !this.props.existingReview ?
        <div style={{display: 'flex', paddingLeft: 16, paddingBottom: 16, paddingRight: 16, position: 'relative'}}>

            <div style={{width: 'auto', marginRight: 24}}>
              <h2 style={styles.reviewHeader}>
                Turned Up?
              </h2>
              <IconButton
                onClick={() => this.handleTurnedUp(true)}
                 style={{padding: 0}} iconStyle={{height: 40}}>
                <CleanTick color={this.state.turnedUp === false ? grey200 : 'rgb(59,158,116)'}/>
              </IconButton>
              <IconButton
                onClick={() => this.handleTurnedUp(false)}
                style={{padding: 0}} iconStyle={{height: 38}}>
                  <Cross color={this.state.turnedUp === true ? grey200 : 'rgb(182,48,43)'}/>
              </IconButton>

            </div>

            <div style={{flex: 1}}>
              <h2 style={styles.reviewHeader}>
                Review
              </h2>
              <TextField
                inputStyle={{
                  backgroundColor: this.state.turnedUp === false ? grey200 : 'inherit',
                  borderRadius: '6px', border: '1px solid ' + grey500,
                  paddingLeft: '12px',  boxSizing: 'border-box'}}
                underlineShow={false}
                hintText={`This will be shared publicly on ${this.props.eng['Name'] ? this.props.eng['Name'].replace(/ .*/,'') : "this person"}'s profile.`}
                multiLine={true}
                fullWidth={true}
                disabled={this.state.turnedUp === false}
                value={this.state.review}
                onChange={this.handleSetAdditional}
                rows={4}
                hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                />
            </div>

            <div style={{width: 300, marginLeft: 24}}>
              <h2 style={styles.reviewHeader}>
                Rating
              </h2>
              <div style={{height: 120, display: 'flex', justifyContent: 'space-between', flexDirection: 'column'}}>

                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginLeft: 20, marginRight: 20, marginTop: 20}}>
                  <span onTouchTap={() => this.handleRating(1)}
                      style={this.state.rating > 3 ? styles.goodRating : this.state.rating === 3 ? styles.middleRating : this.state.rating < 3 ? styles.badRating  : this.state.turnedUp === false ? styles.badRating : styles.circle}>
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
                <div style={{marginLeft: 20, marginRight: 20}}>
                  <RaisedButton label='Submit'
                     primary={true}
                    fullWidth={true}
                    onClick={this.handleSaveReview}
                     labelStyle={{ fontWeight: 'bold'}}/>
                 </div>
              </div>
          </div>


          </div>
        :
        null}
        </div>
    )
  }
}

export class UserReviewPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: true, modalOpen: false}
  }

  componentDidMount(props) {
    db.collection("UserReview").where("Project", "==", this.props.projectId).get().then((querySnapshot) => {
      var data = []
      querySnapshot.forEach((doc) => {
        console.log(doc.data())
        data[doc.data().User] = doc.data()
      });
      this.setState({reviews: data, loading: false})
    })
  }

  handleModalChangeOpen = (e) => {
    this.setState({modalOpen: false})
  }

  render() {
    return (
      <div>
        <h2 style={{fontWeight: 200, fontSize: '30px', textAlign: 'left'}}>
          Reviews
        </h2>
        {
          !fire.auth().currentUser ?
          <div style={{height: '100%', width: '100%', display: 'flex', alignItems: 'center',
            justifyContent: 'center'}}>

          <RaisedButton label='Log in'
            primary={true}
            labelStyle={{fontWeight: 700, textTransform: 'none'}}
            onClick={() => this.setState({modalOpen: true})}
            />
          <SignupModal
            open={this.state.modalOpen}
            changeOpen={this.handleModalChangeOpen}
          onComplete={() => {}}/>

          </div>
          :
          null
        }
        {this.props.engagements ?
          this.props.engagements.map((eng) => (
            <Card
              style={{
                border: 'solid 1px #979797', borderRadius: 4, marginTop: 10,
                boxShadow: 'none',
                backgroundColor: eng['Cancelled'] ? 'rgb(248,248,248)' : 'white',
                      color: eng['Cancelled'] ? 'rgba(0, 0, 0, 0.4)' : 'inherit'}}
              >
              <CardHeader
                title={eng.Name}
                subtitle={eng.Location}
                avatar={<Avatar
                  style={{opacity:  eng['Cancelled'] ? 0.5 : 1}}
                   src={changeImageAddress(eng['Volunteer Picture'], '30xauto')} />}

              />
            {!this.state.loading ?
            <ReviewComponent eng={eng}
                existingReview={this.state.reviews[eng.User]}
                passEngIdUp={(review) => this.setState({[eng._id]: review})}
               projectId={this.props.projectId} />
             :
             null}
            </Card>
          ))
          :
          null
        }
      </div>
    )
  }
}

const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ]
  }

export class EditProjectForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: true,allTags: categories, snackbar: false, deleteOpen: false}
    if (typeof window !== 'undefined') {
      this.ReactQuill = require('react-quill')
    }
  }

  handleSet = (id, e, data) => {
    console.log(data)
    console.log(id)
    var project = this.state.project
    project[id] = data
    this.setState({project: project})
  }

  handleSetMax = (e) => {
    this.setState({max: e.target.value})
  }

  handleSetDeadline = (e, date) => {
    this.setState({deadline: date})
  }

  handleSetGeopoint = (lat, lng, address) => {
    var project = this.state.project
    project.Location = address
    console.log(address)
    console.log({lat: lat, lng: lng})
    project.Geopoint = {lat: lat, lng: lng}
    this.setState({project: project})
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

  componentDidMount(props) {
    db.collection("Project").doc(this.props.projectId).get().then((projectDoc) => {
      let project = projectDoc.data()
      project._id = projectDoc.id
      this.setState({tags: project.Tags, project: project, loading: false, address: project.Location})
    })
  }

  onChange = (address) => this.setState({ address})

  handleUpdateInput = (searchText) => {
    this.setState({
        searchText: searchText,
      });
    fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/xml?input=${encodeURIComponent(this.state.searchText)}&types=establishment&location=51.5074,0.1278&radius=10000&key=AIzaSyAw-u3Xed8r9dRXJI47oW8eDuDN8VpikJE` )
    .then(response => response.json())
    .then(function(data) {
      console.log(data)
      var places = data.predictions.map(a => a.description)
      this.setState({rawPlaces: data.predictions})

      this.setState({places: places})
    }.bind(this))
    .catch(error => this.setState({error: error}))
  };


  handleSaveChanges = () => {
    let project = this.state.project

     db.collection("Project").doc(this.props.projectId).update(project).
     then(data => {
       this.setState({snackbar: true})
        Router.back()
      }
      )
  }

  handleDeleteModal = () => {
    this.setState({deleteOpen: !this.state.deleteOpen})
  }

  handleDeleteProject = () => {
    db.collection("Project").doc(this.props.projectId).delete().then(() => {
      this.handleDeleteModal()
      Router.push('/profile')
    })
  }

  handleRequestClose = () => {
    this.setState({snackbar: false})
  }

  handleChangeDescription = (value) => {
    var project = this.state.project
    project.Description = value
    this.setState({project : project})
  }

  render() {
    const ReactQuill = this.ReactQuill
    console.log(this.state)
    const inputProps = {
        value: this.state.address,
        onChange: this.onChange,
        placeholder: 'Location'
      }
      const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={this.handleDeleteModal}
      />,
      <FlatButton
        label="Delete"
        primary={true}
        onClick={this.handleDeleteProject}
      />,
    ];
    return (
      <div>
        <Snackbar
          open={this.state.snackbar}
          message="Project Updated"
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose}
        />
        {this.state.loading ?
          <Loading/>
          :
          <div style={{width: '80%'}}>
            <Dialog
               title="Are you sure you want to delete this project?"
               actions={actions}
               modal={true}
               open={this.state.deleteOpen}
             >
             </Dialog>
            {/* Min and max */}
            <div style={{width: '100%', paddingBottom: '16px', boxSizing: 'border-box', paddingTop: 16}}>
              <UploadPhoto edit={true} imageUrl={this.state.project['Featured Image']}
                changeParentState={() => this.setState({pictureUploaded: true})}/>
              <p style={styles.header}>
                How many people are you looking for?
              </p>
              <div style={{display: 'flex'}}>
              <div style={{flex: 1, paddingRight: '6px'}}>
                <TextField fullWidth={true}
                  inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                    paddingLeft: '12px',  boxSizing: 'border-box'}}
                  underlineShow={false}
                  hintText={'Minimum'}
                  value={this.state.project['Target People']}
                  hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                  key='min'
                  onChange={this.handleSet.bind(this, 'Target People')}
                  style={styles.textfield}/>
              </div>
              <div style={{flex: 1, paddingLeft: '6px'}}>
                <TextField fullWidth={true}
                  inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                    paddingLeft: '12px',  boxSizing: 'border-box'}}
                  underlineShow={false}
                  hintText={'Maximum'}
                  hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                  key='max'
                  errorStyle={{marginTop: 6, color: orange500, textAlign: 'center'}}
                  errorText={this.state.max && this.state.max < this.state.min ? 'You just set max < min' : null}
                  value={this.state.project['Maximum People']}
                  onChange={this.handleSet.bind(this, 'Maximum People')}
                  style={styles.textfield}/>
              </div>
              </div>
            </div>

            {/* Deadline */}
            <div style={{width: '100%',  paddingBottom: 16,
               boxSizing: 'border-box'}}>
              <p style={styles.header}>
                When is the deadline for sign ups?
              </p>
              <DatePicker
                 style={{borderRadius: '6px', border: '1px solid #858987',paddingLeft: '12px',
                     boxSizing: 'border-box'}}
                   underlineShow={false}
                   value={this.state.project.Deadline}
                   onChange={this.handleSet.bind(this, 'Deadline')}
                   hintStyle={{  bottom: '8px'}}
                   hintText="Deadline" textFieldStyle={styles.textfield}/>
            </div>

            {/* Tags */}
            <div style={{width: '100%',  paddingBottom: 16,
               boxSizing: 'border-box'}}>
              <p style={styles.header}>
                Which categories best describe your project?
              </p>
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
            </div>


            <div style={{width: '100%', paddingBottom: '16px', boxSizing: 'border-box'}}>
              <p style={styles.header}>
                Where is this happenning?
              </p>
            <PlacesWithStandaloneSearchBox
              currentLocation = {this.state.project.Location}
              reportPlaceToParent={(places) =>
                {
                  console.log(places)
                  var geo = places[0].geometry.location
                  var lat = geo.lat()
                  var lng = geo.lng()
                  this.handleSetGeopoint(lat, lng, places[0].formatted_address)
                  console.log(this.state)
                }
              }
              />

            </div>
          <div style={{width: '100%', paddingBottom: '16px', boxSizing: 'border-box'}}>
            <div style={{width: '100%',  paddingBottom: 16,
               boxSizing: 'border-box'}}>
               <div style={{width: '70%', display: 'inline-block'}}>
              <p style={styles.header}>
                When does your project start?
              </p>

              <DatePicker
                 style={{borderRadius: '6px', border: '1px solid #858987',paddingLeft: '12px',
                     boxSizing: 'border-box'}}
                   underlineShow={false}
                   value={this.state.project['Start Time']}
                   onChange={this.handleSet.bind(this, 'Start Time')}
                   hintStyle={{  bottom: '8px'}}
                   hintText="Date" textFieldStyle={styles.textfield}/>
              </div>


                <div style={{width: '25%', display: 'inline-block', marginLeft: '5%'}}>
                  <p style={styles.header}>
                    Start time?
                  </p>

                 <TimePicker
                  style={{borderRadius: '6px', border: '1px solid #858987',paddingLeft: '12px',
                      boxSizing: 'border-box'}}
                    underlineShow={false}
                    value={this.state.project['Start Time']}
                    minutesStep={5}

                    onChange={this.handleSet.bind(this, 'Start Time')}
                    hintStyle={{  bottom: '8px'}}
                    hintText="Time" textFieldStyle={styles.textfield}/>
                </div>
            </div>

            <div style={{width: '100%',  paddingBottom: 16,
               boxSizing: 'border-box'}}>
               <div style={{width: '70%', display: 'inline-block'}}>
              <p style={styles.header}>
                When does your project finish?
              </p>

              <DatePicker
                 style={{borderRadius: '6px', border: '1px solid #858987',paddingLeft: '12px',
                     boxSizing: 'border-box'}}
                   underlineShow={false}
                   value={this.state.project['End Time']}
                   onChange={this.handleSet.bind(this, 'End Time')}
                   hintStyle={{  bottom: '8px'}}
                   hintText="Date" textFieldStyle={styles.textfield}/>
              </div>


                <div style={{width: '25%', display: 'inline-block', marginLeft: '5%'}}>
                  <p style={styles.header}>
                    End time?
                  </p>

                 <TimePicker
                  style={{borderRadius: '6px', border: '1px solid #858987',paddingLeft: '12px',
                      boxSizing: 'border-box'}}
                    underlineShow={false}
                    minutesStep={5}
                    value={this.state.project['End Time']}

                    onChange={this.handleSet.bind(this, 'End Time')}
                    hintStyle={{  bottom: '8px'}}
                    hintText="Time" textFieldStyle={styles.textfield}/>
                </div>
            </div>

            <div style={{width: '100%', paddingBottom: '16px', boxSizing: 'border-box'}}>
              <p style={styles.header}>What is the title of your project?</p>
              <TextField fullWidth={true}
                inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                  paddingLeft: '12px',  boxSizing: 'border-box'}}
                underlineShow={false}
                errorStyle={{marginTop: 6, color: orange500, textAlign: 'center'}}
                errorText={this.state.titleLengthError ? 'Your title is a bit long, could you make it shorter?' : null}
                hintText={'Project Title'}
                hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                key='location'
                value={this.state.project.Name}
                onChange={this.handleSet.bind(this, 'Name')}
                style={styles.textfield}/>
            </div>


            <div style={{width: '100%', paddingBottom: '16px', boxSizing: 'border-box'}}>
              <p style={styles.header}>Project Summary</p>
              <TextField fullWidth={true}
                inputStyle={{borderRadius: '6px', border: '1px solid #858987',
                  paddingLeft: '12px',  boxSizing: 'border-box'}}
                underlineShow={false}
                hintText={'A tagline to use on social media etc.'}
                hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                key='location'
                errorStyle={{color: orange500, marginTop: 6}}
                errorText={this.state.summaryLengthError ? 'Your summary is a bit long, could you make it shorter?' : null}
                value={this.state.project.Summary}
                onChange={this.handleSet.bind(this, 'Summary')}
                style={styles.textfield}/>
            </div>

            <div style={{width: '100%',  paddingBottom: '32px', boxSizing: 'border-box'}}>
              <p style={styles.header}>
                Project Description
              </p>
              {typeof window !== 'undefined' && ReactQuill ?
              <ReactQuill
                style={{fontFamily: 'Nunito'}}
                modules={modules}
                value={this.state.project.Description}
                  onChange={this.handleChangeDescription} />
                :
                null}

            </div>


            <RaisedButton style={{marginBottom: 30}} label='Save Changes'
              labelStyle={{fontWeight: 700, textTransform: 'none'}}
              primary={true}
              onClick={this.handleSaveChanges}
              />

            <RaisedButton style={{marginBottom: 30, marginLeft: 24}} label='Delete Project'
              labelStyle={{fontWeight: 700, textTransform: 'none'}}
              secondary={true}
              onClick={this.handleDeleteModal}
              />
          </div>
          </div>
        }
      </div>
    )
  }
}

class AdminView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: true, selected: typeof window !== 'undefined' && Router.query.tab ?
      Router.query.tab  : 'admin'
      , inkBarLeft: 15}
  }

  changeAnchorEl  = (tab, e) =>  {
    console.log('handleMultipleChoiceClick')
    e.preventDefault()
    console.log(e)
    var rect = e.target.getBoundingClientRect()
    console.log(rect)
    if (typeof window !== 'undefined' && window.document.body.clientWidth > 700) {
      this.setState({selected: tab,
        inkBarLeft: (rect.width-60)/2  + rect.x - ( typeof window !== 'undefined' && window.document.body.clientWidth - 900) /2,
      })
    } else {
      this.setState({selected: tab,
        inkBarLeft: (rect.width-60)/2  + rect.x -16,
      })
    }

  }

  handleTwoTabClick = (value) => {
    Router.push(`/admin?project=${Router.query.project}&tab=${value}`
      , `/projects/p/${Router.query.project}/admin/${value}`)
    this.setState({selected: value})
  }

  componentDidMount(props) {
    db.collection("Engagement").where("Project", "==", Router.query.project).get().then((querySnapshot) => {
      var data = []
      var csvData = []
      querySnapshot.forEach((doc) => {
        console.log(doc.data())
        var elem = doc.data()
        var csvItem = {}
        elem['_id'] = doc.id
        console.log('Engagement Id', doc.id)
        db.collection("Engagement").doc(doc.id).collection("Private")
          .doc(Router.query.project).get().then((privateData) => {
          console.log(privateData.data())
          if (privateData.data()) {
              csvItem.Location = privateData.data().Location
              csvItem.Email = privateData.data().Email
              csvItem.Name = privateData.data().Name
              elem.Location = privateData.data().Location
              elem.Email = privateData.data().Email
              elem.Name = privateData.data().Name
            }
            data.push(elem)
            csvData.push(csvItem)
            console.log(csvData)
            this.setState({engagements: data, csvData: csvData})
        })
        .catch(error => console.log('Error', error))

      });
      console.log(data)
      this.setState({engagements: data, loading: false})
    })
  }

  cancelPerson = (_id, check) => {
    var engagement = this.state.engagements.filter(eng => eng._id === _id)
    var index = this.state.engagements.indexOf(engagement[0])
    var all = this.state.engagements
    engagement[0]['Cancelled'] = !check
    all[index] = engagement[0]
    this.setState({engagements: all})
    db.collection("Engagement").doc(_id).update({Cancelled: !check})
  }

  addNote = (_id) => {
    var engagement = this.state.engagements.filter(eng => eng._id === _id)
    var index = this.state.engagements.indexOf(engagement[0])
    var all = this.state.engagements
    var notes = engagement[0]['Notes'] ? engagement[0]['Notes'] : []
    notes.push(this.state.note[_id])
    engagement[0]['Notes'] = notes
    all[index] = engagement[0]
    this.setState({engagements: all})
    db.collection("Engagement").doc(_id).update({Notes: notes})
  }

  handleNoteType = (_id, e) => {
    var notes = this.state.note ? this.state.note : {}
    notes[_id] = e.target.value
    this.setState({note: notes})
  }

  handleEmail = (e) => {
    e.preventDefault()
    console.log(this.state.engagements)
    let bccs = []
    for (let i = 0; i < this.state.engagements.length; i ++) {
      if (this.state.engagements[i].Email && this.state.engagements[i].Cancelled !== true) {
        bccs.push(this.state.engagements[i].Email)
      }
    }
    var bcc = encodeURIComponent(bccs.join(';'))
    console.log(bccs)
    console.log(bcc)
    window.location.href = 'mailto:?bcc=' + bcc
  }

  render() {
    console.log(this.state.engagements)
    return (
      <App>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <div style={{padding: 16, width: '100%', maxWidth: '900px', position: 'relative'}}>
          <MediaQuery maxDeviceWidth={700}>
            <h2 style={{position: 'relative', textAlign: 'left'}}>Admin View</h2>
          </MediaQuery>
          <MediaQuery minDeviceWidth={700}>
            <h2 style={{position: 'relative'}}>Admin View</h2>
          </MediaQuery>

            <div style={{position: 'absolute', right: 0, top:20, padding: 16}}>
              <RaisedButton
                label='Back to Project'
                labelStyle={{fontWeight: 700, textTransform: 'none'}}
                secondary={true} onClick={() =>
                  Router.push(`/project?project=${Router.query.project}`,
                    `/projects/p/${Router.query.project}`)}/>
            </div>

            <Tabs
                tabItemContainerStyle={{height: '60px', backgroundColor: 'white', borderBottom: '1px solid #DDDDDD'}}
                value={this.state.selected}
                onChange={this.handleTwoTabClick}
                inkBarStyle={{zIndex: 2, backgroundColor: '#E55749',
                left:this.state.inkBarLeft, width: '60px'}}
              >
        <Tab label="Admin"
          style={{width: 'auto', fontSize: '16px'}}
            onTouchTap={(e) => this.changeAnchorEl('admin', e)}
              buttonStyle={this.state.selected === 'admin' ? styles.selectedTab : styles.tab}
           value="admin">

              {this.state.loading ?
                null :
                <div>
                  <h2 style={{fontWeight: 200, fontSize: '30px', textAlign: 'left'}}>
                    Attending ({this.state.engagements.length ? this.state.engagements.length : null})
                  </h2>
                  <CSVLink
                    filename={"my-volunteers.csv"}
                    target=""
                    rel='noopener'
                    data={this.state.csvData ? this.state.csvData : [{"data": "empty"}]}>
                      <RaisedButton label='Download data'
                        secondary={true}
                        labelStyle={{fontWeight: 700, textTransform: 'none'}}
                        icon={<FileDownload/>}/>


                  </CSVLink>
              {this.state.engagements && this.state.engagements.length > 0
               ? this.state.engagements.map((eng) => (
                <List style={{textAlign: 'left', backgroundColor: 'white'}}>
                  <ListItem
                    style={{
                      border: 'solid 1px #979797', borderRadius: 4, marginTop: 10,
                      backgroundColor: eng['Cancelled'] ? 'rgb(248,248,248)' : 'white',
                            color: eng['Cancelled'] ? 'rgba(0, 0, 0, 0.4)' : 'inherit'}}
                    leftAvatar={<Avatar
                      style={{opacity:  eng['Cancelled'] ? 0.5 : 1}}
                       src={changeImageAddress(eng['Volunteer Picture'], '30xauto')} />}
                    primaryText={eng.Name}
                    primaryTogglesNestedList={true}
                    secondaryText={eng.Location}
                    children={
                      <MediaQuery minDeviceWidth={700}>
                        <div style={{position: 'absolute', right: 80, top: 25,
                        color: eng['Cancelled'] ? 'rgba(0, 0, 0, 0.4)' : 'inherit'}}>
                          <Toggle
                            label="Attending"
                            onToggle={(e, check) => this.cancelPerson(eng._id, check)}
                            toggled={eng['Cancelled'] === true ? false : true}
                          />
                        </div>
                      </MediaQuery>
                    }
                    nestedItems={[
                        <ListItem key={1}
                          children={<div style={{width: '100%', height: '100%'}}>
                            <div style={{marginBottom: 6}}>
                              <b>Notes</b>
                            </div>
                            <div>
                              {eng.Notes ? eng.Notes.map((note) => (
                                <li>{note}</li>
                              )): null}
                            </div>
                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                              <TextField onChange={(e, nv) => this.handleNoteType(eng._id, e)}/>
                              <RaisedButton style={{marginLeft: 16}} primary={true}
                                label='Add Note' onClick={() => this.addNote(eng._id)}/>
                            </div>

                          </div>}
                          />,
                      ]}
                  />
                </List>
              )) :
              <div style={{borderRadius: 4, fontWeight: 700, height: '250px', width: '100%', display: 'flex', backgroundColor: 'rgb(247, 247, 247)', justifyContent: 'center' ,alignItems: 'center'}}>
                <div>
                  You don't have any supporters just yet
                </div>
              </div>}
            </div>
            }

          </Tab>

          <Tab label="Leave Reviews"
            style={{width: 'auto', fontSize: '16px'}}
              onTouchTap={(e) => this.changeAnchorEl('leave-reviews', e)}
                buttonStyle={this.state.selected === 'leave-reviews' ? styles.selectedTab : styles.tab}
             value="leave-reviews">
             {typeof window !== 'undefined' ?
             <UserReviewPage
               projectId={Router.query.project}

                engagements={this.state.engagements}/>
              :
              null}
          </Tab>

          <Tab label="Edit Project"
            style={{width: 'auto', fontSize: '16px'}}
              onTouchTap={(e) => this.changeAnchorEl('editproject', e)}
                buttonStyle={this.state.selected === 'editproject' ? styles.selectedTab : styles.tab}
             value="editproject">
             {typeof window !== 'undefined' ?
               <EditProjectForm projectId={Router.query.project}/>
               :
               null
             }

          </Tab>

          <Tab label="Private Feedback"
            style={{width: 'auto', fontSize: '16px'}}
              onTouchTap={(e) => this.changeAnchorEl('privatefeedback', e)}
                buttonStyle={this.state.selected === 'privatefeedback' ? styles.selectedTab : styles.tab}
             value="privatefeedback">
             {typeof window !== 'undefined' ?
             <PrivateFeedback projectId={Router.query.project}/>
             :
             null}
          </Tab>

        </Tabs>

          <div style={{position: 'fixed', bottom: 0, height: 150 , textAlign: 'center', width: '100%', maxWidth: 900,
            display: this.state.selected === 'admin' ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
            <div>
              <b>Contact your supporters</b>
            </div>
            <RaisedButton primary={true} label='Send Email' onClick={this.handleEmail}/>
          </div>
        </div>
      </div>
      </App>
    )
  }
}

export default withMui(Admin)
