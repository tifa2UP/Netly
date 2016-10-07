var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var UpdatePassword = React.createClass({

	//initially, no submission errors
	getInitialState: function(){
		return{hasError: false, succeeded: false};
	},

	handleUpdatePassword: function(){
		var new_password = this.refs.new_password.value;
		var new_password_confirmation = this.refs.new_password_confirmation.value;
		var that = this;

		if(new_password && new_password_confirmation && new_password == new_password_confirmation){
			var user = firebase.auth().currentUser;
			user.updatePassword(new_password).then(function(){
				that.setState({succeeded: true});
				that.setState({hasError: false});
				console.log("success");
				that.setState({successMsg: "Your password has been successfully updated!"});
			}, function(error){
				that.setState({hasError: true});
				console.log("error");
				that.setState({errorMsg: "An error occured!"});
			});
		}else{
			this.setState({hasError: true});
			this.setState({errorMsg: "Passwords do not match."});
		}
		this.refs.new_password.value = "";
		this.refs.new_password_confirmation.value = "";
	},

	//creates a div alert-danger with the error message
	errorMessage: function(){
		return <div className="alert alert-danger"><strong>Error! </strong>{this.state.errorMsg}</div>;
	},

	//creates an empty div if no error message
	noErrorMessage: function(){
		return <div></div>;
	},

	//creates a div alert-danger with the error message
	successMsg: function(){
		return <div className="alert alert-success"><strong>Success! </strong>{this.state.successMsg}</div>;
	},

	//creates an empty div if no error message
	noSuccessMsg: function(){
		return <div></div>;
	},

	//if "Enter" was pressed, act as Sign Up was clicked
	handleKeyPress: function(e){
		if(e.key == 'Enter'){
			try{
				this.handleUpdatePassword();
			}
			catch(e){};
		}
	},

	render: function(){
		//gets the appropriate error alert div depending on whether or not the form has an error
		var errorAlert;
		if(this.state.hasError){
			errorAlert = this.errorMessage();
		}else{
			errorAlert = this.noErrorMessage();
		}

		if(this.state.succeeded){
			success = this.successMsg();
		}else{
			success = this.noSuccessMsg();
		}

		return (
			<div>
				{errorAlert}
				{success}

				<div className="col-md-4">
				</div>

				<div className="col-md-4">
					<center>
						<h1>Update Password</h1>
						
						<input type="password" ref="new_password" placeholder="New Password" className="form-control" onKeyPress={this.handleKeyPress}/><br />
						<input type="password" ref="new_password_confirmation" placeholder="Confirm New Password" className="form-control" onKeyPress={this.handleKeyPress}/><br />
						
						<button onClick={this.handleUpdatePassword} className="btn btn-primary">Update Password</button><br />
					</center>
				</div>
				<div className="col-md-4">
				</div>
			</div>
		);
	}
});

module.exports = UpdatePassword;