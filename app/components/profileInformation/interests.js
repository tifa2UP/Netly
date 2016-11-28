var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var Interests = React.createClass({
	getInitialState: function(){
		return{isCurrentUser: false, editing: false};
	},

	componentWillMount: function(){
        this.userRef = firebase.database().ref().child('users/'+this.props.pageID);
        this.userRef.on("value", snap => {
        	var user = snap.val();
			if(user.interests){
				this.setState({interests: user.interests});
			}else{
				this.setState({interests: ""});
			}
        });
	},

	componentWillReceiveProps: function(nextProps){
		this.userRef = firebase.database().ref().child('users/'+ nextProps.pageID);
        this.userRef.on("value", snap => {
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
		var that = this;
		this.setState({editing: false});

		var newInterests = this.refs.newInterests.value;

        this.userRef.once("value", snap => {
        	var user = snap.val();
        	var userInfo = {};
            for(var i in user){
                userInfo[i] = user[i];
            }
			userInfo.interests = newInterests;
			var updates = {};
			updates['users/' + this.props.pageID] = userInfo;
			firebase.database().ref().update(updates);
        });

        this.setState({interests: newInterests});
	},

	handleClickCancel: function(){
		this.setState({editing: false});
	},

	defaultInterests: function(){
		var editButton;
		if(this.props.isCurrentUser){
			editButton = <button className="btn btn-default" onClick={this.handleClickEdit}><span className="glyphicon glyphicon-pencil" title="Edit Interests"></span></button>;
		}else{
			editButton = <div></div>;
		}

		return(
			<div>
				<h4 className="profile-heading">Interests {editButton}</h4>
			<pre>{this.state.interests}</pre>
			</div>
		);
	},

	editingInterests: function(){
		return(
			<div>
				<h4 className="profile-heading">Interests</h4>
				<textarea className="form-control" rows="6" style={{width: '100%'}} ref="newInterests" defaultValue={this.state.interests}  placeholder="Ex. Hiking, singing, cooking"/>
				<br/>
				<center>
					<div className="btn btn-toolbar">
						<button className="btn btn-primary" onClick={this.handleClickSave}>Save</button>
						<button className="btn btn-default" onClick={this.handleClickCancel}>Cancel</button>
					</div>
				</center>
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
				{partToShow}
				<hr/>
			</div>

		);
	}
});

module.exports = Interests;