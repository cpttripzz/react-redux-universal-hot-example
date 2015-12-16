import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { isLoaded as usersLoaded, load as loadUsers } from 'redux/modules/users';
@connect(
    state => ({users: state.users}),
    dispatch => bindActionCreators({loadUsers}, dispatch))

export default class UserAdmin extends Component {
    constructor(props) {
        super(props)
    }

    static propTypes = {
        users: PropTypes.object.isRequired
    };
    static fetchData(getState, dispatch) {
        const promises = [];

        if (!usersLoaded()) {
            promises.push(dispatch(loadUsers()));
        }
        return Promise.all(promises);
    }

    render() {
        const usersData = this.props.users.users
        console.log(usersData)

        return (
        <div>

        </div>
        );
    }
}
