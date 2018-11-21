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
import FlatButton from 'material-ui/FlatButton';
import CommunicationChatBubble from 'material-ui/svg-icons/av/play-arrow';
import {buttonStyles, radioButtonStyles, textFieldStyles, chipStyles, headerStyles} from '../components/styles.jsx';
import {CSVLink} from 'react-csv';
import DropDownMenu from 'material-ui/DropDownMenu';
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
              <Chip style={chipStyles.chip}
                backgroundColor={props.color}
                labelStyle={chipStyles.chipLabel}>
                {props.data.value}
              </Chip>
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

  return columns
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
            if (elem.lists) {
              delete elem.lists
            }
            data.push(elem)
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

          <Dialog
            open={this.state.onePerson}
            onRequestClose={() => this.setState({onePerson: false})}>
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
                    style={textFieldStyles.style}
                    inputStyle={textFieldStyles.input}
                    hintStyle={textFieldStyles.hint}
                    />
                </div>
              </div>

              <div style={{display: 'flex', alignItems: 'center', paddingBottom: 20}}>
                <div style={{width: 20, paddingRight: 20}}>
                  OI
                </div>
                <div style={{flex: 1}}>
                  <TextField
                    hintText={'Add their Email'}
                    underlineShow={false}
                    fullWidth={true}
                    style={textFieldStyles.style}
                    inputStyle={textFieldStyles.input}
                    hintStyle={textFieldStyles.hint}
                    />
                </div>
              </div>

              <div style={{display: 'flex', alignItems: 'center', paddingBottom: 20}}>
                <div style={{width: 20, paddingRight: 20}}>
                  OI
                </div>
                <div style={{flex: 1}}>
                  <OrganisationAutocomplete
                    org={this.props.url.query.view}/>
                </div>
              </div>
            </div>


          </Dialog>

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
                {typeof window !== 'undefined' ?
                <CSVLink
                  filename={"my-volunteers.csv"}
                  target=""
                  rel='noopener'
                  data={this.state.data ? this.state.data : [{"data": "empty"}]}>
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
          null}
          </div>
        </App>
      </div>
    )
  }
}

export default withMui(People)
