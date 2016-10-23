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
var ProfileImage = require('./profileImage.js');

var Profile = React.createClass({
	getInitialState: function(){
		return {user_name: "", recruiter: false, path: "", isCurrentUser: false};
	},

	componentWillMount: function(){
		var that = this;

		firebase.auth().onAuthStateChanged((user) => {
            this.setState({isCurrentUser: firebase.auth().currentUser.uid == this.props.params.id});
        });

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
				<center>
					<h1>{this.state.user_name}</h1>
					<img src={this.state.path} />
					<ProfileImage user_id={this.props.params.id} isCurrentUser={this.state.isCurrentUser}/>
				</center>
				<br />
				<Summary user_id={this.props.params.id} isCurrentUser={this.state.isCurrentUser}/>
				<Projects user_id={this.props.params.id} isCurrentUser={this.state.isCurrentUser}/>
				<Education user_id={this.props.params.id} isCurrentUser={this.state.isCurrentUser}/>
				<Interests user_id={this.props.params.id} isCurrentUser={this.state.isCurrentUser}/>
				<Experience user_id={this.props.params.id} isCurrentUser={this.state.isCurrentUser}/>
				<Skills user_id={this.props.params.id} isCurrentUser={this.state.isCurrentUser}/>
			</div>
		);
	}
});

module.exports = Profile;