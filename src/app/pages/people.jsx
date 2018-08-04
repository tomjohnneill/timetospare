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
import CommunicationChatBubble from 'material-ui/svg-icons/av/play-arrow';
import {buttonStyles} from '../components/styles.jsx';
import {CSVLink} from 'react-csv';
import {List, ListItem} from 'material-ui/List';
import 'react-table/react-table.css'
import ReactTable from "react-table";

let db = fire.firestore()

let functions = fire.functions('us-central1')

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
    const res =  fetch(`https://us-central1-whosin-next.cloudfunctions.net/users-getMemberDetails?organisation=${query.organisation}`, {
        method: 'GET'
      })
      .then(response => {
        if (response.status == 200) {
          return response.json()
        } else {

          throw new Error('Unauthorized')
        }
      })
      .then((memberArray) => {
        console.log(memberArray)
        if (memberArray) {
          return ({members: memberArray})
        }

      })
      .catch(err => console.log(err.message))
    return res

  }

  componentDidMount (props) {
    console.log(this.state)
    this.setState({organisation: Router.query.organisation})
    if (Router.query.organisation) {
      var data = []
      var columns = []
      fire.auth().onAuthStateChanged((user) => {
        if (user === null) {

        } else {
          fire.auth().currentUser.getIdToken()
          .then((token) =>
            fetch(`https://us-central1-whosin-next.cloudfunctions.net/users-getMemberDetails?organisation=${Router.query.organisation}`, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
              },
            })
            .then(response => response.json())
            .then((memberArray) => {
              console.log(memberArray)
              if (memberArray) {
                this.setState({data: memberArray})
              }

            })
          )
        }
      })
      db.collection("Charity").doc(Router.query.organisation).get().then((doc) => {
        var lists = doc.data().lists
        console.log(lists)
        Object.keys(lists).forEach((key) => {
          db.collection("Lists").doc(key).get().then((listDoc) => {
            console.log(listDoc.data())
            if (listDoc.data().Columns) {
              listDoc.data().Columns.forEach((column) => {
                columns.push({id: column.name, Header: column.name, accessor: column.name})
              })
              this.setState({columns: columns})
            }
          })
        })
      })
    }
  }

  onMailchimpClick = () => {
    var client_id = 806258378783
    var redirect_uri = encodeURIComponent(`https://us-central1-whosin-next.cloudfunctions.net/greetings-mailchimpAuth`)
    window.location.href = `https://login.mailchimp.com/oauth2/authorize?
    response_type=code&client_id=${client_id}&redirect_uri=${redirect_uri}`
  }

  render() {
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
          <div style={{padding: 50}}>
            <div style={{width: '100%', paddingBottom: 20,
              display: 'flex', justifyContent: 'space-between'}}>
              <div style={{fontWeight: 200, fontSize: '30px'}}>
                Your people
              </div>
              <div style={{display: 'flex'}}>
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
