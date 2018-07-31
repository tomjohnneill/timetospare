import React from "react"
import Header from "./Header"
import Footer from "./footer.jsx"
import Router from 'next/router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import "../style.css"
import { withRouter } from 'next/router'
import * as gtag from '../lib/gtag'

var injectTapEventPlugin = require("react-tap-event-plugin");
try {
  injectTapEventPlugin();
}
catch (err) {

}

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#000AB2',
    primary2Color:  '#000AB2',
    accent1Color: '#65A1e7',
  },
  appBar: {
    height: 50,
  },
  datePicker: {
    headerColor: '#65A1e7',
  },
  timePicker: {
    headerColor: '#65A1e7',
  },
  fontFamily: 'Nunito'
});

Router.onRouteChangeComplete = url => {
  gtag.pageview(url)
}

export const App = ({ children, router, href }) => (
  <main
    style={{
      margin: 0,
      padding: 0,
      fontFamily: 'Nunito',
      color: '#484848',
      textDecoration: 'none',
      color: 'inherit',
      listStyleType: 'none'
    }}>

      <div>
        <Header children={children} router={router}/>
        <div style={{height: 50}}/>
        {children}
        <Footer/>
      </div>

  </main>
)

export default withRouter(App)
