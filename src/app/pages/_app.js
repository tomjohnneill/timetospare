import React from 'react'
import App, {Container} from 'next/app'
import Header from "../components/Header"

class Layout extends React.Component {
  render () {
    const {children} = this.props
    return <div className='layout'>
      {children}
    </div>
  }
}

export default class MyApp extends App {
  render () {
    const {Component, pageProps} = this.props
    return <Container>
      <Layout>
        <Header />
        <Component {...pageProps} />
      </Layout>
    </Container>
  }
}
