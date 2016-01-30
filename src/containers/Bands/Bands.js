import React, {Component, PropTypes} from 'react';
import { Link } from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { pushPath } from 'redux-simple-router';
import { isLoaded as bandsLoaded, load as loadBands } from 'redux/modules/bands';


@connect(
  state => ({bands: state.bands}),
  dispatch => bindActionCreators({loadBands}, dispatch)
)


export default class Bands extends Component {
  constructor(props) {
    super(props)
  }

  static propTypes = {
    bands: PropTypes.object.isRequired
  };
  static fetchData(getState, dispatch) {
    const promises = [];

    if (!bandsLoaded()) {
      promises.push(dispatch(loadBands()));
    }
    return Promise.all(promises);
  }

  render() {
    const styles = require('./Bands.scss');
    return (
      <div className={styles.bands}>

      </div>
    );
  }
}
