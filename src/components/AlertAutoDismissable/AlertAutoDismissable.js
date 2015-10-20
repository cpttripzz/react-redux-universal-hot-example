import React, {Component, PropTypes} from 'react';
import { Alert } from 'react-bootstrap';

export default class AlertAutoDismissable extends Component {
  static propTypes = {
    bsStyle: PropTypes.string || 'danger'
  }

  constructor(props) {
    super(props);
    this.state = {isVisible: true, message: props.message};
  }

  handleAlertDismiss = () => {
    this.setState({isVisible: false});
  }

  render() {
    if (this.state.isVisible) {
      return (
        <Alert {...this.props} onDismiss={this.handleAlertDismiss} dismissAfter={5000}>
          <p>{this.props.message}</p>
        </Alert>
      );
    }

    return (
      <span></span>
    );


  }
}
