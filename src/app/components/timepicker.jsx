import React from 'react';
import Autosuggest from 'react-autosuggest';
import Menu from 'material-ui/Menu';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import MenuItem from 'material-ui/MenuItem';
import withMui from '../components/hocs/withMui';

var tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

function doubleZero(n){
    return n > 9 ? "" + n: "0" + n;
}

function createHalfHourIntervals(from, until){

   //*2 because because we want every 30 minutes instead of every hour
   var max = 48
  var time = new Date(from);
  var intervals = []; // more clear name than hours
  for (var i = 0; i <= max; i++) {

    time.setMinutes(time.getMinutes() + 30);
    intervals.push({time:formatDateHHcolonMM(time)});

  }

  return intervals
}

export function formatDateHHcolonMM(date) {  // funny name but specific
  var hours = date.getHours();
  var minute = date.getMinutes();
  if (minute >= 45) {
    minute = 0
    hours += 1
  } else if (minute <= 15) {
    minute = 0
  } else {
    minute = 30
  }
  var ampm
    if (hours > 12) {
      ampm = 'pm'
      hours -= 12;
    } else if (hours === 0) {
       hours = 12;
       ampm = 'am'
    } else {
      ampm = 'am'
    }
  return hours + ":" + doubleZero(minute) + ampm ;

}

export default class TimePicker extends React.Component {
  constructor(props) {
    super(props);
    var times = createHalfHourIntervals(this.props.from, this.props.until)


    this.state = {
      text: '',
      selectedItem: times[0].time,
      times: times,
      text: times[0].time
    };


  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.setState({times: createHalfHourIntervals(nextProps.from, nextProps.until) })
      if (nextProps.selected) {
        this.setState({selectedItem: nextProps.selected, text: nextProps.selected})
      }
    }
  }

  handleRequestClose = () => {
  this.setState({
    open: false,
  });
};

  guessSelectedItem = (raw) => {
    this.setState({selectedItem: ''})
    var times = this.state.times
    var options = times.filter(time => time.time.slice(0, raw.length) === raw)
    if (options[0]) {
      var index = times.indexOf(options[0])
      this.setState({selectedItem: options[0].time, selectedIndex: index})
      if (this.props.getTime) {
        this.props.getTime(options[0].time)
      }
      if (this.menu) {
        this.menu.refs.scrollContainer.scrollTop = index * 40 - 80
      }

    }


  }

  handleOnFocus = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
      open: true
    });
  }

   onChange = (event,  newValue ) => {
      this.setState({
        anchorEl: event.currentTarget,
        text: newValue
      });
    if (newValue.length > 0) {
      this.guessSelectedItem(newValue)
      this.setState({open: true})
    } else {
      this.setState({selectedItem: '', open: false})
    }
  };

  handleKeyPress = (event) => {
    if(event.key == 'Backspace'){
      this.setState({chosen: '', text: event.target.value})
    }
    if (event.key == 'Enter') {
      this.setState({open: false, text: this.state.selectedItem})
      if (this.props.getTime) {
        this.props.getTime(this.state.selectedItem)
      }
    }
  }

  handleKeyDown = (event) => {
    if(event.keyCode == 40) {
      event.preventDefault()
      this.setState({open: true})
      var times = this.state.times
      var index = this.state.selectedIndex
      var item = times[index + 1]
      if (this.menu) {
        this.menu.refs.scrollContainer.scrollTop = (index + 1) * 40 - 80
      }
      if (this.props.getTime) {
        this.props.getTime(item.time)
      }
      this.setState({selectedIndex: index + 1, selectedItem: item.time, text: item.time})
    }
    if (event.keyCode == 38) {
      event.preventDefault()
      var times = this.state.times
      var index = this.state.selectedIndex
      var item = times[index - 1]
      if (this.menu) {
        this.menu.refs.scrollContainer.scrollTop = (index -1) * 40 -80
      }
      if (this.props.getTime) {
        this.props.getTime(item.time)
      }
      this.setState({selectedIndex: index - 1, selectedItem: item.time, text: item.time})
    }

  }

  handleMenuClick = (date) => {
    var index = this.state.times.indexOf(date)
    this.setState({selectedItem: date.time, text: date.time, open: false
      , selectedIndex: index})
      if (this.props.getTime) {
        this.props.getTime(date.time)
      }
  }

  render() {
    console.log(this.props)
    return (
      <div >
        <div style={{width: 72, fontSize: '12px'}}>
          <TextField
            style={this.props.style}
            inputStyle={this.props.textFieldStyle}
            ref={(input) => { this.textInput = input; }}
            fullWidth={true}
            underlineShow={this.props.underlineShow}
            onClick={this.handleOnFocus}
            value = {this.state.chosen ? this.state.chosen : this.state.text}
            onKeyPress={this.handleKeyPress}
            onKeyDown={this.handleKeyDown}
            onChange={this.onChange}
            onBlur={() => {
                if(this.state.open) {
                this.textInput.focus()
              }
            }
            }
            hintText='Start Time'/>
        </div>
        <div style={{width: '50%'}}>
          <Popover

            open={this.state.open}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'left', vertical: 'top'}}
            onRequestClose={this.handleRequestClose}
        >
          <Menu
            selectedMenuItemStyle={ {backgroundColor: '#f5f5f5', color: '#000AB2', fontWeight: 'bold'} }
            value={this.state.selectedItem}
            ref={div => (this.menu = div)}
            id='menu'
            style={{fontSize: '12px', width: 160, textAlign: 'left'}}
            menuItemStyle={{fontSize: '14px', height: 40, minHeight: 40, lineHeight: '40px'}}
            maxHeight={200}
            >
              {this.state.times.map((date) => (
                <MenuItem style={{height: 40}}
                  onClick={() => this.handleMenuClick(date)}
                  primaryText={date.time} value={date.time}/>
              ))}
            </Menu>
          </Popover>
        </div>
      </div>
    )
  }
}
