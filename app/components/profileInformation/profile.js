var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;
var Summary = require('./summary.js');
var Education = require('./education.js');
var Projects = require('./projects.js');
var Interests = require('./interests.js');
var Experience = require('./experience.js');
var Skills = require('./skills.js');
var ProfileImage = require('./profileImage.js');

var Profile = React.createClass({
    getInitialState: function(){
        return {user_name: "", recruiter: false, isCurrentUser: false, currentID: ""};
    },

    componentWillReceiveProps: function(nextProps){
        //same as componentwillmount, but happens only if the params changed to another user
        this.setState({currentID: nextProps.params.id});

        firebase.auth().onAuthStateChanged((user) => {
            this.setState({isCurrentUser: firebase.auth().currentUser.uid == nextProps.params.id});
        });

        var userRef = firebase.database().ref().child('users/'+ nextProps.params.id);
        userRef.on("value", snap=>{
            var user = snap.val();
            this.setState({user_name: user.first + " " + user.last});
            this.setState({recruiter: user.recruiter});
        });
    },

    componentWillMount: function(){
        var that = this;

        //sets the current user_id of the page
        this.setState({currentID: this.props.params.id});

        //checks to see if the user page belongs to the current user
        firebase.auth().onAuthStateChanged((user) => {
            this.setState({isCurrentUser: firebase.auth().currentUser.uid == this.props.params.id});
        });

        //gets the name of the user and whether or not he/she is a recruiter--not yet used
        var userRef = firebase.database().ref().child('users/'+this.props.params.id);
        userRef.on("value", snap=>{
            var user = snap.val();
            this.setState({user_name: user.first + " " + user.last});
            this.setState({recruiter: user.recruiter});
        });
    },

    render: function(){
        return (
            <div className="profile">
                <div className="container profile-container">
                    <center>
                        <div  className="col-md-4 profile-img">
                            <ProfileImage user_id={this.state.currentID} isCurrentUser={this.state.isCurrentUser}/>
                        </div>
                        <div className="col-md-5 profile-details ">
                            <h1>{this.state.user_name}</h1>
                            <h4>500+ Connections</h4>
                            <h4>Occupation here</h4>
                            <h4>Education here</h4>
                            <button className="btn btn-primary">Add connection</button>
                        </div>
                    </center>
                </div>
                <Summary user_id={this.state.currentID} isCurrentUser={this.state.isCurrentUser}/>
                <Projects user_id={this.state.currentID} isCurrentUser={this.state.isCurrentUser}/>
                <Education user_id={this.state.currentID} isCurrentUser={this.state.isCurrentUser}/>
                <Interests user_id={this.state.currentID} isCurrentUser={this.state.isCurrentUser}/>
                <Experience user_id={this.state.currentID} isCurrentUser={this.state.isCurrentUser}/>
                <Skills user_id={this.state.currentID} isCurrentUser={this.state.isCurrentUser}/>
            </div>
        );
    }
});

module.exports = Profile;