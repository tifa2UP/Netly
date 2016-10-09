var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var DeleteAccount = React.createClass({

	//initially, no submission errors
	getInitialState: function(){
		return{hasError: false, succeeded: false, errorMsg: "", successMsg: ""};
	},

	handleDestroy: function(){
		var user = firebase.auth().currentUser;

		if(confirm("Are you sure you want to delete your account?")){

			user.delete().then(function(){

				//removes the posts that belong to the current user
				var postsRef = firebase.database().ref().child('posts').orderByChild('user_id').equalTo(user.uid);
				postsRef.on('child_added', snap =>{
					var post = snap.ref.remove();
				});

				//removes the user-posts from that user
				var userPostsRef = firebase.database().ref('/user-posts/' + user.uid);
				userPostsRef.remove();

				//removes the user from the database
				var userRef = firebase.database().ref('users/' + user.uid);
				userRef.remove();

				//redirects to home after success
				hashHistory.push('/');

			}, function(error){
				console.log(error);
			});
		}
	},

	render: function(){
		return (
			<div>
				<h3 style={{color:'red'}}>Danger Zone</h3>
						
				<button onClick={this.handleDestroy} className="btn btn-danger">Delete Account</button><br />
			</div>
		);
	}
});

module.exports = DeleteAccount;