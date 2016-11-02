var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var AllConnections = React.createClass({
	getInitialState: function(){
		return {
			currentUserID: "",
			connections: []
		}
	},

	componentWillMount: function(){
		var that = this;
		this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
			this.setState({currentUserID: user.uid});

			//gets the connections whose status is accepted
			this.connectionRef = firebase.database().ref().child('connections/' + this.state.currentUserID).orderByChild('status').equalTo('accepted');
			this.connectionRef.on("child_added", snap=>{
				var connectionID = snap.ref.key;
				this.otherConnectionRef = firebase.database().ref().child('users/' + connectionID);
				this.otherConnectionRef.once("value", snap=>{
					var userData = snap.val();
					var userInfo = {
						first: userData.first,
						last: userData.last,
						user_id: snap.ref.key,
						imageURL: userData.imageURL,
					};
					var updatedConnections = that.state.connections.slice();
	                updatedConnections.push(userInfo);
	                that.setState({connections: updatedConnections});
				});
			});

			//if status was updated, remove from array of connections
			this.connectionRefUpdates = firebase.database().ref().child('connections/' + this.state.currentUserID);
			this.connectionRefUpdates.on("child_changed", snap=>{
				var userChangedKey = snap.ref.key;
				var index = -1;
				for(var i = 0; i < this.state.connections.length; i++){
					if(this.state.connections[i].user_id == userChangedKey){
						index = i;
					}
				}

				if(index > -1){
					var updatedConnections = this.state.connections.slice();
		            updatedConnections.splice(index, 1);
		            this.setState({connections: updatedConnections});
	        	}
			});

			//if rejected acceptance, remove from array of connections
			this.connectionRefUpdates.on("child_removed", snap=>{
				var userChangedKey = snap.ref.key;
				var index = -1;
				for(var i = 0; i < this.state.connections.length; i++){
					if(this.state.connections[i].user_id == userChangedKey){
						index = i;
					}
				}

				if(index > -1){
					var updatedConnections = this.state.connections.slice();
		            updatedConnections.splice(index, 1);
		            this.setState({connections: updatedConnections});
	        	}
			});
		});
	},

	componentWillUnmount: function(){
		if(this.otherConnectionRef){
			this.otherConnectionRef.off();
		}
		this.connectionRef.off();
		this.connectionRefUpdates.off();
		this.unsubscribe();
	},

	render: function(){
		var showConnections;
		if(this.state.connections.length == 0){
			showConnections = <div><center>You currently have no connections. Add some!</center></div>
		}else{
			showConnections = 
				this.state.connections.map((user,index) => (
        			<div key={index}>
       					<Link to={"users/" + user.user_id}><img src={user.imageURL} className="img-circle" alt="" width="50" height="50" style={{objectFit: 'cover'}}/> 
       					{user.first + " " + user.last}</Link>
        				<br /><br />
        			</div>
   				))
		}

		return(
			<div>
				<center><h1>Connections</h1></center>
				{showConnections}
			</div>
		);
	}
});

module.exports = AllConnections;