import React from 'react'
import ReactDataSheet from 'react-datasheet';
import App from '../components/App.js';
import MediaQuery from 'react-responsive';
import RaisedButton from 'material-ui/RaisedButton';
import "../static/react-datasheet.css"

function parseExcelPaste(str) {
  var rows = str.split(/\r\n|\n|\r/)
  if (rows[rows.length - 1] === "") {
    rows.pop()
  }
  return rows.map((row) => {
    return row.split('\t')});
}

export default class UploadList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grid: [
        [{value:  1}, {value:  3}],
        [{value:  2}, {value:  4}],
        [{value:  1}, {value:  3}],
      ]
    }
  }

  render() {
    return (
      <div>
        <App>
          <MediaQuery minDeviceWidth={700}>
            <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column',
              justifyContent: 'center', padding: 50}}>
              <h2>Import your volunteer list</h2>
              <ReactDataSheet
                style={{width: 400}}
                data={this.state.grid}
                parsePaste={parseExcelPaste}
                valueRenderer={(cell) => cell.value}
                onCellsChanged={(changes, outOfBounds) => {
                  const grid = this.state.grid.map(row => [...row])
                  console.log(grid)
                  changes.forEach(({cell, row, col, value}) => {
                    grid[row][col] = {...grid[row][col], value}
                  })
                  if (outOfBounds) {
                    console.log(outOfBounds)
                    var maxWidth = 1
                    grid[0].forEach((row) => {
                      if (maxWidth < row.length) {
                        maxWidth = row.length
                      }
                    })
                    outOfBounds.forEach(({row, col, value}) => {
                      if (grid[row]) {
                        grid[row][col] = {...grid[row][col], value}
                      } else {
                        grid[row] = []
                        for (var i = 0; i < maxWidth; i++) {
                          grid[row][i] = {value: ""}
                        }
                        grid[row][col] = {...grid[row][col], value}
                        console.log('adding blank row')
                        console.log(grid[row])

                      }
                    })
                  }
                  this.setState({grid})
                }}
                />
              <div style={{height: 50}}/>
              <RaisedButton label='Next'
                primary={true}
                />
            </div>
          </MediaQuery>
        </App>
      </div>
    )
  }
}
