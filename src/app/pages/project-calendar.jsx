import React from 'react';
import BigCalendar from 'react-big-calendar'
import Router from 'next/router'
import App from '../components/App';
import fire from '../fire';
import IconButton from 'material-ui/IconButton';
import AddCircle from 'material-ui/svg-icons/content/add'
import moment from 'moment'
import Loading from '../components/loading.jsx';
import Dialog from 'material-ui/Dialog';
import DropDownMenu from 'material-ui/DropDownMenu';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import RaisedButton from 'material-ui/RaisedButton';
import MenuItem from 'material-ui/MenuItem';
import "react-big-calendar/lib/css/react-big-calendar.css"
import {Clock, Place, Tag} from '../components/icons.jsx';
import AutoComplete from 'material-ui/AutoComplete';
import withMui from '../components/hocs/withMui';
import TextField from 'material-ui/TextField';
import TimePicker from '../components/timepicker.jsx';
import DatePicker from 'material-ui/DatePicker';
import Breadcrumbs from '../components/onboarding/breadcrumbs.jsx';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import AddTag from '../components/addTag.jsx';
import {buttonStyles, chipStyles} from '../components/styles.jsx';
import Link from 'next/link';
import LinesEllipsis from 'react-lines-ellipsis';
import ShortText from 'material-ui/svg-icons/editor/short-text';
import {formatDateHHcolonMM} from '../components/timepicker.jsx';
import Delete from 'material-ui/svg-icons/action/delete'
import Close from 'material-ui/svg-icons/navigation/close'
import {CirclePicker} from 'react-color';
import Chip from 'material-ui/Chip';
import ColorLens from 'material-ui/svg-icons/image/color-lens'
import OrganisationAutocomplete from '../components/organisation-autocomplete.jsx';

var tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))
let db = fire.firestore()

const editStyles = {
  container : {
    display: 'flex', alignItems: 'center', padding: 10,
    boxSizing: 'border-box'
  },
  icon: {
    height: 20, width: 54
  },
}

const styles = {
  whiteTextfield : {
    backgroundColor: 'rgb(255,255,255)',
    height: '40px',

  },
  inputStyle :
  {borderRadius: '2px', border: '1px solid #aaa',
    paddingLeft: '12px',  boxSizing: 'border-box'}
}

class YourCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: true}
  }

  componentWillUnmount(props) {
    this.unsubscribe()
  }

  getEventInteractions = () => {


    this.unsubscribe = db.collection("Events").where("managedBy", "==", Router.query.view)
    .onSnapshot((querySnapshot) => {
      var data = []
      querySnapshot.forEach((doc) => {
        var elem = doc.data()
        elem._id = doc.id
        var date = new Date(elem.Date)
        elem.Name = elem.name.text
        data.push(elem)
      })
      this.setState({events: data})
      this.setState({loading: false})
    })
  }

  componentDidMount(props) {
    Router.prefetch('/projectedit')
    this.setState({onboarding: Router.query.onboarding})

    fire.auth().onAuthStateChanged((user) => {
      if (user === null) {

      } else {
        if (!this.state.events) {

          this.getEventInteractions()
        }
      }
    })
    if (fire.auth().currentUser) {
        if (!this.state.events) {

          this.getEventInteractions()
        }

    }
  }

  setAsOpen = (slot) => {
    this.setState({open: true, startDate: slot.start, endDate: slot.end})
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
    var startTime = new Date(2018, 1, 1, hours, minutes)
    var endTime = new Date(2018, 1, 1, hours, minutes)
    endTime.setHours(endTime.getHours()+1)
    this.setState({startTime: startTime, endTime: endTime})
  }

  formatDate = (date) => {
    return moment(date, 'YYY-MM-DD').format('MMM DD[, ]YYYY')
  }

  handleMoreDetails = () => {
    if (this.state.startTime) {
      var startHours = this.state.startTime.getHours()
      var endHours = this.state.endTime.getHours()
      var startMinutes = this.state.startTime.getMinutes()
      var endMinutes = this.state.endTime.getMinutes()
      var startDate = this.state.startDate.setHours(startHours, startMinutes)
      var endDate = this.state.endDate.setHours(endHours, endMinutes)
      Router.push(`/projectedit?view=${Router.query.view}&startDate=${startDate}&endDate=${endDate}&title=${this.state.title}`)
    } else {
      Router.push(`/projectedit?view=${Router.query.view}&title=${this.state.title}`)
    }


  }

  eventStyleGetter = (event, start, end, isSelected) => {
    var publicStyle = {
        backgroundColor: event.color ? event.color : '#FFCB00',
        borderRadius: 2,
        margin: 2,
        color:  'black',
        border: '0px',
        display: 'block'
    }
    var calendarStyle = {
        backgroundColor: event.color ? event.color : '#000AB2',
        borderRadius: 2,
        margin: 2,
        color: 'white',
        border: '0px',
        display: 'block'
    }
    if (event.source == 'Eventbrite') {
      return {
        style: publicStyle
      }
    } else {
      return {
        style: calendarStyle
      }
    }
  }

  handleEventClick = (event, clickEvent) => {
    console.log(clickEvent)
    console.log(event)
    mixpanel.track('Clicked event')
    this.setState({
      viewOpen: true,
      targetedEvent: event,
      anchorEl: clickEvent.currentTarget,
    });
    //Router.push(`/project-admin?project=${event._id}&view=${Router.query.view}`)
  }

  handleRequestClose = () => {
  this.setState({
    viewOpen: false,
  });
};

  handleOptions = (e) => {
    this.setState({optionsOpen: true, optionsAnchorEl: e.currentTarget})
  }

  handleOptionsRequestClose = () => {
    this.setState({optionsOpen: false})
  }

  addMarkup(note) {
    return {__html: note}
  }

  handleChangeColor  = (color) => {
    console.log(color)
    var event = this.state.targetedEvent
    event.color = color.hex
    var indexPosition = this.state.events.indexOf(this.state.targetedEvent)
    var events = this.state.events
    events[indexPosition] = event
    this.setState({events: events, optionsOpen: false})
    db.collection("Events").doc(this.state.targetedEvent._id).update({color: color.hex})
  }

  handleDeleteEvent = () => {
    this.setState({viewOpen: false})
    db.collection("Events").doc(this.state.targetedEvent._id).delete()
    .then(() => {
      this.setState({viewOpen: false})
    })
  }

  handleTagAdded = (tag) => {
    console.log(tag)
  }

  filterByOrg = (org) => {
    console.log(org)
    this.setState({filterOrg: org._id})
  }

  render() {
    if (this.state.targetedEvent) {
      var start = new Date(this.state.targetedEvent.start)
      var end = new Date(this.state.targetedEvent.end)
    }

    var filteredEvents = []
    this.state.events && this.state.events.forEach((event) => {
      if (this.state.filterOrg) {
        if (event.Organisations && event.Organisations.includes(this.state.filterOrg)) {
          filteredEvents.push(event)
        }
      } else {
        filteredEvents.push(event)
      }
    })

    return (
      <div>
        <App>
          {
            this.state.targetedEvent ?
            <AddTag
              selection={[this.state.memberData]}
              text={`Tag "${this.state.targetedEvent.name.text}"`}
              organisation={this.props.url.query.view}
              open={this.state.tagOpen}
              type='event'
              event={this.state.targetedEvent._id}
              onTagAdded={this.handleTagAdded}
              onRequestClose={() => this.setState({tagOpen:false})}/>
            :
            null
          }

          <Popover
            style={{marginLeft: 20, width: 450}}
          open={this.state.viewOpen}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'right', vertical: 'center'}}
          targetOrigin={{horizontal: 'left', vertical: 'center'}}
          onRequestClose={this.handleRequestClose}
        >
        {
          this.state.targetedEvent ?
          <div style={{textAlign: 'left'}}>
            <div style={{float: 'right', display: 'flex'}}>
              <IconButton
                onClick={this.handleDeleteEvent}
                tooltip='Delete'
                iconStyle={{color: 'white'}}>
                <Delete/>
              </IconButton>
              <IconButton
                tooltip='Change Tags'
                onClick={() => this.setState({tagOpen: true, viewOpen: false})}
                 iconStyle={{color: 'white'}}>
                <Tag color='white'/>
              </IconButton>
              <IconButton
                tooltip='Change Colour'
                onClick={this.handleOptions}
                 iconStyle={{color: 'white'}}>
                <ColorLens/>
              </IconButton>
              <IconButton
                tooltip='Close'
                onClick={this.handleRequestClose}
                 iconStyle={{color: 'white'}}>
                <Close/>
              </IconButton>

            </div>
            <Link href={this.state.targetedEvent.source === 'Eventbrite' ?
              `/project-admin?project=${this.state.targetedEvent._id}&view=${Router.query.view}`:
              `/projectedit?event=${this.state.targetedEvent._id}&view=${Router.query.view}`}>
              <div style={{backgroundColor: this.state.targetedEvent && this.state.targetedEvent.color ? this.state.targetedEvent.color : '#000AB2'
                , color: 'white',
                minHeight: '50px', cursor: 'pointer',
                fontSize: '20px', padding: '80px 32px 0 64px'}}>
                {this.state.targetedEvent.Name}
              </div>
            </Link>
              <div>

                {
                  this.state.targetedEvent.Location ?
                  <div style={editStyles.container}>
                    <Place style={editStyles.icon} fill={'#484848'}/>
                    <div style={{flex: 1}}>
                      {this.state.targetedEvent.Location.toString()}
                    </div>
                  </div>
                  :
                  null
                }

                {
                  this.state.targetedEvent.start ?
                  <div style={editStyles.container}>
                    <Clock style={editStyles.icon} fill={'#484848'}/>
                    <div style={{flex: 1}}>
                      {start.toLocaleDateString('en-GB', {weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'})} -
                      {end.toLocaleDateString('en-GB', {weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric'})}
                    </div>
                  </div>
                  :
                  null
                }

                {
                  this.state.targetedEvent.summary ?
                  <div style={editStyles.container}>
                    <ShortText style={editStyles.icon} fill={'#484848'}/>
                    <div style={{flex: 1}}>
                      <div>
                        {this.state.targetedEvent.summary}
                      </div>
                    </div>
                  </div>
                  :
                  null
                }


                <div style={editStyles.container}>
                  <ShortText style={editStyles.icon} fill={'#484848'}/>
                  <div style={{flex: 1}}>
                    <div
                      className='story-text'
                       dangerouslySetInnerHTML={this.addMarkup(this.state.targetedEvent.description.text)}/>

                  </div>
                </div>

                {this.state.targetedEvent.tags ?
                <div style={editStyles.container}>
                  <Tag style={editStyles.icon} fill={'#484848'}/>
                  <div style={{flex: 1, flexWrap: 'wrap'}}>
                    {
                      this.state.targetedEvent.tags.map((tag) => (
                        <Chip style={chipStyles.chip}
                          labelStyle={chipStyles.chipLabel}>
                          {tag}
                        </Chip>
                      ))
                    }
                  </div>
                </div>
                :
                null}


              </div>

          </div>
          :
          null
        }

        </Popover>
        <Popover
          style={{overflow: 'hidden'}}
        open={this.state.optionsOpen}
        anchorEl={this.state.optionsAnchorEl}
        anchorOrigin={{horizontal: 'right', vertical: 'center'}}
        targetOrigin={{horizontal: 'left', vertical: 'center'}}
        onRequestClose={this.handleOptionsRequestClose}>
          <div style={{padding: 10, overflow: 'hidden'}}>
              <CirclePicker
              color={ this.state.targetedEvent && this.state.targetedEvent.color }
              onChangeComplete={ this.handleChangeColor }
            />
          </div>
        </Popover>
          <Dialog
            modal={false}
            paperStyle={{padding: '16px 16px 8px'}}
            open={this.state.open}
            bodyStyle={{padding: '16px 16px 8px'}}
            contentStyle={{maxWidth: 500}}
            onRequestClose={() => this.setState({open: false})}
            >
            <div style={{display: 'flex', paddingTop: 20  }}>
              <div style={{height: '100%'}}>
                <div style={{marginTop: 89, height: 40, display: 'flex',
                  paddingLeft: 10, paddingRight: 20, alignItems: 'center'}}>
                  <Clock style={{height: 20}}/>
                </div>
              </div>

              <div style={{flex: 1}}>
                <TextField fullWidth={true}
                  inputStyle={styles.inputStyle}
                  underlineShow={false}
                  hintStyle={{ paddingLeft: '12px', bottom: '8px'}}
                  key='name'
                  onChange = {(e, nv) => this.setState({title: nv})}
                  hintText='Add title'
                  style={styles.whiteTextfield}/>
                <div style={{color: 'white', fontWeight: 'bold', fontSize: '12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 10,
                  borderRadius: 12, width: 100, height: 24, backgroundColor: '#000AB2'}}>
                  New Project
                </div>


                <div style={{display: 'flex', marginTop: 15, backgroundColor: '#f5f5f5',
                alignItems: 'center', justifyContent: 'space-between', paddingLeft: 6,
              paddingRight: 6}}>

                <DatePicker autoOk={true}
                  formatDate={this.formatDate}
                  disableYearSelection={true}
                  value={this.state.startDate}
                  textFieldStyle={{width: 100, fontSize: '14px'}}
                  style={{width:100}} container="inline" />
                  <TimePicker
                    key='1'
                    textFieldStyle={{fontSize: '14px'}}
                    getTime={this.setTime}
                    from={new Date()} until={tomorrow}/>
                  <div style={{padding: 0}}>
                    –
                  </div>
                  <TimePicker
                    key='2'
                    textFieldStyle={{fontSize: '14px'}}
                    selected = {this.state.endTime ?  formatDateHHcolonMM(this.state.endTime) : null}
                    from={this.state.startTime ? this.state.startTime : new Date()} until={tomorrow}/>
                    <DatePicker autoOk={true}
                      value={this.state.endDate}
                      formatDate={this.formatDate}
                      disableYearSelection={true}
                      textFieldStyle={{width: 100, fontSize: '14px'}}
                      style={{width: 100}} container="inline" />
                </div>


                <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end', paddingTop: 15}}>
                  <RaisedButton
                    style={buttonStyles.smallSize}
                    primary={true}
                    onClick={this.handleMoreDetails}
                    labelStyle={buttonStyles.smallLabel}
                    label='Add More Details'/>
                </div>
              </div>
            </div>
          </Dialog>
          {
            this.state.onboarding ?
            <Breadcrumbs stepIndex={2}/>
            :
            null
          }
          <div style={{display: 'flex', alignItems: 'center',  width: '100%',
            backgroundColor: this.state.onboarding ? '#F5F5F5' : 'white', height: '150vh',
          flexDirection: 'column', textAlign:'left', padding: 20, boxSizing: 'border-box'}}>


            {
              !this.state.loading ?
              <div style={{height: '80vh', width: '100%', boxSizing: 'border-box', padding: '0px 15px'}}>
                <h2 style={{textAlign: 'left', width: '100%', display: 'flex', justifyContent: 'space-between'}}>
                  <div style={{flex: 5, fontSize: '30px', fontWeight: 200}}>
                    {this.state.onboarding ? 'Pick a date, and add a project' : 'Your project calendar'}
                  </div>
                  {
                    this.state.filterOrg ?
                    <div style={{display: 'flex', height: '56px', width: '56px', alignItems: 'center',
                    justifyContent: 'center'}}>
                      <IconButton
                        tooltip='Clear Filter'
                        iconStyle={{zIndex: 4, height: 24, padding: 0, width: 24}}
                        onClick={() => this.setState({filterOrg: null})}
                        style={{display: 'flex', alignItems: 'center', padding: 0, width: 24, height: 24}}>
                        <Close/>
                      </IconButton>
                    </div>

                    :
                    null
                  }
                  <div style={{flex: 3, display: 'flex', alignItems: 'center', marginRight: 20}}>
                    <OrganisationAutocomplete
                      handleNewRequest={this.filterByOrg}
                      hintText='Filter by organisation'
                      org={this.props.url.query.view}/>
                  </div>

                  <IconButton style={{display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.2)',
                    padding: 0, height: 56, backgroundColor: '#000AB2',
                  borderRadius: '50%', width: 56}}
                    tooltip='Create project'
                    onClick={() => Router.push(`/projectedit?view=${Router.query.view}`) }
                     iconStyle={{zIndex: 4, height: 24, padding: 0, width: 24, color: 'white'}}>
                    <AddCircle/>
                  </IconButton>
                </h2>
                <BigCalendar
                    popup
                    length={90}
                    selectable
                    defaultDate={new Date()}
                    style={{backgroundColor: 'white'}}
                    events={filteredEvents}
                    startAccessor='start'
                    endAccessor='end'
                    eventPropGetter={this.eventStyleGetter}
                    onSelectEvent={this.handleEventClick}
                    onSelectSlot={(slotInfo, e) =>
                      {
                        this.setAsOpen(slotInfo)

                      /*alert(
                        `selected slot: \n\nstart ${slotInfo.start.toLocaleString()} ` +
                          `\nend: ${slotInfo.end.toLocaleString()}` +
                          `\naction: ${slotInfo.action}`
                      )*/
                      }
                    }
                    titleAccessor='Name'
                  />
              </div>
              :
              <Loading/>
            }
          </div>
        </App>
      </div>
    )
  }
}

export default withMui(YourCalendar)
