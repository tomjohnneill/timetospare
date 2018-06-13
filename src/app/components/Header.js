import React from "react"
import Link from "next/link"
import Router from 'next/router'
import Menu from 'material-ui/Menu';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';
import Popover from 'material-ui/Popover';
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import MediaQuery from 'react-responsive';
import Settings from 'material-ui/svg-icons/action/settings';
import Drawer from 'material-ui/Drawer';
import {Ass} from './icons.jsx'
import InfoOutline from 'material-ui/svg-icons/action/info';
import SignupModal from './signupmodal.jsx';
//import MessagingButton from '/imports/ui/components/messagingbutton.jsx';
import fire from '../fire';
import Head from 'next/head'
import "../style.css"
import 'react-datasheet/lib/react-datasheet.css';

let db = fire.firestore()

const style = {
  display: 'inline-block',
  margin: '16px 32px 16px 0',
  title: {
    cursor: 'pointer',
    fontFamily: 'Permanent Marker',
    color: '#E55749',
    fontSize: '30px',
    marginRight: '10px'
  },
  appBar: {
    margin: '0px',
    boxShadow: 'inset 0px 1px 3px rgba(0,0,0.5), 0px 2px 4px, rgba(0,0,0.5)',
    paddingLeft: '16px',
    position: 'fixed',
    color: 'inherit',
    fontWeight: 'normal',
    marginBottom: 56,
    top: 0,
    backgroundColor: 'white',
    borderBottom: '1px solid #DBDBDB'
  },
  embedAppBar: {
    display: 'none'
  },
  whyAppBar: {
    margin: '0px',
    boxShadow: 'inset 0px 1px 3px rgba(0,0,0.5), 0px 2px 4px, rgba(0,0,0.5)',
    paddingLeft: '16px',
    position: 'fixed',
    top: 0,
    backgroundColor: 'white',
    borderBottom: '1px solid #DBDBDB'
  },
  otherAnchor :{
    float: 'right',
    width: '10px',
  },
  popover: {
    maxWidth: '180px'
  },
  avatar: {
    cursor: 'pointer'
  }
  , badge: {
    paddingBottom : '0px'
    , paddingTop: '16px'
    , marginRight: '12px'
    , cursor: 'pointer'
  }
  , alertBadge: {
    paddingBottom : '0px'
    , paddingTop: '16px'
    , cursor: 'pointer'
  }
  , rightSide: {
    height: '50px'
    , display: 'flex'
    , alignItems: 'center'
  }
  , plainIcon: {
    paddingRight: '36px',
    paddingLeft: '12px'
  }
  , alertPlain: {
    paddingRight: '12px'
  }
  , verifiedPlain: {
    paddingRight: '24px'
  }
};


export default class Header extends React.Component {

  constructor(props){
    super(props);
    console.log(props)


    this.state = {drawerOpen: false, open: false, changePasswordOpen: false, modalOpen: false, loading: true};

  }


  componentDidMount(props) {
    fire.auth().onAuthStateChanged((user) => {
      if (user === null) {

      } else {
        db.collection("User").doc(fire.auth().currentUser.uid).get().then((data) => {
          this.setState({user: data.data(), userPicture: data.data().Picture, loading: false})
        })
        .catch(error => console.log('Error', error))
      }
    })

    if (fire.auth().currentUser) {
      db.collection("User").doc(fire.auth().currentUser.uid).get().then((data) => {
        this.setState({user: data.data(), userPicture: data.data().Picture, loading: false})
      })
      .catch(error => console.log('Error', error))
    }
  }


  handleOpen() {
  this.setState({changePasswordOpen: true});
  };

  handleClose() {
    this.setState({changePasswordOpen: false});
  };


  handleRequestClose() {
    this.setState({
      open: false
    });
  };

  handlePopoverClose = () => {
    this.setState({popoverOpen: false})
  }

  handleChange(textField, event) {
        this.setState({
            [textField]: event.target.value
        });
    }

  handleTitleTap(event) {
    event.preventDefault();

    Router.push('/')
  }

  handleChangePassword(e) {

  }

  handleSettingsClick = (e) => {
    e.preventDefault()
    this.setState({
      open: true,
      anchorEl: e.currentTarget
    })
  }

