var React = require('react');
var ReactDOM = require('react-dom');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var Results = React.createClass({
	getInitialState: function(){
		return {users: []}
	},

	componentWillReceiveProps: function(nextProps){
		this.state.users.splice(0, this.state.users.length);
		var userRef = firebase.database().ref().child('users').orderByChild('first').equalTo(nextProps.params.name);
        userRef.once('child_added', snap =>{
            var user = snap.val();
       	    user.id = snap.ref.key;
            var allUsers = this.state.users;
            allUsers.push(user);
            this.setState({users: allUsers});
        });
	},

	render: function(){
		var empty;
		if(this.state.users.length == 0){
			empty = <div>No results!</div>
		}else{
			empty = <div></div>
		}

		return(
			<div>
				{empty}
				{this.state.users.map((user,index) => (
					<div key={index}>
						<Link to={"users/"+ user.id}>{user.first}</Link>
					</div>
				))}
			</div>
		)
	}
});

module.exports = Results;