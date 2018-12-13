import React from 'react';
import withMui from '../components/hocs/withMui.js';
import fire from '../fire';
import App from "../components/App"
import Link from "next/link";
import Router from 'next/router';
import {Tabs, Tab} from 'material-ui/Tabs';
import {List, ListItem} from 'material-ui/List';
import {buttonStyles, chipStyles, headerStyles} from '../components/styles.jsx';
import MediaQuery from 'react-responsive';
import Avatar from 'material-ui/Avatar';
import LinkIcon from 'material-ui/svg-icons/content/link';
import 'react-table/react-table.css'
import ReactTable from 'react-table';
import Chip from 'material-ui/Chip';
import RaisedButton from 'material-ui/RaisedButton';

let mobile = require('is-mobile');
let db = fire.firestore()
var randomColor = require('randomcolor')

let functions = fire.functions('europe-west1')

const ChipArray = (props) => (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {typeof props.data.value === 'object' ?
              props.data.value.map((entry) => (
                <Chip style={chipStyles.chip}
                  backgroundColor={props.color}
                  labelStyle={chipStyles.chipLabel}>
                  {entry}
                </Chip>
              ))
              :

                props.data.value

            }
          </div>
)

const getColumnsFromMembers = (members) => {
  var rawKeys = []
  var columns = []
  members.forEach((member) => {
    var keys = Object.keys(member)
    keys.forEach((key) => {
      if (!rawKeys.includes(key) && key !== '_id' && key !== 'tags') {
        console.log(key, typeof member[key])
        if (typeof member[key] === 'object') {
          rawKeys.push(key)
          columns.push({
            id: key,
            Header: key,
            accessor: key,
            Cell: row => (
              <ChipArray
                color={randomColor({luminosity: 'light'})}
                data={row}/>
            )
          })
        } else {
          rawKeys.push(key)
          columns.push({id: key, Header: key, accessor: key})
        }
      }
     })
  })
  console.log(columns)
  return columns
}



export class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    return (
      <div style={{width: '100%'}}>
        {
          this.props.attendees.map((person) => (
            <div>

            </div>
          ))
        }
      </div>
    )
  }
}