  handleSignOut = (e) => {
    e.preventDefault()
    fire.auth().signOut()
    .then(() => {Router.push('/'); this.setState({drawerOpen: false})})

    fire.auth().onAuthStateChanged((user) => {
      if (user === null) {
        this.setState({user: null, userPicture: null})
      }
    })
  }

  handleModal = (e) => {
    this.setState({open: false})
    this.setState({modalOpen: !this.state.modalOpen})

  }

  setModal = () => {
    let modal = this.state.modalOpen
    this.setState({modalOpen: !modal})
  }

  handleModalChangeOpen = (e) => {
    this.setState({modalOpen: false})
  }

  handleSignIn = (e) => {
    e.preventDefault()

  }

  handleTerms = (e) => {
    e.preventDefault()
    Router.push('/terms')
  }

  handlePrivacyPolicy = (e) => {
    e.preventDefault()
    Router.push('/privacypolicy')
  }


  handleNewPledge = (e) => {
    console.log('handleNewPledge fired')

  }

  handleCreateProject = (e) => {
    e.preventDefault()
    if (fire.auth().currentUser) {
      Router.push('/create-project?stage=0')
    } else {
      this.setState({modalOpen: true})
    }

  }

  handleComplete = () => {
    this.setState({modalOpen: false})
  }

  goToAndClose = (url) => {
    this.setState({drawerOpen: false})

  }

