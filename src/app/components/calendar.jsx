import React from 'react';
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css"

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))

export default class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {

    return (
        <BigCalendar
          popup
          events={this.props.events}
          startAccessor='Start Time'
          endAccessor='End Time'
          titleAccessor='Name'
        />
    )
  }
}
