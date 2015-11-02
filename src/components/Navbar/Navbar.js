import React, { Component, PropTypes } from 'react';
import { IndexLink, Link } from 'react-router';
import { connect } from 'react-redux';
import { pushState } from 'redux-router';
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
    {logout, pushState})
export default class Navbar extends Component {
    static propTypes = {
        user: PropTypes.object,
        logout: PropTypes.func.isRequired
    }
    handleLogout(event) {
        event.preventDefault();
        this.props.logout();
    }
    render() {
        const {user} = this.props;
        //const {user} = (Object.keys(this.props.user).length) ? this.props : false;

        return (
            <nav className="navbar navbar-default navbar-fixed-top">
                <div className="container">
                    <NavbarLink to="/" className="navbar-brand" component={IndexLink}>
                        Application
                    </NavbarLink>

                    <ul className="nav navbar-nav">
                        {user && <li><NavbarLink to="/chat">Chat</NavbarLink></li>}

                        <li><NavbarLink to="/user-admin">User Admin</NavbarLink></li>
                        <li><NavbarLink to="/profile">Profile</NavbarLink></li>

                        {!user && <li><NavbarLink to="/login">Login</NavbarLink></li>}
                        {user &&

                        <li className="logout-link"><a href="/logout" onClick={::this.handleLogout}>Logout</a></li>}
                    </ul>
                    {user &&
                    <p className='navbar-text'>Logged in as <strong>{user.email}</strong>.
                    </p>}
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