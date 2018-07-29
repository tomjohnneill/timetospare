import React from 'react'
import App from '../components/App.js'
import Router from 'next/router'
import withMui from '../components/hocs/withMui';
import Breadcrumbs from '../components/onboarding/breadcrumbs.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import UploadPhoto from '../components/uploadphoto.jsx'
import {Spiral, CalendarIcon, Place, Clock, World} from '../components/icons.jsx';
import {PlacesWithStandaloneSearchBox} from '../components/placesearch.jsx';
import {styles} from '../components/organisation-details.jsx';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {orange500} from 'material-ui/styles/colors';
import Checkbox from 'material-ui/Checkbox';
import Close from 'material-ui/svg-icons/navigation/close';
import IconButton from 'material-ui/IconButton';
import Notes from 'material-ui/svg-icons/editor/text-fields';
import ShortText from 'material-ui/svg-icons/editor/short-text';
import AddPhoto from 'material-ui/svg-icons/image/add-a-photo';
import Top from 'material-ui/svg-icons/editor/vertical-align-top';
import Lock from 'material-ui/svg-icons/action/lock';
import People from 'material-ui/svg-icons/social/people';
import DatePicker from 'material-ui/DatePicker';
import Dialog from 'material-ui/Dialog';
import moment from 'moment'
import TimePicker from '../components/timepicker.jsx';
import Bottom from 'material-ui/svg-icons/editor/vertical-align-bottom';
import 'react-quill/dist/quill.snow.css';
import Chip from 'material-ui/Chip';
import AutoComplete from 'material-ui/AutoComplete';
import Category from 'material-ui/svg-icons/device/widgets';
import {formatDateHHcolonMM} from '../components/timepicker.jsx';
import fire from '../fire';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';

let db = fire.firestore()

var tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline','strike', 'blockquote'],
      [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
      ['link', 'image', 'video'],
      ['clean']
    ]
  }

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

const editStyles = {
  container : {
    display: 'flex', alignItems: 'center', padding: 10,
    boxSizing: 'border-box'
  },
  icon: {
    height: 20, width: 54
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
        margin: 4,
        cursor: 'pointer'
      },
  selectedChip: {
    margin: 4
  },
}

class ProjectEdit extends React.Component {
  static async getInitialProps({req}){
     if(req){
       return req.query
     } else {
       // called on client
     }
    }

  constructor(props) {
    super(props);
    this.state = {story: '', startDate: new Date(this.props.startDate)}
    if (typeof window !== 'undefined') {
      this.ReactQuill = require('react-quill')
      this.state = {
        story: '',
        tags: [],
        allTags: categories,
        startDate: Router.query.startDate ? new Date(Number(Router.query.startDate)) : new Date(),
        endDate: Router.query.endDate ? new Date(Number(Router.query.endDate)) : new Date(),
        title: Router.query.title
      }
      console.log(new Date(Number(Router.query.startDate)))
    } else {
      this.state = {
        story: '',
        tags: [],
        allTags: categories,
        startDate: this.props.url.query.startDate ? new Date(Number(this.props.url.query.startDate)) : new Date(),
        endDate: this.props.url.query.endDate ? new Date(Number(this.props.url.query.endDate)) : new Date(),
        title: this.props.title
      }
    }
    console.log(this.props)

  }

