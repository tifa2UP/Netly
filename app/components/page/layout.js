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
            this.setState({name: this.state.isLoggedIn ? user.displayName : null});
            this.setState({user_id: this.state.isLoggedIn ? user.uid : null});

            if(this.state.isLoggedIn){
                this.userRef = firebase.database().ref().child('users/' + firebase.auth().currentUser.uid);
                this.userRef.on("value", snap => {
                    var user = snap.val();
                    this.setState({imgURL: user.imageURL});
                    this.setState({recruiter: (user == null || !user.recruiter) ? false : true});
                });


                this.connectionRef = firebase.database().ref().child('connections/' + user.uid).orderByChild('status').equalTo('awaiting-acceptance');
                this.connectionRef.on("child_added", snap=>{
                    if(snap.val()){
                        var requesterID = snap.ref.key;
                        var requesterRef = firebase.database().ref().child('users/' + requesterID);
                        requesterRef.once("value", snap=>{
                            var userData = snap.val();
                            if(userData){
                                this.state.requests.push(requesterID);
                                this.setState({requests: this.state.requests});
                            }
                        });
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

                this.connectionRefRemoved = firebase.database().ref().child('connections/' + user.uid);
                this.connectionRefRemoved.on("child_removed", snap=>{
                    var index = this.state.requests.indexOf(snap.ref.key);
                    if(index >= 0){
                        this.state.requests.splice(index, 1);
                        this.setState({requests: this.state.requests});
                    }
                });
            }
        });
    },

    componentWillReceiveProps: function(nextProps){
        var that = this;
        this.unsubscribe();
        //this.state.requests.splice(0, this.state.requests.length);

        this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            this.setState({isLoggedIn: (null != user)});
            this.setState({recruiter: this.state.isLoggedIn == false ? false : null});
            this.setState({name: this.state.isLoggedIn ? user.displayName : null});
            this.setState({user_id: this.state.isLoggedIn ? user.uid : null});

            if(this.state.isLoggedIn){
                this.userRef = firebase.database().ref().child('users/' + firebase.auth().currentUser.uid);
                this.userRef.on("value", snap => {
                    var user = snap.val();
                    this.setState({imgURL: user.imageURL});
                    this.setState({recruiter: (user == null || !user.recruiter) ? false : true});
                });

                this.connectionRef = firebase.database().ref().child('connections/' + user.uid).orderByChild('status').equalTo('awaiting-acceptance');
                this.connectionRef.on("child_added", snap=>{
                    if(snap.val()){
                        var requesterID = snap.ref.key;
                        var requesterRef = firebase.database().ref().child('users/' + requesterID);
                        requesterRef.once("value", snap=>{
                            var userData = snap.val();
                            if(userData){
                                if(this.state.requests.indexOf(snap.ref.key) < 0){
                                    this.state.requests.push(snap.ref.key);
                                    this.setState({requests: this.state.requests});
                                }
                            }
                        });
                        
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

                this.connectionRefRemoved = firebase.database().ref().child('connections/' + user.uid);
                this.connectionRefRemoved.on("child_removed", snap=>{
                    var index = this.state.requests.indexOf(snap.ref.key);
                    if(index >= 0){
                        this.state.requests.splice(index, 1);
                        this.setState({requests: this.state.requests});
                    }
                });
            }
        });
    },

    componentWillUnmount: function(){
        console.log("unmounted");
        this.unsubscribe();
    },

    render: function() {
        var loginOrOut;
        var profile;
        var signUp;
        var accountSettings;
        var requests;
        var connections;
        var companies;
        var search;

        var navClassName;

        var div;

        var divStyle={
            fontSize: '10px',
            textAlign: 'center',
            color: 'white',
            width: '15px',
            height: '15px',
            position: 'relative',
            backgroundColor: 'red',
            borderRadius: '5px',
            top: '-30px',
            right: '-10px',
            zIndex: '1'
        }

        if(this.state.requests.length > 0){
            div = <div style={divStyle}>{this.state.requests.length}</div>
        }else{
            div= null;
        }


        //if the user is logged in, show the logout and profile link
        if(this.state.isLoggedIn) {
            loginOrOut = <li><Link to="/logout" className="navbar-brand"><span className="glyphicon glyphicon-off navbar-icon" title="Logout"></span></Link></li>;
            profile = <li><Link to={"/users/" + this.state.user_id} title="Profile" className="navbar-brand"><img src={this.state.imgURL} className="img-circle" width="20" height="20" style={{objectFit: 'cover'}}/></Link></li>;
            signUp = null;

            accountSettings = <li><Link to="/accountSettings" className="navbar-brand"><span className="glyphicon glyphicon-cog navbar-icon" title="Settings"></span></Link></li>;
            requests = <li><Link to="/requests" className="navbar-brand"><span className='glyphicon glyphicon-bell navbar-icon' title="Requests"></span>{div}</Link></li>;
            connections = <li><Link to="/connections" className="navbar-brand connections-icon"><span className='ionicons ion-ios-people navbar-icon' title="Connections"></span></Link></li>;
            companies = <Link to="/companies" className="navbar-brand briefcase"><span className='glyphicon glyphicon-briefcase navbar-icon' title="Companies"></span></Link>;

            search = <Search isRecruiter={this.state.recruiter}/>

        //if the user is not logged in, show the login and signup links
        } else {
            loginOrOut = <li><Link to="/login" className="navbar-brand">Login</Link></li>;
            profile = null;
            signUp = <li><Link to="/signup" className="navbar-brand">Sign Up</Link></li>;
            accountSettings = null;
            requests = null;
            connections = null;
            companies = null;
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
                <nav className="navbar navbar-default navbar-static-top">
                    <div className="container">
                        <div className="navbar-header">
                            <Link to="/" className="navbar-brand">
                                {/*<span className="glyphicon glyphicon-home navbar-icon" title="Home"></span>*/}
                                <img src="logo.png" alt="logo" height={35}/>
                            </Link>
                            {companies}
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