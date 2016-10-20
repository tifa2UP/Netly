var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var Interests = React.createClass({
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
			if(user.interests){
				this.setState({interests: user.interests});
			}else{
				this.setState({interests: ""});
			}
        });
	},

	handleClickEdit: function(){
		this.setState({editing: true});
	},

	handleClickSave: function(){
		this.setState({editing: false});
		var newInterests = this.refs.newInterests.value;

		var userRef = firebase.database().ref().child('users/'+this.props.user_id);
        userRef.once("value", snap => {
        	var user = snap.val();
			var userInfo = {
				email: user.email,
  				first: user.first,
  				last: user.last,
  				summary: user.summary,
  				experience: user.experience,
  				education: user.education,
  				skills: user.skills,
  				projects: user.projects,
  				recruiter: user.recruiter,
  				interests: newInterests
			};
			var updates = {};
			updates['users/' + this.props.user_id] = userInfo;
			firebase.database().ref().update(updates);
        });
	},

	handleClickCancel: function(){
		this.setState({editing: false});
	},

	defaultInterests: function(){
		var editButton;
		if(this.state.isCurrentUser){
			editButton = <button className="btn btn-default" onClick={this.handleClickEdit}>Edit</button>;
		}else{
			editButton = <div></div>;
		}

		return(
			<div>
				<pre>{this.state.interests}</pre>
				<br/>
				{editButton}
			</div>
		);
	},

	editingInterests: function(){
		return(
			<div>
				<textarea rows="6" style={{width: '100%'}} ref="newInterests" defaultValue={this.state.interests} />
				<br/>
				<button className="btn btn-primary" onClick={this.handleClickSave}>Save</button>
				<button className="btn btn-default" onClick={this.handleClickCancel}>Cancel</button>
			</div>
		);
	},

	render: function(){
		var partToShow;
		if(this.state.editing){
			partToShow = this.editingInterests();
		}else{
			partToShow = this.defaultInterests();
		}

		return (
			<div>
				<h3>Interests</h3>
				{partToShow}
			</div>

		);
	}
});

module.exports = Interests;