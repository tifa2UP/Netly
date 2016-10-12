var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var Layout = React.createClass({

    //sets the initial logged in state
    getInitialState: function() {
        return {
            isLoggedIn: (null != firebase.auth().currentUser),
            recruiter: false
        }
    },

    //checks for login/logout changes and sets the logged in state accordingly, also gets the user's name
    componentWillMount: function() {
        firebase.auth().onAuthStateChanged((user) => {
            this.setState({isLoggedIn: (null != user)});
            this.setState({recruiter: this.state.isLoggedIn == false ? false : null});
            this.setState({name: user.displayName});

            userRef = firebase.database().ref().child('users/' + firebase.auth().currentUser.uid);
            userRef.on("value", snap => {
                var user = snap.val();
                this.setState({recruiter: (user == null || !user.recruiter) ? false : true});
            });
        });
    },

    render: function() {
        var loginOrOut;
        var profile;
        var signUp;
        var accountSettings;

        var navClassName;

        //if the user is logged in, show the logout and profile link
        if(this.state.isLoggedIn) {
            loginOrOut = <li><Link to="/logout" className="navbar-brand">Logout</Link></li>;
            profile = <li><Link to="/profile" className="navbar-brand">{this.state.name ? this.state.name : "Profile" } </Link></li>;
            signUp = null;
            accountSettings = <li><Link to="/accountSettings" className="navbar-brand">Account Settings</Link></li>;

        //if the user is not logged in, show the login and signup links
        } else {
            loginOrOut = <li><Link to="/login" className="navbar-brand">Login</Link></li>;
            profile = null;
            signUp = <li><Link to="/signup" className="navbar-brand">Sign Up</Link></li>;
            accountSettings = null;
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
                                SJSUConnect
                            </Link>
                        </div>
                        
                        <ul className="nav navbar-nav pull-right">
                            {signUp} {/*shows only if user is not logged in*/}
                            {profile} {/*shows only if user is logged in*/}
                            {loginOrOut} {/*shows login or logout link depending on logged in state*/}
                            {accountSettings}
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