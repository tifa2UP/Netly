var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var Summary = React.createClass({
	getInitialState: function(){
		return{isCurrentUser: false, editing: false};
	},

	componentWillMount: function(){
        this.userRef = firebase.database().ref().child('users/'+this.props.pageID);
        this.userRef.on("value", snap => {
        	var user = snap.val();
			if(user.summary){
				this.setState({summary: user.summary});
			}else{
				this.setState({summary: ""});
			}
        });
	},

	componentWillReceiveProps: function(nextProps){
        this.userRef = firebase.database().ref().child('users/'+ nextProps.pageID);
        this.userRef.on("value", snap => {
        	var user = snap.val();
			if(user.summary){
				this.setState({summary: user.summary});
			}else{
				this.setState({summary: ""});
			}
        });
	},

	componentWillUnmount: function(){
		this.userRef.off();
	},

	handleClickEdit: function(){
		this.setState({editing: true});
	},

	handleClickSave: function(){
		this.setState({editing: false});
		var newSummary = this.refs.newSummary.value;

        this.userRef.once("value", snap => {
        	var user = snap.val();
			var userInfo = {};
            for(var i in user){
                userInfo[i] = user[i];
            }
			userInfo.summary = newSummary;
			var updates = {};
			updates['users/' + this.props.pageID] = userInfo;
			firebase.database().ref().update(updates);
        });
	},

	handleClickCancel: function(){
		this.setState({editing: false});
	},

	defaultSummary: function(){
		var editButton;
		if(this.props.isCurrentUser){
			editButton = <button className="btn btn-default" onClick={this.handleClickEdit}><span className="glyphicon glyphicon-pencil"></span></button>;
		}else{
			editButton = <div></div>;
		}

		return(
			<div>
				<h2 style={{color: "#0077B5"}}>Summary {editButton}</h2>
				<pre style={{margin: "-10px 0px 0px -10px", fontFamily: "helvetica", border: "none", width: "100%", background: "none", whiteSpace: "pre-wrap"}}>{this.state.summary}</pre>
			</div>
		);
	},

	editingSummary: function(){
		return(
			<div>
				<h3>Summary</h3>
				<textarea className="form-control" rows="6" style={{width: '100%'}} ref="newSummary" defaultValue={this.state.summary} />
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
			partToShow = this.editingSummary();
		}else{
			partToShow = this.defaultSummary();
		}

		return (
			<div>
				{partToShow}
				<br />
			</div>

		);
	}
});

module.exports = Summary;