import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { isLoaded as usersLoaded, load as loadUsers } from 'redux/modules/users';

@connect(
    state => ({users: state.users.data}),
    dispatch => bindActionCreators({loadUsers}, dispatch))

export default class UserAdmin extends Component {

    static fetchData(getState, dispatch) {
        const promises = [];

        if (!usersLoaded()) {
            promises.push(dispatch(loadUsers()));
        }
        return Promise.all(promises);
    }

    render() {
        return (
            <div >
You Aare hree
            </div>
        );
    }
}
