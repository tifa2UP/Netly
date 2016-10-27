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
		firebase.auth().onAuthStateChanged((user) => {
			this.setState({currentUserID: user.uid});
			var connectionRef = firebase.database().ref().child('connections/' + this.state.currentUserID).orderByChild('status').equalTo('accepted');
			connectionRef.on("child_added", snap=>{
				var connectionID = snap.ref.key;
				var connectionRef = firebase.database().ref().child('users/' + connectionID);
				connectionRef.on("value", snap=>{
					var userData = snap.val();
					var userInfo = {
						first: userData.first,
						last: userData.last,
						hasProfileImage: userData.hasProfileImage,
						user_id: snap.ref.key,
						url: "",
					};
					if(userInfo.hasProfileImage){
	                    var userImageRef = firebase.storage().ref().child('images/users/' + userInfo.user_id + '/profilepic.jpg');
	                    userImageRef.getDownloadURL().then(function(url){
	                        userInfo.url = url;
	                        var updatedConnections = that.state.connections.slice();
	                        updatedConnections.push(userInfo);
	                        that.setState({connections: updatedConnections});
	                    }).catch(function(error){
	                        var defaultRef = firebase.storage().ref().child('images/' + 'default.jpg');
	                        defaultRef.getDownloadURL().then(function(url){
	                        	userInfo.url = url;
	                        	var updatedConnections = that.state.connections.slice();
	                        	updatedConnections.push(userInfo);
	                        	that.setState({connections: updatedConnections});
	                        });
	                    });
	                }else{
	                    var defaultRef = firebase.storage().ref().child('images/' + 'default.jpg');
	                    defaultRef.getDownloadURL().then(function(url){
	                        userInfo.url = url;
	                        var updatedConnections = that.state.connections.slice();
	                        updatedConnections.push(userInfo);
	                        that.setState({connections: updatedConnections});
	                    });
	                }
				});
			});

			//if status was updated, remove from array of connections
			var connectionRef = firebase.database().ref().child('connections/' + this.state.currentUserID);
			connectionRef.on("child_changed", snap=>{
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
			var connectionRef = firebase.database().ref().child('connections/' + this.state.currentUserID);
			connectionRef.on("child_removed", snap=>{
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

	render: function(){
		var showConnections;
		if(this.state.connections.length == 0){
			showConnections = <div><center>You currently have no connections. Add some!</center></div>
		}else{
			showConnections = 
				this.state.connections.map((user,index) => (
        			<div key={index}>
       					<Link to={"users/" + user.user_id}><img src={user.url} className="img-circle" alt="" width="50" height="50" style={{objectFit: 'cover'}}/> 
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