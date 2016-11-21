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
        this.postReplyRef = firebase.database().ref('post-reply').child(this.props.post_id);
        this.postReplyRef.on('child_added', snap=>{
            var replyInfo = snap.val();

            var userRef = firebase.database().ref('users/'+ replyInfo.user_id);
            userRef.once('value', snap=>{
                replyInfo.user_imgurl = snap.val().imageURL;
                this.state.replies.push(replyInfo);
                this.setState({replies: this.state.replies});
            });
        });
    },

    componentWillReceiveProps: function(nextProps){
        this.postReplyRef.off();
        this.state.replies.splice(0, this.state.replies.length);

        this.postReplyRef = firebase.database().ref('post-reply').child(nextProps.post_id);
        this.postReplyRef.on('child_added', snap=>{
            var replyInfo = snap.val();

            var userRef = firebase.database().ref('users/'+ replyInfo.user_id);
            userRef.once('value', snap=>{
                replyInfo.user_imgurl = snap.val().imageURL;
                this.state.replies.push(replyInfo);
                this.setState({replies: this.state.replies});
            });
        });
    },

    handlePostReply: function(){
        var postReplyKey = firebase.database().ref().child('reply').push().key;
        var reply = {
            post_id: this.props.post_id,
            user_name: firebase.auth().currentUser.displayName,
            user_id: firebase.auth().currentUser.uid,
            body: this.refs.theReply.value,
            post_time: firebase.database.ServerValue.TIMESTAMP
        };

        firebase.database().ref('post-reply/' + this.props.post_id + "/" + postReplyKey).set(reply);

        this.refs.theReply.value ="";
    },

    render: function(){
        return(
            <div className="replies">
                {this.state.replies.map((reply,index) => (
                    <div key={index}>
                        <table>
                            <tbody>
                                <tr>
                                    <td rowSpan='2' style={{padding: '0 5px 0 0'}}>
                                        <img src={reply.user_imgurl} width="50" height="50" style={{objectFit: 'cover'}}/>
                                    </td>
                                    <td style={{padding: '0 0 0 5px'}}>
                                        <Link to={"/users/"+reply.user_id}> {reply.user_name}</Link>
                                    </td>
                                </tr>

                                <tr>
                                    <td style={{padding: '0 0 0 5px'}}>
                                        {(new Date(reply.post_time)).toLocaleTimeString("en-US", dateTimeCustomization)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <blockquote>
                            "{reply.body}"<br />
                        </blockquote>
                    </div>
                ))}
                <input type="text" onKeyPress={this.handleKeyPress} ref="theReply" className="form-control" placeholder="Reply to post..." id="reply"/>
            </div>
        )
    }
});

module.exports = Reply;
