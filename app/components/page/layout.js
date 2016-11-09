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
            imgURL: "",
            requests: []
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
                this.setState({imgURL: user.imageURL});
                this.setState({recruiter: (user == null || !user.recruiter) ? false : true});
            });


            this.connectionRef = firebase.database().ref().child('connections/' + user.uid).orderByChild('status').equalTo('awaiting-acceptance');
            this.connectionRef.on("child_added", snap=>{
                if(snap.val()){
                    this.state.requests.push(snap.ref.key);
                    this.setState({requests: this.state.requests});
                }
            });

            this.connectionRefUpdate = firebase.database().ref().child('connections/' + user.uid);
            this.connectionRefUpdate.on("child_changed", snap=>{
                if(snap.val().status == 'accepted'){
                    var index = this.state.requests.indexOf(snap.ref.key);
                    if(index >= 0){
                        this.state.requests.splice(index, 1);
                        this.setState({requests: this.state.requests});
                    }
                }
            });

            this.connectionRefUpdate = firebase.database().ref().child('connections/' + user.uid);
            this.connectionRefUpdate.on("child_removed", snap=>{
                var index = this.state.requests.indexOf(snap.ref.key);
                if(index >= 0){
                    this.state.requests.splice(index, 1);
                    this.setState({requests: this.state.requests});
                }
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

        var style;
        if(this.state.requests.length > 0){
            style={
                color: 'red'
            }
        }else{
            style={}
        }

        //if the user is logged in, show the logout and profile link
        if(this.state.isLoggedIn) {
            loginOrOut = <li><Link to="/logout" className="navbar-brand"><span className="glyphicon glyphicon-off" title ="Logout"></span></Link></li>;
            profile = <li><Link to={"/users/" + this.state.user_id} title= "Profile" className="navbar-brand"><img src={this.state.imgURL} className="img-circle" width="20" height="20" style={{objectFit: 'cover'}} /></Link></li>;
            signUp = null;
            accountSettings = <li><Link to="/accountSettings" className="navbar-brand"><span className="glyphicon glyphicon-cog" title="Settings"></span></Link></li>;
            requests = <li><Link to="/requests" className="navbar-brand"><span className='glyphicon glyphicon-bell' title = "Requests" style={style}></span></Link></li>;
            connections = <li><Link to="/connections" className="navbar-brand"><span className='glyphicon glyphicon-globe' title="Connections"></span></Link></li>;
            search = <Search isRecruiter={this.state.recruiter}/>

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