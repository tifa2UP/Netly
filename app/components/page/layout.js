var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;
var Search = require('./search.js');

var Layout = React.createClass({

    //sets the initial logged in state
    getInitialState: function() {
        return {
            isLoggedIn: (null != firebase.auth().currentUser),
            recruiter: false,
            imgURL: ""
        }
    },

    //checks for login/logout changes and sets the logged in state accordingly, also gets the user's name
    componentWillMount: function() {
        var that = this;

        this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            this.setState({isLoggedIn: (null != user)});
            this.setState({recruiter: this.state.isLoggedIn == false ? false : null});
            this.setState({name: user.displayName});
            this.setState({user_id: user.uid});

            this.userRef = firebase.database().ref().child('users/' + firebase.auth().currentUser.uid);
            this.userRef.on("value", snap => {
                var user = snap.val();
                if(user.hasProfileImage){
                    var userImageRef = firebase.storage().ref().child('images/users/' + firebase.auth().currentUser.uid + '/profilepic.jpg');
                    userImageRef.getDownloadURL().then(function(url){
                        that.setState({imgURL: url});
                    }).catch(function(error){
                        var defaultRef = firebase.storage().ref().child('images/' + 'default.jpg');
                        defaultRef.getDownloadURL().then(function(url){
                        that.setState({imgURL: url});
                        });
                    });
                }else{
                    var defaultRef = firebase.storage().ref().child('images/' + 'default.jpg');
                    defaultRef.getDownloadURL().then(function(url){
                        that.setState({imgURL: url});
                    });
                }
                this.setState({recruiter: (user == null || !user.recruiter) ? false : true});
            });
        });
    },

    componentWillUnmount: function(){
        this.unsubscribe();
    },

    render: function() {
        var loginOrOut;
        var profile;
        var signUp;
        var accountSettings;
        var requests;
        var connections;
        var search;

        var navClassName;

        //if the user is logged in, show the logout and profile link
        if(this.state.isLoggedIn) {
            loginOrOut = <li><Link to="/logout" className="navbar-brand"><span className="glyphicon glyphicon-off"></span></Link></li>;
            //profile = <li><Link to={"/users/" + this.state.user_id} className="navbar-brand">{this.state.name ? this.state.name : "Profile" } </Link></li>;
            profile = <li><Link to={"/users/" + this.state.user_id} className="navbar-brand"><img src={this.state.imgURL} className="img-circle" width="20" height="20" style={{objectFit: 'cover'}}/></Link></li>;
            signUp = null;
            accountSettings = <li><Link to="/accountSettings" className="navbar-brand"><span className="glyphicon glyphicon-cog"></span></Link></li>;
            requests = <li><Link to="/requests" className="navbar-brand">Requests</Link></li>;
            connections = <li><Link to="/connections" className="navbar-brand">Connections</Link></li>;
            search = <Search />

        //if the user is not logged in, show the login and signup links
        } else {
            loginOrOut = <li><Link to="/login" className="navbar-brand">Login</Link></li>;
            profile = null;
            signUp = <li><Link to="/signup" className="navbar-brand">Sign Up</Link></li>;
            accountSettings = null;
            requests = null;
            connections = null;
            search = null;
        }

        //if recruiter -> black navbar, else job seeker -> default navbar
        if(this.state.recruiter == true){
            navClassName = "navbar navbar-inverse navbar-static-top";
        }else{
            navClassName = "navbar navbar-default navbar-static-top";
        }

        return (
            <span>
                <nav className={navClassName}>
                    <div className="container">
                        <div className="navbar-header">
                            <Link to="/" className="navbar-brand">
                                <span className="glyphicon glyphicon-home"></span>
                            </Link>
                        </div>
                        {search}
                        <ul className="nav navbar-nav pull-right">
                            {signUp} {/*shows only if user is not logged in*/}
                            {profile} {/*shows only if user is logged in*/}
                            {requests}
                            {connections}
                            {accountSettings}
                            {loginOrOut} {/*shows login or logout link depending on logged in state*/}
                        </ul>
                    </div>
                </nav>

            {/*shows the rest of the page: home, login, signup, etc. */}
                <div className="container">
                    {this.props.children}
                </div>
            </span>
        )
    }
});

module.exports = Layout;