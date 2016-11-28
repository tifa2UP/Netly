var React =require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var Skills = React.createClass({
	getInitialState: function(){
		return {isCurrentUser: false, editing: false};
	},

	componentWillMount: function(){
		this.userRef = firebase.database().ref().child('users/'+this.props.pageID);
        this.userRef.on("value", snap => {
        	var user = snap.val();
			if(user.skills){
				this.setState({skills: user.skills});
			}else{
				this.setState({skills: ""});
			}
        });
	},

	componentWillReceiveProps: function(nextProps){
		this.userRef = firebase.database().ref().child('users/'+ nextProps.pageID);
        this.userRef.on("value", snap => {
        	var user = snap.val();
			if(user.skills){
				this.setState({skills: user.skills});
			}else{
				this.setState({skills: ""});
			}
        });
	},

	handleClickEdit: function(){
		this.setState({editing:true});
	},
    
    handleClickSave: function(){
        this.setState({editing: false});
		var newSkills = this.refs.newSkills.value;

        this.userRef.once("value", snap => {
        	var user = snap.val();
			var userInfo = {};
            for(var i in user){
                userInfo[i] = user[i];
            }
			userInfo.skills = newSkills;
            var updates = {};
			updates['users/' + this.props.pageID] = userInfo;
			firebase.database().ref().update(updates);
        });

        this.setState({skills: newSkills});
    },

    componentWillUnmount: function(){
    	this.userRef.off();
    },
    
	handleClickCancel: function(){
		this.setState({editing: false});
	},

    defaultSkills: function(){
		var editButton;
		if(this.props.isCurrentUser){
			editButton = <button className="btn btn-default" onClick={this.handleClickEdit}><span className="glyphicon glyphicon-pencil" title="Edit Skills"></span></button>;
		}else{
			editButton = <div></div>;
		}

		return(
			<div>
				<h4 className="profile-heading">Skills {editButton}</h4>
				<pre>{this.state.skills}</pre>
			</div>
		);
	},

    editingSkills: function(){
		return(
			<div>
				<h4>Skills</h4>
				<textarea className="form-control" rows="6" style={{width: '100%'}} ref="newSkills" defaultValue={this.state.skills}  placeholder="Ex. Microsoft Office, Java, Git"/>
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
			partToShow = this.editingSkills();
		}else{
			partToShow = this.defaultSkills();
		}

		return (
			<div>
				{partToShow}
				<hr/>
			</div>

		);
	}
});

module.exports = Skills;