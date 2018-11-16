import React from 'react';
import Router from 'next/router'
import App from '../../components/App';
import fire from '../../fire';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import withMui from '../../components/hocs/withMui';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Avatar from 'material-ui/Avatar';
import ShortText from 'material-ui/svg-icons/editor/short-text';
import Chip from 'material-ui/Chip';
import OutlookIntegrate from '../../components/outlook/integrate.jsx';
import CircularProgress from 'material-ui/CircularProgress';
import LinesEllipsis from 'react-lines-ellipsis';
import {headerStyles, buttonStyles, chipStyles} from '../../components/styles.jsx';

const users = [
  {
    name: 'Tom Neill'
  },
  {
    name: 'Ed Jackert'
  },
  {
    name: 'Jacey Lee'
  }
]

const orgs = [
  {
    name: 'Dover Big Local'
  },
  {
    name: 'Heston West'
  },
  {
    name: 'Ramsgate'
  }
]

const tags = [
  'banana',
  'apple',
  'orange',
  'kiwi'
]

const editStyles = {
  container : {
    display: 'flex', alignItems: 'center', padding: 10,
    boxSizing: 'border-box'
  },
  icon: {
    height: 20, width: 20, paddingRight: 30
  },
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  chip: {
        margin: 4,
        cursor: 'pointer'
      },
  selectedChip: {
    margin: 4
  },
}

class InteractionCard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {visible: false}
  }

  componentDidMount (props) {
    setTimeout(
        () => {
            this.setState({visible: true});
        },
        100
    );
  }

  handleDeleteUser = (user) => {
    var userArray = this.props.data.details
    var userPosition = userArray.indexOf(user)
    userArray.splice(userPosition, 1)
    this.props.editDetails(userArray, this.props.index)
  }

  handleDeleteOrg = (user, org) => {
    var userArray = this.props.data.details
    var userPosition = userArray.indexOf(user)
    var orgPosition = userArray[userPosition].Organisations.indexOf(org)
    userArray[userPosition].Organisations.splice(orgPosition, 1)
    this.props.editDetails(userArray, this.props.index)
  }

  handleDeleteTag = (user, tag) => {
    var userArray = this.props.data.details
    var userPosition = userArray.indexOf(user)
    var tagPosition = userArray[userPosition].tags.indexOf(tag)
    userArray[userPosition].tags.splice(tagPosition, 1)
    this.props.editDetails(userArray, this.props.index)
  }

  render() {
    return (
      <Card
        key={this.props.data.details.Subject}
        style={{textAlign: 'left', marginBottom: 20, boxShadow: 'none',
        opacity: this.state.visible ? 100 : 0,
        transition: 'opacity 0.5s',
        borderBottom: '1px solid #DBDBDB'}}>
        <CardHeader
          title={this.props.data.email.Subject}
          subtitle={this.props.type}
          avatar={<Avatar>H</Avatar>}
        />

        <CardText>
          <div style={{display: 'flex'}}>
            <div style={{flex: 1, paddingRight: 20}}>
              <div style={{display: 'flex'}}>
                <ShortText style={editStyles.icon} color={'#484848'}/>
                <div style={{display: 'flex', flexWrap: 'wrap'}}>
                  {
                    this.props.data && this.props.data.details.map((user) => (
                      user ?
                      <Chip style={chipStyles.chip}
                        deleteIconStyle={chipStyles.deleteStyle}
                        onRequestDelete={() => this.handleDeleteUser(user)}
                        labelStyle={chipStyles.chipLabel}>
                        {user['Full Name']}
                      </Chip>
                      :
                      null
                    ))
                  }
                </div>
              </div>

              <div style={{display: 'flex', paddingTop: 16}}>
                <div style={{width: 54}}>
                  <ShortText style={editStyles.icon} color={'#484848'}/>
                </div>
                <div style={{flex: 1}}>
                  {this.props.data.email.Body && this.props.data.email.Body.Content ?
                  <LinesEllipsis
                    text={this.props.data.email.Body.Content}
                    maxLine='3'
                    ellipsis='...'
                    trimRight
                    basedOn='words'/>
                  :
                  null
                  }
                </div>

              </div>
            </div>
            <div style={{flex: 1}}>
              <div style={{display: 'flex'}}>
                <div style={{width: 54}}>
                  <ShortText style={editStyles.icon} color={'#484848'}/>
                </div>
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {
                      this.props.data && this.props.data.details.map((user) => (

                            user && user.Organisations && user.Organisations.map((org) => (
                              <Chip style={chipStyles.chip}
                                deleteIconStyle={chipStyles.deleteStyle}
                                onRequestDelete={() => this.handleDeleteOrg(user, org)}
                                labelStyle={chipStyles.chipLabel}>
                                {org}
                              </Chip>
                            ))

                      ))
                    }
                  </div>
                </div>
              </div>
              <div style={{display: 'flex', paddingTop: 16}}>
                <div style={{width: 54}}>
                  <ShortText style={editStyles.icon} color={'#484848'}/>
                </div>
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', flexWrap: 'wrap'}}>
                    {
                      this.props.data && this.props.data.details.map((user) => (
                            user && user.tags && user.tags.map((tag) => (
                              <Chip style={chipStyles.chip}
                                deleteIconStyle={chipStyles.deleteStyle}
                                onRequestDelete={() => this.handleDeleteTag(user, tag)}
                                labelStyle={chipStyles.chipLabel}>
                                {tag}
                              </Chip>
                            ))
                      ))
                    }
                  </div>
                </div>
              </div>

            </div>
          </div>
        </CardText>
        <CardActions style={{textAlign: 'right'}}>
          <FlatButton
            labelStyle={buttonStyles.smallLabel}
            style={buttonStyles.smallSize}
             label="Delete" />
          <RaisedButton
            style={buttonStyles.smallSize}
            labelStyle={buttonStyles.smallLabel}
            primary={true}
            label="Confirm" />

        </CardActions>
      </Card>
    )
  }
}

