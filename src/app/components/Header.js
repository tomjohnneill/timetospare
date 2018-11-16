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
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import DataLink from 'data-prefetch-link'
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import MediaQuery from 'react-responsive';
import Settings from 'material-ui/svg-icons/action/settings';
import Drawer from 'material-ui/Drawer';
import {Ass, Plant} from './icons.jsx'
import InfoOutline from 'material-ui/svg-icons/action/info';
import SignupModal from './signupmodal.jsx';
//import MessagingButton from '/imports/ui/components/messagingbutton.jsx';
import fire from '../fire';
import {buttonStyles} from './styles.jsx'
import Head from 'next/head'
import Home from 'material-ui/svg-icons/action/home';
import "../style.css"
import 'react-datasheet/lib/react-datasheet.css';

let db = fire.firestore()

const style = {
  display: 'inline-block',
  margin: '16px 32px 16px 0',
  title: {
    cursor: 'pointer',
    fontFamily: 'Pacifico',
    color: '#000AB2',
    fontSize: '25px',
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
  },
  category: {
    height: '100%',
  cursor: 'pointer', display: 'flex', alignItems: 'center', marginRight:25
},
selectedCategory : {
  height: '100%',
cursor: 'pointer', display: 'flex', alignItems: 'center', marginRight:25, borderBottom: '2px solid #000AB2'
}

};


export default class Header extends React.Component {

  constructor(props){
    super(props);
    console.log(props)
    console.log(props.router.pathname)


    this.state = {
      path: '',
      drawerOpen: false, open: false, changePasswordOpen: false, modalOpen: false, loading: true};

  }


