var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var Projects = React.createClass({
	getInitialState: function(){
		return{isCurrentUser: false, editing: false};
	},

	componentWillMount: function(){
        var userRef = firebase.database().ref().child('users/'+this.props.user_id);
        userRef.on("value", snap => {
        	var user = snap.val();
			if(user.projects){
				this.setState({projects: user.projects});
			}else{
				this.setState({projects: ""});
			}
        });
	},

	componentWillReceiveProps: function(nextProps){
        var userRef = firebase.database().ref().child('users/'+ nextProps.user_id);
        userRef.on("value", snap => {
        	var user = snap.val();
			if(user.projects){
				this.setState({projects: user.projects});
			}else{
				this.setState({projects: ""});
			}
        });
	},

	handleClickEdit: function(){
		this.setState({editing: true});
	},

	handleClickSave: function(){
		this.setState({editing: false});
		var newProjects = this.refs.newProjects.value;

		var userRef = firebase.database().ref().child('users/'+this.props.user_id);
        userRef.once("value", snap => {
        	var user = snap.val();
			var userInfo = {
				email: user.email,
  				first: user.first,
  				last: user.last,
  				recruiter: user.recruiter,
  				summary: user.summary,
  				education: user.education,
  				projects: newProjects,
  				skills: user.skills,
  				experience: user.experience,
  				interests: user.interests
			};
			var updates = {};
			updates['users/' + this.props.user_id] = userInfo;
			firebase.database().ref().update(updates);
        });
	},

	handleClickCancel: function(){
		this.setState({editing: false});
	},

	defaultProjects: function(){
		var editButton;
		if(this.props.isCurrentUser){
			editButton = <button className="btn btn-default" onClick={this.handleClickEdit}><span className="glyphicon glyphicon-pencil"></span></button>;
		}else{
			editButton = <div></div>;
		}

		return(
			<div>
				<h3>Projects {editButton}</h3>
				<pre>{this.state.projects}</pre>
			</div>
		);
	},

	editingProjects: function(){
		return(
			<div>
				<h3>Projects</h3>
				<textarea rows="6" style={{width: '100%'}} ref="newProjects" defaultValue={this.state.projects} />
				<br/>
				<button className="btn btn-primary" onClick={this.handleClickSave}>Save</button>
				<button className="btn btn-default" onClick={this.handleClickCancel}>Cancel</button>
			</div>
		);
	},

	render: function(){
		var partToShow;
		if(this.state.editing){
			partToShow = this.editingProjects();
		}else{
			partToShow = this.defaultProjects();
		}

		return (
			<div>
				{partToShow}
				<br />
			</div>

		);
	}
});

module.exports = Projects;