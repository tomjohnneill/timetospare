import React from 'react';
import withMui from '../components/hocs/withMui.js';
import App from '../components/App.js';
import Router from 'next/router';
import fire from '../fire.js';
import RaisedButton from 'material-ui/RaisedButton';
import FileDownload from 'material-ui/svg-icons/file/file-download';
import Add from 'material-ui/svg-icons/content/add';
import Divider from 'material-ui/Divider'
import Avatar from 'material-ui/Avatar';
import Link from 'next/link'
import Dialog from 'material-ui/Dialog';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import Email from 'material-ui/svg-icons/communication/email';
import FlatButton from 'material-ui/FlatButton';
import CommunicationChatBubble from 'material-ui/svg-icons/av/play-arrow';
import {buttonStyles, radioButtonStyles, textFieldStyles, chipStyles, headerStyles} from '../components/styles.jsx';
import {CSVLink} from 'react-csv';
import DropDownMenu from 'material-ui/DropDownMenu';
import OrganisationsIcon from 'material-ui/svg-icons/communication/business';
import MenuItem from 'material-ui/MenuItem';
import {List, ListItem} from 'material-ui/List';
import 'react-table/react-table.css'
import ReactTable from "react-table";
import {Tag, AvatarIcon} from '../components/icons.jsx';
import Chip from 'material-ui/Chip';
import AddTag from '../components/addTag.jsx';
import TextField from 'material-ui/TextField';
import OrganisationAutocomplete from '../components/organisation-autocomplete.jsx';

let db = fire.firestore()

var randomColor = require('randomcolor')
let functions = fire.functions('europe-west1')

var colorMap = () => {
  var color = []
  for (var i = 0; i < 500; i ++ ) {
    color.push(randomColor({luminosity: 'light'}))
  }
  return color
}

var orgColorMap = {}

const ChipArray = (props) => (

          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            {typeof props.data.value === 'object' && props.data.value.length > 1?

              props.data.value.map((entry) => (
                <Chip style={chipStyles.chip}
                  backgroundColor={props.color}
                  labelStyle={chipStyles.chipLabel}>
                  {entry}
                </Chip>
              ))
              :
              typeof props.data.value === 'object' && props.data.column.Header.toLowerCase() == 'organisations' ?

              props.data.value.map((entry) => (
                <Chip style={chipStyles.chip}
                  backgroundColor={orgColorMap[entry.toLowerCase()]}
                  labelStyle={chipStyles.chipLabel}>
                  {entry}
                </Chip>
              ))
              :
              typeof props.data.value === 'object' && props.data.column.Header.toLowerCase() == 'full name' ?
              <div style={{textTransform: 'capitalize'}}>
                {props.data.value}
                </div>
              :
              <div>
                {props.data.value && props.data.value.toString()}
                </div>
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

        if (typeof member[key] === 'object') {
          rawKeys.push(key)
          columns.push({
            id: key,
            Header: key,
            accessor: key,
            Cell: row => {
              console.log(row)
              console.log(orgColorMap)
              return (<ChipArray
                data={row}/>)
            }
          })
        } else {
          rawKeys.push(key)
          columns.push({id: key, Header: key, accessor: key})
        }
      }
     })
  })

  return columns
}

