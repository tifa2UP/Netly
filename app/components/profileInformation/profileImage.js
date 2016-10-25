var React = require('react');
var ReactDOM = require('react-dom');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var UploadImage = React.createClass({
    getInitialState: function(){
        return{imgURL: ""};
    },

    //uploads the image into firebase storage
    handleUploadImage: function(e){
        var that = this;

        //gets the file data
        var imageFile = e.target.files[0];
        //creates a new reference called profilepic.jpg in the user storage folder for this current user
        var userProfileImageRef = firebase.storage().ref().child('images/users/' + this.props.user_id + '/profilepic.jpg');
        //stores the file into the reference
        userProfileImageRef.put(imageFile).then(function(snapshot){
            //gets the user data and reupdates it after changing hasProfileImage and imageFileName
            var userData = {};
            for(var i in that.state.userData){
                userData[i] = that.state.userData[i];
            }
            userData.hasProfileImage = true;
            userData.imageFileName = imageFile.name;
            var updates = {};
            updates['users/' + that.props.user_id] = userData;
            firebase.database().ref().update(updates);
        });
    },

    componentWillMount: function(){
        var that = this;

        //checks to see if the user has a profile picture, if not, use default image.
        var userRef = firebase.database().ref().child('users/'+this.props.user_id);
        userRef.on("value", snap=>{
            var user = snap.val();
            this.setState({userData: user});
            if(user.hasProfileImage){
                var userImageRef = firebase.storage().ref().child('images/users/' + this.props.user_id + '/profilepic.jpg');
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
        });
    },

    componentWillReceiveProps: function(nextProps){
        var that = this;

        //does the same as component will mount, but updates to the correct param user
        var userRef = firebase.database().ref().child('users/'+ nextProps.user_id);
        userRef.on("value", snap=>{
            var user = snap.val();
            this.setState({userData: user});
            if(user.hasProfileImage){
                var userImageRef = firebase.storage().ref().child('images/users/' +  nextProps.user_id + '/profilepic.jpg');
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
        });
    },

    render: function(){
        var showUpload;
        //shows an upload image option if currentuser
        if(this.props.isCurrentUser){
            showUpload = <input type="file" accept="image/*" onChange={this.handleUploadImage}/>
        }else{
            showUpload = <div></div>
        }

        return (
            <div>
                <img src={this.state.imgURL} className="img-circle" alt="" width="200" height="200" style={{objectFit: 'cover'}}/><br />
                {showUpload}
                <br />
            </div>
        );
    }
});

module.exports = UploadImage;