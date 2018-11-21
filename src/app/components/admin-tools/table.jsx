import React from 'react'
import ReactTable from "react-table";
import fire from '../../fire';
import Router from 'next/router';
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
    this.state = {
      columns: [{id: 'Email', Header: 'Email', accessor: 'Email'},
                {id: 'Full Name', Header: 'Full Name', accessor: 'Full Name'}],
      data: [],
      selected: null
    }
  }

  componentDidMount(props) {

    if (this.props.organisation) {
      var data = []
      var columns = []
      fire.auth().onAuthStateChanged((user) => {
        if (user === null) {

        } else {
          fire.auth().currentUser.getIdToken()
          .then((token) =>
            fetch(`https://us-central1-whosin-next.cloudfunctions.net/users-getMemberDetails?organisation=${this.props.organisation}`, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
              },
            })
            .then(response => response.json())
            .then((memberArray) => {
              if (memberArray) {
                this.setState({data: memberArray})
              }

            })
          )
        }
      })
      db.collection("Organisations").doc(this.props.organisation).get().then((doc) => {
        var lists = doc.data().lists

        Object.keys(lists).forEach((key) => {
          db.collection("Lists").doc(key).get().then((listDoc) => {

            if (listDoc.data().Columns) {
              listDoc.data().Columns.forEach((column) => {
                columns.push({id: column.name, Header: column.name, accessor: column.name})
              })
              this.setState({columns: columns})
            }
          })
        })
      })
    }
  }

  render() {

    return (
      <div>
        {this.state.columns && this.state.data ?
        <ReactTable
          getTdProps={(state, rowInfo, column, instance) => {
            return {
              onClick: (e, handleOriginal) => {


                // IMPORTANT! React-Table uses onClick internally to trigger
                // events like expanding SubComponents and pivots.
                // By default a custom 'onClick' handler will override this functionality.
                // If you want to fire the original onClick handler, call the
                // 'handleOriginal' function.
                Router.push(`/member?member=${rowInfo.original._id}`, `/member/${rowInfo.original._id}}`)
                if (handleOriginal) {
                  handleOriginal();
                }
              }
            };
          }}
          defaultPageSize={this.props.defaultPageSize}
          data={this.state.data}
          columns={this.state.columns}
          filterable={true}
        />
      :
      null}
      </div>
    )
  }
}
