import React, { Component } from 'react';
import { Link } from 'react-router';
import { isLoaded as bandLoaded, load as loadBand } from 'redux/modules/band';

import { routeActions } from 'react-router-redux';
import { asyncConnect } from 'redux-async-connect';
export default class Band extends Component {
  render() {
    const styles = require('./Band.scss');
    return (
      <div className={styles.band}>

      </div>
    );
  }
}
