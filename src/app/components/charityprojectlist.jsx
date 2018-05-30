import React  from 'react';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import Link from "next/link"
import Router from 'next/router'
import {changeImageAddress} from './desktopproject.jsx';
import LinearProgress from 'material-ui/LinearProgress';
import fire from '../fire';
import {grey500} from 'material-ui/styles/colors'

let db = fire.firestore()

export default class CharityProjectList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {loading: true, projects: []}
  }

  componentDidMount(props) {
    db.collection("Project").where("Charity", "==", this.props.charityId)
      .get().then((querySnapshot) => {
        var data = []
      querySnapshot.forEach((doc) => {
        var elem = doc.data()
        elem['_id'] = doc.id
        data.push(elem)
      })
      this.setState({projects: data, loading: false})
    })
  }

  handleClick (project, e) {
    e.preventDefault()

  }

  render() {
    return (
      <div>
        {this.state.loading ?
          <div>
            Loading...
          </div>
        :
          <div>
            {this.state.projects.map((project) => (
              <Link as={`/projects/p/${project._id}`}
                href={`/project?project=${project._id}`}
                style={{padding: '12px'}}>
                  <Card onTouchTap={this.handleClick.bind(this, project)}>
                    <div>
                      <h2 style={{margin:0, padding: 16}}>{project.Name}</h2>
                        <div style={{paddingTop: 0, paddingBottom: 10, paddingLeft: 16}}>
                          {project.Summary}
                        </div>
                    </div>
                    <CardMedia mediaStyle={{display: 'flex'}}>
                      <img style={{flex: 1, width: '50%', maxWidth: null, minWidth: null, height: '250px', objectFit: 'cover'}}
                        src={changeImageAddress(project['Featured Image'], '1000xauto')} alt="" />
                      <div style={{padding: 20, flex: 3, width: null, maxWidth: null, minWidth: null}}>
                        <span>



                            <p style={{fontWeight: '600',  textAlign: 'left', margin: '0px'}}>
                              {project['People Pledged'] === null ? 0 : project['People Pledged']} people are in
                            </p>
                            <p style={{fontWeight: 'lighter',  textAlign: 'left', marginTop: '4px'}}>
                              {project['Target People']} people needed
                            </p>

                        <LinearProgress  style={{height: '5px', borderRadius: '1.5px'}} color={'#00ABE8'} mode="determinate"
                          min={0} max={project['Target People']}
                          value={project['People Pledged'] === null ? 0 : project['People Pledged']} />

                        <div style={{paddingTop: 10, paddingBottom: 6, marginTop: 70, color: grey500}}>
                            {project['Start Time'] ? project['Start Time'].toLocaleString('en-gb') : null}
                          </div>
                          <div style={{paddingTop: 0, paddingBottom: 10, color: grey500}}>
                            {project.Location}
                          </div>
                        </span>
                      </div>
                    </CardMedia>
                    <CardText>
                      {project.Description}
                    </CardText>
                  </Card>

              </Link>
            ))}
          </div>
        }
      </div>
    )
  }
}