  componentDidMount(props) {
    this.setState({client: true})
    if (Router.query.organisation) {
      fire.auth().onAuthStateChanged((user) => {
        if (user === null) {

        } else {
          fire.auth().currentUser.getIdToken()
          .then((token) =>
            fetch(`https://us-central1-whosin-next.cloudfunctions.net/users-getMemberDetails?organisation=${Router.query.organisation}`, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
              },
            })
            .then(response => response.json())
            .then((memberArray) => {
              console.log(memberArray)
              if (memberArray) {
                this.setState({members: memberArray})
              }
              console.log(memberArray)

            })
          )
        }
      })
    }
  }

  handleSetStory = (value) => {
    localStorage.setItem('story', value)
    this.setState({story: value})
  }

  handleFocus = (e) => {
    console.log('hi')
    console.log(e)
  }

  formatDate = (date) => {
    return moment(date, 'YYY-MM-DD').format('MMM DD[, ]YYYY')
  }

  getStartDateInfo = () => {
    if (this.state.startDate) {
      var year = this.state.startDate.getFullYear()
      var month = this.state.startDate.getUTCMonth()
      var day = this.state.startDate.getDate()
      var hours = this.state.startDate.getHours()
      var minutes = this.state.startDate.getMinutes()
      return ({year: year, month: month, day: day, hours: hours, minutes: minutes})
    } else {
      var today = new Date()
      return ({hours: 0, minutes: 0, year: today.getFullYear(), month: today.getUTCMonth(), day: today.getHours()})
    }

  }

  getEndDateInfo = () => {
    if (this.state.endDate) {
      var year = this.state.endDate.getFullYear()
      var month = this.state.endDate.getUTCMonth()
      var day = this.state.endDate.getDate()
      var hours = this.state.endDate.getHours()
      var minutes = this.state.endDate.getMinutes()
      return ({year: year, month: month, day: day, hours: hours, minutes: minutes})
    }
    else {
      var today = new Date()
      return ({hours: 0, minutes: 0, year: today.getFullYear(), month: today.getUTCMonth(), day: today.getHours()})
    }
  }

  getDateDiff = () => {
    var diff = this.state.endDate - this.state.startDate
    console.log(diff)
    return diff
  }

  setTime = (time) => {
    var ampm = time.slice(time.length -2 , time.length)
    var hours = Number(time.substring(0, time.indexOf(':')))
    if (ampm == 'pm') {
      hours += 12
    }
    if (hours === 24) {
      hours = 0
    }
    var minutes = Number(time.substring(time.indexOf(':') + 1, time.length -2))
    var startDateInfo = this.getStartDateInfo()
    var startDate = new Date(startDateInfo.year, startDateInfo.month, startDateInfo.day,
       hours, minutes)
    var diff = this.getDateDiff()

    console.log(startDate.getTime() + diff)
    var endDate = new Date(startDate.getTime() + diff)
    this.setState({startDate: startDate, endDate: endDate})
  }

  setEndTime = (time) => {
    var ampm = time.slice(time.length -2 , time.length)
    var hours = Number(time.substring(0, time.indexOf(':')))
    if (ampm == 'pm') {
      hours += 12
    }
    if (hours === 24) {
      hours = 0
    }
    var minutes = Number(time.substring(time.indexOf(':') + 1, time.length -2))
    var endDateInfo = this.getEndDateInfo()
    var endDate = new Date(endDateInfo.year, endDateInfo.month, endDateInfo.day,
       hours, minutes)
    this.setState({endDate: endDate})
  }

  handleStartDateChange = (e, date) => {
    var startDateInfo = this.getStartDateInfo()
    var newDate = new Date(date)
    newDate.setHours(startDateInfo.hours, startDateInfo.minutes)
    if (this.state.endDate) {
      var diff = this.getDateDiff()
      var endDate = new Date(newDate.getTime() + diff)
      this.setState({endDate: endDate})
    } else {
      var diff = 60 * 60 * 1000
      var endDate = new Date(newDate.getTime() + diff)
      this.setState({endDate: endDate})
    }
    this.setState({startDate: newDate})
  }

  handleEndDateChange = (e, date) => {
    var endDateInfo = this.getEndDateInfo()
    var newDate = new Date(date)
    newDate = new Date(newDate.setHours(endDateInfo.hours, endDateInfo.minutes))
    console.log(newDate)
    this.setState({endDate: newDate})
  }

  handleChangeItem = (item, nv) => {
    console.log(item)
    this.setState({[item]: nv})
  }

  handleSaveProject = () => {
    console.log('Saving project')
    var batch = db.batch();


    var body = {
      'Start Time' : this.state.startDate,
      'End Time' : this.state.endDate,
      'Admin' : {
        [fire.auth().currentUser.uid] : true
      },
      Name: this.state.title ? this.state.title : null,
      Description: this.state.story ? this.state.story : null,
      Summary: this.state.tagline ? this.state.tagline : null,
      Creator: fire.auth().currentUser.uid,
      'Target People': this.state.min ? this.state.min : null,
      'Maximum People': this.state.max ? this.state.max : null,
      'Featured Image': localStorage.getItem('coverPhoto') ? localStorage.getItem('coverPhoto') :null,
      'Location': this.state.address ? this.state.address : null,
      Geopoint: this.state.geopoint ? this.state.geopoint : null,
      created: new Date(),
      Tags: this.state.tags ? this.state.tags : null,
      Invited: this.state.users ? this.state.users : null,
      Lists : this.state.lists ? this.state.lists : null
    }
    console.log(body)
    db.collection("Project").add(body).then((docRef) => {
      this.state.users.forEach((user) => {
        let interactionDoc = db.collection("Interactions").doc()
        batch.set(interactionDoc, {
          Type: 'Invited',
          Member: user._id,
          Organisation: Router.query.organisation,
          Date: new Date(),
          Project: docRef.id
        })
      })
      batch.commit()
      Router.push(`/project?project=${docRef.id}`, `/projects/p/${docRef.id}`)
    })
  }

  handleSetGeopoint = (lat, lng, address) => {
    this.setState({geopoint: {lat: lat, lng: lng}, address: address})
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

  handleUpdateInput = (e, searchText) => {
    this.setState({searchText: searchText})
  }

  addPerson = (person) => {
    this.setState({searchText: ''})
    var users = this.state.users ? this.state.users : []
    users.push(person)
    this.setState({users: users})
  }

  removePerson = (person) => {
    var users = this.state.users
    var index = users.indexOf(person)
    users.splice(index, 1)
    this.setState({users: users})
  }

  handleStoryChange = (value) => {
    this.setState({story: value})
  }

  render() {
    var updatedList
    if (this.state.searchText && this.state.members) {
      var length = this.state.searchText.length
      var people = Object.values(this.state.members)
      var filteredPeople = []
      people.forEach((person) => {
        if (person['Full Name'].substring(0, length).toLowerCase() === this.state.searchText.toLowerCase()) {
          filteredPeople.push(person)
          console.log(person)
        }
      })
      console.log(filteredPeople)
    }

    const ReactQuill = this.ReactQuill
    console.log(styles)
    console.log(this.state)
    return (
      <div>

          <div style={{textAlign: 'left'}}>

            <div style={{width: '100%', display: 'flex', backgroundColor: '#f5f5f5'}}>
              <div style={{width: '50%', padding: 15}}>
                <div style={editStyles.container}>
                  <IconButton
                    onClick={() => Router.push('/project-calendar')}
                    tooltip='Back to calendar'
                    style={{padding: 0, width: 54, height: 54}} iconStyle={{width: 54, height: 30}}>
                    <Close  color={'#484848'}/>
                  </IconButton>
                  <div style={{flex: 1}}>
                    <TextField fullWidth={true}
                      inputStyle={{borderRadius: '2px', border: '1px solid #aaa',
                        paddingLeft: '12px',  boxSizing: 'border-box', fontSize: '18px'}}
                      underlineShow={false}
                      hintText='Title'
                      onChange={(e, nv) => this.handleChangeItem('title', nv)}
                      hintStyle={{ paddingLeft: '12px',fontSize: '18px',  bottom: '12px'}}
                      key='title'
                      value={this.state.title != 'undefined' ? this.state.title : null}
                      style={{backgroundColor: 'rgb(255,255,255)',
                      height: '50px'}}/>
                  </div>
                </div>
                <div style={editStyles.container}>
                  <div style={{width: 54}}/>
                    <div style={{display: 'flex', marginTop: 10, backgroundColor: '#f5f5f5',
                    alignItems: 'center', justifyContent: 'space-between',
                    width: 450,
                  paddingRight: 6}}>

                    <DatePicker autoOk={true}
                      formatDate={this.formatDate}
                      disableYearSelection={true}
                      hintText='From'
                      onChange={this.handleStartDateChange}
                      hintStyle={{paddingLeft: 8, bottom: 8, position: 'absolute'}}
                      value={this.state.startDate ? this.state.startDate : null}
                      textFieldStyle={{width: 100, fontSize: '14px', backgroundColor: 'white',
                        border: '1px solid #aaa', borderRadius: 3, height: 40, paddingLeft: 6}}
                        underlineShow={false}
                      style={{width:100, height: 40}} container="inline" />
                      <TimePicker
                        key='1'
                        style={{width:72, height: 40}}
                        underlineShow={false}
                        textFieldStyle={{width: 72, fontSize: '14px', backgroundColor: 'white',
                          border: '1px solid #aaa', borderRadius: 3, height: 40, paddingLeft: 6}}
                        selected={this.state.startDate ?  formatDateHHcolonMM(this.state.startDate) : null}
                        getTime={this.setTime}
                        from={new Date()} until={tomorrow}/>
                      <div style={{padding: 0}}>
                        –
                      </div>
                      <TimePicker
                        key='2'
                        style={{width: 72, height: 40}}
                        underlineShow={false}
                        getTime={this.setEndTime}
                        textFieldStyle={{width: 72, fontSize: '14px', backgroundColor: 'white',
                          border: '1px solid #aaa', borderRadius: 3, height: 40, paddingLeft: 6}}
                        selected = {this.state.endDate ?  formatDateHHcolonMM(this.state.endDate) : null}
                        from={this.state.startTime ? this.state.startTime : new Date()} until={tomorrow}/>
                        <DatePicker autoOk={true}
                          value={this.state.endDate ? this.state.endDate : null}
                          formatDate={this.formatDate}
                          disableYearSelection={true}
                          hintText='To'
                          onChange={this.handleEndDateChange}
                          hintStyle={{paddingLeft: 8, bottom: 8, position: 'absolute'}}
                          textFieldStyle={{width: 100, fontSize: '14px', backgroundColor: 'white',
                            paddingLeft: 6,
                            border: '1px solid #aaa', borderRadius: 3, height: 40}}
                            underlineShow={false}
                          style={{width:100, height: 40}} container="inline" />
                    </div>
                </div>
                <div style={{paddingLeft: 64, paddingBottom: 10}}>
                  <DropDownMenu
                    style={{textAlign: 'left', height: 40}}
                    onChange={(e, key, value) => this.handleChangeItem('recurring', value)}
                    labelStyle={{backgroundColor: 'white', height: 40, border: '1px solid #aaa',
                      borderRadius: 2, display: 'flex', alignItems: 'center'}}
                    iconStyle={{height: 40}}
                    underlineStyle={{border: 'none'}}
                    selectedMenuItemStyle={ {backgroundColor: '#f5f5f5', color: '#000AB2', fontWeight: 'bold'} }
                    menuStyle={{textAlign: 'left'}}
                    value={this.state.recurring ? this.state.recurring : 'norepeat'} >
                    <MenuItem value={'norepeat'} primaryText='Does not repeat' />
                    <MenuItem value={'daily'} primaryText='Daily' />
                    <MenuItem value={'weekly'} primaryText={`Weekly on ${this.state.startDate.toLocaleDateString('en-GB', { weekday: 'long' })}`} />
                    <MenuItem value={'weekday'} primaryText='Every weekday' />
                    <MenuItem
                      onClick={() => this.setState({customOpen: true})}
                      value={'custom'} primaryText='Pick dates' />

                  </DropDownMenu>
                  <Dialog
                    open={this.state.customOpen}
                    onRequestClose={() => this.setState({customOpen: false, recurring: 'norepeat'})}
                    >
                    <p style={{fontWeight: 700}}>Custom repeat project</p>
                    Repeat
                  </Dialog>
                </div>
              </div>
              <div style={{paddingTop: 15, height: 74, display: 'flex', alignItems: 'center'}}>
                <RaisedButton primary={true} label='Save'
                  style={{height: 32, borderRadius: 3}}
                  onClick={this.handleSaveProject}
                  labelStyle={{fontSize: '12px', fontWeight: 700}}
                  />
              </div>
            </div>

            <div style={{width: '100%', display: 'flex', backgroundColor: '#f5f5f5'}}>
              <div style={{flex: 1, boxSizing: 'border-box'}}>
                <div style={{width: '100%',
                  lineHeight: '40px',borderBottom: '1px solid #aaa',
                color: '#000AB2', fontSize: '12px', fontWeight: 'bold'}}>
                  <div style={{textAlign: 'center', marginBottom: '-1px', marginLeft: 10,
                    width: 120, borderBottom: '2px solid #000AB2'}}>
                    PROJECT DETAILS
                  </div>
                </div>
                <div style={{boxSizing: 'border-box', padding: 15, borderRight: '1px solid #aaa'}}>
                  {
                  this.state.client ?
                    <div style={{display: 'flex', alignItems: 'top', padding: 10,
                    boxSizing: 'border-box'}}>
                      <AddPhoto style={{paddingTop: 10, width: 54, height: 20}} color={'#484848'}/>
                      <div style={{flex: 1}}>
                        <UploadPhoto
                          changeParentState={() => this.setState({pictureUploaded: true})}
                          height={'200px'}
                          width='100%'
                          edit/>
                      </div>
                    </div>
                    :
                    null
                  }
                  <div style={editStyles.container}>
                    <Place style={editStyles.icon} fill={'#484848'}/>
                    <div style={{flex: 1}}>
                      <PlacesWithStandaloneSearchBox
                        bounds={null}
                        disabled={this.state.remote}
                        currentLocation = {this.state.address}
                        reportPlaceToParent={(places) =>
                          {

                            var geo = places[0].geometry.location
                            var lat = geo.lat()
                            var lng = geo.lng()
                            this.handleSetGeopoint(lat, lng, places[0].formatted_address)

                          }
                        }
                        />
                    </div>
                  </div>

                  <div style={editStyles.container}>
                    <ShortText style={editStyles.icon} color={'#484848'}/>
                    <div style={{flex: 1}}>
                      <TextField fullWidth={true}
                        inputStyle={styles.inputStyle}
                        underlineShow={false}
                        hintText='Tagline'
                        value={this.state.summary}
                        onChange={(e, nv) => this.handleChangeItem('summary', nv)}
                        onFocus={this.handleFocus}
                        hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                        key='tagline'
                        style={styles.whiteTextfield}/>
                    </div>
                  </div>

                  <div style={{display: 'flex', alignItems: 'top', padding: 10,
                  boxSizing: 'border-box'}}>
                    <Category style={{paddingTop: 10, width: 54, height: 20}} color={'#484848'}/>
                    <div style={{flex: 1}}>
                      <div style={editStyles.wrapper}>
                        {this.state.tags.map((tag) => (
                          <Chip
                            key={tag}
                            style={editStyles.selectedChip}
                            backgroundColor={'#65A1e7'}
                            onRequestDelete={() => this.handleRequestDelete(tag)}
                          >
                            {tag}
                          </Chip>
                        ))}
                      </div>


                      <div style={editStyles.wrapper}>
                        {this.state.allTags.map((tag) => (
                          <Chip
                            key={tag}
                            style={editStyles.chip}
                            onTouchTap={() => this.handleAddTag(tag)}
                          >
                            {tag}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{display: 'flex', alignItems: 'top', padding: 10,
                  boxSizing: 'border-box'}}>
                    <Notes style={{paddingTop: 10, width: 54, height: 20}}
                      color={'#484848'}/>
                    <div style={{flex: 1}}>
                      {typeof window !== 'undefined' && ReactQuill ?
                      <ReactQuill
                        style={{fontFamily: 'Nunito', backgroundColor: 'white'}}
                        modules={modules}
                        toolbar={{fontName: 'Nunito'}}
                        onChange={this.handleStoryChange}
                        value={this.state.story}
                           />
                        : null}
                    </div>
                  </div>

                </div>
              </div>
              <div style={{flex: 1, boxSizing: 'border-box'}}>
                <div style={{width: '100%', borderBottom: '1px solid #aaa',
                  lineHeight: '40px',
                color: '#000AB2', fontSize: '12px', fontWeight: 'bold'}}>
                  <div style={{textAlign: 'center', marginBottom: '-1px', marginLeft: 10,
                    width: 100, borderBottom: '2px solid #000AB2'}}>
                    THE PEOPLE
                  </div>
                </div>
                <div style={{padding: 15}}>
                  <div style={{width: '100%', boxSizing: 'border-box'}}>
                    <p style={{marginTop: 0}}>
                      How many people are you looking for?
                    </p>
                    <div style={{display: 'flex'}}>
                    <div style={{flex: 1, paddingRight: '6px'}}>
                      <div style={editStyles.container}>
                        <Bottom style={editStyles.icon} color={'#484848'}/>
                        <div style={{flex: 1}}>
                          <TextField fullWidth={true}
                            inputStyle={styles.inputStyle}
                            underlineShow={false}
                            value={this.state.min}
                            onChange={(e, nv) => this.handleChangeItem('min', nv)}
                            type='number'
                            hintText='Minimum'
                            hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                            key='invite'
                            style={styles.whiteTextfield}/>
                        </div>
                      </div>
                    </div>
                    <div style={{flex: 1, paddingLeft: '6px'}}>
                      <div style={editStyles.container}>
                        <Top style={editStyles.icon} color={'#484848'}/>
                        <div style={{flex: 1}}>
                          <TextField fullWidth={true}
                            inputStyle={styles.inputStyle}
                            underlineShow={false}
                            hintText={'Maximum'}
                            value={this.state.max}
                            onChange={(e, nv) => this.handleChangeItem('max', nv)}
                            hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                            key='max'
                            type='number'
                            errorStyle={{marginTop: 6, color: orange500, textAlign: 'center'}}
                            errorText={this.state.max && this.state.min
                                && Number(this.state.max) < Number(this.state.min) ? 'You just set max < min' : null}
                            value={this.state.max}
                            key='invite'
                            style={styles.whiteTextfield}/>
                        </div>
                      </div>
                    </div>
                    </div>
                  </div>
                  <p>Project privacy</p>
                    <div style={editStyles.container}>
                      <Lock style={editStyles.icon} color={'#484848'}/>
                      <div style={{flex: 1}}>
                        <DropDownMenu
                          style={{textAlign: 'left', height: 40}}
                          labelStyle={{backgroundColor: 'white', height: 40, border: '1px solid #aaa',
                            borderRadius: 4, display: 'flex', alignItems: 'center'}}
                          iconStyle={{height: 40}}
                          selectedMenuItemStyle={ {backgroundColor: '#f5f5f5', color: '#000AB2'} }
                          onChange={(e, key, value) => this.handleChangeItem('visibility', value)}
                          value={this.state.visibility ? this.state.visibility : 'public'}
                          underlineStyle={{border: 'none'}}
                          menuStyle={{textAlign: 'left'}}
                            >
                          <MenuItem value={'public'} primaryText={<div><b>Public</b>: Publish to the front page</div>} />
                          <MenuItem value={'limited'} primaryText={<div><b>Limited</b>: Anyone with the link can see</div>} />
                          <MenuItem value={'private'} primaryText={<div><b>Private</b>: Only specific people can access</div>} />
                        </DropDownMenu>
                      </div>
                    </div>

                  <p>Invite individual volunteers</p>
                  { this.state.lists ?
                    <div>
                      <p>Choose list to see</p>
                        <DropDownMenu
                          style={{backgroundColor: 'white', textAlign: 'left'}}
                          menuStyle={{textAlign: 'left'}}
                          value={this.state.value} onChange={this.handleChange}>
                          {
                            this.state.lists.map((list) => {
                                <MenuItem value={list._id} primaryText={list.Name} />
                            })
                          }
                        </DropDownMenu>
                    </div>
                    :
                    null
                  }
                    <div style={editStyles.container}>
                      <People style={editStyles.icon} color={'#484848'}/>
                      <div style={{flex: 1}}>
                        {
                          this.state.users && this.state.users.length > 0 ?
                          <div style={{display: 'flex', flexWrap: 'wrap', paddingBottom: 6}}>
                            {this.state.users.map((user) => (
                              <Chip style={{margin: 4, backgroundColor: '#FFCB00'}}
                                onRequestDelete={() => this.removePerson(user._id, user['Full Name'], user.Email)}
                                >
                                {user['Full Name']}
                              </Chip>
                            ))}
                          </div>
                          :
                          null
                        }
                        <TextField fullWidth={true}
                          inputStyle={styles.inputStyle}
                          underlineShow={false}
                          ref={el => { this.el = el; }}
                          value={this.state.searchText}
                          hintText='Enter names or email addresses'
                          hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                          key='invite'
                          onChange={this.handleUpdateInput}
                          style={styles.whiteTextfield}/>
                          {this.state.searchText && filteredPeople ?
                        <List>
                        {
                          filteredPeople.map((person) => (
                            <ListItem
                              leftAvatar={<Avatar />}
                              onClick={() => this.addPerson(person)}
                              primaryText={person['Full Name']}
                              secondaryText={person['Email']}
                            />
                          ))
                        }
                        </List>
                      : null
                      }
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </div>

      </div>
    )
  }
}

export default withMui(ProjectEdit)
