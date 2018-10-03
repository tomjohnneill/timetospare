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
import AddNote from '../components/addNote.jsx';
import {buttonStyles} from '../components/styles.jsx';

let db = fire.firestore()

const areas = [
  "Dover Big Local",
  "Kingsbrook and Cauldwell",
"North West Ipswich",
"Leecliffe (Leeming and Aycliffe)",
"Ramsey",
"Allenton",
"Growing Together (Northampton East)",
"Warsop Parish",
"Mablethorpe, Trusthorpe and Sutton on Sea (Coastal Communities Challenge) ",
"Wormholt and White City",
"North Brixton",
"South Bermondsey",
"People's Empowerment Alliance of Custom House (PEACH)",
"Hackney Wick",
"Barnfield",
"Mottingham",
"William Morris",
"Heston West",
"Gateshead",
"Gaunless Gateway",
"East Cleveland Villages",
"Ewanrigg",
"Barrow Island",
"Shadsworth with Whitebirk",
"Rudheath and Witton",
"Northwood",
"Clubmoor",
"Clarksfield, Greenacres and Littlemoor",
"Little Hulton",
"Leigh West",
"Marsh and Micklefield",
"Fratton",
"Harefield, Midanbury and Townhill Park (Big Local SO18)",
"Dartford",
"Northfleet North",
"Par Bay",
"Littlemoor",
"Toothill",
"Radstock and Westfield",
"Three Parishes - Gobowen, St Martins and Weston Rhyn",
"Stoke North",
"East Coseley",
"Grace Mary to Lion Farm",
"Firs and Bromford",
"Horsefair, Broadwaters and Greenhill (Big Local DY10)",
"Thurnscoe",
"Dewsbury Moor",
"Woodlands Speaks",
"Greatfield",
"Winterton",
"Warwick Ahead",
"Canvey’s Big Local £1 million",
"Ravensthorpe and Westwood",
"Wormley and Turnford",
"Heart of Pitsea",
"Birchwood",
"Kingswood and Hazel Leys",
"Langold, Costhorpe and Carlton",
"St Matthew's Estate",
"Slade Green",
"London Road area of Broad Green",
"Clapham Junction, West Battersea (Big Local SW11)",
"Hanwell, Copley Close",
"Bountagu (Bounces-Montagu)",
"Noel Park Estate",
"Chinbrook Estate",
"North Meets South",
"Central Jarrow",
"Whitley Bay",
"Dyke House",
"3 Together",
"Blackpool Revoe",
"Tonge with the Haulgh",
"Gannow",
"Windmill Hill",
"Collyhurst",
"Bradley",
"St Oswald and Netherton (L30 Million Project)",
"Ridge Hill",
"Prospect Estate",
"Conniburrow",
"North East Hastings",
"Heart of Sidley",
"Eastern Sheppey",
"Arches Local (Central Chatham, Luton Arches)",
"Whitleigh",
"Worle",
"Podsmead",
"Birchfield",
"Brereton",
"Hill Top and Caldwell",
"Church Hill",
"Brookside",
"Mossley",
"Scotlands and Bushbury Hill",
"Barrowcliff",
"Thurcroft",
"Greenmoor",
"North Cleethorpes",
"Hawksworth Wood Estate, the Abbeydales and the Vespers (HAVA)",
"Rastrick",
"Elmton, Creswell and Hodthorpe",
"Central Boston",
"Kirk Hallam",
"Grassland and Hasmoor",
"Farley Hill",
"Catton Grove",
"Riverside Community",
"Grange",
"Wembley Central",
"Somers Town",
"Elthorne Estates",
"World's End Estate and Lots Road area",
"Plaistow South",
"Aberfeldy",
"St James Street Area",
"Peabody Avenue and Churchill Gardens Estate (Big Local SW1)",
"North Ormesby",
"CELL - Lynemouth, Cresswell, Ellington and Linton",
"Roseworth Ward",
"Distington",
"West End, Morecambe",
"Inner East Preston",
"Kirkholt",
"Wargrave",
"Brinnington",
"Sale West",
"Latch Ford",
"Beechwood, Ballantyne and Bidston Village ",
"Sompting",
"Dover Town",
"Devonshire West",
"Wecock Farm",
"Whitley",
"Newington, Ramsgate",
"Lawrence Weston",
"St Peter's and the Moors",
"Bourne Estate",
"Woolavington and Puriton Villages Together",
"Welsh House Farm",
"Heath Big Local",
"Ansley Village, New Arley and OId Arley (Leys Millionnaires)",
"Hateley Cross (Hateley Heath and Stone Cross)",
"Cars Area, Smith's Wood, Solihull",
"Palfrey",
"Goldthorpe with Bolton-on-Dearne",
"Keighley Valley",
"Withernsea",
"Selby Town",
"Westfield Estate",
"Tang Hall"
]

