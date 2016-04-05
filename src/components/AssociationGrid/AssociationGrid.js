import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
let Loader = require('react-loader');

export default class AssociationGrid extends Component {
  static propTypes = {
    assocItems: PropTypes.array
  }


  render() {
    const styles = require('./AssociationGrid.scss');
    const defaultOptions = {
      speed: 1,
      trail: 60,
      color: '#2A9FD6',
      shadow: false,
      hwaccel: true,
      scale: 0.5,
      position: 'relative',
      display: 'inline-block',
      left: '100%'
    };
    const { assocItems } = this.props;
    //const spinnerOptions = Object.assign(options, defaultOptions);
    console.log(this.props.assocItems)
    return (
      <div>
        {assocItems.map((assocItem) => {

          <div className="row multi-columns-row">
            <div className="association-item">
              <div class="association-image">
                <img href=""><Link to=""/></img>
              </div>
            </div>
          </div>
        })}
      </div>

    )
  }
}