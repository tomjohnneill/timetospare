import React from 'react'
import Divider from 'material-ui/Divider';
import App from '../components/App.js';
import RaisedButton from 'material-ui/RaisedButton';
import withMui from '../components/hocs/withMui.js';
import {buttonStyles} from '../components/styles.jsx';
import {Tick} from '../components/icons.jsx';
import MediaQuery from 'react-responsive';

let mobile = require('is-mobile');

const styles = {
  price: {
    fontSize: '30px',
    paddingTop: 20,
    height: 100,
  },
  categoryHeader: {
    fontWeight: 700,
    fontSize: '20px',
    paddingBottom: 5
  },
  categoryText: {
    height: 80
  },
  userNo: {
    fontSize: '20px'
  },
  includes: {
    marginTop: 20,
    paddingTop: 20,
    borderTop: '1px solid #484848'
  },
  featureText: {
    width: 200,
    color: '#000AB2',
    fontWeight: 700,
    textAlign: 'left'
  },
  tick: {
    height: 30
  },
  tickContainer: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'center',
    flex: 1, height: 60
  },
  middleContainer: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'center',
    flex: 1, height: 60, backgroundColor: '#edeeff'
  },
  selectedPlan: {
    backgroundColor: '#f6f6f4',
    color: '#000AB2',
    fontWeight: 700,
    padding: 20,
    flex: 1,
    borderRight: '1px solid black',
    transition: 'all .15s linear'
  },
  normalPlan: {
    flex: 1,
    padding: 20,
    borderRight: '1px solid black',
    transition: 'all .15s linear'
  },
  rightSelectedPlan: {
    backgroundColor: '#f6f6f4',
    color: '#000AB2',
    fontWeight: 700,
    padding: 20,
    flex: 1,
    transition: 'all .15s linear'
  },
  rightNormalPlan: {
    flex: 1,
    padding: 20,
    transition: 'all .15s linear'
  }
}

const Feature = (props) => (
  <div>
    <MediaQuery
      values={{deviceWidth: props.isMobile ? 600 : 1400}}
      minDeviceWidth={700}>
      <div style={{width: 1100, display: 'flex', alignItems: 'center' }}>
        <div style={styles.featureText}>
          {props.name}
        </div>
        <div style={styles.tickContainer}>
          <Tick
            color='#00b012'
            style={styles.tick}/>
        </div>
        <div style={styles.middleContainer}>
          <Tick
            color='#00b012'
            style={styles.tick}/>
        </div>
        <div style={styles.tickContainer}>
          <Tick
            color='#00b012'
            style={styles.tick}/>
        </div>
      </div>
    </MediaQuery>
    <MediaQuery
      values={{deviceWidth: props.isMobile ? 600 : 1400}}
      maxDeviceWidth={700}>
      <div style={{width: '100%', display: 'flex', alignItems: 'center' }}>
        <div style={styles.featureText}>
          {props.name}
        </div>
        <div style={styles.tickContainer}>
          <Tick
            color='#00b012'
            style={styles.tick}/>
        </div>

      </div>
    </MediaQuery>
  </div>

)

