import React from 'react';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import Close from 'material-ui/svg-icons/navigation/close';
import {CalendarIcon, Clock, AvatarIcon} from './icons.jsx';

export default class ChooseDates extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount(props) {

  }

  render() {
    return (
      <div style={{textAlign: 'left'}}>
        {this.props.closeModal ?
          <div>
        <IconButton
          style={{padding: 0, width: 24,marginBottom: 16}}
          iconStyle={{padding: 0, width: 36, height: 36, color: 'rgb(118, 118, 118)'}}
           onClick={this.props.closeModal} >
          <Close/>
        </IconButton>

        <h2 style={{fontSize: '32px', marginTop: 0, marginBottom: 0}}>When do you want to do this?</h2>
        </div>
        :
        null
      }
        {this.props.subProjects.slice(0, this.props.limit).map((sub) => (
          <div style={{borderBottom: '1px solid #DBDBDB', lineHeight: 1.43,
            fontWeight: 200,
          paddingTop: 24, paddingBottom: 24}}>
          <div style={{float: 'right'}}>
            <RaisedButton secondary={true} label='Choose'
              />
          </div>
            <div style={{display: 'flex', paddingBottom: 10}}>
                <CalendarIcon color={'black'} style={{height: 20, width: 20, marginRight: 16}}/>
              {sub.Date.toLocaleString('en-gb',
                {weekday: 'long', month: 'long', day: 'numeric'})}
            </div>
            <div style={{display: 'flex', paddingBottom: 10}}>
              <Clock color={'black'} style={{height: 20, width: 20, marginRight: 16}}/>
              {sub.Date.toLocaleString('en-gb',
                {hour: '2-digit', minute: '2-digit'})}
            </div>
            <div style={{display: 'flex'}}>
                <AvatarIcon color={'black'} style={{height: 20, width: 20, marginRight: 16}}/>
                6/11 people
            </div>
          </div>
        ))}

      </div>
    )
  }
}
