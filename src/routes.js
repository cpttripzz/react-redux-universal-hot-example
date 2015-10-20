import React from 'react';
import {Route} from 'react-router';
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
      store.dispatch(loadAuth()).then(checkAuth);
    } else {
      checkAuth();
    }
  };

    return (
        <Route component={App}>
            <Route path="/" component={Home}/>
            <Route path="/widgets" component={Widgets}/>
            <Route path="/about" component={About}/>
            <Route path="/login" component={Login}/>
            <Route path="/register" component={Register}/>
            <Route onEnter={requireLogin}>
                <Route path="/chat" component={Chat}/>
                <Route path="/loginSuccess" component={LoginSuccess}/>
            </Route>
            <Route path="/survey" component={Survey}/>
            <Route path="*" component={NotFound} status={404}/>
        </Route>

    );
};
