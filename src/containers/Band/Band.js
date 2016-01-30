import React, { Component } from 'react';
import { Link } from 'react-router';
import {connect} from 'react-redux';
import { pushPath } from 'redux-simple-router';
import { isLoaded as bandLoaded, load as loadBand } from 'redux/modules/band';
export default class Band extends Component {
  render() {
    const styles = require('./Band.scss');
    return (
      <div className={styles.band}>

      </div>
    );
  }
}
