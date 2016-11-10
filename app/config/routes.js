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
var Profile = require('../components/profileInformation/profile.js');
var AwaitingAcceptance = require('../components/connection/awaiting_acceptance.js');
var Connections = require('../components/connection/index.js');
var SearchResults = require('../components/page/results.js');
var AdvancedSearch = require('../components/page/advanced.js');
var Companies = require('../components/page/companies.js');

var requireAuth = require('./require_auth.js')

var routes = (
	<Router history={hashHistory}>
		<Route path="/" component={Layout}>
			<IndexRoute component={Home} onEnter={requireAuth}/>
			<Route path="login" component={SessionUser}/>
			<Route path="signup" component={NewUser}/>
			<Route path="logout" component={Logout}/>
			<Route path="accountSettings" component={AccountSettings} onEnter={requireAuth}/>
			<Route path="users/:id" component={Profile} onEnter={requireAuth}/>
			<Route path="requests" component={AwaitingAcceptance} onEnter={requireAuth}/>
			<Route path="connections" component={Connections} onEnter={requireAuth}/>
			<Route path="results/:name" component={SearchResults} onEnter={requireAuth}/>
			<Route path="advanced" component={AdvancedSearch} onEnter={requireAuth}/>
			<Companies path="companies" component={Companies} onEnter={requireAuth}/>
		</Route>
	</Router>
);

module.exports= routes;