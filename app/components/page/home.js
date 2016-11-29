var React = require('react');
var ReactDOM = require('react-dom');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;
var Reply = require('./reply.js');

var Home = React.createClass({

    //initializes the postArray
    getInitialState: function(){
        return {postArray: [], username: ""};
    },

    //loading all posts into the state's postArray
    componentWillMount: function(){
        var that = this;
        //gets the post reference
        this.postsRef = firebase.database().ref().child('posts').orderByChild("created_at");
        //for each child added to post, push to postArray

        this.unsubscribe = firebase.auth().onAuthStateChanged(user =>{
            if(user){
                this.userRef = firebase.database().ref('users').child(firebase.auth().currentUser.uid);
                this.userRef.on("value", snap=>{
                    this.setState({username: snap.val().first + " " + snap.val().last});
                });
            }
        });

        this.postsRef.on("child_added", snap => {
            var post = snap.val();
            post.post_id = snap.ref.key;
            post.user_imgurl = "https://firebasestorage.googleapis.com/v0/b/testingproject-cd660.appspot.com/o/images%2Fdefault.jpg?alt=media&token=23d9c5ea-1380-4bd2-94bc-1166a83953b7";

            var updatedPostArray = this.state.postArray;
            updatedPostArray.push(post);
            this.setState({postArray : updatedPostArray});

            var userRef = firebase.database().ref('users/'+ post.user_id);
            userRef.once('value', snap=>{

                post.user_imgurl = snap.val().imageURL;

                var index = -1;
                for(var i = 0; i < this.state.postArray.length; i++){
                    if(this.state.postArray[i].post_id == post.post_id){
                        index = i;
                    }
                }

                var updatedPostArray = this.state.postArray;
                updatedPostArray.splice(index, 1, post);
                this.setState({postArray: updatedPostArray});
            });
        });

        //for each child changed to post, replace that post with the post already in postArray
        this.postsRef.on("child_changed", snap => {
            var post = snap.val();
            post.post_id = snap.ref.key;

            var userRef = firebase.database().ref('users/'+ post.user_id);
            userRef.once('value', snap=>{

                post.user_imgurl = snap.val().imageURL;

                var index;
                for(var i = 0; i < this.state.postArray.length; i++){
                    if(this.state.postArray[i].post_id == post.post_id){
                        index = i;
                    }
                }

                var updatedPostArray = this.state.postArray;
                updatedPostArray.splice(index, 1, post);
                this.setState({postArray: updatedPostArray});
            });
        });
    },

    componentWillUnmount: function(){
        this.postsRef.off();
    },

    //adds the new post to the database upon clicking Post
    handlePost: function(){

        //only saves data if the post field isn't empty
        if(this.refs.body.value){
            //gathers the data from the post submission
            var postData = {
                user_id: firebase.auth().currentUser.uid,
                user_name: this.state.username,
                body: this.refs.body.value,
                created_at: firebase.database.ServerValue.TIMESTAMP,
                replies: [],
                likes: 0
            };

            //generate new post reference key
            var postRefKey = firebase.database().ref().child('posts').push().key;
            //sets the postData to the post child with the postRefKey
            firebase.database().ref('posts/' + postRefKey).set(postData);
            //sets the postData to the user-posts child with the currentUserId & the postRefKey
            firebase.database().ref('/user-posts/' + firebase.auth().currentUser.uid + '/' + postRefKey).set(postData);

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
                    post.likes += 1;
                }

                var anotherPost = JSON.parse(JSON.stringify(post)); //copies contents of post into anotherPost
                delete anotherPost.post_id; //remove the post_id property in anotherPost -- we don't want to create an unnecessary post_id property in the post database

                //updates all the data in the posts ref and user-post ref
                var updates = {};
                updates['/posts/' + post.post_id] = anotherPost;
                updates['/user-posts/' + post.user_id + '/' + post.post_id] = anotherPost;
                firebase.database().ref().update(updates);
            });
        }
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
            year: "numeric", month: "short",
            day: "numeric", hour: "2-digit", minute: "2-digit"
        }

        return (
            <div>
                <center><h1>Connection Feed</h1></center><br />
                <div className="update-post-container">
                    <input type="text" ref="body" placeholder="What are you thinking about?" onKeyPress={this.handleKeyPress} className="form-control update-post"/><br />
                </div>
                {reversedPost.map((post,index) => (
                    <div key={index} className="post">
                        <table>
                            <tbody>
                            <tr>
                                <td rowSpan='2' style={{padding: '0 5px 0 0'}}>
                                    <Link to={"/users/"+post.user_id}><img src={post.user_imgurl} width="80" height="80" style={{objectFit: 'cover'}}/></Link>
                                </td>
                                <td className="post-username" style={{padding: '0 0 0 5px', verticalAlign: 'bottom'}}>
                                    <Link to={"/users/"+post.user_id}>{post.user_name}</Link>
                                </td>
                            </tr>

                            <tr>
                                <td style={{padding: '0 0 0 5px', color: '#9f9f9f', verticalAlign: 'top'}}>
                                    {(new Date(post.created_at)).toLocaleTimeString("en-US", dateTimeCustomization)}
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <blockquote>
                            {post.body}<br/>
                            <button className="btn btn-default" onClick={this.handleLike.bind(null, post)}><span className="glyphicon glyphicon-thumbs-up"></span> ({post.likes})</button>
                        </blockquote>
                        <hr/>
                        <Reply post_id={post.post_id} username={this.state.username}/>
                    </div>
                ))}
            </div>
        );
    }
});

module.exports = Home;