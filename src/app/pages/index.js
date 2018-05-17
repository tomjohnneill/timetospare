import React from "react"
import RaisedButton from 'material-ui/RaisedButton';
import App from "../components/App"
import fire from '../fire';

let db = fire.firestore()


export function changeImageAddress(file, size) {
  if (file && file.includes('https://d3kkowhate9mma.cloudfront.net')) {
    var str = file, replacement = '/' + size + '/';
    str = str.replace(/\/([^\/]*)$/,replacement+'$1');
    return(str + '?pass=this')
  } else {
    return (file)
  }
}



export default () => (
  <App>
    <p>Index Page</p>
      <img
              style={{height: '90vh', width: '100%', objectFit: 'cover', position: 'relative', marginTop: '-51px'}}
              src={changeImageAddress('https://d3kkowhate9mma.cloudfront.net/important/jeremy-bishop-170994-unsplash.jpg', '750xauto')}/>
            <div style={{position: 'absolute',top:'-51px',  height: '100%', width: '100%',
              background: 'radial-gradient(ellipse closest-side, rgba(0,0,0,0.75), rgba(0,0,0,0))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            paddingLeft: '20px', paddingRight: '20px', boxSizing: 'border-box'}}>
              <div style={{display: 'flex', alignItems: 'center', flexDirection: 'column'
                , justifyContent: 'center', width: '300px'}}>
                <h2 style={{color: 'white', fontSize: '36px'}}>Get up off your ass and do something good</h2>
                <span style={{fontWeight: 'lighter', color: 'white'}}>
                  Doing good shouldn't be hard. Find a project near you to get involved with.

                </span>
                {
                  !fire.auth().currentUser ?

                <div style={{paddingTop: 20}}>
                <RaisedButton label="I'm In."
                  primary={true}
                  onClick={this.handleImIn}
                  labelStyle={{letterSpacing: 0.3, fontWeight: 700}}
                  />
                <div style={{width: '80vw'}}>

                </div>
                </div>
                :
                null
              }
              </div>
            </div>
  </App>
)
