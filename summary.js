var React =require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var Summary = React.createClass({
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
			if(user.summary){
				this.setState({summary: user.summary});
			}else{
				this.setState({summary: ""});
			}
        });
	},

	handleClickEdit: function(){
		this.setState({editing: true});
	},

	handleClickSave: function(){
		this.setState({editing: false});
		var newSummary = this.refs.newSummary.value;

		var userRef = firebase.database().ref().child('users/'+this.props.user_id);
        userRef.once("value", snap => {
        	var user = snap.val();
			var userInfo = {
				email: user.email,
  				first: user.first,
  				last: user.last,
  				recruiter: user.recruiter,
  				summary: user.summary,
  				experience: user.experience,
  				skills: user.skills,
  				recruiter: user.recruiter,
  				interests: user.interests,
  				education: user.education,
  				summary: newSummary
			};
			var updates = {};
			updates['users/' + this.props.user_id] = userInfo;
			firebase.database().ref().update(updates);
        });
	},

	handleClickCancel: function(){
		this.setState({editing: false});
	},

	defaultSummary: function(){
		var editButton;
		if(this.state.isCurrentUser){
			editButton = <button className="btn btn-default" onClick={this.handleClickEdit}>Edit</button>;
		}else{
			editButton = <div></div>;
		}

		return(
			<div>
				<pre>{this.state.summary}</pre>
				<br/>
				{editButton}
			</div>
		);
	},

	editingSummary: function(){
		return(
			<div>
				<textarea rows="6" style={{width: '100%'}} ref="newSummary" defaultValue={this.state.summary} />
				<br/>
				<button className="btn btn-primary" onClick={this.handleClickSave}>Save</button>
				<button className="btn btn-default" onClick={this.handleClickCancel}>Cancel</button>
			</div>
		);
	},

	render: function(){
		var partToShow;
		if(this.state.editing){
			partToShow = this.editingSummary();
		}else{
			partToShow = this.defaultSummary();
		}

		return (
			<div>
				<h3>Summary</h3>
				{partToShow}
			</div>

		);
	}
});

module.exports = Summary;