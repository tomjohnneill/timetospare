import React from 'react';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import TimePicker from 'material-ui/TimePicker';
import DatePicker from 'material-ui/DatePicker';
import MediaQuery from 'react-responsive';

function disableDates(date) {
  var basics = JSON.parse(localStorage.getItem('basics'))
  var deadline = basics ? parseISOString(basics.deadline): null
  return  date < deadline;
}

function parseISOString(s) {
  var b = s.split(/\D+/);
  return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}


const styles = {
  block: {
    maxWidth: 250,
  },
  radioButton: {
    marginBottom: 16,
  },
  weekday: {
    display: 'flex', alignItems: 'center',
      justifyContent: 'center', flex: 1, height: 40,
      border: '1px solid rgb(170, 170, 170)', fontWeight: 'lighter',
      cursor: 'pointer'
  },
  hovered: {
    display: 'flex', alignItems: 'center',
    cursor: 'pointer',
      justifyContent: 'center', flex: 1, height: 40,
      color: 'white',
      border: '1px solid rgb(170, 170, 170)', fontWeight: 700,
      backgroundColor: 'rgba(101, 161, 231, 0.7)'
  },
  header : {
    margin: '0px',
    padding: '6px',
    fontWeight: 500
  },
  inputStyle :
  {borderRadius: '2px', border: '1px solid #aaa',
    paddingLeft: '12px',  boxSizing: 'border-box'},
  textfield: {
    height: '40px',
    fontsize: '20px'
  },
};