export class AddOnePerson extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleOnePerson = (field, data) => {
    var person = this.state.person ? this.state.person : {}
    person[field] = data
    this.setState({person: person})
  }

  handleOrgLookup = (one, org, three) => {
    var person = this.state.person ? this.state.person : {}
    if (person.Orgs) {
      person.Orgs.push(one)
    } else {
      person.Orgs = [one]
    }
    this.setState({person: person})
    console.log(person)
  }

  handleSavePerson = () => {
    var person = this.state.person
    person.managedBy = Router.query.view
    db.collection("PersonalData").where("Email", "array-contains", person.Email[0])
    .get().then((querySnapshot) => {
      var _id
      var docRef
      if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
          _id = doc.id
        })
      }
      if (!_id) {
        docRef = db.collection("PersonalData").doc()
      } else {
        docRef = db.collection("PersonalData").doc(_id)
      }
      return docRef.set(person, {merge: true}).then(() => docRef)
    })
    .then((doc) => {
      var orgArray = []
      var orgNames = {}
      person.Orgs.forEach((orgObj) => {
        orgArray.push(orgObj._id)
        orgNames[orgObj._id] = orgObj.name
      })

      db.collection("Relationships").add({
        MemberNames : {
          [doc.id] : person['Full Name']
        },
        Members: [doc.id],
        OrgNames : orgNames,
        Organisations: orgArray
      }).then(() => {
        this.props.handleRequestClose()
      })
    })
  }

  render() {
    return (
      <Dialog
        onRequestClose={this.props.handleRequestClose}
        open={this.props.open}
        actions={[<FlatButton
          onClick={this.props.handleRequestClose}
          style={buttonStyles.smallSize}
          labelStyle={buttonStyles.smallLabel}
          label='Cancel'
          />
        ,
        <RaisedButton
          primary={true}
          onClick={this.handleSavePerson}
          style={buttonStyles.smallSize}

          labelStyle={buttonStyles.smallLabel}
          label='Save'/>]}
        >
      <div>
        <div style={headerStyles.desktop}>
          Add their details
        </div>
        <div>


          <div style={{display: 'flex', alignItems: 'center', paddingBottom: 20}}>
            <div style={{width: 20, paddingRight: 20}}>
              OI
            </div>
            <div style={{flex: 1}}>
              <TextField
                hintText={'Add their Full Name'}
                underlineShow={false}
                fullWidth={true}
                onChange={(e, nv) => this.handleOnePerson('Full Name', [nv])}
                style={textFieldStyles.style}
                inputStyle={textFieldStyles.input}
                hintStyle={textFieldStyles.hint}
                />
            </div>
          </div>

          <div style={{display: 'flex', alignItems: 'center', paddingBottom: 20}}>

              <Email style={{width: 20, paddingRight: 20}}/>

            <div style={{flex: 1}}>
              <TextField
                hintText={'Add their Email'}
                underlineShow={false}
                fullWidth={true}
                onChange={(e, nv) => this.handleOnePerson('Email', [nv])}
                style={textFieldStyles.style}
                inputStyle={textFieldStyles.input}
                hintStyle={textFieldStyles.hint}
                />
            </div>
          </div>

          <div style={{display: 'flex', alignItems: 'center'}}>

              <OrganisationsIcon style={{width: 20, paddingRight: 20}}/>

            <div style={{flex: 1}}>
              <OrganisationAutocomplete
                handleNewRequest={this.handleOrgLookup}
                org={this.props.managedBy}/>
            </div>
          </div>
        </div>

      </div>
    </Dialog>
    )
  }
}

