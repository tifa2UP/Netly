var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var SignUpForm = React.createClass({

	//initially, no submission errors
	getInitialState: function(){
		return{hasError: false};
	},

	handleSignUp: function(){
		var that = this;

		//gets the data from the form fields
		var firstName = this.refs.firstName.value;
		var lastName = this.refs.lastName.value;
		var email = this.refs.email.value;
		var password = this.refs.password.value;
		var password_confirmation = this.refs.password_confirmation.value;

		//creates the user on firebase
		firebase.auth().createUserWithEmailAndPassword(email, password == password_confirmation ? password : "nil").catch(function(error) {
			if(error){
				that.setState({hasError: true});
				that.setState({errorMsg: "Please enter a valid email address with a password of at least 6 characters."});
			}
		});

		//if successfully logged in, add the user child to the database with the name and email.
		firebase.auth().onAuthStateChanged(function(user) {
  			if (user) {
  				console.log("Signed up!");
  				var userData = {
  					email: email,
  					first: firstName,
  					last: lastName
  				};

  				firebase.database().ref('users/' + firebase.auth().currentUser.uid).set(userData);
				hashHistory.push("/");
  			}
		});
	},

	//if "Enter" was pressed, act as Sign Up was clicked
	handleKeyPress: function(e){
		if(e.key == 'Enter'){
			try{
				this.handleSignUp();
			}
			catch(e){};
		}
	},

	render: function(){
		return (
			<div>
				{(this.state.hasError
        			?	<div className="alert alert-danger"><strong>Error! </strong>{this.state.errorMsg}</div>
      				: 	<div></div>
    			)}

				<div className="col-md-4">
				</div>

				<div className="col-md-4">
					<center><h1>Sign Up</h1>
						<input type="text" ref="firstName" placeholder="First Name" className="form-control" onKeyPress={this.handleKeyPress} /><br /> 
						<input type="text" ref="lastName" placeholder="Last Name" className="form-control" onKeyPress={this.handleKeyPress} /><br />
						<input type="email" ref="email" placeholder="Email Address" className="form-control" onKeyPress={this.handleKeyPress} /><br />
						<input type="password" ref="password" placeholder="Password" className="form-control" onKeyPress={this.handleKeyPress} /><br />
						<input type="password" ref="password_confirmation" placeholder="Password Confirmation" className="form-control" onKeyPress={this.handleKeyPress} /><br />
						<button onClick={this.handleSignUp} className="btn btn-primary">Create Account</button><br />
						Have an account? <Link to="/login">Login!</Link></center>
				</div>
				<div className="col-md-4">
				</div>
			</div>
		);
	}
});

module.exports = SignUpForm;