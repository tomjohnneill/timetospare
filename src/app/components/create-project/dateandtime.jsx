import React from 'react';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';
import DocumentTitle from 'react-document-title';
import MediaQuery from 'react-responsive';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Checkbox from 'material-ui/Checkbox';
import Link from "next/link"
import Router from 'next/router'
import TypeOfDate from './type-of-date.jsx';
import {PlacesWithStandaloneSearchBox} from '../placesearch.jsx';

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
  inputStyle :
  {borderRadius: '2px', border: '1px solid #aaa',
    paddingLeft: '12px',  boxSizing: 'border-box'}
}

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

function disableDates(date) {
  var basics = JSON.parse(localStorage.getItem('basics'))
  var deadline = basics ? parseISOString(basics.deadline): null
  return  date < deadline;
}


class Form extends React.Component {
  constructor(props) {
    super(props);
    var times = JSON.parse(localStorage.getItem('times'))
    this.state = {
      startDate: times && times['Start Time'] ? parseISOString(times['Start Time']): null,
      endDate: times && times['End Time'] ? parseISOString(times['End Time']): null,
      startTime: times && times['Start Time']? parseISOString(times['Start Time']): null,
      endTime: times && times['End Time'] ? parseISOString(times['End Time']): null,
      address: times && times.address ? times.address : '',
    }
  }

  debounce = function(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

  onChange = (address) => this.setState({ address })

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


  handleSetGeopoint = (lat, lng, address) => {
    this.setState({geopoint: {lat: lat, lng: lng}, address: address})
  }


  handleNext = (e) => {
    var startTime = new Date(this.state.startTime)
    var startHours = startTime.getHours()
    var startMinutes = startTime.getMinutes()
    var startDate = new Date(this.state.startDate)
    startDate.setHours(startHours)
    startDate.setMinutes(startMinutes)

    var endTime = new Date(this.state.endTime)
    var endHours = endTime.getHours()
    var endMinutes = endTime.getMinutes()
    var endDate = new Date(this.state.endDate)
    endDate.setHours(endHours)
    endDate.setMinutes(endMinutes)

    var times =
      {'Start Time': startDate,
        'End Time': endDate,
        'Remote': this.state.remote,
      'address': this.state.address,
       'location': this.state.geopoint}
    var timeString = JSON.stringify(times)
    localStorage.setItem('times', timeString)
    Router.push('/create-project?stage=3')

  }

  handleSetStartDate = (e, date) => {
    this.setState({startDate: date, endDate: date})

  }

  handleSetEndDate = (e, date) => {
    this.setState({endDate: date})
  }


    handlePrevious = (e) => {
      e.preventDefault()
      Router.push('/create-project?stage=1')
    }

  handleSetStartTime = (e, date) => {
    console.log(date)
    var today = new Date(date)
    var newDate = new Date(today.setHours(today.getHours() + 2));
    this.setState({startTime: date, endTime: newDate})
  }

  handleSetEndTime = (e, date) => {
    this.setState({endTime: date})
  }


  setRemote = (e, checked) => {
    this.setState({remote: checked})
  }

  pushData = (key, value) => {
    this.setState({[key]: value})
  }

  render() {
    console.log(this.state)
    return (
      <div className='form' style={{textAlign: 'left', width: '100%'}}>
        <DocumentTitle title='Create Project'/>
        <p className='desktop-header'>
          If this is an event, can you give some details?</p>
          <div style={{width: '100%', paddingBottom: '16px', boxSizing: 'border-box'}}>

            <div style={{display: 'flex'}}>
              <div style={{flex: 1}}>
                <p style={styles.header}>
                  Where is this happening?
                </p>
                <PlacesWithStandaloneSearchBox
                  bounds={null}
                  disabled={this.state.remote}
                  currentLocation = {this.state.address}
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
              <div style={{width: 100, marginLeft: 10}}>
                <p style={styles.header}>
                  Remote?
                </p>
                <div style={{height: 40.4, display: 'flex', alignItems: 'center'}}>
                  <Checkbox
                    onCheck={this.setRemote}
                    style={{width: '20%', marginLeft: '25px'}}
                    />
                </div>
              </div>
            </div>

          </div>
          <TypeOfDate
            pushData = {this.pushData}
            />


        <RaisedButton label='Previous' backgroundColor='#C5C8C7'
            onTouchTap={this.handlePrevious}
            style={{marginRight: 16, height: '36px', boxShadow: ''}} overlayStyle={{height: '36px'}}
            buttonStyle={{height: '36px'}}
            labelStyle={{ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                 letterSpacing: '0.6px', fontWeight: 'bold'}}/>
        <MediaQuery minDeviceWidth={700}>
          <RaisedButton label='NEXT'
              onClick={this.handleNext}
              disabled={!this.state.startDate || !this.state.startTime || !this.state.endDate || !this.state.endTime || (!this.state.address && !this.state.remote)}
              style={{marginRight: 16, height: '36px', boxShadow: ''}} primary={true} overlayStyle={{height: '36px'}}
              buttonStyle={{height: '36px'}}
               labelStyle={{height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    letterSpacing: '0.6px', fontWeight: 'bold'}}/>
        </MediaQuery>
        <MediaQuery maxDeviceWidth={700}>
          <RaisedButton label='NEXT' backgroundColor='#000AB2'
              onClick={this.handleNext}
              style={{marginRight: 16, height: '36px', marginTop: '16px', boxShadow: ''}} primary={true} overlayStyle={{height: '36px'}}
              buttonStyle={{height: '36px'}}
              labelStyle={{height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                   letterSpacing: '0.6px', fontWeight: 'bold'}}
              disabled={!this.state.startDate || !this.state.startTime || !this.state.endDate || !this.state.endTime || (!this.state.address && !this.state.remote)}
            />
        </MediaQuery>
      <RaisedButton label='Skip' secondary={true}
          onClick={() => Router.push('/create-project?stage=3')}
          style={{marginRight: 16, height: '36px', boxShadow: ''}} overlayStyle={{height: '36px'}}
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

export default class DateAndTime extends React.Component {
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
