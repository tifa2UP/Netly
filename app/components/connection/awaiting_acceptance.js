var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var AwaitingAcceptance = React.createClass({
	getInitialState: function(){
		return {
			currentUserID: "",
			requesters: []
		}
	},

	componentWillMount: function(){
		var that = this;
		this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
			this.setState({currentUserID: user.uid});

			//get connections whose status is awaiting acceptance
			var connectionRef = firebase.database().ref().child('connections/' + this.state.currentUserID).orderByChild('status').equalTo('awaiting-acceptance');
			connectionRef.on("child_added", snap=>{
				var requesterID = snap.ref.key;
				var requesterRef = firebase.database().ref().child('users/' + requesterID);
				requesterRef.once("value", snap=>{
					var userData = snap.val();
					var userInfo = {
						first: userData.first,
						last: userData.last,
						hasProfileImage: userData.hasProfileImage,
						user_id: snap.ref.key,
						url: "",
					};

					//gets the user's profile image url & updates the state
					if(userInfo.hasProfileImage){
	                    var userImageRef = firebase.storage().ref().child('images/users/' + userInfo.user_id + '/profilepic.jpg');
	                    userImageRef.getDownloadURL().then(function(url){
	                        userInfo.url = url;
	                        var updatedRequesters = Array.prototype.slice.call(that.state.requesters);
	                        updatedRequesters.push(userInfo);
	                        that.setState({requesters: updatedRequesters});
	                    }).catch(function(error){
	                        var defaultRef = firebase.storage().ref().child('images/' + 'default.jpg');
	                        defaultRef.getDownloadURL().then(function(url){
	                        	userInfo.url = url;
	                        	var updatedRequesters = that.state.requesters.slice();
	                        	updatedRequesters.push(userInfo);
	                        	that.setState({requesters: updatedRequesters});
	                        });
	                    });
	                }else{
	                    var defaultRef = firebase.storage().ref().child('images/' + 'default.jpg');
	                    defaultRef.getDownloadURL().then(function(url){
	                        userInfo.url = url;
	                        var updatedRequesters = that.state.requesters.slice();
	                        updatedRequesters.push(userInfo);
	                        that.setState({requesters: updatedRequesters});
	                    });
	                }

				});
			});

			//if status was updated, remove from array of requesters
			var connectionRef = firebase.database().ref().child('connections/' + this.state.currentUserID);
			connectionRef.on("child_changed", snap=>{
				var userChangedKey = snap.ref.key;
				var index = -1;
				for(var i = 0; i < this.state.requesters.length; i++){
					if(this.state.requesters[i].user_id == userChangedKey){
						index = i;
					}
				}

				if(index > -1){
					var updatedRequesters = this.state.requesters.slice();
		            updatedRequesters.splice(index, 1);
		            this.setState({requesters: updatedRequesters});
	        	}
			});

			//if rejected acceptance, remove from array of requesters
			var connectionRef = firebase.database().ref().child('connections/' + this.state.currentUserID);
			connectionRef.on("child_removed", snap=>{
				var userChangedKey = snap.ref.key;
				var index = -1;
				for(var i = 0; i < this.state.requesters.length; i++){
					if(this.state.requesters[i].user_id == userChangedKey){
						index = i;
					}
				}

				if(index > -1){
					var updatedRequesters = this.state.requesters.slice();
		            updatedRequesters.splice(index, 1);
		            this.setState({requesters: updatedRequesters});
	        	}
			});
		});
	},

	componentWillUnmount: function(){
		this.unsubscribe();
	},

	//update the connection status to accepted
	handleAcceptConnection: function(user){
		var connectionUpdate = {};
		connectionUpdate['connections/' + this.state.currentUserID + '/' + user.user_id] = {status: "accepted"}
		firebase.database().ref().update(connectionUpdate);

		var connectionOtherUpdate = {};
		connectionOtherUpdate['connections/' + user.user_id + '/' + this.state.currentUserID] = {status: "accepted"}
		firebase.database().ref().update(connectionOtherUpdate);
	},

	//remove the connection
	handleRemoveConnection: function(user){
		var connectionRef = firebase.database().ref().child('connections/' + this.state.currentUserID + '/' + user.user_id);
		connectionRef.remove();

		var connectionOtherRef = firebase.database().ref().child('connections/' + user.user_id + '/' + this.state.currentUserID);
		connectionOtherRef.remove();
	},

	//show the accept & delete request buttons
	showAwaitingAcceptance: function(user){
		return(
			<div>
				<button className='btn btn-default' onClick={this.handleAcceptConnection.bind(null, user)}>Accept Connection</button>
				<button className='btn btn-default' onClick={this.handleRemoveConnection.bind(null, user)}>Delete Request</button>
			</div>
		);
	},

	render: function(){
		var showRequests;
		if(this.state.requesters.length == 0){
			showRequests = <div><center>No new requests!</center></div>
		}else{
			showRequests = 
				this.state.requesters.map((user,index) => (
        			<div key={index}>
       					<Link to={"users/" + user.user_id}><img src={user.url} className="img-circle" alt="" width="50" height="50" style={{objectFit: 'cover'}}/> 
       					{user.first + " " + user.last}</Link>
        				{this.showAwaitingAcceptance(user)}
        				<br />
        			</div>
   				))
		}

		return(
			<div>
				<center><h1>Requests</h1></center>
				{showRequests}
			</div>
		);
	}
});

module.exports = AwaitingAcceptance;