var React =require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var Skills = React.createClass({
	getInitialState: function(){
		return {isCurrentUser= false, editing: false};
	},
	componentwillmount: function()
	{
		firebase.auth().onAuthstatechanged((user)=> {
			this.setState({isCurrentUser: firebase.auth().currentUser.uid == this.props.user_id})
		});
		var userRef = firebase.database().ref().child('users/'+this.props.user_id);
        userRef.on("value", snap => {
        	var user = snap.val();
			if(user.skills){
				this.setState({skills: user.skills});
			}else{
				this.setState({skills: ""});
			}
        });
	},
	handleClickedit: function()
	{
		this.setState({editing:true});
	},
    
    handleClickSave: function()
    {
        this.setState({editing: false});
		var newProjects = this.refs.newSkills.value;

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
  				skills: newskills
            };
            var updates = {};
			updates['users/' + this.props.user_id] = userInfo;
			firebase.database().ref().update(updates);
        });
    },
    
	handleClickCancel: function(){
		this.setState({editing: false});
	},
    defaultSkills: function(){
		var editButton;
		if(this.state.isCurrentUser){
			editButton = <button className="btn btn-default" onClick={this.handleClickEdit}>Edit</button>;
		}else{
			editButton = <div></div>;
		}

		return(
			<div>
				<pre>{this.state.skills}</pre>
				<br/>
				{editButton}
			</div>
		);
	},
    editingSkills: function(){
		return(
			<div>
				<textarea rows="6" style={{width: '100%'}} ref="newSkills" defaultValue={this.state.skills} />
				<br/>
				<button className="btn btn-primary" onClick={this.handleClickSave}>Save</button>
				<button className="btn btn-default" onClick={this.handleClickCancel}>Cancel</button>
			</div>
		);
	},
    
render: function(){
		var partToShow;
		if(this.state.editing){
			partToShow = this.editingSkills();
		}else{
			partToShow = this.defaultSkills();
		}

		return (
			<div>
				<h3>Skills</h3>
				{partToShow}
			</div>

		);
	}
});

module.exports = Skills;
	