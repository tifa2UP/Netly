var React = require('react');
var ReactDOM = require('react-dom');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var Results = React.createClass({
	getInitialState: function(){
		return {users: [], prop_name: ""}
	},

	componentWillMount: function(){
		this.state.users.splice(0, this.state.users.length);
		this.setState({prop_name: this.props.params.name}); //to make sure we don't head over to compWillReceiveProps with the same prop name

		this.userRef = firebase.database().ref().child('users').orderByChild('first').equalTo(this.props.params.name);
        this.userRef.on('child_added', snap =>{
            var user = snap.val();
       	    user.id = snap.ref.key;
       	    this.state.users.push(user);
            this.setState({users: this.state.users});
        });
	},

	componentWillReceiveProps: function(nextProps){
		if(this.state.prop_name != nextProps.params.name){
			this.setState({prop_name: nextProps.params.name}); //to make sure we don't go through the compWillReceiveProps function twice

			this.state.users.splice(0, this.state.users.length);
			this.userRef = firebase.database().ref().child('users').orderByChild('first').equalTo(nextProps.params.name);
		    this.userRef.on('child_added', snap =>{
		        var user = snap.val();
		       	user.id = snap.ref.key;
		       	this.state.users.push(user);
		       	this.setState({users: this.state.users});
		    });
		}
	},

	componentWillUnmount: function(){
		this.userRef.off();
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