export class People extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
    if (this.props.members) {
      this.state = {members: this.props.members}
    }
  }



  static async getInitialProps({req, pathname, query}) {


  }

  componentDidMount (props) {
    Router.prefetch('/member')

    this.setState({organisation: Router.query.view, tagType: 'existing'})
    if (Router.query.view) {
      if (typeof window !== 'undefined' && localStorage.getItem('sample') == "true") {
        var data = []
        var corsRequest = functions.httpsCallable('integrations-wrapCors');
        corsRequest({url: 'https://fantasy.premierleague.com/drf/elements/'})
        .then(responseData => {

          responseData.data.forEach((player) => {
            data.push({
              '_id': player.id,
              'organisation': player.team,
              'Full Name': player.first_name + ' ' + player.second_name,
              'Email': [player.first_name + player.second_name + '@gmail.com'],
              'Goals Conceded': player.goals_conceded,
              'Goals Scored': player.goals_scored,
              'Yellow Cards': player.yellow_cards,
              'Red Cards': player.red_cards,
              'News': player.news
            })
          })
          this.setState({data: data, columns: getColumnsFromMembers(data)})
        })
      } else {
        db.collection("PersonalData").where("managedBy", "==", Router.query.view)
        .get().then((querySnapshot) => {
          var data = []
          querySnapshot.forEach((member) => {
            var elem = member.data()
            elem._id = member.id
            delete elem.managedBy
            delete elem.User
            if (elem.lastContacted) {
              elem['Last Contacted'] = elem.lastContacted.toLocaleString('en-gb',
                {weekday: 'long', month: 'long', day: 'numeric'})
              delete elem.lastContacted

            }
            delete elem.Organisations
            data.push(elem)
            elem.organisations && elem.organisations.forEach((org) => {
              orgColorMap[org.toLowerCase()] = randomColor({luminosity: 'light'})
            })
          })


          this.setState({data: data, columns: getColumnsFromMembers(data)})
        })
      }



    }
  }

  onMailchimpClick = () => {
    var client_id = 806258378783
    var redirect_uri = encodeURIComponent(`https://us-central1-whosin-next.cloudfunctions.net/greetings-mailchimpAuth`)
    window.location.href = `https://login.mailchimp.com/oauth2/authorize?
    response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}`
  }

  handleSaveSelection = (records) => {

    var selection = this.selectTable.getResolvedState().sortedData
    this.setState({selection: selection, tagDialog: true})

  }



  render() {
    console.log(this.state.data)
    console.log(this.state.columns)
    var datagrid = []
    if (this.state.data) {
      var headerRow = []
      this.state.columns.forEach((column) => {
        headerRow.push(column.accessor)
      })
      datagrid.push(headerRow)
      this.state.data.forEach((row) => {
        var rowGrid = []
        headerRow.forEach((column) => {
          if (row[column]) {
            rowGrid.push(row[column].toString())
          } else {
            rowGrid.push("")
          }
        })
        datagrid.push(rowGrid)
      })
      console.log(datagrid)
    }

    const currentRecords = this.selectTable && this.selectTable.getResolvedState().sortedData;

    return (
      <div>
        <div style={{position: 'fixed', zIndex: -1, top: 50, borderRadius: '40% 0 0 90%',
          transform: 'skewX(-10deg)', backgroundColor: '#FFCB00', right: -350,
           width: '30vw', height: '100vw'}}/>
        <App>
          <Dialog
            open={this.state.import}
            onRequestClose={() => this.setState({import:false})}>
            <List style={{backgroundColor: 'white', borderRadius: 4}}>

              <ListItem
                style={{display: 'flex', height: 80, alignItems: 'center'}}
                primaryText="Import from Mailchimp"
                onClick={this.onMailchimpClick}
                leftAvatar={<Avatar src="https://static.mailchimp.com/web/brand-assets/logo-freddie-fullcolor.svg" />}
                rightIcon={<CommunicationChatBubble />}
              />
              <Divider/>
              <Link href={`/upload-data?view=${this.state.organisation}`} prefetch>
                <ListItem
                  style={{display: 'flex', height: 80, alignItems: 'center'}}
                  primaryText="Import from csv"

                  leftAvatar={<Avatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuLVCgqTLxBFELkcZJ1b7_xsV7mOVQxcVVmAp-tFD2dYBhLDG7YQ" />}
                  rightIcon={<CommunicationChatBubble />}
                />
              </Link>
              <Divider/>

                <ListItem
                  onClick={() => this.setState({onePerson: true, import: false})}
                  style={{display: 'flex', height: 80, alignItems: 'center'}}
                  primaryText="Add one person"
                  leftAvatar={<Avatar><AvatarIcon/></Avatar>}
                  rightIcon={<CommunicationChatBubble />}
                />

            </List>
          </Dialog>


          <AddOnePerson
            open={this.state.onePerson}
            handleRequestClose={() => this.setState({onePerson: false})}
            managedBy={this.props.url.query.view}/>



          <AddTag
            selection={this.state.selection}
            organisation={this.props.url.query.view}
            open={this.state.tagDialog}
            onRequestClose={() => this.setState({tagDialog:false})}/>

          <div style={{padding: 50}}>
            <div style={{width: '100%', paddingBottom: 20,
              display: 'flex', justifyContent: 'space-between'}}>
              <div style={{fontWeight: 200, fontSize: '30px'}}>
                People
              </div>
              <div style={{display: 'flex'}}>
                {
                  this.state.filtered && this.state.filtered.length > 0?
                  <RaisedButton
                    secondary={true}
                    onClick={() => this.handleSaveSelection(currentRecords)}
                    style={buttonStyles.smallSize}
                    icon={<Tag style={{height: 15}}/>}
                    labelStyle={buttonStyles.smallLabel}
                    label='Save this selection'/>
                  :
                  null
                }

                <div style={{width: 20}}/>
                {typeof window !== 'undefined' && datagrid.length > 0 ?
                <CSVLink
                  filename={`${new Date().toJSON().slice(0,10)} Contacts.csv`}
                  target=""
                  rel='noopener'
                  data={datagrid}>
                  <RaisedButton
                    primary={true}
                    style={buttonStyles.smallSize}
                    labelStyle={buttonStyles.smallLabel}
                    icon={<FileDownload/>}
                    label='Export to csv'/>
                </CSVLink>
                :
                null}

                <div style={{width: 20}}/>
                <RaisedButton
                  primary={true}
                  onClick={() => this.setState({import: true})}
                  style={buttonStyles.smallSize}
                  icon={<Add/>}
                  labelStyle={buttonStyles.smallLabel}
                  label='Add new'/>
              </div>
            </div>
            <Divider style={{marginBottom: 20}}/>
            {this.state.columns && this.state.data ?
              <div style={{backgroundColor: 'white', textAlign: 'left'}}>
            <ReactTable
              getTdProps={(state, rowInfo, column, instance) => {
                return {
                  onClick: (e, handleOriginal) => {
                    mixpanel.track('Clicked person')
                    if (localStorage.getItem('sample') == "true") {
                      Router.push(`/member?member=${rowInfo.original._id}&view=none&name=${rowInfo.original['Full Name']}&team=${rowInfo.original['organisation']}`)
                    } else {
                      Router.push(`/member?member=${rowInfo.original._id}&view=${Router.query.view}&name=${rowInfo.original['Full Name']}`)
                    }
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
          </div>
          :
          <div style={{height: '100vh'}}/>
        }
          </div>
        </App>
      </div>
    )
  }
}

export default withMui(People)
