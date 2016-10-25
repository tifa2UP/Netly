var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var UpdatePassword = React.createClass({

	//initially, no submission errors
	getInitialState: function(){
		return{hasError: false, succeeded: false, errorMsg: "", successMsg: ""};
	},

	handleUpdatePassword: function(){
		if(true){
			var new_password = this.refs.new_password.value;
			var new_password_confirmation = this.refs.new_password_confirmation.value;
			var that = this;

			if(new_password && new_password_confirmation && new_password == new_password_confirmation){
				var user = firebase.auth().currentUser;
				user.updatePassword(new_password).then(function(){
					hashHistory.push('/');
				}, function(error){
					that.setState({hasError: true});
					that.setState({errorMsg: "An error occured!"});
				});
			}else{

				that.setState({hasError: true});
				that.setState({errorMsg: "Passwords do not match."});
			}
			this.refs.new_password.value = "";
			this.refs.new_password_confirmation.value = "";
		}
	},

	//creates a div alert-danger with the error message
	errorMessage: function(){
		return <div className="alert alert-danger"><strong>Error! </strong>{this.state.errorMsg}</div>;
	},

	//creates an empty div if no error message
	noErrorMessage: function(){
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

		return (
			<div>
				{errorAlert}
				<input type="password" ref="new_password" placeholder="New Password" className="form-control" onKeyPress={this.handleKeyPress}/><br />
				<input type="password" ref="new_password_confirmation" placeholder="Confirm New Password" className="form-control" onKeyPress={this.handleKeyPress}/><br />
						
				<button onClick={this.handleUpdatePassword} className="btn btn-primary">Update Password</button><br />
			</div>
		);
	}
});

module.exports = UpdatePassword;