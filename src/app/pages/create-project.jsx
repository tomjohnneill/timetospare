import React from 'react'
import App from '../components/App.js'
import Router from 'next/router'
import MiniWhy from '../components/create-project/miniwhy.jsx'
import DateAndTime from '../components/create-project/dateandtime.jsx'
import OrgLookup from '../components/create-project/organisationlookup.jsx'
import OrgType from '../components/create-project/organisationtype.jsx'
import Basics from '../components/create-project/basics.jsx'
import Story from '../components/create-project/story.jsx'

export default class CreateProject extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  getCreatePage = (query) => {
    switch(query) {
      case '0':
        return (
          <MiniWhy/>
        )
      case '1':
        return (
          <Basics/>
        )
      case '2':
        return (
          <DateAndTime/>
        )
      case '3':
        return (
          <Story/>
        )
      case 'choose-type':
        return (
          <OrgType/>
        )
      case 'organisation':
        return (
          <OrgLookup/>
        )
    }
  }

  render() {
    return (
      <App>
        {typeof window !== 'undefined' ?
          this.getCreatePage(Router.query.stage)
          :
          null}
      </App>
    )
  }
}
