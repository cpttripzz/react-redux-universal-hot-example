import React, { Component, PropTypes } from 'react';
import { IndexLink, Link } from 'react-router';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
import { logout } from 'redux/modules/auth';

const NavbarLink = ({to, className, activeRoute, component, children}) => {
  const Comp = component || Link;

  if (to==activeRoute) className += className + " active"
  return (
    <Comp to={to} className={className}>
      {children}
    </Comp>
  );
};

@connect(
  state => ({user: state.auth.user}),
  {logout, pushState})
export default class Navbar extends Component {
  static propTypes = {
    user: PropTypes.object,
    logout: PropTypes.func.isRequired,
    activeRoute:  PropTypes.string
  }

  handleLogout(event) {
    event.preventDefault();
    this.props.logout().then(() => this.props.pushState(null, '/'))

  }


  render() {
    const isLoggedIn = this.props.user && (Object.keys(this.props.user).length) ? true: false
    const { activeRoute } = this.props
    return (
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container">
          <NavbarLink to="/" className="navbar-brand" component={IndexLink}>
            Reduxxed
          </NavbarLink>

          <ul className="nav navbar-nav">
            {isLoggedIn && <li><NavbarLink to="/user-admin" activeRoute={activeRoute} >User Admin</NavbarLink></li>}
            {isLoggedIn && <li><NavbarLink to="/profile" activeRoute={activeRoute}>Profile</NavbarLink></li>}
            {!isLoggedIn && <li><NavbarLink to="/login" activeRoute={activeRoute}>Login</NavbarLink></li>}
            {isLoggedIn && <li className="logout-link"><a href="/logout" onClick={::this.handleLogout}>Logout</a></li>}
          </ul>
          {isLoggedIn && <p className='navbar-text'>Logged in as <strong>{this.props.user.email}</strong></p>}
          <ul className="nav navbar-nav navbar-right">
            <li>
              yo
            </li>
          </ul>
        </div>
      </nav>
    );
  }
  }