export class Categorise extends React.Component {
  constructor(props) {
    super(props)
    this.state = {outlookFinished: false}
  }

  addEmails = (result) => {
    var newEmails = result.data && result.data.data
    var currentEmails = this.state.emails ? this.state.emails : []
    newEmails.forEach((email) => {
      currentEmails.unshift(email)
      this.setState({emails: currentEmails})
    })

  }

  editEmailDetailsFromChild = (detail, index) => {
    var emails = this.state.emails
    emails[index].details = detail
    this.setState({emails: emails})
  }

  handleFinish = () => {
    this.setState({outlookFinished: true})
  }

  render() {
    console.log(this.state)
    return (
      <div>
        <App>
          <OutlookIntegrate
            onFinish={this.handleFinish}
            handleResult={this.addEmails}
            />
          <div style={{position: 'fixed', zIndex: -1, top: 50, borderRadius: '30% 0 0 90%',
            transform: 'skewX(-10deg)', backgroundColor: '#FFCB00', right: -250,
             width: '30vw', height: '100vw'}}/>
           <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh'}}>
            <div style={{maxWidth: 1200, boxSizing: 'border-box', padding: 20}}>
              <div style={headerStyles.desktop}>
                We just need a bit of help classifying a few things...
              </div>
              <div style={{height: 4, width: 100, backgroundColor: '#000AB2', marginBottom: 20}}/>
              {
                !this.state.outlookFinished ?
                <div style={{width: '100%', display:'flex', alignItems: 'center', flexDirection: 'column'}}>
                  <CircularProgress size={50} thickness={4} />
                  <div style={{paddingTop: 10}}>
                    {
                      this.state.emails ?
                      <span>Still a few more to go</span> :

                      <span>This could take a minute</span>}</div>
                </div>
                :
                null
              }
              {
                this.state.emails && this.state.emails.map((email) => (
                  email ?
                  <InteractionCard
                    editDetails={this.editEmailDetailsFromChild}
                    index={this.state.emails.indexOf(email)}
                    type='Email' data={email}/>
                  :
                  null
                ))
              }

            </div>
          </div>
        </App>
      </div>
    )
  }
}

export default withMui(Categorise)
