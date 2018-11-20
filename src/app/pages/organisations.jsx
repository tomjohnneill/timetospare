import React, { Component } from "react";
import { Container, Draggable } from "react-smooth-dnd";
import fire from '../fire';
import withMui from '../components/hocs/withMui';
import Link from 'next/link'
import Router from 'next/router';
import Dialog from 'material-ui/Dialog';
import App from "../components/App"
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {List, ListItem} from 'material-ui/List';
import AddNote from '../components/addNote.jsx';
import {buttonStyles, headerStyles} from '../components/styles.jsx';
import Checkbox from 'material-ui/Checkbox';

let db = fire.firestore()



export const applyDrag = (arr, dragResult) => {
  const { removedIndex, addedIndex, payload } = dragResult;
  if (removedIndex === null && addedIndex === null) return arr;

  const result = [...arr];
  let itemToAdd = payload;

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0];
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd);
  }

  return result;
};

export const generateItems = (count, creator) => {
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(creator(i));
  }
  return result;
};

const columnNames = ["Your favourites", "Not so popular", "New Issues"];
const columnColors = ["#d0f0c0", "#FFCCCB", null];


class Cards extends Component {
  constructor() {
    super();

    this.onColumnDrop = this.onColumnDrop.bind(this);
    this.onCardDrop = this.onCardDrop.bind(this);
    this.getCardPayload = this.getCardPayload.bind(this);
    this.state = {
      scene: {
        type: "container",
        props: {
          orientation: "horizontal"
        },
        children: generateItems(3, i => ({
          id: `column${i}`,
          type: "container",
          name: columnNames[i],
          props: {
            orientation: "vertical",
            className: "card-container"
          },
          children: [

          ]
        })
        )
      }
    };
    console.log(this.state)
  }

  /*
  children: generateItems(+(Math.random() * 10).toFixed() + 5, j => ({
    type: "draggable",
    id: `${i}${j}`,
    props: {
      className: "card",
      style: { backgroundColor: pickColor() }
    },
    data: lorem.slice(0, Math.floor(Math.random() * 150) + 30)
  })
  */

  componentDidMount(props) {
    db.collection("OrgData").where("managedBy", "==", Router.query.view)
    .orderBy('lastInteraction', "desc")
    .limit(20)
    .get().then((querySnapshot) => {
      querySnapshot.forEach((orgDoc) => {
        var data = orgDoc.data()
        console.log(data)
        var body = {
          type: "draggable",
          id : orgDoc.id,
          props: {
            className: "card",
            id: orgDoc.id
          },
          data: data.details.name,
          date: data.lastInteraction
        }
        console.log(body)
        console.log(orgDoc.data())
        var currentOrgs = this.state.scene.children[0].children ? this.state.scene.children[0].children : []
        currentOrgs.push(body)
        var scene = this.state.scene
        scene.children[0].children = currentOrgs
        this.setState({scene: scene})
      })
    })

    db.collection("OrgData").where("managedBy", "==", Router.query.view)
    .orderBy('lastInteraction', "asc")
    .limit(20)
    .get().then((querySnapshot) => {
      querySnapshot.forEach((orgDoc) => {
        var data = orgDoc.data()
        var body = {
          type: "draggable",
          id : orgDoc.id,
          props: {
            className: "card",
            id: orgDoc.id
          },
          data: data.details.name,
          date: data.lastInteraction
        }
        console.log(body)
        console.log(orgDoc.data())
        var currentOrgs = this.state.scene.children[1].children ? this.state.scene.children[1].children : []
        currentOrgs.push(body)
        var scene = this.state.scene
        scene.children[1].children = currentOrgs
        this.setState({scene: scene})
      })
    })
  }

  handleSaveNote = (note) => {
    var memberIds = []
    this.setState({takeNote: false})
    let data = {
      Organisation: Router.query.organisation,
      Organisations: [this.state.selectedDropped],
      Date: new Date(),
      Type: 'Note',
      Details : {
        Note: note
      },
      Pinned: true
    }
    db.collection("Interactions").add(data).then(() => {
      this.setState({dialogOpen: false, selectedDropped: null})
    })
  }


