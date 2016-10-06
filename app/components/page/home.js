var React = require('react');
var ReactDOM = require('react-dom');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var Home = React.createClass({

	//initializes the postArray
	getInitialState: function(){
		return {postArray: []};
	},

	//adds the new post to the database upon clicking Post
	handlePost: function(){
		if(this.refs.body.value){
			var postData = {
				user_id: firebase.auth().currentUser.uid,
				user_name: firebase.auth().currentUser.displayName,
				body: this.refs.body.value,
				created_at: firebase.database.ServerValue.TIMESTAMP
			};
		
			var postRefKey = firebase.database().ref().child('posts').push().key;
			firebase.database().ref('posts/' + postRefKey).set(postData);
			firebase.database().ref('/user-posts/' + firebase.auth().currentUser.uid + '/' + postRefKey).set(postData);

			//refreshes pages after submission
			hashHistory.push("/");

			//emptys the post text field
			this.refs.body.value = "";
		}
	},

	//loading all posts into the state's postArray
	componentWillMount: function(){
		var recentPostsRef = firebase.database().ref().child('posts');
		recentPostsRef.on("child_added", snap => {
			var post = snap.val();
			this.state.postArray.push(post);
			//refreshes page when the posts are pushed into the array
			hashHistory.push('/');
		});
	},

	//just to check if the user presses "Enter" while typing in a text field so that it acts as if he/she clicked "Post"
	handleKeyPress: function(e){
		if(e.key == 'Enter'){
			try{
				this.handlePost();
			}
			catch(e){};
		}
	},

	render: function(){
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
        			<div key={index}>
        				On {(new Date(post.created_at)).toLocaleTimeString("en-US", dateTimeCustomization)}, {post.user_name} said <blockquote>"{post.body}"</blockquote>
        			</div>
   				))}
			</div>
		);
	}
});

module.exports = Home;