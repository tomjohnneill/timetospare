import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Link from "next/link"
import Router from 'next/router'
import {changeImageAddress} from './desktopproject.jsx';
import {Spiral, CalendarIcon, Place, Clock, World, Tick} from './icons.jsx';
import {yellow500, grey200, grey500} from 'material-ui/styles/colors';
import fire from '../fire';

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

export default class EmbeddedProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = {loading: true}
  }

  componentDidMount(props) {
    var projectId = this.props.params && this.props.params._id ? this.props.params._id : this.props.projectId
    console.log(projectId)
    if (this.props.project) {
      let project = this.props.project
      if (typeof project['Start Time'] === 'string') {
        project['Start Time'] = new Date(project['Start Time'])
        project['End Time'] = new Date(project['End Time'])
      }
      this.setState({project: project, loading: false})
      if (project.Charity) {
        db.collection("Charity").doc(project.Charity.toString()).get().then((charityDoc) => {
            var charity = charityDoc.data() ? charityDoc.data() : {}
            charity._id = charityDoc.id
            this.setState({ project: project, charity: charity, loading: false})
          })
          db.collection("ProjectReview").where("Project", "==", project._id).get()
          .then((querySnapshotReviews) => {
            let data = []
            querySnapshotReviews.forEach((doc) => {
              data.push(doc.data())
            })
            this.setState({projectReviews: data})
          })
          .catch(error => console.log('Error', error))
      }
    } else {
      db.collection("Project").doc(projectId).get().then((doc) => {
        var project = doc.data()
        project._id = doc.id
        this.setState({ project: project, loading: false})
        if (project.Charity) {
          db.collection("Charity").doc(project.Charity.toString()).get().then((charityDoc) => {
              var charity = charityDoc.data() ? charityDoc.data() : {}
              charity._id = charityDoc.id
              this.setState({ charity: charity})
            })
          db.collection("ProjectReview").where("Project", "==", project._id).get()
          .then((querySnapshotReviews) => {
            let data = []
            querySnapshotReviews.forEach((doc) => {
              data.push(doc.data())
            })
            this.setState({projectReviews: data})
          })
            .catch(error => console.log('Error', error))
        }
      })
      .catch(error => console.log('Error', error));
    }


  }

  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      let project = nextProps.project
      if (typeof project['Start Time'] === 'string') {
        project['Start Time'] = new Date(project['Start Time'])
        project['End Time'] = new Date(project['End Time'])
      }
      this.setState({project: project, loading: false})

      if (project.Charity) {
        db.collection("Charity").doc(project.Charity.toString()).get().then((charityDoc) => {
            var charity = charityDoc.data() ? charityDoc.data() : {}
            charity._id = charityDoc.id
            this.setState({ project: project, charity: charity, loading: false})
          })
          db.collection("ProjectReview").where("Project", "==", project._id).get()
          .then((querySnapshotReviews) => {
            let data = []
            querySnapshotReviews.forEach((doc) => {
              data.push(doc.data())
            })
            this.setState({projectReviews: data})
          })
          .catch(error => console.log('Error', error))
        }
        this.setState({project: nextProps.project, loading: false})

        if (project.Charity) {
          db.collection("Charity").doc(project.Charity.toString()).get().then((charityDoc) => {
              var charity = charityDoc.data() ? charityDoc.data() : {}
              charity._id = charityDoc.id
              this.setState({ project: project, charity: charity, loading: false})
            })
            .catch(error => console.log('Error', error))
          }

    }
    else {
      let project = this.props.project
      if (typeof project['Start Time'] === 'string') {
        project['Start Time'] = new Date(project['Start Time'])
        project['End Time'] = new Date(project['End Time'])
      }
      this.setState({project: project, loading: false})
    }
  }

  render() {
    var average = null
    if (this.state.projectReviews) {
      var reviews = this.state.projectReviews
      var total = 0
      var count = 0
      reviews.forEach((review) => {
        total += review.Rating
        count += 1
      })
      average = count === 0 ? null : Math.round(total/count,1)
    }
    return (
      <div>
        <div>
          {this.state.loading ?
            <div/>
            :
            <div onClick={() => localStorage.setItem('project', JSON.stringify(this.state.project))} style={{backgroundColor: 'white', borderRadius: 8, overflow: 'hidden', border: '1px solid #DDDDDD', paddingBottom: 24}}>
            <Link
              prefetch
              as={`/projects/p/${this.state.project._id}`}
              href={`/project?project=${this.state.project._id}`}
              target={this.props.location && this.props.location.pathname.includes('/embed/') ? '_parent' : '_self'}
               >
              <a>
              <img src={changeImageAddress(this.state.project['Featured Image'], '500xauto')}
                style={{width: '100%', height: '170px', objectFit: 'cover'}}
                />
              <div style={{paddingLeft: 24, paddingRight: 24}}>
                {this.state.charity ?
                <div className='charity-link-content'
                   style={{display: 'flex', marginTop: 6, alignItems: 'center'}}>
                  <div style={{marginRight: 10}} className='charity-icon'>
                    {this.state.charity['Featured Image'] ?
                      <img src={changeImageAddress(this.state.charity['Featured Image'], '50xauto')}
                        style={{height: 25, width: 25, borderRadius: '50%', objectFit: 'cover'}}/>
                      :
                      <World style={{height: 25, width: 25}} color={'#484848'}/>
                      }
                  </div>
                  <p className='charity-name' style={{margin: 0, fontSize: '14px'}}>
                      {this.state.charity.Name}
                  </p>
                </div>
                :
                null}
                    <div style={{fontSize: '24px', fontWeight: 'bold', textAlign: 'left',
                       margin: 0, marginTop: 10}}>
                      {this.state.project.Name}
                    </div>


                  <p style={{fontSize: '16px', fontWeight: 'light', textAlign: 'left'}}>
                    {this.state.project.Summary}
                  </p>

                  {this.state.project['Start Time'] ?
                  <div style={{display: 'flex',
                     paddingTop: 10, textAlign: 'left'}}
                    className='datetime-container'>
                    <div className='date-container' style={{alignItems: 'center', display: 'flex'}}>
                      <div className='date-icon'>
                        <CalendarIcon color={'black'} style={{height: 20, width: 20, marginRight: 10}}/>
                      </div>
                      <div style={{fontSize: '12px'}}>
                        {this.state.project['Start Time'].toLocaleString('en-gb',
                          {weekday: 'long', month: 'long', day: 'numeric'})}
                      </div>
                    </div>
                    <div className='time-container' style={{alignItems: 'center', display: 'flex', marginLeft: 24}}>
                      <div className='time-icon'>
                        <Clock color={'black'} style={{height: 20, width: 20, marginRight: 10}}/>
                      </div>
                      <div style={{fontSize: '12px'}} >
                        {this.state.project['Start Time'].toLocaleString('en-gb',
                          {hour: '2-digit', minute: '2-digit'})} -
                          {this.state.project['End Time'].toLocaleString('en-gb',
                            {hour: '2-digit', minute: '2-digit'})}
                      </div>
                    </div>
                  </div>
                  : null}
                  <div>
                    {this.state.project.Location || this.state.project.Remote ?
                      <div className='location-container'
                        style={{alignItems: 'center', display: 'flex', marginTop: 6}}>
                        <div className='location-icon'>
                          <Place color={'black'} style={{height: 20, width: 20, marginRight: 10}}/>
                        </div>
                        <div style={{textAlign: 'left', fontSize: '12px'}}>
                          {
                            this.state.project.Location ?

                              this.state.project.Location

                            :
                            'Remote'
                          }
                        </div>
                      </div>
                      : null
                    }
                  </div>

                  {average !== null ?
                  <div style={{display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', textAlign: 'left', paddingTop: 16}}>
                    <div style={{minWidth: '150px', color: '#65A1e7', textDecoration: 'underline', fontWeight: 700}}>
                      Read all {count} reviews
                    </div>
                    <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        paddingLeft: 16, paddingRight: 16}}>
                      <span
                          style={average > 3 ? styles.goodRating : average === 3 ? styles.middleRating : average < 3 ? styles.badRating :  styles.circle}>
                        1
                      </span>
                      <span
                          style={average > 3 ? styles.goodRating : average === 3 ? styles.middleRating : average === 2 ? styles.badRating :  styles.circle}>
                        2
                      </span>
                      <span
                          style={average > 3 ? styles.goodRating : average === 3 ? styles.middleRating : styles.circle}>
                        3
                      </span>
                      <span
                          style={average > 3 ? styles.goodRating : styles.circle}>
                        4
                      </span>
                      <span
                        style={average === 5 ? styles.goodRating : styles.circle}>
                        5
                      </span>
                    </div>
                  </div>
                  :
                  null}

                  {(this.props.location && this.props.location.query.noLogo) || this.props.noLogo ? null :
                  <div style={{display: 'flex'}}>
                    <div style={{flex: 2, paddingLeft: 24, paddingTop: 24, paddingBottom: 24, display: 'flex', alignItems: 'center'}}>
                      <RaisedButton
                        label='See More'
                        primary={true}
                        labelStyle={{paddingLeft: 8, paddingRight: 8,
                           color: 'white', fontFamily: 'Permanent Marker', fontSize: '18px', letterSpacing: '1px'}}
                        />
                    </div>

                      <div style={{flex: 2, fontFamily: 'Permanent Marker', color: '#E55749', fontSize: '24px', paddingTop: 24, paddingRight: 24}}>
                        Who's In?
                      </div>

                  </div>
                  }
                </div>
                </a>
              </Link>
          </div>

            }
        </div>
      </div>
    )
  }
}
