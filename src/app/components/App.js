import React from "react"
import Header from "./Header"
import Footer from "./footer.jsx"
import Router from 'next/router';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { withRouter } from 'next/router'
import RaisedButton from 'material-ui/RaisedButton';
import * as gtag from '../lib/gtag'
import {buttonStyles} from './styles.jsx'
import ErrorBoundary from './hocs/errorBoundary.jsx';

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
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
        {
          typeof window !== 'undefined' && localStorage.getItem('sample') == 'true'
          && router.route !== '/' && router.route !== '/upload-data'
          ?
          <div style={{overflowX: 'hidden',position: 'fixed',
            borderTop: '1px solid #DBDBDB', color: 'white',
            backgroundColor: '#000AB2', zIndex: 10, flexDirection: 'column',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
           height: 120, width: '100%', bottom: 0}}>
           <div style={{paddingBottom: 10, fontSize: '20px', fontWeight: 200}}>
             Looks good?
           </div>
              <RaisedButton label='Use Real Data'
                style={buttonStyles.bigSize}
                labelStyle={buttonStyles.bigLabel}
                />

          </div>
          :
          null
        }
        <Footer/>
      </div>

  </main>
)

export default withRouter(App)