var images = [
  'https://localtrust.org.uk/assets/images/areas/Kingsbrook_527.jpg'
  ,'https://localtrust.org.uk/assets/images/areas/bigevent%20029%20527px.jpg',
  'https://hadrianswallcountry.co.uk/sites/default/files/Gateshead%202.JPG',
  'https://www.hackneywicked.co.uk/wp-content/uploads/2015/06/PubWide-1.jpg',
  'https://www.visitcumbria.com/photos/simon/barrow-6794.jpg,'
]

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

const lorem = `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`;

const columnNames = ["Your favourites", "Not so popular", "Others"];
const columnColors = ["#d0f0c0", "#FFCCCB", null];

const cardColors = [
  "azure",
  "beige",
  "bisque",
  "blanchedalmond",
  "burlywood",
  "cornsilk",
  "gainsboro",
  "ghostwhite",
  "ivory",
  "khaki"
];
const pickColor = () => {
  let rand = Math.floor(Math.random() * 10);
  return cardColors[rand];
};

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
          orientation: "vertical"
        },
        children: generateItems(3, i => ({
          id: `column${i}`,
          type: "container",
          name: columnNames[i],
          background: columnColors[i],
          style: {width: "100%"},
          props: {
            orientation: "horizontal",
            className: "card-container"
          },
          children: generateItems(+(Math.random() * 20).toFixed() + 5, j => ({
            type: "draggable",
            id: `${i}${j}`,
            data: areas[j],
            image: images[j % 5]
          }))
        }))
      }
    };
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
        <Dialog
          open={this.state.dialogOpen}

          onRequestClose={() => this.setState({dialogOpen:false})}>
          <h2 style={{textAlign: 'left'}}>How come {this.state.selectedDropped} belongs in this category?</h2>
          <div style={{textAlign: 'left'}}>
            <AddNote
              handleCancelNote={() => this.setState({dialogOpen: false})}
              handleSaveNote={this.handleSaveNote}
              />
          </div>
        </Dialog>
        <div style={{textAlign: 'left'}} className="card-scene">
          <h2 style={{fontWeight: 200}}>
            Your linked organisations
          </h2>
          <Container
            orientation="vertical"
            onDrop={this.onColumnDrop}
            dragHandleSelector=".column-drag-handle"
          >
            {this.state.scene.children.map(column => {
              return (
                <Draggable style={{display: 'block'}} key={column.id}>
                  <div className={column.props.className} style={{backgroundColor: column.background}}>
                    <div className="card-column-header">
                      <span className="column-drag-handle">&#x2630;</span>
                      {column.name}
                    </div>
                    <Container
                      {...column.props}
                      style={{display: 'flex', flexWrap: 'wrap', overflow: 'hidden', backgroundColor: column.background}}
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
                      {column.children.map(card => {
                        return (
                          <Draggable key={card.id}>
                            <Link prefetch href={`/organisation?targetorganisation=${card.data}&organisation=${this.props.url.query.organisation}`}>
                              <div style={{position: 'relative', cursor: 'pointer'}} {...card.props}>
                                <img
                                  src={card.image}
                                  style={{margin: 10, borderRadius: '50%', cursor: 'pointer',
                                    objectFit: 'cover',
                                    height: 100, width: 100, position: 'relative'}}/>
                                <div
                                  style={{position: 'absolute', height: 100,
                                    width: '100px',
                                    display: 'flex', alignItems: 'center',
                                    backgroundColor: 'rgba(255,255,255,0.7)',
                                    fontWeight: 700, color: 'black', fontSize: '14px',
                                    borderRadius: '50%', margin: 10,
                                    textAlign: 'center', justifyContent: 'center',
                                   top: 0}}>
                                   {card.data}

                                </div>
                              </div>
                            </Link>
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
