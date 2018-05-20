import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Link from "next/link"
import Router from 'next/router'
import AutoComplete from 'material-ui/AutoComplete';
import DatePicker from 'material-ui/DatePicker';
import MediaQuery from 'react-responsive';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {orange500} from 'material-ui/styles/colors';
import DocumentTitle from 'react-document-title';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Chip from 'material-ui/Chip';

const styles = {
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
      inputStyle :
      {borderRadius: '2px', border: '1px solid #aaa',
        paddingLeft: '12px',  boxSizing: 'border-box'}
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

function disableDates(date) {

  var deadline = new Date()
  return  date < deadline;
}

export class Form extends React.Component {
  constructor(props) {
    super(props);
    var basics = JSON.parse(localStorage.getItem('basics'))
    this.state = {
      searchText: '', places: [], loading: true,
      min: basics? basics.min : null,
      max: basics ? basics.max : null,
      meetup: basics ? basics.meetup : null,
      deadline: basics && basics.deadline ? parseISOString(basics.deadline): null,
      tags: basics && basics? basics.tags: [],
      allTags: categories
    }
  }


  handleNext = (e) => {
    e.preventDefault()
    var basics = {min: this.state.min, max: this.state.max, deadline: this.state.deadline, tags: this.state.tags,
      meetup: this.state.meetup}
    var basicString = JSON.stringify(basics)
    localStorage.setItem('basics', basicString)
    if (this.state.meetup) {
      var link = this.state.meetup
      link = link.replace('https://www.meetup.com/', '')
      var pathname = link.split( '/' )
      fetch(`https://us-central1-whos-in-dev.cloudfunctions.net/getMeetupEventInfo?eventId=${pathname[2]}&group=${pathname[0]}`)
      .then(response => response.json())
      .then(responseData => {
        console.log(responseData)
        var data = responseData.data
        var times = {}
        times['Start Time'] = new Date(data.time).toISOString()
        times['End Time'] = new Date(data.time + data.duration).toISOString()
        times.address = data.venue.address_1
        times.location = {lat: data.venue.lat, lng: data.venue.lon}
        var timeString = JSON.stringify(times)
        localStorage.setItem('times', timeString)

        localStorage.setItem('story', data.description)
        localStorage.setItem('title', data.name)
        Router.push('/create-project?stage=2')
      })
    } else {
      Router.push('/create-project?stage=2')
    }


  }

  handleSetMin = (e) => {
    this.setState({min: e.target.value})
  }

  handleSetMax = (e) => {
    this.setState({max: e.target.value})
  }

  handleSetMeetup = (e) => {
    this.setState({meetup: e.target.value})
  }


  handleSetDeadline = (e, date) => {
    this.setState({deadline: date})
  }

  handleRequestDelete = (key) => {
    const chipToDelete = this.state.tags.indexOf(key);
    var newTags = this.state.tags
    newTags.splice(chipToDelete, 1);

    var allTags = this.state.allTags
    allTags.push(key)
    console.log(allTags)
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

  handleChangeType = (event, index, value) => this.setState({type: value});

  render() {
    console.log(this.state)
    return (
      <div className='form' style={{textAlign: 'left', width: '100%'}}>
        <DocumentTitle title='Create Project'/>
        <p className='desktop-header'>
          Let's start with the basics</p>

        <div style={{width: '100%', paddingBottom: '16px', boxSizing: 'border-box'}}>
          <p style={styles.header}>
            How many people are you looking for?
          </p>
          <div style={{display: 'flex'}}>
          <div style={{flex: 1, paddingRight: '6px'}}>
            <TextField fullWidth={true}
              inputStyle={styles.inputStyle}
              underlineShow={false}
              hintText={'Minimum'}
              value={this.state.min}
              hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
              key='min'
              onChange={this.handleSetMin}
              style={styles.textfield}/>
          </div>
          <div style={{flex: 1, paddingLeft: '6px'}}>
            <TextField fullWidth={true}
              inputStyle={styles.inputStyle}
              underlineShow={false}
              hintText={'Maximum'}
              hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
              key='max'
              errorStyle={{marginTop: 6, color: orange500, textAlign: 'center'}}
              errorText={this.state.max && this.state.min
                  && Number(this.state.max) < Number(this.state.min) ? 'You just set max < min' : null}
              value={this.state.max}
              onChange={this.handleSetMax}
              style={styles.textfield}/>
          </div>
          </div>
        </div>
        <div style={{width: '100%',  paddingBottom: '32px',
           boxSizing: 'border-box'}}>
          <p style={styles.header}>
            When is the deadline for sign ups?
          </p>
          <DatePicker
             style={styles.inputStyle}
               underlineShow={false}
               value={this.state.deadline}
               autoOk={true}
               onChange={this.handleSetDeadline}
               shouldDisableDate={disableDates}
               hintStyle={{  bottom: '8px'}}
               hintText="Deadline" textFieldStyle={styles.textfield}/>

        </div>
        <div style={{width: '100%',  paddingBottom: '32px',
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
        <Card
          style={{border: '1px solid #aaa', borderRadius: 2, boxShadow: 'none', marginBottom: 20}}
          >
          <CardHeader
            title="Advanced Settings"

            actAsExpander={true}
            showExpandableButton={true}
          />
          <CardText expandable={true}>
            <div style={{fontWeight: 700, paddingBottom: 6}}>Link project to Meetup</div>
              <TextField fullWidth={true}
                inputStyle={styles.inputStyle}
                underlineShow={false}
                hintText={'Copy Meetup Event URL here'}
                hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                key='meetup'
                value={this.state.meetup}
                onChange={this.handleSetMeetup}
                style={styles.textfield}/>
          </CardText>
        </Card>
        <RaisedButton label='NEXT'
          onClick={this.handleNext}
          disabled={!this.state.deadline || !this.state.min }
          style={{height: '36px', boxShadow: ''}} primary={true} overlayStyle={{height: '36px'}}
          buttonStyle={{height: '36px'}}
           labelStyle={{height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                letterSpacing: '0.6px', fontWeight: 'bold'}}/>
      </div>
    )
  }
}


function parseISOString(s) {
  var b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

export default class Basics extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <MediaQuery minDeviceWidth={700}>
          <div style={{display: 'flex', paddingLeft: '100px', paddingTop: '50px', paddingRight: '100px'}}>
            <div style={{maxWidth: '500px', display: 'flex'
              , justifyContent: 'center'}} className='basics-container'>
              <div style={{paddingRight: '50px'}}>
                <Form />
              </div>
            </div>

              <div style={{flex: 1, paddingLeft: '50px', boxSizing: 'border-box'}} className='basics-image'>
                <img src='https://dru-cdn.zipcar.com/sites/default/files/6__milwaukeefarm_4.jpg'
                  style={{width: '100%', height: '70vh', objectFit: 'cover', borderRadius: '10px'}}/>
              </div>

          </div>
        </MediaQuery>
        <MediaQuery maxDeviceWidth={700}>
          <div style={{padding: '16px'}}>
            <Form />
          </div>
        </MediaQuery>
      </div>
    )
  }
}
