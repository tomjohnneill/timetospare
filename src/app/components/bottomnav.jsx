import React, {Component} from 'react';
import FontIcon from 'material-ui/FontIcon';
import Link from "next/link";
import Router from 'next/router';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
import Home from 'material-ui/svg-icons/action/home';
import Edit from 'material-ui/svg-icons/image/edit';
import Settings from 'material-ui/svg-icons/action/settings';

const editIcon = <Edit/>;
const homeIcon = <Home/>;
const adminIcon = <Settings/>;

/**
 * A simple example of `BottomNavigation`, with three labels and icons
 * provided. The selected `BottomNavigationItem` is determined by application
 * state (for instance, by the URL).
 */
class BottomNavigationExampleSimple extends Component {
  state = {
    selectedIndex: 1,
  };

  select = (tab, index) => {
    this.setState({selectedIndex: index})
    if (tab !== 'project') {
      Router.push(window.location.pathname + '/admin/' + tab)
    }



  }
    ;

  render() {
    return (
      <Paper style={{borderTop: '2px solid #E55749' ,

        zIndex: 7, position: 'fixed', width: '100%', backgroundColor: '#65A1e7', bottom: 0}} zDepth={6}>
        <BottomNavigation
          style={{background: 'linear-gradient(rgb(252,252,252), rgb(255,255,255))'}}
          selectedIndex={this.state.selectedIndex}>
          <BottomNavigationItem
            label="Admin"
            icon={adminIcon}
            onClick={() => this.select('admin', 0)}
          />
          <BottomNavigationItem
            label="Project"
            icon={homeIcon}
            onClick={() => this.select('project', 1)}
          />
          <BottomNavigationItem
            label="Edit"
            icon={editIcon}
            onClick={() => this.select('editproject', 2)}
          />
        </BottomNavigation>
      </Paper>
    );
  }
}

export default BottomNavigationExampleSimple;
