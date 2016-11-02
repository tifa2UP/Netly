var React = require('react');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var IndexRoute = require('react-router').IndexRoute;
var hashHistory = require('react-router').hashHistory;

var NewUser = require('../components/user/new.js');
var SessionUser = require('../components/session/new.js');
var Home = require('../components/page/home.js');
var Logout = require('../components/session/destroy.js');
var Layout = require('../components/page/layout.js');
var AccountSettings = require('../components/user/accountSettings.js');
var AccountSettings2 = require('../components/user/accountSettings2.js');
var Profile = require('../components/profileInformation/profile.js');
var AwaitingAcceptance = require('../components/connection/awaiting_acceptance.js');
var Connections = require('../components/connection/index.js');

var requireAuth = require('./require_auth.js')

var routes = (
	<Router history={hashHistory}>
		<Route path="/" component={Layout}>
			<IndexRoute component={Home} onEnter={requireAuth}/>
			<Route path="login" component={SessionUser}/>
			<Route path="signup" component={NewUser}/>
			<Route path="logout" component={Logout}/>
<<<<<<< HEAD
			<Route path="accountSettings" component={AccountSettings} />//onEnter={requireAuth}/>
			<Route path="profile" component={Profile} onEnter={requireAuth} />
=======
			<Route path="accountSettings" component={AccountSettings} onEnter={requireAuth}/>
			<Route path="users/:id" component={Profile} onEnter={requireAuth} />
			<Route path="accountsettings/2" component={AccountSettings2} onEnter={requireAuth}/>
			<Route path="requests" component={AwaitingAcceptance} onEnter={requireAuth}/>
			<Route path="connections" component={Connections} onEnter={requireAuth}/>
>>>>>>> 5a00b2973165a90dbe91d3bb88ef86ca556f2d74
		</Route>
	</Router>
);

module.exports= routes;