var React = require('react');
var ReactDOM = require('react-dom');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var Status = React.createClass({
	getInitialState: function(){
		console.log("in initialize");
		return {postArray: []};
	},

	handlePost: function(){
		var postData = {
			user_id: firebase.auth().currentUser.uid,
			body: this.refs.body.value,
			created_at: firebase.database.ServerValue.TIMESTAMP
		};

		var postRefKey = firebase.database().ref().child('posts').push().key;
		firebase.database().ref('posts/' + postRefKey).set(postData);
		firebase.database().ref('/user-posts/' + firebase.auth().currentUser.uid + '/' + postRefKey).set(postData);
		hashHistory.push("/");

		console.log("in handlePost");
	},

	componentWillMount: function(){
		var recentPostsRef = firebase.database().ref().child('posts');
		recentPostsRef.on("child_added", snap => {
			var post = snap.val();
			this.state.postArray.push(post);
		});

		console.log("in componentWillMount");
		console.log(this.state.postArray.length);
	},

	handleKeyPress: function(e){
		if(e.key == 'Enter'){
			try{
				this.handlePost();
			}
			catch(e){};
		}
	},

	getNameOfUser: function(id){
		var name;

		var userRef = firebase.database().ref('users/' + id);
		userRef.on("value", snap => {
			var data = snap.val();
			name = data.first + " " + data.last;
			console.log(name);
		});

		return name;
	},

	render: function(){
		console.log("in render");

		//reverse the order so it goes from last post added to the earliest post added
		var reversedPost = Array.prototype.slice.call(this.state.postArray);
		reversedPost.reverse();

		//customize date for rendering
		var dateTimeCustomization = {
   		 	weekday: "long", year: "numeric", month: "short",
    		day: "numeric", hour: "2-digit", minute: "2-digit"
		}

		return (
			<div>
				<h1>Connection Feed</h1>
				<input type="text" ref="body" placeholder="What are you thinking about?" onKeyPress={this.handleKeyPress} className="form-control"/><br />
				<center><button className="btn btn-primary" onClick={this.handlePost}>Post</button></center><br />	
				{reversedPost.map((post,index) => (
        			<li key={index}>On {(new Date(post.created_at)).toLocaleTimeString("en-US", dateTimeCustomization)}, {this.getNameOfUser(post.user_id)} <blockquote>"{post.body}"</blockquote></li>
   				))}
			</div>
		);
	}
});

module.exports = Status;