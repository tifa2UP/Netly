var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var Profile = React.createClass({
	getInitialState: function(){
		return {user: firebase.auth().currentUser};
	},

	componentWillMount: function(){
		this.setState({user: firebase.auth().currentUser});
	},

	render: function(){
		return (
			<div>Hello</div>
		);
	}
});

module.exports = Profile;