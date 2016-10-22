var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;
var Summary = require('./summary.js');
var Education = require('./education.js');
var Projects = require('./projects.js');
var Interests = require('./interests.js');
var Experience = require('./experience.js');
var Skills = require('./skills.js');

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
				<center><h1>{this.state.user_name}</h1></center>
				<br />
				<Summary user_id={this.props.params.id}/>
				<Projects user_id={this.props.params.id}/>
				<Education user_id={this.props.params.id}/>
				<Interests user_id={this.props.params.id}/>
				<Experience user_id={this.props.params.id}/>
				<Skills user_id={this.props.params.id}/>
			</div>
		);
	}
});

module.exports = Profile;