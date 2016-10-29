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
		if(true){
			var user = firebase.auth().currentUser;

			if(confirm("Are you sure you want to delete your account?")){

				//TODO: user gets deleted before we unliked the posts... figure it out!
				//removes the user-likes from that user
				var userLikesRef = firebase.database().ref('/user-likes/' + user.uid);
				//finds the posts that the user liked

				userLikesRef.on('child_added', snap =>{
						var post_id = snap.ref.path.o[2];

						var postLikedRef = firebase.database().ref('posts/' + post_id);
						//decrement the likes of the user-likes posts
						postLikedRef.once('value', snap =>{
							var post = snap.val();
							post.likes-=1;
							var updates = {};
							updates['/posts/' + post_id] = post;
							updates['/user-posts/' + post.user_id + '/' + post_id] = post;
							firebase.database().ref().update(updates);
						});
					});
				setTimeout(function(){
					userLikesRef.remove();
				}.bind(this),1000);

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

				setTimeout(function() {
					user.delete().then(function(){
						//redirects to home after success
						hashHistory.push('/');

					}, function(error){
						console.log(error);
					});
				}.bind(this), 2000);
			}
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