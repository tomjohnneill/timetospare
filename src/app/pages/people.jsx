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
import Dialog from 'material-ui/Dialog';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import FlatButton from 'material-ui/FlatButton';
import CommunicationChatBubble from 'material-ui/svg-icons/av/play-arrow';
import {buttonStyles, radioButtonStyles, textFieldStyles} from '../components/styles.jsx';
import {CSVLink} from 'react-csv';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {List, ListItem} from 'material-ui/List';
import 'react-table/react-table.css'
import ReactTable from "react-table";
import {Tag} from '../components/icons.jsx';
import AddTag from '../components/addTag.jsx';
import TextField from 'material-ui/TextField';


let db = fire.firestore()


let functions = fire.functions('us-central1')

const getColumnsFromMembers = (members) => {
  var rawKeys = []
  var columns = []
  members.forEach((member) => {
    var keys = Object.keys(member)
    keys.forEach((key) => {
      if (!rawKeys.includes(key) && key !== '_id' && key !== 'tags') {
        rawKeys.push(key)
        columns.push({id: key, Header: key, accessor: key})
      }
     })
  })
  return columns
}

export class People extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
    console.log(this.props)
    if (this.props.members) {
      this.state = {members: this.props.members}
    }
  }



  static async getInitialProps({req, pathname, query}) {
    console.log(req)
    console.log('called initial props')

  }

  componentDidMount (props) {
    Router.prefetch('/member')
    console.log(this.state)
    this.setState({organisation: Router.query.organisation, tagType: 'existing'})
    if (Router.query.organisation) {

      db.collection("PersonalData").where("organisation", "==", Router.query.organisation)
      .get().then((querySnapshot) => {
        var data = []
        querySnapshot.forEach((member) => {
          var elem = member.data()
          elem._id = member.id
          delete elem.organisation
          if (elem.lists) {
            delete elem.lists
          }
          data.push(elem)
        })
        console.log(data)
        this.setState({data: data, columns: getColumnsFromMembers(data)})
      })


    }
  }

  onMailchimpClick = () => {
    var client_id = 806258378783
    var redirect_uri = encodeURIComponent(`https://us-central1-whosin-next.cloudfunctions.net/greetings-mailchimpAuth`)
    window.location.href = `https://login.mailchimp.com/oauth2/authorize?
    response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}`
  }

  handleSaveSelection = (records) => {
    console.log(this.state.filtered)
    var selection = this.selectTable.getResolvedState().sortedData
    this.setState({selection: selection, tagDialog: true})

  }



  render() {
    console.log(this.state)
    const currentRecords = this.selectTable && this.selectTable.getResolvedState().sortedData;

    return (
      <div>
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
              <ListItem
                style={{display: 'flex', height: 80, alignItems: 'center'}}
                primaryText="Copy and paste from a spreadsheet"
                onClick={() => Router.push(`/csv-upload?organisation=${this.state.organisation}`,
                      `/csv-upload/${this.state.organisation}`)}
                leftAvatar={<Avatar src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTuLVCgqTLxBFELkcZJ1b7_xsV7mOVQxcVVmAp-tFD2dYBhLDG7YQ" />}
                rightIcon={<CommunicationChatBubble />}
              />

            </List>
          </Dialog>

          <AddTag
            selection={this.state.selection}
            organisation={this.props.url.query.organisation}
            open={this.state.tagDialog}
            onRequestClose={() => this.setState({tagDialog:false})}/>

          <div style={{padding: 50}}>
            <div style={{width: '100%', paddingBottom: 20,
              display: 'flex', justifyContent: 'space-between'}}>
              <div style={{fontWeight: 200, fontSize: '30px'}}>
                Your people
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
                    console.log("A Td Element was clicked!");
                    console.log("it produced this event:", e);
                    console.log("It was in this column:", column);
                    console.log("It was in this row:", rowInfo);
                    console.log(rowInfo.original)
                    console.log("It was in this table instance:", instance);

                    // IMPORTANT! React-Table uses onClick internally to trigger
                    // events like expanding SubComponents and pivots.
                    // By default a custom 'onClick' handler will override this functionality.
                    // If you want to fire the original onClick handler, call the
                    // 'handleOriginal' function.
                    Router.push(`/member?member=${rowInfo.original._id}&organisation=${Router.query.organisation}&name=${rowInfo.original['Full Name']}`)
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
              className='-highlight -striped'
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
