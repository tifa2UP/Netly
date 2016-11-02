var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;
var DeleteAccount = require('./destroy.js');
var UpdatePassword = require('./updatePassword.js');
var UploadImage = require('./uploadImage.js');


<<<<<<< HEAD
=======
	//initially, no submission errors
	getInitialState: function(){
		return{hasError: false, errorMsg: "", verified: false, verificationMessage: ""};
	},
>>>>>>> 510107b4d50a6c64e3e65446c364ff8c73fbf3eb

<<<<<<< HEAD
class AccountSettings extends React.Component {
	constructor(props) {
		super(props);
		this.state = {hasError: false, errorMsg: "", verified: false, verificationMessage:""};
		this.handleTypeChanges = this.handleTypeChanges.bind(this);
		this.verifyPassword = this.verifyPassword.bind(this);
	}
	
	
	componentWillUnmount(){
		console.log("inside of componentWillUnmount");
	}
	componentDidMount(){
		console.log("inside of componentDidMount");
	}
	
	componentWillUpdate(){
		console.log("inside of componentWillUpdate");
	}
	
	componentDidUpdate(){
		console.log("inside of componentDidUpdate");
	}

	shouldComponentUpdate(){
		console.log("inside of shouldComponentUpdate");
		return false;
	}
	
	handleReauthenticate(){
		return this.state.verified;
	}
	
	handleTypeChanges(){
		this.setState({hasError: false, errorMsg: ""});
	}
=======
	verifyPassword: function(e){
		var that = this;
>>>>>>> 5a00b2973165a90dbe91d3bb88ef86ca556f2d74

	verifyPassword(e){
		//var that = this;
//e.preventDefault();
		if(this.refs.current_password.value){
			var user = firebase.auth().currentUser;
			var credential = firebase.auth.EmailAuthProvider.credential(user.email, this.refs.current_password.value);
<<<<<<< HEAD
			console.log(credential);
			
			user.reauthenticate(credential).then(function (){
			
			console.log("inside of onResolve");
			
			hashHistory.push("/accountSettings");
			//break function;
			return;
			
			},function (error){
			
			console.log("inside of onReject");
			
			});
			
			
			
			
			
			//.then(function(onResolve, onReject) {
				
			//});
			/*user.reauthenticate(credential).then( 
				(onResolve) => {
				console.log("inside of onResolve");
					this.setState({
						hasError: false, 
						errorMsg: "", 
						verified: true,
						verificationMessage: "Your password has been verified!"
					})
				}).then(
				(onReject)=>{
				console.log("inside of onReject");
					this.setState({
						hasError: true, 
						errorMsg: "Your current password is incorrect.",
						verified: false
					})
				});
		}else{
			this.setState({
				hasError: true,
				errorMsg: "Please enter your current password",
				verified: false
			});*/
=======
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
<<<<<<< HEAD
>>>>>>> 5a00b2973165a90dbe91d3bb88ef86ca556f2d74
=======
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
>>>>>>> 510107b4d50a6c64e3e65446c364ff8c73fbf3eb
		}
	}

<<<<<<< HEAD
	//creates a div alert-danger with the error message
	errorMessage(){
		return <div className="alert alert-danger"><strong>Error! </strong>{this.state.errorMsg}</div>;
	}

	//creates an empty div if no error message
	noErrorMessage(){
		return <div className="alert alert-danger">Please verify your current password.</div>;
	}

	successMessage(){
=======
	//creates an empty div if no error message
	enterPasswordAlert: function(){
		return <div className="alert alert-info">Please enter your current password before proceeding.</div>;;
	},

	successAlert: function(){
>>>>>>> 5a00b2973165a90dbe91d3bb88ef86ca556f2d74
		return <div className="alert alert-success"><strong>Success! </strong>{this.state.verificationMessage}</div>;
	}

<<<<<<< HEAD
	render(){
=======
	//creates an empty div if no error message
	errorAlert: function(){
		return <div className="alert alert-danger"><strong>Error! </strong>{this.state.errorMsg}</div>;
	},
>>>>>>> 510107b4d50a6c64e3e65446c364ff8c73fbf3eb

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
<<<<<<< HEAD
<<<<<<< HEAD
						<UploadImage />

						<input type="password" ref="current_password" placeholder="Current Password" className="form-control" onChange={this.handleTypeChanges}/><br />
						<button onClick={this.verifyPassword} className="btn btn-success">Verify Password</button><br />
						<br/>
						<UpdatePassword handleReauthenticate={this.handleReauthenticate} /><br />
						<DeleteAccount handleReauthenticate={this.handleReauthenticate} />
=======
						
						<input type="password" ref="current_password" placeholder="Current Password" className="form-control" onChange={this.verifyPassword}/><br />
>>>>>>> 5a00b2973165a90dbe91d3bb88ef86ca556f2d74
=======
						{show}
>>>>>>> 510107b4d50a6c64e3e65446c364ff8c73fbf3eb
					</center>
				</div>
				<div className="col-md-4">
				</div>
			</div>
		);
	}
}

module.exports = AccountSettings;