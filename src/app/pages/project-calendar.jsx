import React from 'react';
import Calendar from '../components/calendar.jsx';
import App from '../components/App';
import fire from '../fire';
import Loading from '../components/loading.jsx';
import "react-big-calendar/lib/css/react-big-calendar.css"
import withMui from '../components/hocs/withMui';

let db = fire.firestore()

class YourCalendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  getProjects = (uid) => {
    db.collection("Project").where("Creator", "==", uid).get()
    .then((querySnapshot) => {
      var data = []
      querySnapshot.forEach((doc) => {
        var elem = doc.data()
        elem._id = doc.id
        if (elem['Start Time']) {
          data.push(elem)
          this.setState({events: data})
        }
        db.collection("Project").doc(doc.id).collection("SubProject").get()
        .then((subProjectSnapshot) => {
          if (subProjectSnapshot.size > 0) {
            subProjectSnapshot.forEach((subDoc) => {
              var subElem = subDoc.data()
              subElem._id = subDoc.id
              subElem.Name = elem.Name
              subElem.Location = elem.Location
              subElem.Geopoint = elem.Geopoint
              data.push(subElem)
              this.setState({events: data})
            })
          }
        })
      })
    })
  }

  componentDidMount(props) {
    fire.auth().onAuthStateChanged((user) => {
      if (user === null) {

      } else {
        this.getProjects(fire.auth().currentUser.uid)
      }
    })
    if (fire.auth().currentUser) {
        this.getProjects(fire.auth().currentUser.uid)
    }
  }

  render() {
    return (
      <div>
        <App>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%',
          flexDirection: 'column', textAlign:'left', padding: 20, boxSizing: 'border-box'}}>

            {
              this.state.events ?
              <div style={{height: '80vh', width: '80vw'}}>
                <h2 style={{textAlign: 'left', width: '100%'}}>Your project calendar</h2>
                <Calendar events={this.state.events}/>
              </div>
              :
              <Loading/>
            }
          </div>
        </App>
      </div>
    )
  }
}

export default withMui(YourCalendar)
