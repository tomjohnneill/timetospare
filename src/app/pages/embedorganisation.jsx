import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Link from "next/link"
import Router from 'next/router'
import {changeImageAddress} from '../components/desktopproject.jsx';
import {Spiral, CalendarIcon, Place, Clock, World, Tick} from '../components/icons.jsx';
import {yellow500, grey200, grey500} from 'material-ui/styles/colors'
import EmbeddedProject from '../components/embeddedproject.jsx';
import {CharityProjects} from './charity.jsx';
import App from "../components/App"
import fire from '../fire';
import withMui from '../components/hocs/withMui';

let db = fire.firestore()

const styles = {
  circle : {
    borderRadius: '50%',
    border: '2px solid ' + grey200,
    color: grey500,
    width: 24,
    fontWeight: 700,
    height: 24,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  badRating : {
    borderRadius: '50%',
    border: '2px solid rgb(182,48,43)',
    color: 'white',
    width: 24,
    fontWeight: 700,
    height: 24,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(182,48,43)'
  },
  middleRating : {
    borderRadius: '50%',
    border: '2px solid ' + yellow500,
    color: 'inherit',
    width: 24,
    fontWeight: 700,
    height: 24,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: yellow500
  },
  goodRating : {
    borderRadius: '50%',
    border: '2px solid ' + 'rgb(59,158,116)',
    color: 'white',
    width: 24,
    fontWeight: 700,
    height: 24,
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(59,158,116)'
  }
}

class EmbeddedOrganisation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: true}
  }

  componentDidMount(props) {
    var charityId = this.props.params.charityId
    db.collection("Charity").doc(charityId).get().then((docRef) => {
      var data = docRef.data()
      this.setState({charity: data, loading: false})
    })
    db.collection("ProjectReview").where("Charity", "==", charityId).get()
    .then((querySnapshot) => {
      var data = []
      var total = 0
      var count = 0
      querySnapshot.forEach((doc) => {
        var elem = doc.data()
        total += elem.Rating
        count += 1
      })
      if (count > 0) {
        this.setState({averageRating: total/count, reviewCount: count})
      }
    })
  }

  render() {
    return (
      <App>
        {this.state.loading ?
          null
          :
          <div style={{marginTop: -50, borderRadius: 2, border: '1px solid #aaa', backgroundColor: 'rgba(0,0,0,0)'}}>
            <div style={{display: 'flex', alignItems: 'center', minHeight: 148.8}}>
              <div style={{fontFamily: 'Permanent Marker', fontSize: '50px', color: '#000AB2',
                height: '100%', display: 'flex', alignItems: 'top',
                  paddingRight: 50, paddingLeft: 16}}>
                who's in?
              </div>
              <div className='charity-header-container' >
                {this.state.charity['Featured Image'] ?
                  <img className='charity-logo-in-header'
                    src={changeImageAddress(this.state.charity['Featured Image'], '500xauto')}
                    style={{borderRadius: '6px', width: 'auto', height: 80, margin: 10}}/>
                  :
                  <div style={{margin: 10, height: 80, width: 80, borderRadius: '50%', backgroundColor: 'rgba(216,216,216,0.2)',
                      display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <World style={{height: 50, width: 50}}/>
                  </div>
                }
                <div className='charity-title-container' >
                  <div className='charity-title' style={{fontWeight: 'bold', fontSize: '36px', textAlign: 'left'}}>
                    {this.state.charity.Name +  "'s Projects"}
                  </div>
                </div>
              </div>
              <Link
                target={this.props.location && this.props.location.pathname.includes('/embed/') ? '_parent' : '_self'}
                href={`/charity/${this.props.params.charityId}`}>
                <a>
                <div className='review-container'
                  style={{display: 'flex', alignItems: 'flex-end', height: '100%', minHeight: 148.8 , paddingBottom: 10,
                  paddingLeft: 40, boxSizing: 'border-box'}}>
                  {this.state.reviewCount  > 0 ?

                  <div style={{display: 'flex', alignItems: 'center', cursor: 'pointer',
                    justifyContent: 'space-between', textAlign: 'left', paddingTop: 16}}>
                    <div style={{minWidth: '150px', color: '#65A1e7', textDecoration: 'underline', fontWeight: 700}}>
                      Read all {this.state.reviewCount} reviews
                    </div>
                    <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        paddingLeft: 16, paddingRight: 16}}>
                      <span

                        style={this.state.averageRating > 3 ? styles.goodRating : this.state.averageRating === 3 ? styles.middleRating : this.state.averageRating < 3 ? styles.badRating :  styles.circle}>
                        1
                      </span>
                      <span
                        style={this.state.averageRating > 3 ? styles.goodRating : this.state.averageRating === 3 ? styles.middleRating : this.state.averageRating === 2 ? styles.badRating :  styles.circle}>
                        2

                      </span>
                      <span
                          style={this.state.averageRating > 3 ? styles.goodRating : this.state.averageRating === 3 ? styles.middleRating : styles.circle}>
                        3
                      </span>
                      <span
                          style={this.state.averageRating > 3 ? styles.goodRating : styles.circle}>
                        4
                      </span>
                      <span
                        style={this.state.averageRating === 5 ? styles.goodRating : styles.circle}>
                        5
                      </span>
                    </div>
                  </div>
                  :
                  null}


                </div>
                </a>
              </Link>
            </div>
            <CharityProjects charityId={this.props.params.charityId}/>
          </div>
        }

      </App>
    )
  }
}

export default withMui(EmbeddedOrganisation)
