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
					if(userData){
						var userInfo = {
							first: userData.first,
							last: userData.last,
							user_id: snap.ref.key,
							imageURL: userData.imageURL,
						};
						var updatedConnections = that.state.connections.slice();
		                updatedConnections.push(userInfo);
		                that.setState({connections: updatedConnections});
					}
				});
			});

			//if status was updated, remove from array of connections
			this.connectionRefUpdate = firebase.database().ref().child('connections/' + this.state.currentUserID);
			this.connectionRefUpdate.on("child_changed", snap=>{
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
			this.connectionRefUpdate.on("child_removed", snap=>{
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
		this.connectionRef.off();
		this.connectionRefUpdate.off();
		this.unsubscribe();
	},

	render: function(){
		var showConnections;
		if(this.state.connections.length == 0){
			showConnections = <div><center>You currently have no connections. Add some!</center></div>
		}else{
			showConnections = 
				this.state.connections.map((user,index) => (
        			<div className="col-md-3 grid-item" key={index}>
       					<Link to={"users/" + user.user_id}><h4><img src={user.imageURL} className="grid-img img-circle" alt="" width="100" height="100" style={{objectFit: 'cover', }}/><br/>
       					{user.first + " " + user.last}</h4></Link>
        				<br /><br />
        			</div>
   				))
		}

		return(
			<div>
				<center><h1 className="grid-title">Connections</h1></center>
				{showConnections}
			</div>
		);
	}
});

module.exports = AllConnections;