  render() {
    console.log(this.state)

  return(

      <div >
        <Head>
          <title>Who's In?</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />
          <script defer src="https://use.fontawesome.com/releases/v5.0.8/js/all.js" integrity="sha384-SlE991lGASHoBfWbelyBPLsUlwY1GwNDJo3jSJO04KZ33K2bwfV9YBauFfnzvynJ" crossorigin="anonymous"></script>
        </Head>
        <AppBar

          style={typeof window !== 'undefined' && Router.asPath.includes('/embed/') ? style.embedAppBar :
            typeof window !== 'undefined' && Router.asPath === '/why' ? style.whyAppBar : style.appBar}
          iconClassNameLeft='mobile-nav-bar'
          iconElementLeft={
            <div>
              <MediaQuery minDeviceWidth={700}>
                <div style={{width: 16}}/>
              </MediaQuery>
              <MediaQuery maxDeviceWidth={700}>
                <IconButton onClick={() => this.setState({drawerOpen: true})} tooltip='Menu'>
                  <MenuIcon/>
                </IconButton>
              </MediaQuery>
            </div>
          }
          className={'appbar'}
          iconElementRight={
                            <div style={{display: 'flex', alignItems: 'center', height: '100%'}}>

                            <MediaQuery minDeviceWidth = {700}>
                              {typeof window !== 'undefined' && !Router.asPath.includes('create-project') ?
                                <div
                                  className='link-container'
                                   style={{display: 'flex', height: '100%', alignItems: 'center'}}>
                                  <Link prefetch style={{height: '100%'}} href='/why'>
                                    <div style={{
                                      cursor: 'pointer', display: 'flex', alignItems: 'center', paddingRight:25}}

                                      >
                                      Why start a project?
                                    </div>
                                  </Link>
                                  <Link prefetch href='/about'>
                                    <div style={{
                                      cursor: 'pointer', display: 'flex', alignItems: 'center', paddingRight:25}}

                                      >
                                      About
                                    </div>
                                  </Link>
                                  <Link href='/groups'>
                                    <div style={{
                                      cursor: 'pointer', display: 'flex', alignItems: 'center', paddingRight:25}}

                                      >
                                      Groups
                                    </div>
                                  </Link>
                                  <Link prefetch href='/projects'>
                                    <div style={{
                                      cursor: 'pointer', display: 'flex', alignItems: 'center', paddingRight:25}}

                                      >
                                      Projects
                                    </div>
                                  </Link>

                                    <RaisedButton
                                      style={{height: '36px', marginRight: '16px', boxShadow: ''}} primary={true} overlayStyle={{height: '36px'}}
                                      buttonStyle={{height: '36px'}}
                                       labelStyle={{height: '36px', display: 'inline-flex', alignItems: 'center',
                                            letterSpacing: '0.6px', fontWeight: 'bold'}}
                                      labelClassName
                                       label={<span className='flexthis' style={{display: 'flex'}}>Start a Project</span>} onTouchTap={this.handleCreateProject}/>

                               </div>
                               :
                               null}

                            </MediaQuery>
                            <Popover
                              open={this.state.popoverOpen}
                               anchorEl={this.state.anchorEl}
                               anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                               targetOrigin={{horizontal: 'left', vertical: 'top'}}
                               onRequestClose={this.handlePopoverClose}>
                               <Menu style={{width: 150}}>
                                 <Link href='/profile' prefetch>
                                   <MenuItem primaryText="Profile" />
                                  </Link>
                                  <Link href='/edit-profile' prefetch>
                                    <MenuItem primaryText="Edit Profile" />
                                  </Link>
                                  <Link prefetch href='/groups'>
                                    <MenuItem primaryText="Groups" />
                                  </Link>

                                    <MenuItem onClick={this.handleSignOut}
                                      primaryText="Sign out" />


                              </Menu>
                            </Popover>
                            {this.state.loading ? null :
                              this.state.user ?
                              <div style={{
                                  height: '100%',
                                  alignItems: 'center',
                                  display: 'flex'
                                }}>

                                <IconButton onTouchTap={(event) => {
                                     event.preventDefault();
                                      this.setState({
                                    popoverOpen: true,
                                    anchorEl: event.currentTarget,
                                  })}}

                                style={{padding: 0, height: 40, width: 40}}>
                                {this.state.userPicture ?
                                <Avatar src={this.state.userPicture}/>
                                :
                                <Avatar> {this.state.user.Name.substring(0,1)}</Avatar>
                                }
                              </IconButton>



                              </div> :
                            null}
                            {!this.state.user ?
                              <div
                                onTouchTap={this.setModal}
                                style={{cursor: 'pointer',
                                  fontWeight: 700,
                                  color: 'inherit',
                                  display: 'flex',
                                  paddingLeft: 10, paddingRight: 10}}>Log In
                                </div>
                            : null}
                            </div>}
          title={
            <div className='flexthis' style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <Link href={'/'}>
            <span onTouchTap ={this.handleTitleTap.bind(this)}  className = 'whosin' style={style.title}>
              who's in?
            </span>
            </Link>

            </div>
          }
          titleStyle = {{display: 'flex', alignItems: 'center', justifyContent: 'flex-start'}}
          />

        <div>
          {/*<SignupModal

            open={this.state.modalOpen}
            changeOpen={this.handleModalChangeOpen}
          />
          */}
       </div>
       <SignupModal
         open={this.state.modalOpen}
         type='login'
         changeOpen={this.handleModalChangeOpen}
         onComplete = {this.handleComplete}
         />
       <Drawer
         style={{textAlign: 'left'}}
          onRequestChange={(drawerOpen) => {
            this.setState({drawerOpen: drawerOpen})
            console.log('request changed')
          }}
          docked={false}
          open={this.state.drawerOpen}>
            <div style={{height: 51, display: 'flex', alignItems: 'center'}}>
              <IconButton style={{marginRight: 8}}
                onClick={() => this.setState({drawerOpen: false})} tooltip='Menu'>
                <MenuIcon/>
              </IconButton>
              <span onTouchTap ={this.handleTitleTap.bind(this)}  className = 'whosin' style={style.title}>
                who's in?
              </span>
            </div>
            <Link href='/about'>
              <MenuItem onClick={() => this.goToAndClose('/about')}>About</MenuItem>
            </Link>
            <Link href='/why'>
              <MenuItem onClick={() => this.goToAndClose('/why')}>Why start a project?</MenuItem>
            </Link>
            <Link href='/projects'>
              <MenuItem onClick={() => this.goToAndClose('/projects')}>Projects</MenuItem>
            </Link>
            <Link href='/groups'>
              <MenuItem onClick={() => this.goToAndClose('/groups')}>Groups</MenuItem>
            </Link>
            <Link href='/create-project?stage=0' >
              <MenuItem onClick={this.handleCreateProject}>Start a project</MenuItem>
            </Link>
            <MenuItem onClick={this.handleSignOut}>
              Sign out</MenuItem>
          </Drawer>

      </div>
    );
  }

}
