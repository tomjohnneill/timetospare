import React from 'react'
import App from "../components/App"
import Link from "next/link"
import Router from 'next/router'
import GoodThanks from '../components/feedback/good-thanks.jsx';
import Sorry from '../components/feedback/sorry.jsx';
import withMui from '../components/hocs/withMui';

class ReviewStatus extends React.Component {
  render() {
    if (Router.query.status === 'good-thanks') {
      return (
        <App>
          <GoodThanks projectId={Router.query.project}/>
        </App>
      )
    } else if (Router.query.status === 'sorry') {
      return (
        <App>
          <Sorry projectId={Router.query.project}/>
        </App>
      )
    }
  }
}

export default withMui(ReviewStatus)
