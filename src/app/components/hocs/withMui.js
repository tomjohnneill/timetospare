import React from "react"
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { withRouter } from 'next/router'
import 'babel-polyfill'

var cookie = require('cookie');

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
    accent1Color: '#FFCB00',
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

export default function(NextPage) {
 class outputComponent extends React.Component {
    static async getInitialProps(ctx) {
      const {req} = ctx;
      const userAgent = req ? req.headers['user-agent'] : navigator.userAgent;
      var cookies = {}
      if (req && req.headers && req.headers.cookie) {
        cookies = cookie.parse(req.headers.cookie)
      }
      const __session = cookies.__session
      ctx.__session = __session
      let pageProps = {};
      if (NextPage.getInitialProps) {
        pageProps = await NextPage.getInitialProps(ctx);
      }

      return {
        ...pageProps,
        userAgent,
        __session,
      }

    }
    render() {
      let userAgent = this.props.userAgent;
      return (
         <MuiThemeProvider muiTheme={getMuiTheme({userAgent,  ...muiTheme})}>
            <NextPage {...this.props} />
         </MuiThemeProvider>
      );
    }
 }

 return outputComponent;

}
