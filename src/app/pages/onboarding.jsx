import React from 'react';
import App from '../components/App.js';
import Link from "next/link"
import Router from 'next/router'
import fire from '../fire';

let db = fire.firestore()

export default class Onboarding extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount(props) {
    db.collection("Charity").doc(Router.query.organisation).get()
    .then((doc) => {
      this.setState({organisation: doc.data()})
    })
  }

  render() {
    return (
      <App>
        <div>
          {
            this.state.organisation ?
            <div>
              {this.state.organisation.Name}
            </div>
            :
            null
          }
          <p>Add your organisation details</p>
          <p onClick={() => Router.push(`/import-volunteers?organisation=${Router.query.organisation}`,
            `/import-volunteers/${Router.query.organisation}`)}>Import your volunteers</p>
          <Link href={`/invite?organisation=${Router.query.organisation}`} prefetch>
            <p>Send invites</p>
          </Link>
          <p>Set admin accounts</p>
          <p>Quick create projects</p>

        </div>
      </App>
    )
  }
}