  componentDidMount(props) {
    this.setState({path: Router.asPath})
    fire.auth().onIdTokenChanged(user => {
      if (user) {
        user.getIdToken().then(token => {
          document.cookie = `__session=${token};max-age=3600`;
        });
      } else {
        document.cookie = '__session=;max-age=0';
      }
    });


    fire.auth().onAuthStateChanged((user) => {
      if (user === null) {
        this.setState({loading: false})
      } else {
        user.getIdToken().then(token => {
          document.cookie = `__session=${token};max-age=3600`;
        });
        db.collection("User").doc(fire.auth().currentUser.uid).get().then((data) => {
          this.setState({user: data.data(), userPicture: data.data().Picture, loading: false})
        })
        db.collection("Charity").where("Admin." + fire.auth().currentUser.uid, "==", true)
        .get().then((snapshot) => {
          if (snapshot.size > 0) {
            snapshot.forEach((doc) => {
              this.setState({organisation: doc.id})
            })
          }
        })
        .catch(error => console.log('Error', error))
      }
    })

    if (fire.auth().currentUser) {
      db.collection("User").doc(fire.auth().currentUser.uid).get().then((data) => {
        this.setState({user: data.data(), userPicture: data.data().Picture, loading: false})
      })
      db.collection("Charity").where("Admin." + fire.auth().currentUser.uid, "==", true)
      .get().then((snapshot) => {
        if (snapshot.size > 0) {
          snapshot.forEach((doc) => {
            this.setState({organisation: doc.id})
          })
        }
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
    if (this.state.organisation) {
      Router.push('/dashboard')
    }
    else {
      Router.push('/signup')
    }
  }

  handleComplete = () => {
    this.setState({modalOpen: false})
  }

  goToAndClose = (url) => {
    this.setState({drawerOpen: false})

  }

  render() {
    console.log(this.props.router.pathname)
  return(

      <div >
        <Head>
          <title>Time to Spare</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" key="viewport" />

        </Head>
        <AppBar

          style={this.props.router.pathname.includes('/embed/') ? style.embedAppBar :
            this.props.router.pathname === '/why' ? style.whyAppBar : style.appBar}
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

                            <MediaQuery
                              values={{deviceWidth: 700}}
                              minDeviceWidth={700}>
                              {
                                this.props.router.pathname.includes('create-project') ?
                                null
                                :
                                <div
                                  className='link-container'
                                   style={{display: 'flex', height: '100%', fontWeight: 'normal', alignItems: 'center'}}>
                                   {
                                     this.state.organisation || (typeof window !== 'undefined' && localStorage.getItem('sample') == "true") ?
                                     <div style={{display: 'flex', height: '100%', fontWeight: 'normal', alignItems: 'center'}}>
                                       <Link prefetch href={`/dashboard`}>
                                         <div
                                           className='header-category'
                                           style={
                                             this.props.router.pathname.includes('/dashboard') ?
                                             style.selectedCategory :
                                             style.category}

                                           >
                                           <Home/>
                                         </div>
                                       </Link>
                                       <Link prefetch href={`/project-calendar?organisation=${this.state.organisation}`}>
                                         <div
                                           className='header-category'
                                           style={
                                             this.props.router.pathname.includes('project-calendar') ?
                                             style.selectedCategory :
                                             style.category}

                                           >
                                           Calendar
                                         </div>
                                       </Link>
                                       <DataLink prefetch withData href={`/people?organisation=${this.state.organisation}`}>
                                         <div
                                           className='header-category'
                                           style={
                                             this.props.router.pathname.includes('people') ?
                                             style.selectedCategory :
                                             style.category}

                                           >
                                           People
                                         </div>
                                       </DataLink>
                                       <Link prefetch href={`/organisations?view=${this.state.organisation}`}>
                                         <div
                                           className='header-category'
                                           style={
                                             this.props.router.pathname.includes('organisations') ?
                                             style.selectedCategory :
                                             style.category}

                                           >
                                           Organisations
                                         </div>
                                       </Link>
                                     </div>

                                     :
                                     null
                                   }

                                   <div style={{width: 25, color:'#DBDBDB'}}>
                                     |
                                   </div>

                                   <Link prefetch href='/pricing'>
                                     <div style={
                                       this.props.router.pathname.includes('pricing') ?
                                       style.selectedCategory :
                                       style.category}
                                       className='header-category'
                                       >
                                       Pricing
                                     </div>
                                   </Link>

                                  <Link prefetch href='/projects'>
                                    <div style={
                                      this.props.router.pathname.includes('projects') ?
                                      style.selectedCategory :
                                      style.category}
                                      className='header-category'
                                      >
                                      Projects
                                    </div>
                                  </Link>
                                  {
                                    this.state.organisation ?
                                    null :
                                  <div style={{paddingRight: 15}}>
                                    <RaisedButton
                                      style={buttonStyles.smallSize} primary={true} overlayStyle={{height: '36px'}}

                                       labelStyle={buttonStyles.smallLabel}

                                       label={<span className='flexthis' style={{display: 'flex'}}>

                                         Sign up free

                                       </span>} onClick={this.handleCreateProject}/>
                                  </div>
                                }
                               </div>
                             }

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
                                  <Link  prefetch href='/your-calendar'>
                                    <MenuItem primaryText="Calendar"/>
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

                                <IconButton onClick={(event) => {
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
                                onClick={this.setModal}
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
            <Link prefetch href={'/'}>
            <div style={{display: 'flex'}}>

              <span  className = 'whosin' style={style.title}>
                Time to Spare
              </span>
            </div>
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
              <span onClick ={this.handleTitleTap.bind(this)}  className = 'whosin' style={style.title}>
                Time to Spare
              </span>
            </div>
            {
              this.state.organisation ?
              <div>

              <Link prefetch href={`/project-calendar?organisation=${this.state.organisation}`}>
                <MenuItem primaryText="Project Calendar" />
               </Link>
               <Link prefetch href={`/people?organisation=${this.state.organisation}`}>
                 <MenuItem primaryText="People" />
               </Link>
               <Link prefetch href={`/messaging?organisation=${this.state.organisation}`}>
                 <MenuItem primaryText="Messaging"/>
               </Link>
               <Divider/>
             </div>
             :
             null
            }
            <Link href='/projects'>
              <MenuItem onClick={() => this.goToAndClose('/projects')}>Projects</MenuItem>
            </Link>
            <Link href='/create-other' >
              <MenuItem onClick={this.handleCreateProject}>Start an organisation</MenuItem>
            </Link>
          </Drawer>

      </div>
    );
  }

}
