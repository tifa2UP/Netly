var React = require('react');
var ReactDOM = require('react-dom');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

//customize date for rendering
var dateTimeCustomization = {
    weekday: "long",  month: "short",
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
            this.state.replies.push(snap.val());
            this.setState({replies: this.state.replies});
        });
    },

    componentWillReceiveProps: function(nextProps){
        this.postReplyRef.off();
        this.state.replies.splice(0, this.state.replies.length);

        this.postReplyRef = firebase.database().ref('post-reply').child(nextProps.post_id);
        this.postReplyRef.on('child_added', snap=>{
            this.state.replies.push(snap.val());
            this.setState({replies: this.state.replies});
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
                        <Link to={"/users/"+reply.user_id}> {reply.user_name} </Link> on {(new Date(reply.post_time)).toLocaleTimeString("en-US", dateTimeCustomization)} <br/>
                        <blockquote>
                            "{reply.body}"<br />
                        </blockquote>
                    </div>
                ))}
                <input type="text" onKeyPress={this.handleKeyPress} ref="theReply" className="form-control" placeholder="Reply" id="reply"/>
                <button type="button" className="btn btn-primary" onClick={this.handlePostReply}>Submit</button>
            </div>
        )
    }
});

module.exports = Reply;
