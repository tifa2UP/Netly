var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;
var DeleteAccount = require('./destroy.js');
var UpdatePassword = require('./updatePassword.js');

var AccountSettings = React.createClass({

	//initially, no submission errors
	getInitialState: function(){
		return{hasError: false, errorMsg: "", verified: false};
	},

	handleReauthenticate: function(){
		return this.state.verified;
	},

	handleTypeChanges: function(e){
		this.setState({hasError: false})
		this.setState({errorMsg: ""});
	},

	verifyPassword: function(e){
		var that = this;

		if(this.refs.current_password.value){
			var user = firebase.auth().currentUser;
			var credential = firebase.auth.EmailAuthProvider.credential(user.email, this.refs.current_password.value);
			user.reauthenticate(credential).then(function() {
				that.setState({hasError: false})
				that.setState({errorMsg: ""});
				that.setState({verified: true});
				that.setState({verificationMessage: "Your password has been verified!"});
			}, function(error) {
				that.setState({hasError: true});
				that.setState({errorMsg: "Your current password is incorrect."});
				that.setState({verified: false});
			});
		}else{
			this.setState({hasError: true});
			this.setState({errorMsg: "Please enter your current password"});
			this.setState({verified: false});
		}
	},

	//creates a div alert-danger with the error message
	errorMessage: function(){
		return <div className="alert alert-danger"><strong>Error! </strong>{this.state.errorMsg}</div>;
	},

	//creates an empty div if no error message
	noErrorMessage: function(){
		return <div className="alert alert-danger">Please verify your current password.</div>;
	},

	successMessage: function(){
		return <div className="alert alert-success"><strong>Success! </strong>{this.state.verificationMessage}</div>;
	},

	render: function(){

		//gets the appropriate error alert div depending on whether or not the form has an error
		var alert;
		if(this.state.hasError){
			alert = this.errorMessage();
		}else if(this.state.verified){
			alert = this.successMessage();
		}else{
			alert = this.noErrorMessage();
		}

		return(
			<div>
				{alert}

				<div className="col-md-4">
				</div>
				<div className="col-md-4">
					<center>
						<h1>Account Settings</h1><br />

						<input type="password" ref="current_password" placeholder="Current Password" className="form-control" onChange={this.handleTypeChanges}/><br />
						<button onClick={this.verifyPassword} className="btn btn-success">Verify Password</button><br />
						<br/>
						<UpdatePassword handleReauthenticate={this.handleReauthenticate} /><br />
						<DeleteAccount handleReauthenticate={this.handleReauthenticate} />
					</center>
				</div>
				<div className="col-md-4">
				</div>
			</div>
		);
	}
});

module.exports = AccountSettings;