import React from 'react';
import App from '../components/App.js';
import Link from "next/link"
import Router from 'next/router'
import fire from '../fire';
import withMui from '../components/hocs/withMui';

let db = fire.firestore()

class Onboarding extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount(props) {
    this.setState({orgId: Router.query.organisation})
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
          <p onClick={() => Router.push(`/import-volunteers?organisation=${this.state.orgId}`,
            `/import-volunteers/${this.state.orgId}`)}>Import your volunteers</p>
          <Link href={`/invite?organisation=${this.state.orgId}`} prefetch>
            <p>Send invites</p>
          </Link>
          <p>Set admin accounts</p>
          <p>Quick create projects</p>

        </div>
      </App>
    )
  }
}

export default withMui(Onboarding)
