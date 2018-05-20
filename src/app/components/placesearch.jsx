
import React from "react"


const { compose, withProps, lifecycle } = require("recompose");
const {
  withScriptjs,
} = require("react-google-maps");
const { StandaloneSearchBox } = require("react-google-maps/lib/components/places/StandaloneSearchBox");

export const PlacesWithStandaloneSearchBox = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyBnLdq8kJzE87Ba_Q5NEph7nD6vkcXmzhA&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
  }),
  lifecycle({
    componentWillMount() {
      const refs = {}

      this.setState({
        places: [],
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();

          this.setState({
            places,
          });
          this.props.reportPlaceToParent(places)
        },
      })
    },
  }),
  withScriptjs
)(props =>
  <div data-standalone-searchbox="">
    <StandaloneSearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        type="text"
        disabled={props.disabled}
        defaultValue={props.currentLocation}
        placeholder="Location"
        style={{
          display: 'inline-block',
          width: '100%',
          color: '#484848',
          paddingTop: '10px',
          paddingBottom: '10px',
          paddingLeft: '12px',
          fontFamily: 'Nunito',
          fontSize: '16px',
          boxSizing: 'border-box',
          borderRadius: '2px',
          border: '1px solid #aaa'
        }}
      />
    </StandaloneSearchBox>

  </div>
);
