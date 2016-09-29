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
		firebase.auth().onAuthStateChanged(function(user) {
  			if (user) {
  				console.log("Logged in!");
				hashHistory.push("/");
  			} else {
		    	hashHistory.push("/login");
  			}
		});
	},

	//if user pressed "Enter" while filling out his/her info, act as if Login was clicked
	handleKeyPress: function(e){
		if(e.key == 'Enter'){
			this.handleLogIn();
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
					<center>
						<h1>Log In</h1>
						<input type="email" ref="email" placeholder="Email Address" className="form-control" onKeyPress={this.handleKeyPress}/><br />
						<input type="password" ref="password" placeholder="Password" className="form-control" onKeyPress={this.handleKeyPress}/><br />
						<button className="btn btn-primary" onClick={this.handleLogIn}>Login</button><br />
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