import React from "react"
import Header from "./Header"
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

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
  <main>
    <MuiThemeProvider muiTheme={muiTheme}>
      <div>
        <Header />
        {children}
      </div>
    </MuiThemeProvider>
  </main>
)

export default App
