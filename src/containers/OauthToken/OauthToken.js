import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { routeActions } from 'react-router-redux'
import cookie from '../../../utils/cookie'

@connect( state => ({}), {pushState: routeActions.push})
export default class OauthToken extends Component {
  static propTypes = {
    pushState: PropTypes.func.isRequired 
  }

  componentDidMount() {
    const {token} = this.props.params
    console.log("token",token)
    if (token) {
      cookie.setToken(token)
      this.props.pushState('/profile')
    }
  }

  render() {
    return (
      <div className="container">
      </div>
    )
  }
}
