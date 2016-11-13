var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;
var DeleteAccount = require('./destroy.js');
var UpdatePassword = require('./updatePassword.js');

var AccountSettings = React.createClass({

	//initially, no submission errors
	getInitialState: function(){
		return{hasError: false, errorMsg: "", verified: false, verificationMessage: ""};
	},

	verifyPassword: function(e){
		var that = this;

		if(this.refs.current_password.value){
			var user = firebase.auth().currentUser;
			var credential = firebase.auth.EmailAuthProvider.credential(user.email, this.refs.current_password.value);
			user.reauthenticate(credential).then(function(){
				that.setState({verified: true});
				that.setState({verificationMessage: "Your password has been verified."});
				that.setState({hasError: false});
				that.setState({errorMsg: ""});
			}).catch(function(error){
				that.setState({hasError: true});
				that.setState({errorMsg: "The password you entered is invalid."});
				that.setState({verified: false});
				that.setState({verificationMessage: ""});
			});
		}else{
			this.setState({hasError: true});
			this.setState({errorMsg: "Your current password cannot be blank."});
			this.setState({verified: false});
			this.setState({verificationMessage: ""});
		}
	},

	handleTypingChange: function(){
		this.setState({verified: false});
		this.setState({hasError: false});
	},

	handleKeyPress: function(e){
		if(e.key == "Enter"){
			try{
				this.verifyPassword();
			}catch(e){}
		}
	},

	//creates an empty div if no error message
	enterPasswordAlert: function(){
		return <div className="alert alert-info">Please enter your current password before proceeding.</div>;;
	},

	successAlert: function(){
		return <div className="alert alert-success"><strong>Success! </strong>{this.state.verificationMessage}</div>;
	},

	//creates an empty div if no error message
	errorAlert: function(){
		return <div className="alert alert-danger"><strong>Error! </strong>{this.state.errorMsg}</div>;
	},

	render: function(){
		//gets the appropriate error alert div depending on whether or not the form has an error
		var alert;
		if(this.state.verified){
			alert = this.successAlert();
		}else if(this.state.hasError){
			alert = this.errorAlert();
		}else{
			alert = this.enterPasswordAlert();
		}

		var show;
		if(this.state.verified){
			show = 
				<div>
					<UpdatePassword /><br />
					<DeleteAccount /><br />
				</div>
		}else{
			show = 
				<div>
					<input type="password" ref="current_password" placeholder="Current Password" className="form-control" onChange={this.handleTypingChange} onKeyPress={this.handleKeyPress}/><br />
					<button className="btn btn-success" onClick={this.verifyPassword}>Verify</button>
				</div>
		}

		return(
			<div>
				{alert}

				<div className="col-md-4">
				</div>
				<div className="col-md-4">
					<center>
						<h1>Account Settings</h1><br />
						{show}
					</center>
				</div>
				<div className="col-md-4">
				</div>
			</div>
		);
	}
});

module.exports = AccountSettings;