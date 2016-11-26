var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var Connection = React.createClass({
	getInitialState: function(){
		return {
			status: "",
			currentUserID: "",
			pageID: "",
			isCurrentUser: false
		}
	},

	componentDidMount: function(){
		this.setState({currentUserID: this.props.currentUserID});
		this.setState({pageID: this.props.pageID});
		this.setState({isCurrentUser: this.props.isCurrentUser});

		if(!this.props.isCurrentUser){
			this.connectionRef = firebase.database().ref().child('connections/' + this.props.currentUserID + '/' + this.props.pageID);
			this.connectionRef.on("value", snap=>{
				var connection = snap.val();
				if(connection && connection.status){
					this.setState({status: connection.status});
				}
			});

			this.connectionRefUpdates = firebase.database().ref().child('connections/' + this.props.currentUserID);
			this.connectionRefUpdates.on("child_removed", snap=>{
				var removedKey = snap.ref.key;
				if(removedKey == this.props.pageID){
					this.setState({status: ""});
				}
			});
		}
	},

	componentWillReceiveProps: function(nextProps){
		this.setState({currentUserID: nextProps.currentUserID});
		this.setState({pageID: nextProps.pageID});
		this.setState({isCurrentUser: nextProps.isCurrentUser});

		if(!nextProps.isCurrentUser){
			this.connectionRef = firebase.database().ref().child('connections/' + nextProps.currentUserID + '/' + nextProps.pageID);
			this.connectionRef.on("value", snap=>{
				var connection = snap.val();
				if(connection && connection.status){
					this.setState({status: connection.status});
				}
			});

			this.connectionRefUpdates = firebase.database().ref().child('connections/' + nextProps.currentUserID);
			this.connectionRefUpdates.on("child_removed", snap=>{
				var removedKey = snap.ref.key;
				if(removedKey == nextProps.pageID){
					this.setState({status: ""});
				}
			});
		}
	},

	componentWillUnmount: function(){
		this.connectionRef.off();
		this.connectionOtherRef.off();
		this.endorsementRef.off();
		this.endorsementOtherRef.off();
		this.connectionRefUpdates.off();
	},

	handleAddConnection: function(){
		var connectionUpdate = {};
		connectionUpdate['connections/' + this.state.currentUserID + '/' + this.state.pageID] = {status: "requested"}
		firebase.database().ref().update(connectionUpdate);

		var connectionOtherUpdate = {};
		connectionOtherUpdate['connections/' + this.state.pageID + '/' + this.state.currentUserID] = {status: "awaiting-acceptance"}
		firebase.database().ref().update(connectionOtherUpdate);
	},

	handleRemoveConnection: function(){
		var connectionRef = firebase.database().ref().child('connections/' + this.state.currentUserID + '/' + this.state.pageID);
		connectionRef.remove();

		var connectionOtherRef = firebase.database().ref().child('connections/' + this.state.pageID + '/' + this.state.currentUserID);
		connectionOtherRef.remove();
		
		var endorsementRef = firebase.database().ref().child('user-endorsement/' + this.state.pageID + '/' + this.state.currentUserID);
		endorsementRef.remove();
		
		var endorsementOtherRef = firebase.database().ref().child('user-endorsement/' + this.state.currentUserID + '/' + this.state.pageID);
		endorsementOtherRef.remove();
	},


	handleAcceptConnection: function(){
		var connectionUpdate = {};
		connectionUpdate['connections/' + this.state.currentUserID + '/' + this.state.pageID] = {status: "accepted"}
		firebase.database().ref().update(connectionUpdate);

		var connectionOtherUpdate = {};
		connectionOtherUpdate['connections/' + this.state.pageID + '/' + this.state.currentUserID] = {status: "accepted"}
		firebase.database().ref().update(connectionOtherUpdate);
	},

	showAccepted: function(){
		return (<button className='btn btn-danger' onClick={this.handleRemoveConnection}>Remove Connection</button>);
	},

	showRequested: function(){
		return(<button className='btn btn-danger' onClick={this.handleRemoveConnection}>Undo Request</button>);
	},

	showAwaitingAcceptance: function(){
		return(
			<div>
				<button className='btn btn-primary' onClick={this.handleAcceptConnection}>Accept Connection</button>
				<button className='btn btn-danger' onClick={this.handleRemoveConnection}>Delete Request</button>
			</div>
		);
	},

	showAdd: function(){
		return(<button className='btn btn-primary' onClick={this.handleAddConnection}>Add Connection</button>);
	},

	render: function(){
		var connectionButton;
		if(this.state.isCurrentUser){
			connectionButton = <div></div>; //can't add yourself of course.
		}else if(this.state.status == "accepted"){
			connectionButton = this.showAccepted();
		}else if(this.state.status == "requested"){
			connectionButton = this.showRequested();
		}else if(this.state.status == "awaiting-acceptance"){
			connectionButton = this.showAwaitingAcceptance();
		}
		else{//not connected
			connectionButton = this.showAdd();
		}

		return 	<div>
					{connectionButton}
				</div>;
	}
});

module.exports = Connection;