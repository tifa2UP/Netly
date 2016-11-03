var React = require('react');
var ReactDOM = require('react-dom');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var UploadImage = React.createClass({
    getInitialState: function(){
        return{imgURL: "", userData: {}};
    },

    componentWillMount: function(){
        var that = this;

        //checks to see if the user has a profile picture, if not, use default image.
        this.userRef = firebase.database().ref().child('users/'+this.props.pageID);
        this.userRef.on("value", snap=>{
            var user = snap.val();
            this.setState({userData: user});
        });
    },

    componentWillReceiveProps: function(nextProps){
        var that = this;

        //does the same as component will mount, but updates to the correct param user
        this.userRef = firebase.database().ref().child('users/'+ nextProps.pageID);
        this.userRef.on("value", snap=>{
            var user = snap.val();
            this.setState({userData: user});
        });
    },

    componentWillUnmount: function(){
        this.userRef.off();
    },

    //uploads the image into firebase storage
    handleUploadImage: function(e){
        var that = this;

        //gets the file data
        var imageFile = e.target.files[0];
        //creates a new reference called profilepic.jpg in the user storage folder for this current user
        var userProfileImageRef = firebase.storage().ref().child('images/users/' + this.props.pageID + '/profilepic.jpg');
        //stores the file into the reference
        userProfileImageRef.put(imageFile).then(function(snapshot){
            //gets the user data and reupdates it after changing hasProfileImage and imageFileName
            var userData = {};
            for(var i in that.state.userData){
                userData[i] = that.state.userData[i];
            }

            userData.imageURL = snapshot.downloadURL;

            var updates = {};
            updates['users/' + that.props.pageID] = userData;
            firebase.database().ref().update(updates);
        });
    },

    render: function(){
        var showUpload;
        //shows an upload image option if currentuser
        if(this.props.isCurrentUser){
            showUpload = <label className="btn btn-file btn-link">
                            <span className='glyphicon glyphicon-paperclip'></span>
                            <input type="file" accept="image/*" onChange={this.handleUploadImage} style={{display: 'none'}} />
                        </label>
        }else{
            showUpload = <div></div>
        }

        return (
            <div>
                <img src={this.state.userData.imageURL} className="img-circle" alt="" width="200" height="200" style={{objectFit: 'cover'}}/><br />
                {showUpload}
                <br />
            </div>
        );
    }
});

module.exports = UploadImage;