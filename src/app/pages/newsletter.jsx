import React from 'react';
import {CSVLink} from 'react-csv';
import FileDownload from 'material-ui/svg-icons/file/file-download';
import RaisedButton from 'material-ui/RaisedButton';
import Chip from 'material-ui/Chip';
import fire from '../fire';
import App from "../components/App"
import withMui from '../components/hocs/withMui';

let db = fire.firestore()

var categories = ["Environment",
"Refugees",
"Equality",
"Poverty",
"Education",
"Healthcare",
"Disabilities",
"Young people",
"Old people",
"Loneliness",
"Animals",
"Mental Health",
"Homelessness",
"Democracy",
"Technology",
"Journalism",
"Conservation",
"Arts and culture",
"Women",
"LGBT+",
"Human rights",
"Justice"
]

const styles = {
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
        margin: 4,
        cursor: 'pointer'
      },
  selectedChip: {
    margin: 4
  },
}

class NewsletterData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tags: [],
      allTags: categories
    }
  }

  componentDidMount(props) {
    db.collection("Newsletter").get().then((querySnapshot) => {
      let data = []
      let emails = []
      querySnapshot.forEach((doc) => {
        if (!emails.includes(doc.data().email)) {
          let docData = doc.data()
          emails.push(docData.email)
          data.push(docData)
        }
      })
      this.setState({csvData: data, originalData: data})
    })

  }

  handleRequestDelete = (key) => {
    const chipToDelete = this.state.tags.indexOf(key);
    var newTags = this.state.tags
    newTags.splice(chipToDelete, 1);
    var allTags = this.state.allTags
    allTags.push(key)
    this.setState({tags: newTags, allTags: allTags});

    var currentData = this.state.originalData
    let newData = []
    currentData.forEach((data) => {
      newTags.forEach((tag) => {
        if (data.issues && data.issues.includes(tag)) {
          newData.push(data)
        }
      })
    })
    this.setState({csvData: newData})
  };

  handleAddTag = (key) => {
    const chipToDelete = this.state.allTags.indexOf(key);
    var newAllTags = this.state.allTags
    newAllTags.splice(chipToDelete, 1);
    this.setState({allTags: newAllTags});
    var tags = this.state.tags
    tags.push(key)
    this.setState({tags: tags})

    var currentData = this.state.originalData
    let newData = []
    currentData.forEach((data) => {
      tags.forEach((tag) => {
        if (data.issues && data.issues.includes(tag)) {
          newData.push(data)
        }
      })
    })
    this.setState({csvData: newData})
  }

  render() {
    console.log(this.state)
    if (this.state.originalData) {
      return(
        <App>
        <div style={{width: '100%', height: '50vh', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center'}}>

              <div style={{maxWidth: 800, display: 'flex', alignItems: 'left', flexDirection: 'column'}}>
                <h2>
                  Choose by interest
                </h2>
                <div style={styles.wrapper}>
                  {this.state.tags.map((tag) => (
                    <Chip
                      key={tag}
                      style={styles.selectedChip}
                      backgroundColor={'#65A1e7'}
                      onRequestDelete={() => this.handleRequestDelete(tag)}
                    >
                      {tag}
                    </Chip>
                  ))}
                </div>


                <div style={styles.wrapper}>
                  {this.state.allTags.map((tag) => (
                    <Chip
                      key={tag}
                      style={styles.chip}
                      onTouchTap={() => this.handleAddTag(tag)}
                    >
                      {tag}
                    </Chip>
                  ))}
                </div>
                <div style={{height: 20}}/>

                </div>

          <CSVLink
            filename={"newsletter-data.csv"}
            target=""
            rel='noopener'
            data={this.state.csvData ? this.state.csvData : [{"data": "empty"}]}>
              <RaisedButton label='Download data'
                secondary={true}
                labelStyle={{fontWeight: 700, textTransform: 'none'}}
                icon={<FileDownload/>}/>


          </CSVLink>

          <div style={{maxWidth: 800, width: '100%', display: 'flex', flexDirection: 'column'}}>
            <h2 style={{width: '100%', textAlign: 'left'}}>
              All people
            </h2>
            <CSVLink
              filename={"newsletter-data.csv"}
              target=""
              rel='noopener'
              data={this.state.originalData ? this.state.originalData : [{"data": "empty"}]}>
                <RaisedButton label='Download all data'
                  secondary={true}
                  labelStyle={{fontWeight: 700, textTransform: 'none'}}
                  icon={<FileDownload/>}/>


            </CSVLink>
          </div>
        </div>
        </App>
      )
    } else {
      return (
        <div>
          Loading...
        </div>
      )
    }

  }
}

export default withMui(NewsletterData)
