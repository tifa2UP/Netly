var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var Education = React.createClass({
	getInitialState: function(){
		return{isCurrentUser: false, editing: false};
	},

	componentWillMount: function(){
        var userRef = firebase.database().ref().child('users/'+this.props.pageID);
        userRef.on("value", snap => {
        	var user = snap.val();
			if(user.education){
				this.setState({education: user.education});
			}else{
				this.setState({education: ""});
			}
        });
	},

	componentWillReceiveProps: function(nextProps){
		var userRef = firebase.database().ref().child('users/'+ nextProps.pageID);
        userRef.on("value", snap => {
        	var user = snap.val();
			if(user.education){
				this.setState({education: user.education});
			}else{
				this.setState({education: ""});
			}
        });
	},

	handleClickEdit: function(){
		this.setState({editing: true});
	},

	handleClickSave: function(){
		this.setState({editing: false});
		var newEducation = this.refs.newEducation.value;

		var userRef = firebase.database().ref().child('users/'+this.props.pageID);
        userRef.once("value", snap => {
        	var user = snap.val();
			var userInfo = {};
            for(var i in user){
                userInfo[i] = user[i];
            }
			userInfo.education = newEducation;
			var updates = {};
			updates['users/' + this.props.pageID] = userInfo;
			firebase.database().ref().update(updates);
        });
	},

	handleClickCancel: function(){
		this.setState({editing: false});
	},

	defaultEducation: function(){
		var editButton;
		if(this.props.isCurrentUser){
			editButton = <button className="btn btn-default" onClick={this.handleClickEdit}><span className="glyphicon glyphicon-pencil"></span></button>;
		}else{
			editButton = <div></div>;
		}

		return(
			<div>
				<h3>Education {editButton}</h3>
				<pre>{this.state.education}</pre>
			</div>
		);
	},

	editingEducation: function(){
		return(
			<div>
				<h3>Education</h3>
				<textarea rows="6" style={{width: '100%'}} ref="newEducation" defaultValue={this.state.education} />
				<br/>
				<button className="btn btn-primary" onClick={this.handleClickSave}>Save</button>
				<button className="btn btn-default" onClick={this.handleClickCancel}>Cancel</button>
			</div>
		);
	},

	render: function(){
		var partToShow;
		if(this.state.editing){
			partToShow = this.editingEducation();
		}else{
			partToShow = this.defaultEducation();
		}

		return (
			<div>
				{partToShow}
				<br />
			</div>

		);
	}
});

module.exports = Education;