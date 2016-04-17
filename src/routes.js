import React from 'react';
import {IndexRoute, Route} from 'react-router';
import {isLoaded as isAuthLoaded, load as loadAuth} from 'redux/modules/auth';
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
      const {auth: {user}} = store.getState();
      if (!user) {
        console.log('auuuuuft')
        // oops, not logged in, so can't be here!
        return replace({
          pathname: '/login',
          state: { nextPathname: nextState.location.pathname }
        })
      }
      cb();
    }

    if (!isAuthLoaded(store.getState())) {
      return store.dispatch(loadAuth()).then(checkAuth).catch((e) => console.log('eee',e))
    } else {
      checkAuth()
    }

  };
  // const routes = {
  //   path: '/',
  //   component: App,
  //   indexRoute: {component: Home},
  //   childRoutes: [
  //     {path: 'login', component: Login},
  //     {path: 'register', component: Register},
  //     {path: '/oauth-profile/:token', component: OauthToken},
  //     {
  //       path: 'inbox',
  //       component: Inbox,
  //       childRoutes: [{
  //         path: 'messages/:id',
  //         onEnter: ({params}, replace) => replace(`/messages/${params.id}`)
  //       }]
  //     },
  //     {path: '*', component: NotFound, status: {404} },
  //   ]
  // }

  return (
    <Route component={App}>
      <Route path="/" component={Home}/>
      <Route path="/login" component={Login}/>
      <Route path="/register" component={Register}/>
      <Route path="/oauth-profile/:token" component={OauthToken}/>



        <Route path="/bands" component={Bands} onEnter={requireLogin}/>
        <Route path="/profile" component={Profile} onEnter={requireLogin}/>
        <Route path="/user-admin" component={UserAdmin} onEnter={requireLogin}/>

      <Route path="*" component={NotFound} status={404}/>
    </Route>
  );
};
