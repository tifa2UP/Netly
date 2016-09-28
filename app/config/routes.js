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

var requireAuth = require('./require_auth.js')

var routes = (
	<Router history={hashHistory}>
		<Route path="/" component={Layout}>
			<IndexRoute component={Home} onEnter={requireAuth}/>
			<Route path="login" component={SessionUser}/>
			<Route path="signup" component={NewUser}/>
			<Route path="logout" component={Logout}/>
		</Route>
	</Router>
);

module.exports= routes;