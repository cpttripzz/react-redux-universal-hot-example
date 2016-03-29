import React from 'react';
import {IndexRoute, Route} from 'react-router';
import { isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth';
import {
    App,
    Chat,
    Home,
    About,
    Login,
    Register,
    LoginSuccess,
    Survey,
    NotFound,
    UserAdmin,
    Profile,
    OauthToken,
    Bands
} from 'containers';

export default (store) => {
    const requireLogin = (nextState, replace, cb) => {
        function checkAuth() {
            const { auth: { user }} = store.getState();
            if (!user) {
                // oops, not logged in, so can't be here!
              replace(null, '/');
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
            <Route path="/oauth-profile/:token" component={OauthToken}/>
            <Route path="/profile" component={Profile}/>
            <Route path="/bands" component={Bands}/>

            <Route onEnter={requireLogin}>
                <Route path="/loginSuccess" component={LoginSuccess}/>
            </Route>
            <Route path="*" component={NotFound} status={404}/>
        </Route>

    );
};
