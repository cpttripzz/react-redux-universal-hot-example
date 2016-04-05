import React, { Component, PropTypes } from 'react';
import { IndexLink, Link } from 'react-router';
import { connect } from 'react-redux';
import { routeActions } from 'react-router-redux';
import { logout } from 'redux/modules/auth';

const NavbarLink = ({to, className, component, children}) => {
  const Comp = component || Link;

  return (
    <Comp to={to} className={className} activeStyle={{color: '#33e0ff'}}>
      {children}
    </Comp>
  );
};

@connect(
  state => ({user: state.auth.user}),
  {logout, pushState: routeActions.push})
export default class Navbar extends Component {
  static propTypes = {
    user: PropTypes.object,
    logout: PropTypes.func.isRequired
  }

  handleLogout(event) {
    event.preventDefault();
    this.props.logout().then(() => this.props.pushState(null, '/'))

  }


  render() {
    const isLoggedIn = this.props.user && (Object.keys(this.props.user).length) ? true: false
    const photoPath = false; //isLoggedIn ? 'thumbs/' + this.props.user._id + '.png' : false
    return (
      <nav className="navbar navbar-default navbar-fixed-top navbar-left">
        <div className="col-sm-6 col-sm-offset-3">
          <NavbarLink to="/" className="navbar-brand" component={IndexLink}>
            Reduxxed
          </NavbarLink>

          <ul className="nav navbar-nav col-sm-6  col-sm-offset-3">
            <li><NavbarLink to="/bands">Bands</NavbarLink></li>

            {isLoggedIn && <li><NavbarLink to="/user-admin" >User Admin</NavbarLink></li>}
            {isLoggedIn && <li><NavbarLink to="/profile">Profile</NavbarLink></li>}
            {!isLoggedIn && <li><NavbarLink to="/login">Login</NavbarLink></li>}
            {isLoggedIn && <li className="logout-link"><a href="/logout" onClick={::this.handleLogout}>Logout</a></li>}
          </ul>
          </div>
        <div>
        {isLoggedIn && <p className='navbar-text'>Logged in as <strong>{this.props.user.email}</strong></p>}
          {photoPath && <img src={photoPath} />}
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