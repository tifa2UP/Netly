var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var NavBar = React.createClass({
    getInitialState: function() {
        return {
            isLoggedIn: (null != firebase.auth().currentUser)
        }
    },
    componentWillMount: function() {
        firebase.auth().onAuthStateChanged((user) => {
            this.setState({ isLoggedIn: (null != user)})
            userRef = firebase.database().ref().child('users/' + firebase.auth().currentUser.uid);
            userRef.on("value", snap => {
                var user = snap.val();
                this.setState({name: user.first + " " + user.last});
            });
        });
    },

    render: function() {
        var loginOrOut;
        var profile;
        var signUp;

        if(this.state.isLoggedIn) {
            loginOrOut = <li><Link to="/logout" className="navbar-brand">Logout</Link></li>;
            profile = <li><Link to="/" className="navbar-brand">{this.state.name}</Link></li>
            signUp = null;
        } else {
            loginOrOut = <li><Link to="/login" className="navbar-brand">Login</Link></li>;
            profile = null;
            signUp = <li><Link to="/signup" className="navbar-brand">Sign Up</Link></li>;
        }

        return (
            <span>
                <nav className="navbar navbar-inverse navbar-static-top">
                    <div className="container">
                        <div className="navbar-header">
                            <Link to="/" className="navbar-brand">
                                SJSUConnect
                            </Link>
                        </div>
                        <ul className="nav navbar-nav pull-right">
                            {signUp}
                            {profile}
                            {loginOrOut}
                        </ul>
                    </div>
                </nav>

                <div className="container">
                    {this.props.children}
                </div>
            </span>
        )
    }
});

module.exports = NavBar;