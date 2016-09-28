var React = require('react');
var firebase = require('firebase');
var hashHistory = require('react-router').hashHistory;

var Logout = React.createClass({
	componentDidMount() {
		firebase.auth().signOut();
		hashHistory.push('/login');
	},

	render: function(){
		return <p>Logged out</p>;
	}
});

module.exports = Logout;