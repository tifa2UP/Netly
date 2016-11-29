var React = require('react');
var ReactDOM = require('react-dom');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

//customize date for rendering
var dateTimeCustomization = {
    year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
}

var Reply = React.createClass({
    getInitialState: function(){
        return {replies: []}
    },
    //just to check if the user presses "Enter" while typing in a text field so that it acts as if he/she clicked "Post"
    handleKeyPress: function(e){
        if(e.key == 'Enter'){
            try{
                this.handlePostReply();
            }
            catch(e){};
        }
    },

    componentWillMount: function(){
        this.setState({post_id: this.props.post_id});
        this.postReplyRef = firebase.database().ref('post-reply').child(this.props.post_id).orderByChild("post_time");
        this.postReplyRef.on('child_added', snap=>{
            var replyInfo = snap.val();
            replyInfo.reply_id = snap.ref.key;
            replyInfo.user_imgurl = "https://firebasestorage.googleapis.com/v0/b/testingproject-cd660.appspot.com/o/images%2Fdefault.jpg?alt=media&token=23d9c5ea-1380-4bd2-94bc-1166a83953b7";

            this.state.replies.push(replyInfo);
            this.setState({replies: this.state.replies});

            var userRef = firebase.database().ref('users/'+ replyInfo.user_id);
            userRef.once('value', snap=>{
                replyInfo.user_imgurl = snap.val().imageURL;

                var index = -1;
                for(var i = 0; i < this.state.replies.length; i++){
                    if(this.state.replies[i].reply_id == replyInfo.reply_id){
                        index = i;
                    }
                }

                this.state.replies.splice(index, 1, replyInfo);
                this.setState({replies: this.state.replies});
            });
        });
    },

    componentWillReceiveProps: function(nextProps){
        if(this.state.post_id != nextProps.post_id){
            
            this.setState({post_id: nextProps.post_id});
            this.postReplyRef.off();
            this.state.replies.splice(0, this.state.replies.length);

            this.postReplyRef = firebase.database().ref('post-reply').child(nextProps.post_id).orderByChild("post_time");
            this.postReplyRef.on('child_added', snap=>{
                var replyInfo = snap.val();
                replyInfo.reply_id = snap.ref.key;
                replyInfo.user_imgurl = "https://firebasestorage.googleapis.com/v0/b/testingproject-cd660.appspot.com/o/images%2Fdefault.jpg?alt=media&token=23d9c5ea-1380-4bd2-94bc-1166a83953b7";

                this.state.replies.push(replyInfo);
                this.setState({replies: this.state.replies});

                var userRef = firebase.database().ref('users/'+ replyInfo.user_id);
                userRef.once('value', snap=>{
                    replyInfo.user_imgurl = snap.val().imageURL;

                    var index = -1;
                    for(var i = 0; i < this.state.replies.length; i++){
                        if(this.state.replies[i].reply_id == replyInfo.reply_id){
                            index = i;
                        }
                    }

                    this.state.replies.splice(index, 1, replyInfo);
                    this.setState({replies: this.state.replies});
                });
            });
        }
    },

    handlePostReply: function(){
        if(this.refs.theReply.value){
            var postReplyKey = firebase.database().ref().child('reply').push().key;
            var reply = {
                post_id: this.props.post_id,
                user_name: this.props.username,
                user_id: firebase.auth().currentUser.uid,
                body: this.refs.theReply.value,
                post_time: firebase.database.ServerValue.TIMESTAMP
            };

            firebase.database().ref('post-reply/' + this.props.post_id + "/" + postReplyKey).set(reply);

            this.refs.theReply.value ="";
        }
    },

    componentWillUnmount: function(){
        this.postReplyRef.off();
    },

    render: function(){
        return(
            <div className="replies">
                {this.state.replies.map((reply,index) => (
                    <div key={index}>
                        <div className="reply">
                            <table>
                                <tbody>
                                <tr>
                                    <td rowSpan='2' style={{padding: '0 5px 0 0'}}>
                                        <Link to={"/users/"+reply.user_id}><img src={reply.user_imgurl} width="50" height="50" style={{objectFit: 'cover'}}/></Link>
                                    </td>
                                    <td style={{padding: '0 0 0 5px'}}>
                                        <Link to={"/users/"+reply.user_id}> {reply.user_name}</Link>
                                    </td>
                                </tr>

                                <tr>
                                    <td  width="95%" style={{padding: '0 0 0 5px'}}>
                                        {reply.body} <span className="reply-time"> {(new Date(reply.post_time)).toLocaleTimeString("en-US", dateTimeCustomization)} </span>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}
                <input type="text" onKeyPress={this.handleKeyPress} ref="theReply" className="form-control" placeholder="Reply to post..." id="reply"/>
            </div>
        )
    }
});

module.exports = Reply;
