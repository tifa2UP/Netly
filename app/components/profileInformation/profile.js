var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;
var Projects = require('./projects.js');
var Interests = require('./interests.js');

var Profile = React.createClass({
	getInitialState: function(){
		return {user_name: "", recruiter: false};
	},

	componentWillMount: function(){
		var userRef = firebase.database().ref().child('users/'+this.props.params.id);
		userRef.once("value", snap=>{
			var user = snap.val();
			this.setState({user_name: user.first + " " + user.last});
			this.setState({recruiter: user.recruiter});
		});
	},

	render: function(){
		return ( 
			<div>
					<h1>{this.state.user_name}</h1> 
					<Projects user_id = {this.props.params.id}/>

					<Interests user_id = {this.props.params.id}/>
		</div>
		);
	}
});

module.exports = Profile;