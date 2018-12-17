import React, { Component } from "react";
import { Container, Draggable } from "react-smooth-dnd";
import fire from '../fire';
import withMui from '../components/hocs/withMui';
import Link from 'next/link'
import Router from 'next/router';
import Dialog from 'material-ui/Dialog';
import App from "../components/App"
import RaisedButton from 'material-ui/RaisedButton';
import MoreVert from 'material-ui/svg-icons/navigation/more-vert'
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import {List, ListItem} from 'material-ui/List';
import AddNote from '../components/addNote.jsx';
import {buttonStyles, headerStyles, iconButtonStyles} from '../components/styles.jsx';
import Checkbox from 'material-ui/Checkbox';
import Delete from 'material-ui/svg-icons/action/delete'
import Close from 'material-ui/svg-icons/navigation/close'
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import OrganisationAutocomplete from '../components/organisation-autocomplete.jsx';
import {ReviewIcon, NoteIcon, Tag, Pin} from '../components/icons.jsx';
import moment from 'moment'

let db = fire.firestore()

let functions = fire.functions('europe-west1')

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
      orgMap: {},
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
    this.getSummaryAgg()
    db.collection("OrgData").where("managedBy", "==", Router.query.view)
    .orderBy("lastInteraction", "asc").limit(10)
    .get().then((querySnapshot) => {
      querySnapshot.forEach((orgDoc) => {
        this.addToUnfavourites(orgDoc)
      })
    })

    db.collection("OrgData").where("Pinned", "==", true).where("managedBy", "==", Router.query.view)
    .get().then((querySnapshot) => {
      querySnapshot.forEach((orgDoc) => {
        this.addToIssues(orgDoc)
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

  addToFavourites = (orgDoc) => {
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

    var currentOrgs = this.state.scene.children[0].children ? this.state.scene.children[0].children : []
    currentOrgs.push(body)
    var scene = this.state.scene
    scene.children[0].children = currentOrgs
    this.setState({scene: scene})
  }

  addToUnfavourites = (orgDoc) => {
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

    var currentOrgs = this.state.scene.children[1].children ? this.state.scene.children[1].children : []
    currentOrgs.push(body)
    var scene = this.state.scene
    scene.children[1].children = currentOrgs
    this.setState({scene: scene})
  }

  addToIssues = (orgDoc) => {
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

    var currentOrgs = this.state.scene.children[2].children ? this.state.scene.children[2].children : []
    currentOrgs.push(body)
    var scene = this.state.scene
    scene.children[2].children = currentOrgs
    this.setState({scene: scene})
  }

  getSummaryAgg = () => {
    var summaryAgg = functions.httpsCallable('elastic-summaryAggregation');
    var today  = moment().format("DD/MM/YYYY")

    var sixmonths = new Date()
    console.log(sixmonths)
    var sixMonths = new Date(sixmonths.setMonth(sixmonths.getMonth() - 6))
    var sixmonthsformat = moment(sixMonths).format("DD/MM/YYYY")
    summaryAgg({
      view: Router.query.view,
      fromDate: sixmonthsformat,
      toDate: today,
      aggs: {
        "profit": {
          "terms" : {
              "field" : "Organisations.raw",
              "size": 10000
            },
            "aggs": {
              "score": {
                "scripted_metric": {
                  "init_script" : "state.ints = []",
                  "map_script" : "if (doc.Type.value == \"Event\") {state.ints.add(10)} else if (doc.Type.value == \"PlaceholderEvent\") {state.ints.add(10)} else {state.ints.add(1)}",
                  "combine_script" : "double profit = 0; for (t in state.ints) { profit += t } return profit",
                  "reduce_script" : "double profit = 0; for (a in states) { profit += a } return profit"
              }
            }
          }
        }
      }
    }).then((result) => {
      console.log(result)
      var data = result.data.aggregations.profit.buckets.sort(function(a, b) {
          a = (a.score.value);
          b = (b.score.value);
          return a>b ? -1 : a < b ? 1 : 0;
      });
      return data
    }).then((data) => {
      console.log(data)

      var favourites = data.slice(0, 10)

      favourites.forEach((orgObj) => {
        db.collection("OrgData").doc(orgObj.key).get().then((orgDoc) => {
          this.addToFavourites(orgDoc)
        })
      })
    })
  }

  handleOptionsClick = (event, int) => {

    this.setState({
      optionsOpen: true,
      targetedInt: int,
      anchorEl: event.currentTarget,
    });
  }

  handleOptionsRequestClose = () => {
    this.setState({
      optionsOpen: false,
    });
  };


  handleOrgPick = (org) => {
    console.log(org)
    Router.push(`/organisation?targetorganisation=${org._id}&view=${Router.query.view}`)
  }


  render() {
    console.log(this.state)
    return (
      <App>
        <Popover
          open={this.state.optionsOpen}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleOptionsRequestClose}
        >
          <Menu style={{textAlign: 'left'}}>
            <MenuItem primaryText="Tags"
              onClick={() => this.setState({tagOpen: true, optionsOpen: false,
                tags: this.state.targetedInt.tags, int: this.state.targetedInt._id})}
                leftIcon={<Tag style={{height: 25}}/>} />
            <MenuItem
              onClick={() => this.setState({deleteOpen: true, optionsOpen: false})}
              primaryText="Completely delete" leftIcon={<Delete/>} />
            <MenuItem
              onClick={() => this.setState({deleteOpen: true, optionsOpen: false})}
              primaryText="Remove from this tag" leftIcon={<Close/>} />
            <MenuItem
              onClick={this.handlePin}
              primaryText={`${this.state.targetedInt && this.state.targetedInt.Pinned ? 'Unpin' : 'Pin'} this`} leftIcon={<Pin/>} />
          </Menu>
        </Popover>
        <div style={{position: 'fixed', zIndex: -1, top: 50, borderRadius: '0 30% 90% 0%',
          transform: 'skewX(-10deg)', backgroundColor: '#FFCB00', left: -340,
           width: '20vw', height: '100vw'}}/>
           <div style={{position: 'fixed', zIndex: -1, top: 50, borderRadius: '30% 0 0 90%',
             transform: 'skewX(-10deg)', backgroundColor: '#FFCB00', right: -350,
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
          <div style={{maxWidth: 1200, width: '100%'}}>
            <div style={headerStyles.desktop}>
              Key organisations
            </div>
            <div style ={{width: 100, height: 4, backgroundColor: '#000AB2', marginBottom: 30}}/>
            <div className="card-scene" style={{display: 'flex', textAlign: 'left'}}>

              <Container
                style={{overflowX: 'auto'}}
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

                          onDrop={e => this.onCardDrop(column.id, e)}
                          getChildPayload={index =>
                            this.getCardPayload(column.id, index)
                          }
                          dragClass="card-ghost"
                          dropClass="card-ghost-drop"

                        >
                          {column.children && column.children.map(card => {
                            return (
                              <Draggable style={{display: 'block'}} key={card.id}
                                id={card.id}>
                                <ListItem
                                  onClick={() => Router.push(`/organisation?view=${Router.query.view}&targetorganisation=${card.id}`)}
                                  rightIcon={<IconButton
                                    tooltip='Options'
                                    onClick={(e) => this.handleOptionsClick(e, card)}
                                    style={iconButtonStyles.button}><MoreVert /></IconButton>}
                                  style={{backgroundColor: 'white', marginBottom: 6, borderBottom: '1px solid #DBDBDB'}}
                                  primaryText={card.data}

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
          <div style={headerStyles.desktop}>
            All linked organisations
          </div>
          <div style ={{width: 100, height: 4, backgroundColor: '#000AB2', marginBottom: 30}}/>
            <OrganisationAutocomplete
              handleNewRequest={this.handleOrgPick}
              hintText='Search all organisations'
              org={this.props.url.query.view}/>

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

    this.setState({dialogOpen: true,   selectedDropped: dropResult.payload.data
    })

  }
}

export default withMui(Cards);