  render() {
    console.log(this.state)
    return (
      <App>
        <div style={{position: 'fixed', zIndex: -1, top: 50, borderRadius: '0 30% 90% 0%',
          transform: 'skewX(-10deg)', backgroundColor: '#000AB2', left: -250,
           width: '20vw', height: '100vw'}}/>
           <div style={{position: 'fixed', zIndex: -1, top: 50, borderRadius: '30% 0 0 90%',
             transform: 'skewX(-10deg)', backgroundColor: '#000AB2', right: -250,
              width: '30vw', height: '100vw'}}/>
        <Dialog
          open={this.state.dialogOpen}
          onRequestClose={() => this.setState({dialogOpen:false})}>
          <h2 style={{textAlign: 'left', fontSize: '30px', fontWeight: 200}}>
            Why does {this.state.selectedDropped} belong in this category?</h2>
          <div style={{textAlign: 'left'}}>
            <AddNote
              handleCancelNote={() => this.setState({dialogOpen: false})}
              handleSaveNote={this.handleSaveNote}
              />
          </div>
        </Dialog>
        <div style={{display: 'flex', justifyContent: 'center', minHeight: '100vh'}}>
          <div style={{maxWidth: 1200}}>
            <div style={headerStyles.desktop}>
              Your linked organisations
            </div>
            <div style ={{width: 100, height: 4, backgroundColor: '#000AB2', marginBottom: 30}}/>
            <div className="card-scene" style={{display: 'flex', textAlign: 'left'}}>

              <Container
                orientation="horizontal"
                onDrop={this.onColumnDrop}
                dragHandleSelector=".column-drag-handle"
              >
                {this.state.scene.children.map(column => {
                  return (
                    <Draggable key={column.id}>
                      <div className={column.props.className}>
                        <div className="card-column-header" style={{marginBottom: 10}}>
                          <span className="column-drag-handle">&#x2630;</span>
                          {column.name}
                        </div>
                        <Container
                          {...column.props}
                          groupName="col"
                          onDragStart={e => console.log("drag started", e)}
                          onDragEnd={e => console.log("drag end", e)}
                          onDrop={e => this.onCardDrop(column.id, e)}
                          getChildPayload={index =>
                            this.getCardPayload(column.id, index)
                          }
                          dragClass="card-ghost"
                          dropClass="card-ghost-drop"
                          onDragEnter={() => {
                            console.log("drag enter:", column.id);
                          }}
                          onDragLeave={() => {
                            console.log("drag leave:", column.id);
                          }}
                          onDropReady={p => console.log('Drop ready: ', p)}
                        >
                          {column.children && column.children.map(card => {
                            return (
                              <Draggable style={{display: 'block'}} key={card.id}
                                id={card.id}>
                                <ListItem

                                  style={{backgroundColor: 'white', marginBottom: 6, borderBottom: '1px solid #DBDBDB'}}
                                  primaryText={card.data}
                                  secondaryText={card.date.toLocaleString('en-gb',
                                    {weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'})}
                                  />
                              </Draggable>
                            );
                          })}
                        </Container>
                      </div>
                    </Draggable>
                  );
                })}
              </Container>
          </div>
        </div>
      </div>

      </App>
    );
  }

  getCardPayload(columnId, index) {
    return this.state.scene.children.filter(p => p.id === columnId)[0].children[
      index
    ];
  }

  onColumnDrop(dropResult) {
    const scene = Object.assign({}, this.state.scene);
    scene.children = applyDrag(scene.children, dropResult);
    this.setState({
      scene: scene
    });
  }

  onCardDrop(columnId, dropResult) {
    console.log(this.state)
    if (dropResult.removedIndex !== null || dropResult.addedIndex !== null) {
      const scene = Object.assign({}, this.state.scene);
      const column = scene.children.filter(p => p.id === columnId)[0];
      const columnIndex = scene.children.indexOf(column);

      const newColumn = Object.assign({}, column);
      newColumn.children = applyDrag(newColumn.children, dropResult);
      scene.children.splice(columnIndex, 1, newColumn);

      this.setState({
        scene : scene
      });

    }
    console.log(dropResult)
    this.setState({dialogOpen: true,   selectedDropped: dropResult.payload.data
    })

  }
}

export default withMui(Cards);
