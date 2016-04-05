import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { asyncConnect } from 'redux-async-connect';

import { isLoaded as bandsLoaded, load as loadBands } from 'redux/modules/bands';
import { AssociationGrid } from 'components';


@connect(
  state => ({bands: state.bands}),
  dispatch => bindActionCreators({loadBands}, dispatch)
)

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    const promises = [];

    if (!bandsLoaded()) {
      promises.push(dispatch(loadBands()));
    }

    return Promise.all(promises);
  }
}])

export default class Bands extends Component {
  constructor(props) {
    super(props)
  }

  static propTypes = {
    bands: PropTypes.object.isRequired
  };


  render() {
    const bands = this.props.bands.data.data
    const styles = require('./Bands.scss')

    return (
      <div className="col-xs-6 col-sm-4 col-md-3 col-lg-3">
        <div className="row multi-columns-row">
          <AssociationGrid assocItems={bands} />
        </div>
      </div>
    );
  }
}
