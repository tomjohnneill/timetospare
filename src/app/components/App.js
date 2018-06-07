import React from "react"
import Header from "./Header"
import Footer from "./footer.jsx"
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

var injectTapEventPlugin = require("react-tap-event-plugin");
try {
  injectTapEventPlugin();
}
catch (err) {

}

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#E55749',
    primary2Color:  '#E55749',
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

const App = ({ children }) => (
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
    <MuiThemeProvider muiTheme={muiTheme}>
      <div>
        <Header />
        <div style={{height: 50}}/>
        {children}
        <Footer/>
      </div>
    </MuiThemeProvider>
  </main>
)

export default App
