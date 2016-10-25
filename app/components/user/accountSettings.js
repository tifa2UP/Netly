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

	verifyPassword: function(e){
		var that = this;

		if(this.refs.current_password.value){
			var user = firebase.auth().currentUser;
			var credential = firebase.auth.EmailAuthProvider.credential(user.email, this.refs.current_password.value);
			user.reauthenticate(credential).then(function(){
				hashHistory.push('/accountsettings/2');
			}).catch(function(error){
				//handle error
			});
		}
	},

	//creates an empty div if no error message
	enterPasswordAlert: function(){
		return <div className="alert alert-danger">Please enter your current password before proceeding.{this.state.verificationMessage}</div>;;
	},

	successAlert: function(){
		return <div className="alert alert-success"><strong>Success! </strong>{this.state.verificationMessage}</div>;
	},

	render: function(){

		//gets the appropriate error alert div depending on whether or not the form has an error
		var alert;
		if(this.state.verified){
			alert = this.successAlert();
		}else{
			alert = this.enterPasswordAlert();
		}

		return(
			<div>
				{alert}

				<div className="col-md-4">
				</div>
				<div className="col-md-4">
					<center>
						<h1>Account Settings</h1><br />
						
						<input type="password" ref="current_password" placeholder="Current Password" className="form-control" onChange={this.verifyPassword}/><br />
					</center>
				</div>
				<div className="col-md-4">
				</div>
			</div>
		);
	}
});

module.exports = AccountSettings;