var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var Experience = React.createClass({
	getInitialState: function(){
		return{isCurrentUser: false, editing: false};
	},

	componentWillMount: function(){
		firebase.auth().onAuthStateChanged((user) => {
            this.setState({isCurrentUser: firebase.auth().currentUser.uid == this.props.user_id});
        });

        var userRef = firebase.database().ref().child('users/'+this.props.user_id);
        userRef.on("value", snap => {
        	var user = snap.val();
			if(user.experience){
				this.setState({experience: user.experience});
			}else{
				this.setState({experience: ""});
			}
        });
	},

	handleClickEdit: function(){
		this.setState({editing: true});
	},

	handleClickSave: function(){
		this.setState({editing: false});
		var newExperience = this.refs.newExperience.value;

		var userRef = firebase.database().ref().child('users/'+this.props.user_id);
        userRef.once("value", snap => {
        	var user = snap.val();
			var userInfo = {
				email: user.email,
  				first: user.first,
  				last: user.last,
  				recruiter: user.recruiter,
  				summary: user.summary,
  				skills: user.skills,
  				recruiter: user.recruiter,
  				interests: user.interests,
  				education: user.education,
  				projects: user.projects,
  				experience: newExperience,
			};
			var updates = {};
			updates['users/' + this.props.user_id] = userInfo;
			firebase.database().ref().update(updates);
        });
	},

	handleClickCancel: function(){
		this.setState({editing: false});
	},

	defaultExperience: function(){
		var editButton;
		if(this.state.isCurrentUser){
			editButton = <button className="btn btn-default" onClick={this.handleClickEdit}>Edit</button>;
		}else{
			editButton = <div></div>;
		}

		return(
			<div>
				<pre>{this.state.experience}</pre>
				<br/>
				{editButton}
			</div>
		);
	},

	editingExperience: function(){
		return(
			<div>
				<textarea rows="6" style={{width: '100%'}} ref="newExperience" defaultValue={this.state.experience} />
				<br/>
				<button className="btn btn-primary" onClick={this.handleClickSave}>Save</button>
				<button className="btn btn-default" onClick={this.handleClickCancel}>Cancel</button>
			</div>
		);
	},

	render: function(){
		var partToShow;
		if(this.state.editing){
			partToShow = this.editingExperience();
		}else{
			partToShow = this.defaultExperience();
		}

		return (
			<div>
				<h3>Experience</h3>
				{partToShow}
			</div>

		);
	}
});

module.exports = Experience;