export class ProjectAdmin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
    console.log(this.props)
    if (this.props.members) {
      this.state = {members: this.props.members}
    }
  }

  componentDidMount (props) {
    Router.prefetch('/member')

    console.log(this.state)
    this.setState({organisation: Router.query.view, tagType: 'existing'})

    if (Router.query.sample) {
      var corsRequest = functions.httpsCallable('integrations-wrapCors');
      var teams = {}
      corsRequest({url: 'https://fantasy.premierleague.com/drf/teams/'})
      .then(teamData => {
        teamData.data.forEach((team) => {
          teams[team.id] = team.name
        })
      })
      .then(() => corsRequest({url: 'https://fantasy.premierleague.com/drf/elements/'}))
      .then(responseData => {
        console.log(responseData)
        var data = []
        responseData.data.forEach((player) => {
          if (player.team === parseInt(Router.query.team)) {
            data.push({
              '_id': player.id,
              'organisation': player.team_code,
              'Full Name': player.first_name + ' ' + player.second_name,
              'Goals Conceded': player.goals_conceded,
              'Goals Scored': player.goals_scored,
              'Email': [player.first_name + player.second_name + '@gmail.com']
            })
          }
        })
        console.log(data)
        this.setState({interactions: data})
      })
    }

    else if (Router.query.view) {
      db.collection("Events").doc(Router.query.project).get()
      .then((eventDoc) => {
        var elem = eventDoc.data()
        console.log(elem)
      })

      var getOneEventAttendees = functions.httpsCallable('integrations-getOneEventAttendees')
      getOneEventAttendees({organisation: Router.query.view, eventId: Router.query.project}).then((result) => {
        console.log(result)
        var unmatched = []
        result.data && result.data.attendees.forEach((attendee) => {
          unmatched.push(attendee.profile)
        })
        this.setState({unmatchedAttendees: unmatched,
            unmatchedColumns:
            [
              {id: 'name',
                Header: 'name',
                accessor: 'name'},
                {
                  id: 'email',
                  Header: 'email',
                  accessor: 'email'
                }
              ]
        })
      })

      db.collection("Interactions").where("EventId", "==", Router.query.project)
      .where("managedBy", "==", Router.query.view)
      .get().then((querySnapshot) => {
        var data = []
        querySnapshot.forEach((doc) => {
          var intData = doc.data()
          this.setState({project: intData})
          console.log(intData)
          if (intData && intData.Members) {
            intData.Members.forEach((member) => {
              db.collection("PersonalData").doc(member).get().then((memberDoc) => {
                let raw = memberDoc.data()
                let elem = {}
                let columns = ['Full Name', 'Email', 'Organisations', 'lastContacted']
                columns.forEach((key) => {
                  if (raw[key]) {
                    elem[key] = raw[key]
                  }
                })
                if (elem.lastContacted) {
                  elem['Last Contacted'] = elem.lastContacted.toLocaleString('en-gb',
                    {weekday: 'long', month: 'long', day: 'numeric'})
                  delete elem.lastContacted
                }
                elem._id = memberDoc.id
                data.push(elem)
                this.setState({data: data, columns: getColumnsFromMembers(data)})
              })

            })
          }
        })



        console.log(data)
      })
    }
  }




  handleClick = () => {
    if (fire.auth().currentUser) {
      fire.auth().currentUser.getIdToken()
      .then((token) =>
      fetch(`https://us-central1-whosin-next.cloudfunctions.net/users-addMember?project=${Router.query.project}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token
        }
      })
      .then(response => response.json())
      .then(data => console.log(data))
      )
    }
  }

  render() {
    var isMobile = mobile(this.props.userAgent)
    return (
      <App>
        <div style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
          <MediaQuery
            values={{deviceWidth: isMobile ? 600 : 1400}}
            minDeviceWidth={700}>
            <div style={{position: 'fixed', zIndex: -1, top: 50, borderRadius: '40% 0 0 90%',
              transform: 'skewX(-10deg)', backgroundColor: '#FFCB00', right: -350,
               width: '30vw', height: '100vw'}}/>
             <div style={{position: 'fixed', zIndex: -1, top: 50, borderRadius: '0 60% 90% 0%',
               transform: 'skewX(-10deg)', backgroundColor: '#FFCB00', left: -250,
                width: '20vw', height: '100vw'}}/>
              <div style={{width: '100%', width: 1000, minHeight: '90vh'}}>
              <div >
                <div style={{justifyContent: 'space-between', display: 'flex'}}>
                  <div style={headerStyles.desktop}>
                    <b>Attendees: </b> <span style={{paddingLeft: 10}}>
                      {this.state.project && this.state.project.Details && this.state.project.Details.name}
                    </span>
                  </div>
                  <div style={{display: 'block'}}>


                  </div>
                  <div style={{display: 'inline-flex', marginTop: 30}}>
                    <RaisedButton
                      rel='noopener'
                      target='_blank'
                      style={buttonStyles.smallSize}
                      labelStyle={buttonStyles.smallLabel}
                      primary={true}
                      icon={<LinkIcon/>}
                      href={this.state.project && this.state.project.Details && this.state.project.Details.url}
                       label='Go to event'/>
                   </div>
                </div>
              </div>
              <div style={{width: 150, backgroundColor: '#000AB2',
                marginBottom: 30,
                height: 4}}/>
              {
                this.state.data && this.state.columns ?
                <ReactTable
                  getTdProps={(state, rowInfo, column, instance) => {
                    return {
                      onClick: (e, handleOriginal) => {
                        Router.push(`/member?member=${rowInfo.original._id}&view=${Router.query.view}&name=${rowInfo.original['Full Name']}`)
                        if (handleOriginal) {
                          handleOriginal();
                        }
                      }
                    };
                  }}
                  defaultPageSize={10}
                  onFilteredChange={(filtered) =>this.setState({filtered: filtered})}
                  ref={(r) => {
                    this.selectTable = r;
                  }}
                  className='-highlight'
                  data={this.state.data}
                  columns={this.state.columns}
                  filterable={true}
                />
              :
              null
              }

              <div style={{height: 100}}>
                {
                  this.state.unmatchedAttendees && this.state.unmatchedColumns ?
                  <ReactTable

                    defaultPageSize={10}
                    onFilteredChange={(filtered) =>this.setState({filtered: filtered})}
                    ref={(r) => {
                      this.unmatchedTable = r;
                    }}
                    className='-highlight'
                    data={this.state.unmatchedAttendees}
                    columns={this.state.unmatchedColumns}
                    filterable={true}
                  />
                :
                null
                }
              </div>

            </div>
          </MediaQuery>
        </div>
      </App>
    )
  }
}

export default withMui(ProjectAdmin)
