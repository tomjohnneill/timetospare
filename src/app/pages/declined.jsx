import React from 'react'
import {changeImageAddress, dateDiffInDays} from '../components/desktopproject.jsx'
import {Spiral} from '../components/icons.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import {grey500} from 'material-ui/styles/colors'
import AddToCalendar from 'react-add-to-calendar';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import LinearProgress from 'material-ui/LinearProgress';
import FlatButton from 'material-ui/FlatButton';
import Link from "next/link"
import Router from 'next/router'
import MediaQuery from 'react-responsive';
import App from "../components/App"
import fire from '../fire';

let db = fire.firestore()

let icon = { 'calendar-plus': 'left' };

const styles = {

  number: {
    color: '#E55749',
    fontSize: '20px',

  },
  bottomBit: {
    marginTop: '-5px',
    fontWeight: 'lighter',
    letterSpacing: '1.5px'
  }
}

export class YouMightLike extends React.Component {
  constructor(props) {
    super(props)
    this.state = {loading: false, potentialProjects: []}
  }

  componentDidMount(props) {
    var potentialProjects = []

    if (this.props.project.Charity) {
      db.collection("Project").where("Charity", "==", this.props.project.Charity)
      .where("Approved", "==", true)
      .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          var elem = doc.data()
          elem['_id'] = doc.id
          if (doc.id !== this.props.project._id) {
            potentialProjects.push(elem)
          }
        });
        this.setState({potentialProjects: potentialProjects, loading: false})
      })
    }


    /*
    if (this.props.project.Type) {
      db.collection("Project").where("Type", "==", this.props.project.Type)
      .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          var elem = doc.data()
          elem['_id'] = doc.id
          if (doc.id !== this.props.project._id) {
            potentialProjects.push(elem)
          }
        });
        this.setState({potentialProjects: potentialProjects})
      })
    }

    */
    if (this.props.project['Start Time']) {
      db.collection("Project").where("Start Time", ">", this.props.project['Start Time'])
      .where("Approved", "==", true)
      .get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          var elem = doc.data()
          elem['_id'] = doc.id
          if (doc.id !== this.props.project._id) {
            potentialProjects.push(elem)
          }
        });
        this.setState({potentialProjects: potentialProjects, loading: false})
      })
    }

    console.log(potentialProjects)
  }

  render() {
    return(
      <div style={{paddingLeft: 'auto', paddingRight: 'auto', marginTop: '60px'
            }}>

        {this.state.loading ?
          <div/> :
          this.state.potentialProjects.map((project) => (
            <div style={{width: '60%', minWidth: '300px'}}>
                  <Link to={`/projects/${project.Name}/${project._id}`}>
                <div style={{marginTop: 16}}>
                <p style={{fontSize: '18px', fontWeight: 'bold', textAlign: 'left', margin: 0, marginBottom: '24px'}}>
                  {project.Name}
                </p>

              </div>

            <div
              ref='variableBox'
              style={{display: 'flex',
                  alignItems: 'center', flexDirection: 'row'}}>
            <div style={{height: '130px', width: '95px'}}>
              <img src={changeImageAddress(project['Featured Image'], '150xauto')}
                style={{height: '130px', width: '95px', objectFit: 'cover'}}
                />
            </div>
            <div style={{ height: '130px', flex: 1}}>
              <CardTitle
                style={{height: '100%', paddingTop: '0px', paddingLeft: '32px',  overflowX:'hidden', paddingBottom: '0px'}}
                children={
                  <div style={{justifyContent: 'space-between', display: 'flex', flexDirection: 'column', height: '100%'}}>
                    <div>
                      <p style={{fontWeight: '600',  textAlign: 'left', margin: '0px'}}>{project['People Pledged']} people are in</p>
                      <p style={{fontWeight: 'lighter',  textAlign: 'left', marginTop: '0px', marginBottom: '6px'}}>{project['Target People']} people needed</p>
                      <LinearProgress  style={{height: '5px', borderRadius: '1.5px'}} color={'#00ABE8'}
                        mode="determinate" value={project['People Pledged']}
                        min={0}
                        max={project['Target People']}
                         />
                    </div>
                    <div>
                      <div style={{display: 'flex', paddingTop: '6px', color: grey500,
                      marginTop: '-5px'}}>
                          {project.Location}
                      </div>
                    </div>
                  <div>

                      <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <div style={styles.number}>
                          {project['End Time'] ? dateDiffInDays(new Date(),project['End Time']) : 10}
                        </div>
                        <div style={{fontWeight: 'lighter', marginLeft: '6px'}}>
                          days to go...
                        </div>
                      </div>
                    </div>
                    <div>
                    </div>
                  </div>
                }/>

            </div>

            </div>
            <p style={{fontSize: '14px', fontWeight: 'light', textAlign: 'left'}}>
              {project.Summary}
            </p>
            <div style={{dispay: 'flex'}}>
              <span style={{fontFamily: 'Permanent Marker', color: '#E55749' }}>
                Who's In?
              </span>
              <FlatButton style={{marginLeft: '16px'}}
                label='Read More' labelStyle={{color: '#65A1e7', textTransform: 'none'}}/>

            </div>
            <div style={{height: '20px', borderBottom: 'solid 1px #DDDDDD', width: '100%', marginBottom: 1}}/>
            </Link>
            </div>
          ))

        }
      </div>
    )

  }
}

export default class CantCome extends React.Component{
  constructor(props) {
    super(props)
    this.state = {loading: true}
  }

  componentDidMount(props) {
    db.collection("Project").doc(this.props.params._id).get().then((doc) => {
      var project = doc.data()
      project._id = doc.id
      this.setState({project: project, loading: false, charity: {}})
    });

  }

  render() {

    console.log(this.state)

    return(
      <App style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
        {this.state.loading ?
          <div/> :
        <div style={{maxWidth: '1000px', width: '100%', marginTop: 30, marginLeft: 16, marginRight: 16}}>
          <div style={{fontSize: '32px', fontWeight: 700, textAlign: 'left', marginBottom: 16, marginTop: 16}}>
            We're sorry you can't come, but thanks for letting us know
          </div>
          <div style={{display: 'flex', marginTop: 50}}>
            <MediaQuery minDeviceWidth={700}>
              <div style={{flex: 2, marginRight: 30}}>

                <Spiral color={'#E55749'}/>

              </div>
            </MediaQuery>
            <div style={{flex: 5}}>
              <div style={{fontSize: '20px', textAlign: 'left', marginBottom: 16}}>
                {this.state.project.Name}
              </div>
              <img src={changeImageAddress(this.state.project['Featured Image'], '750xauto')}
                style={{width: '100%', height: '220px', objectFit: 'cover'}}
                />
            </div>
          </div>
          <div style={{textAlign: 'left'}}>



            <div style={{marginTop: '30px'}}>

            </div>

            <div style={{fontSize: '24px', fontWeight: 'bold', textAlign: 'left', marginBottom: 16, marginTop: 80}}>
              Do any of these take your fancy instead?
            </div>
            <div style={{width: '60%', borderBottom: 'solid 1px #DDDDDD'}}/>


            <YouMightLike project={this.state.project}/>



          </div>
        </div>
      }
    </App>
    )
  }
}
