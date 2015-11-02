import React from 'react';
import {IndexRoute, Route} from 'react-router';
import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth';
import {
    App,
    Chat,
    Home,
    Widgets,
    About,
    Login,
    Register,
    LoginSuccess,
    Survey,
    NotFound,
    UserAdmin,
    Profile
} from 'containers';

export default (store) => {
    const requireLogin = (nextState, replaceState, cb) => {
        function checkAuth() {
            const { auth: { user }} = store.getState();
            if (!user) {
                // oops, not logged in, so can't be here!
                replaceState(null, '/');
            }
            cb();
        }

        if (!isAuthLoaded(store.getState())) {
            store.dispatch(loadAuth(store.getState())).then(checkAuth);
        } else {
            checkAuth();
        }
    };


    return (
        <Route component={App}>
            <Route path="/" component={Home}/>
            <Route path="/login" component={Login}/>
            <Route path="/register" component={Register}/>
            <Route path="/user-admin" component={UserAdmin}/>
            <Route path="/oauth-profile" component={LoginSuccess}/>
            <Route onEnter={requireLogin}>
                <Route path="/profile" component={Profile}/>
                <Route path="/loginSuccess" component={LoginSuccess}/>
            </Route>
            <Route path="*" component={NotFound} status={404}/>
        </Route>

    );
};