export class Pricing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {plan: 'small'}
  }

  handleChoosePlan = (plan) => {
    this.setState({plan: plan})
  }

  renderMobilePlan = () => {
    switch(this.state.plan) {
      case 'personal':
        return (
          <div style={{flex: 1, padding: 20, paddingBottom: 40,
              backgroundColor: '#edeeff',
               borderTop: '1px solid #484848', borderBottom: '1px solid #484848'}}>
            <div style={styles.categoryHeader}>Personal</div>
            <div style={styles.categoryText}>
              Ideal for volunteers and organisations with one admin member of staff
            </div>

            <div style={styles.price}>Free</div>
            <div style={styles.userNo}>
              <b>1</b> account
            </div>
            <div style={{paddingTop: 25}}>
              <RaisedButton
                style={buttonStyles.bigSize}
                primary={true}
                labelStyle={buttonStyles.bigLabel}
                label='Start Now Free'
                />
            </div>

          </div>
        )
      case 'small' :
        return (
          <div style={{flex: 1, padding: 20, backgroundColor: '#edeeff',
            paddingBottom: 40
            , borderTop: '1px solid #484848', borderBottom: '1px solid #484848'}}>
            <div style={styles.categoryHeader}>Small Organisation</div>
            <div style={styles.categoryText}>
              Perfect for small organisations and teams
            </div>
            <div style={styles.price}><b>£100</b><br/>/month</div>
            <div style={styles.userNo}>
              Up to <b>5</b> accounts
            </div>
            <div style={{paddingTop: 25}}>
              <RaisedButton
                style={buttonStyles.bigSize}
                primary={true}
                labelStyle={buttonStyles.bigLabel}
                label='Sign Up Now'
                />
            </div>

          </div>
        )
        case 'major':
        return (
          <div style={{flex: 1, padding: 20, borderTop: '1px solid #484848',
            backgroundColor: '#edeeff',
            paddingBottom: 40,
            borderBottom: '1px solid #484848'}}>
            <div style={styles.categoryHeader}>Major Institution</div>
            <div style={styles.categoryText}>
              Designed for large charities, local authorities, funders and umbrella organisations
            </div>
            <div style={styles.price}><b>£1000</b><br/>/month</div>
            <div style={styles.userNo}>
              <b>Unlimited</b> accounts
            </div>
            <div style={{paddingTop: 25}}>
              <RaisedButton
                style={buttonStyles.bigSize}
                primary={true}
                labelStyle={buttonStyles.bigLabel}
                label='Sign Up Now'
                />
            </div>

          </div>
        )
    }
  }

  render() {
    var isMobile = mobile(this.props.userAgent)
    return (
      <div>
        <App>
          <div style={{paddingTop: '50', display: 'flex', justifyContent: 'center',
            paddingLeft: 10, paddingRight: 10, boxSizing: 'border-box'}}>
            <div>
              <h2 style={{fontWeight: 200, fontSize: '30px', paddingTop: 50}}>
                Pick the right plan to fit your needs
              </h2>
              <div style={{display: 'flex', justifyContent: 'center', paddingBottom: 50}}>
                <div style={{backgroundColor:'#000AB2', width: 80, height: 4}}/>
              </div>


              <MediaQuery
                values={{deviceWidth: isMobile ? 600 : 1400}}
                minDeviceWidth={700}>
                <div style={{position: 'fixed', zIndex: -1, top: 50, borderRadius: '0 30% 90% 0%',
                  transform: 'skewX(-10deg)', backgroundColor: '#FFCB00', left: -250,
                   width: '20vw', height: '100vw'}}/>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <div style={{maxWidth: 1100, display: 'flex',justifyContent: 'center'}}>
                    <div style={{width: 200, borderTop: '1px solid #484848', borderBottom: '1px solid #484848'}}>

                        <div style={{paddingTop: 20,  fontSize: '20px', textAlign: 'left'}}>
                          Plan
                          </div>

                    </div>

                    <div style={{flex: 1, padding: 20, paddingBottom: 40,
                         borderTop: '1px solid #484848', borderBottom: '1px solid #484848'}}>
                      <div style={styles.categoryHeader}>Personal</div>
                      <div style={styles.categoryText}>
                        Ideal for volunteers and organisations with one admin member of staff
                      </div>

                      <div style={styles.price}>Free</div>
                      <div style={styles.userNo}>
                        <b>1</b> account
                      </div>
                      <div style={{paddingTop: 25}}>
                        <RaisedButton
                          style={buttonStyles.bigSize}
                          primary={true}
                          labelStyle={buttonStyles.bigLabel}
                          label='Start Now Free'
                          />
                      </div>

                    </div>

                    <div style={{flex: 1, padding: 20, backgroundColor: '#edeeff',
                      paddingBottom: 40
                      , borderTop: '1px solid #484848', borderBottom: '1px solid #484848'}}>
                      <div style={styles.categoryHeader}>Small Organisation</div>
                      <div style={styles.categoryText}>
                        Perfect for small organisations and teams
                      </div>
                      <div style={styles.price}><b>£100</b><br/>/month</div>
                      <div style={styles.userNo}>
                        Up to <b>5</b> accounts
                      </div>
                      <div style={{paddingTop: 25}}>
                        <RaisedButton
                          style={buttonStyles.bigSize}
                          primary={true}
                          labelStyle={buttonStyles.bigLabel}
                          label='Sign Up Now'
                          />
                      </div>

                    </div>

                    <div style={{flex: 1, padding: 20, borderTop: '1px solid #484848',
                      paddingBottom: 40,
                      borderBottom: '1px solid #484848'}}>
                      <div style={styles.categoryHeader}>Major Institution</div>
                      <div style={styles.categoryText}>
                        Designed for large charities, local authorities, funders and umbrella organisations
                      </div>
                      <div style={styles.price}><b>£1000</b><br/>/month</div>
                      <div style={styles.userNo}>
                        <b>Unlimited</b> accounts
                      </div>
                      <div style={{paddingTop: 25}}>
                        <RaisedButton
                          style={buttonStyles.bigSize}
                          primary={true}
                          labelStyle={buttonStyles.bigLabel}
                          label='Sign Up Now'
                          />
                      </div>

                    </div>
                  </div>
                </div>
                <h2 style={{fontWeight: 200, fontSize: '30px', borderBottom: '1px solid #484848',
                  margin: 0, paddingLeft: 200,paddingTop: 10, paddingBottom: 10}}>
                  Included in your plan
                </h2>

              </MediaQuery>

              <MediaQuery
                values={{deviceWidth: isMobile ? 600 : 1400}}
                maxDeviceWidth={700}>
                <div style={{padding: 10}}>
                  <div style={{display: 'flex', marginTop:0, marginBottom: 50,
                    border: '1px solid black',
                  boxSizing: 'border-box', width: '100%'}}>
                    <div onClick={() => this.handleChoosePlan('personal')}
                      style={this.state.plan === 'personal' ? styles.selectedPlan : styles.normalPlan}
                      >
                      Personal
                    </div>
                    <div onClick={() => this.handleChoosePlan('small')}
                      style={this.state.plan === 'small' ? styles.selectedPlan : styles.normalPlan}
                      >
                      Small
                    </div>
                    <div onClick={() => this.handleChoosePlan('major')}
                      style={this.state.plan === 'major' ? styles.rightSelectedPlan : styles.rightNormalPlan}
                      >
                      Major
                    </div>

                  </div>
                </div>

                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <div>

                    {
                      this.renderMobilePlan()
                    }
                  </div>
                </div>

              </MediaQuery>
              <Feature isMobile={isMobile} name='Contact Database'/>
              <Feature isMobile={isMobile} name='Linked Organisations'/>
              <Feature isMobile={isMobile} name='Timelines'/>
              <Feature isMobile={isMobile} name='Calendars'/>
              <Feature isMobile={isMobile} name='Email Integration'/>
              <Feature isMobile={isMobile} name='Events'/>
              <Feature isMobile={isMobile} name='Emails'/>
              <Feature isMobile={isMobile} name='Texts'/>
              <Feature  isMobile={isMobile} name='Unlimited Add-ons'/>
            </div>
          </div>
        </App>
      </div>
    )
  }
}

export default withMui(Pricing)
