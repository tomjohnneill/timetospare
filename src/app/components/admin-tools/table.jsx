import React from 'react'
import ReactTable from "react-table";
import fire from '../../fire';
import 'react-table/react-table.css'

let db = fire.firestore()

const columns = [{
    Header: 'Email',
    accessor: 'Email' // String-based value accessors!
  }, {
    Header: 'Name',
    accessor: 'Full Name',
    Cell: props => <span className='number'>{props.value}</span> // Custom cell components!
  }, {
    id: 'friendName', // Required because our accessor is not a string
    Header: 'Friend Name',
    accessor: 'name' // Custom value accessors!
  }, {
    Header: props => <span>Friend Age</span>, // Custom header components!
    accessor: 'age'
  }]

export default class Table extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  componentDidMount(props) {
    console.log('mounted')
    console.log(this.props.organisation)
    if (this.props.organisation) {
      var data = []
      var columns = []
      db.collection("Charity").doc(this.props.organisation).get().then((doc) => {
        var lists = doc.data().lists
        console.log(lists)
        Object.keys(lists).forEach((key) => {
          db.collection("Lists").doc(key).get().then((listDoc) => {
            console.log(listDoc.data())
            if (listDoc.data().Columns) {
              listDoc.data().Columns.forEach((column) => {
                columns.push({id: column.name, Header: column.name, accessor: column.name})
              })
              this.setState({columns: columns})
            }

          })
          db.collection("Lists").doc(key).collection("Members").get().then((listSnapshot) => {
            listSnapshot.forEach((member) => {
              data.push(member.data())
              console.log(data)
              this.setState({data: data})
            })
          })
        })
      })
    }
  }

  render() {
    console.log(this.state)
    return (
      <div>
        {this.state.columns && this.state.data ?
        <ReactTable
          defaultPageSize={this.props.defaultPageSize}
          data={this.state.data}
          columns={this.state.columns}
        />
      :
      null}
      </div>
    )
  }
}
