var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var LogInForm = React.createClass({

	//initially, there are no submission errors
	getInitialState: function(){
		return{hasError: false};
	},

	//logs the user in with the firebase method and reroutes to the home page
	handleLogIn: function(){

		var that = this;
		var email = this.refs.email.value;
		var password = this.refs.password.value;

		firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
  			var errorCode = error.code;
  			var errorMessage = error.message;

  			//sets hasError and the errorMsg if an error occured to show in the alerts
  			if(error){
  				that.setState({hasError: true});
  				that.setState({errorMsg: "Invalid email or password combination."});
  			}
		});

		//if successfully logged in, reroute to home
		this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
  			if (user) {
				hashHistory.push("/");
  			} else {
		    	hashHistory.push("/login");
  			}
		});
	},

	componentWillUnmount: function(){
		if (typeof this.unsubscribe == 'function')
		{
			this.unsubscribe(); 
		}
	},

	//if user pressed "Enter" while filling out his/her info, act as if Login was clicked
	handleKeyPress: function(e){
		if(e.key == 'Enter'){
			this.handleLogIn();
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
				<div className="col-md-4">
				</div>

				<div className="col-md-4">
					<center>
						<h1 className="margin-top-30">Log In</h1><br />
						
						<input type="email" ref="email" placeholder="Email Address" className="form-control" onKeyPress={this.handleKeyPress}/><br />
						<input type="password" ref="password" placeholder="Password" className="form-control" onKeyPress={this.handleKeyPress}/><br />
						<button className="btn btn-primary margin-bottom-10" onClick={this.handleLogIn}>Login</button><br />
						No account? <Link to="/signup">Sign up!</Link>
					</center>
				</div>

				<div className="col-md-4">
				</div>

			</div>
			);
	}
});

module.exports = LogInForm;