export default class TypeOfDate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {type: 'one-off'}

  }

  changeType = (e, v) => {
    this.setState({type: v})
    this.props.pushData('type', v)
  }

  handleAreaEnter = (side) => {
    this.setState({hover: side})
  }

  handleAreaLeave = (side) => {
    this.setState({hover: null})
  }

  handleSetStartTime = (e, date) => {
    console.log(date)
    var today = new Date(date)
    var newDate = new Date(today.setHours(today.getHours() + 2));
    this.setState({startTime: date, endTime: newDate})
    this.props.pushData('startTime', date)
    this.props.pushData('endTime', newDate)
  }

  handleSetEndTime = (e, date) => {
    this.setState({endTime: date})
    this.props.pushData('endTime', date)
  }

  handleSetStartDate = (e, date) => {
    this.setState({startDate: date, endDate: date})
    this.props.pushData('startDate', date)
    this.props.pushData('endDate', date)
  }

  handleSetEndDate = (e, date) => {
    this.setState({endDate: date})
    this.props.pushData('endDate', date)
  }

  renderContent = (type) => {
    switch(type) {
      case 'one-off':
        return (
          <div>
            <div style={{width: '100%', paddingBottom: '16px', boxSizing: 'border-box'}}>
              <div style={{width: '100%',  paddingBottom: '32px',
                 boxSizing: 'border-box'}}>
                 <div style={{width: '70%', display: 'inline-block'}}>
                <p style={styles.header}>
                  When does your project start?
                </p>

                <DatePicker
                   style={styles.inputStyle}
                       autoOk={true}
                     underlineShow={false}
                     value={this.state.startDate}
                     onChange={this.handleSetStartDate}
                     hintStyle={{  bottom: '8px'}}
                     shouldDisableDate={disableDates}
                     hintText="Date" textFieldStyle={styles.textfield}/>
                </div>


                  <div style={{width: '25%', display: 'inline-block', marginLeft: '5%'}}>
                    <p style={styles.header}>
                      Start time?
                    </p>

                   <TimePicker
                    style={styles.inputStyle}
                      underlineShow={false}
                      value={this.state.startTime}
                      minutesStep={5}
                      format='24hr'
                      onChange={this.handleSetStartTime}
                      hintStyle={{  bottom: '8px'}}
                      hintText="Time" textFieldStyle={styles.textfield}/>
                  </div>
              </div>

              <div style={{width: '100%',  paddingBottom: '32px',
                 boxSizing: 'border-box'}}>
                 <div style={{width: '70%', display: 'inline-block'}}>
                <p style={styles.header}>
                  When does your project finish?
                </p>

                <DatePicker
                   style={styles.inputStyle}
                     underlineShow={false}
                     autoOk={true}
                     shouldDisableDate={disableDates}
                     value={this.state.endDate}
                     onChange={this.handleSetEndDate}
                     hintStyle={{  bottom: '8px'}}
                     hintText="Date" textFieldStyle={styles.textfield}/>
                </div>


                  <div style={{width: '25%', display: 'inline-block', marginLeft: '5%'}}>
                    <p style={styles.header}>
                      End time?
                    </p>

                   <TimePicker
                    style={styles.inputStyle}
                      underlineShow={false}
                      minutesStep={5}
                      value={this.state.endTime}
                      format='24hr'
                      onChange={this.handleSetEndTime}
                      hintStyle={{  bottom: '8px'}}
                      hintText="Time" textFieldStyle={styles.textfield}/>
                  </div>
              </div>



            </div>
          </div>
        )
        break;
      case 'weekly':
        return (
          <div>
            <div style={{display: 'flex', width: '100%'}}>
              <span
                onClick={() => this.setState({selected: 'mon'})}
                onMouseEnter={() => this.handleAreaEnter('mon')}
                onMouseLeave={() => this.handleAreaLeave('mon')}
                style={this.state.hover === 'mon' || this.state.selected === 'mon'
                   ? styles.hovered: styles.weekday}>
                Mon
              </span>
              <span
                onClick={() => this.setState({selected: 'tue'})}
                onMouseEnter={() => this.handleAreaEnter('tue')}
                onMouseLeave={() => this.handleAreaLeave('tue')}
                style={this.state.hover === 'tue' || this.state.selected === 'tue'
                   ? styles.hovered: styles.weekday}>
                Tue
              </span>
              <span
                onClick={() => this.setState({selected: 'wed'})}
                onMouseEnter={() => this.handleAreaEnter('wed')}
                onMouseLeave={() => this.handleAreaLeave('wed')}
                style={this.state.hover === 'wed' || this.state.selected === 'wed'
                   ? styles.hovered: styles.weekday}>
                Wed
              </span>
              <span
                onClick={() => this.setState({selected: 'thu'})}
                onMouseEnter={() => this.handleAreaEnter('thu')}
                onMouseLeave={() => this.handleAreaLeave('thu')}
                style={this.state.hover === 'thu' || this.state.selected === 'thu'
                   ? styles.hovered: styles.weekday}>
                Thu
              </span>
              <span
                onClick={() => this.setState({selected: 'fri'})}
                onMouseEnter={() => this.handleAreaEnter('fri')}
                onMouseLeave={() => this.handleAreaLeave('fri')}
                style={this.state.hover === 'fri' || this.state.selected === 'fri'
                   ? styles.hovered: styles.weekday}>
                Fri
              </span>
              <span
                onClick={() => this.setState({selected: 'sat'})}
                onMouseEnter={() => this.handleAreaEnter('sat')}
                onMouseLeave={() => this.handleAreaLeave('sat')}
                style={this.state.hover === 'sat' || this.state.selected === 'sat'
                   ? styles.hovered: styles.weekday}>
                Sat
              </span>
              <span
                onClick={() => this.setState({selected: 'sun'})}
                onMouseEnter={() => this.handleAreaEnter('sun')}
                onMouseLeave={() => this.handleAreaLeave('sun')}
                style={this.state.hover === 'sun' || this.state.selected === 'sun'
                   ? styles.hovered: styles.weekday}>
                Sun
              </span>
            </div>
            {
              this.state.selected ?
              <div>
                <div style={{width: '100%', paddingBottom: '16px', boxSizing: 'border-box'}}>
                  <div style={{width: '100%',  paddingBottom: '10px', paddingTop: 10,
                     boxSizing: 'border-box'}}>


                      <div style={{width: '40%', display: 'inline-block'}}>
                        <p style={styles.header}>
                          Start time?
                        </p>

                       <TimePicker
                        style={styles.inputStyle}
                          underlineShow={false}
                          value={this.state.startTime}
                          minutesStep={5}
                          format='24hr'
                          onChange={this.handleSetStartTime}
                          hintStyle={{  bottom: '8px'}}
                          hintText="Time" textFieldStyle={styles.textfield}/>
                      </div>
                      <div style={{width: '40%', display: 'inline-block', marginLeft: '5%'}}>
                        <p style={styles.header}>
                          End time?
                        </p>

                       <TimePicker
                        style={styles.inputStyle}
                          underlineShow={false}
                          minutesStep={5}
                          value={this.state.endTime}
                          format='24hr'
                          onChange={this.handleSetEndTime}
                          hintStyle={{  bottom: '8px'}}
                          hintText="Time" textFieldStyle={styles.textfield}/>
                      </div>
                  </div>

                  {
                    this.state.endTime ?
                    <div style={{width: '100%',  paddingBottom: '32px',
                       boxSizing: 'border-box'}}>

                       <div style={{width: '40%', display: 'inline-block'}}>
                         <p style={styles.header}>
                           Start Date
                         </p>

                         <DatePicker
                            style={styles.inputStyle}
                                autoOk={true}
                              underlineShow={false}
                              value={this.state.startDate}
                              onChange={this.handleSetStartDate}
                              hintStyle={{  bottom: '8px'}}
                              shouldDisableDate={disableDates}
                              hintText="Date" textFieldStyle={styles.textfield}/>
                       </div>
                       <div style={{width: '40%', display: 'inline-block', marginLeft: '5%'}}>
                         <p style={styles.header}>
                           End Date
                         </p>

                         <DatePicker
                            style={styles.inputStyle}
                              underlineShow={false}
                              autoOk={true}
                              shouldDisableDate={disableDates}
                              value={this.state.endDate}
                              onChange={this.handleSetEndDate}
                              hintStyle={{  bottom: '8px'}}
                              hintText="Date" textFieldStyle={styles.textfield}/>
                       </div>


                    </div>
                    :
                    null
                  }

              </div>
            </div>
              :
              <div style={{height: 165}}/>
            }
          </div>
        )
        break;
      case 'custom':
        return (
          <div>

          </div>
        )
        break;
      default:
        return null
    }
  }

  render() {
    return (
      <div>
        <p style={styles.header}>
          When is this project?
        </p>
        <MediaQuery minDeviceWidth={700}>
          <RadioButtonGroup name="shipSpeed"
            valueSelected={this.state.type}
            onChange={this.changeType}
            style={{padding: 10, display: 'flex'}}
            >
            <RadioButton
              value="one-off"
              label="One Off"
              style={styles.radioButton}
            />
            <RadioButton
              value="weekly"
              label="Weekly"
              style={styles.radioButton}
            />
            <RadioButton
              value="custom"
              label="Pick Dates"
              style={styles.radioButton}
            />
          </RadioButtonGroup>
        </MediaQuery>
        <MediaQuery maxDeviceWidth={700}>
          <RadioButtonGroup name="shipSpeed"
            valueSelected={this.state.type}
            onChange={this.changeType}
            style={{padding: 10}}
            >
            <RadioButton
              value="one-off"
              label="One Off"
              style={styles.radioButton}
            />
            <RadioButton
              value="weekly"
              label="Weekly"
              style={styles.radioButton}
            />
            <RadioButton
              value="custom"
              label="Pick Dates"
              style={styles.radioButton}
            />
          </RadioButtonGroup>
        </MediaQuery>
        {
          this.renderContent(this.state.type)
        }
      </div>
    )
  }
}
