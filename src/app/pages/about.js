import React from "react"
import App from "../components/App"
import fire from '../fire';

let db = fire.firestore()

export default class About extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  static getInitialProps() {
  /*  const res = await db.collection("Project")
      .get().then((querySnapshot) => {
        var data = []
        querySnapshot.forEach((doc) => {
          console.log(doc.data())
          var elem = doc.data()
          elem['_id'] = doc.id
          data.push(elem)
        });
        return data
      })*/
    return {projects: [{Name: 'hardcoded'}]}
  }

  render() {
    return (
      <App>
        <div>
          About
          {this.props.projects ?
            this.props.projects.map((project) => (
              <div>
                {project.Name}
              </div>
            ))
            :
            null
          }
        </div>
      </App>
    )
  }
}
