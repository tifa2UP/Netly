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

		//only saves data if the post field isn't empty
		if(this.refs.body.value){
			//gathers the data from the post submission
			var postData = {
				user_id: firebase.auth().currentUser.uid,
				user_name: firebase.auth().currentUser.displayName,
				body: this.refs.body.value,
				created_at: firebase.database.ServerValue.TIMESTAMP,
				likes: 0
			};
		
			//generate new post reference key
			var postRefKey = firebase.database().ref().child('posts').push().key; 
			//sets the postData to the post child with the postRefKey
			firebase.database().ref('posts/' + postRefKey).set(postData);
			//sets the postData to the user-posts child with the currentUserId & the postRefKey
			firebase.database().ref('/user-posts/' + firebase.auth().currentUser.uid + '/' + postRefKey).set(postData);

			//refreshes pages after submission
			hashHistory.push("/");

			//emptys the post text field
			this.refs.body.value = "";
		}
	},

	//likes the post if the user hasn't liked it yet, unlikes it if already liked
	handleLike: function(post){
		//gets the ref of the user-likes to see if user has liked this post yet
		if(post.user_id != firebase.auth().currentUser.uid){
			var ref = firebase.database().ref('/user-likes/' + firebase.auth().currentUser.uid + '/' + post.post_id);
			ref.once('value', snap =>{

				//check if this data exists, and if it does, check if the user liked it
				if(snap.val() && snap.val().liked){
					
					//if user already liked this post, remove the user-likes reference
					var userLikesRef = firebase.database().ref('user-likes/' + firebase.auth().currentUser.uid + '/' + post.post_id);
					userLikesRef.remove();

					//decrementing likes of post
					post.likes-=1;
				}else{
					//if user hasn't yet liked this post, like it
					var likeUpdate = {};
					likeUpdate['/user-likes/' + firebase.auth().currentUser.uid + '/' + post.post_id] = {liked: true}
					firebase.database().ref().update(likeUpdate);

					//incrementing likes of post
					post.likes+=1;
				}

				var anotherPost = JSON.parse(JSON.stringify(post)); //copies contents of post into anotherPost
				delete anotherPost.post_id; //remove the post_id property in anotherPost -- we don't want to create an unnecessary post_id property in the post database

				//updates all the data in the posts ref and user-post ref
				var updates = {};
				updates['/posts/' + post.post_id] = anotherPost;
				updates['/user-posts/' + post.user_id + '/' + post.post_id] = anotherPost;
				firebase.database().ref().update(updates);

				//refreshes the page after like
				hashHistory.push("/");
			});
		}
	},

	//loading all posts into the state's postArray
	componentWillMount: function(){
		//gets the post reference
		var postsRef = firebase.database().ref().child('posts');
		//for each child added to post, push to postArray
		postsRef.on("child_added", snap => {
			var post = snap.val();
			var newPostWithId = {
				user_id: post.user_id,
				user_name: post.user_name,
				body: post.body,
				created_at: post.created_at,
				likes: post.likes,
				post_id: snap.ref.path.o[1]
			};
			this.state.postArray.push(newPostWithId);

			//refreshes page when the posts are pushed into the array, so it shows without manually refreshing
			hashHistory.push('/');
		});

		//gets the post reference
		var postsRef = firebase.database().ref().child('posts');
		//for each child changed to post, replace that post with the post already in postArray
		postsRef.on("child_changed", snap => {
			var post = snap.val();
			var updatedPost = {
				user_id: post.user_id,
				user_name: post.user_name,
				body: post.body,
				created_at: post.created_at,
				likes: post.likes,
				post_id: snap.ref.path.o[1]
			};
			var index;
			for(var i = 0; i < this.state.postArray.length; i++){
				if(this.state.postArray[i].post_id == updatedPost.post_id){
					index = i;
				}
			}

			this.state.postArray.splice(index, 1, updatedPost);
			//refreshes page when the posts are pushed into the array, so it shows without manually refreshing
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
		//reverse the order so that the newest posts are at the top of the array
		var reversedPost = Array.prototype.slice.call(this.state.postArray);
		reversedPost.reverse();

		//customize date for rendering
		var dateTimeCustomization = {
   		 	weekday: "long", year: "numeric", month: "short",
    		day: "numeric", hour: "2-digit", minute: "2-digit"
		}

		return (
			<div>
				<h1>Connection Feed</h1><br />
				<input type="text" ref="body" placeholder="What are you thinking about?" onKeyPress={this.handleKeyPress} className="form-control"/><br />
				<center><button className="btn btn-primary" onClick={this.handlePost}>Post</button></center><br />	
				{reversedPost.map((post,index) => (
        			<div key={index}>
        				On {(new Date(post.created_at)).toLocaleTimeString("en-US", dateTimeCustomization)}, <Link to={"/users/"+post.user_id}>{post.user_name}</Link> said 
        				<blockquote>
        					"{post.body}"<br />
        					<button className="btn btn-default" onClick={this.handleLike.bind(null, post)}><span className="glyphicon glyphicon-thumbs-up"></span> ({post.likes})</button>
        				</blockquote>
        			</div>
   				))}
			</div>
		);
	}
});

module.exports = Home;