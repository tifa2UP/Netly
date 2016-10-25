
var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var Experience = React.createClass({
	getInitialState: function(){
		return{isCurrentUser: false, editing: false};
	},

	componentWillMount: function(){
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

	componentWillReceiveProps: function(nextProps){
		var userRef = firebase.database().ref().child('users/'+ nextProps.user_id);
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
        userRef.once("value", snap=>{
        	var user = snap.val();
        	var userInfo = {};
            for(var i in user){
                userInfo[i] = user[i];
            }
			userInfo.experience = newExperience;
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
		if(this.props.isCurrentUser){
			editButton = <button className="btn btn-default" onClick={this.handleClickEdit}><span className="glyphicon glyphicon-pencil"></span></button>;
		}else{
			editButton = <div></div>;
		}

		return(
			<div>
				<h3>Experience {editButton}</h3>
				<pre>{this.state.experience}</pre>
			</div>
		);
	},

	editingExperience: function(){
		return(
			<div>
				<h3>Experience</h3>
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
				{partToShow}
				<br />
			</div>

		);
	}
});

module.exports = Experience;