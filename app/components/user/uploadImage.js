var React = require('react');
var ReactDOM = require('react-dom');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var UploadImage = React.createClass({
    getInitialState: function(){	
        return{imgRef: "", currentUser: ""};
    },

    handleUploadImage: function(){
		var storage = firebase.storage();
		var file = document.getElementById('input').files[0];

		// Create the file metadata
		var metadata = {
			contentType: 'image/jpeg'
		};
//ADD USERNAME FOLDERS
		// Upload file and metadata to the object 'images/mountains.jpg'
		var uploadTask = storage.ref('images/' + firebase.auth().currentUser.uid + '/default.jpg' ).put(file, metadata);

		// Listen for state changes, errors, and completion of the upload.
		uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
			function(snapshot) {
				// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
				var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				console.log('Upload is ' + progress + '% done');
				switch (snapshot.state) {
					case firebase.storage.TaskState.PAUSED: // or 'paused'
						console.log('Upload is paused');
						break;
					case firebase.storage.TaskState.RUNNING: // or 'running'
						console.log('Upload is running');
						break;
				}
			}, function(error) {
			switch (error.code) {
				case 'storage/unauthorized':
					// User doesn't have permission to access the object
					break;
				case 'storage/canceled':
					// User canceled the upload
					break;
				case 'storage/unknown':
					// Unknown error occurred, inspect error.serverResponse
					break;
			}
			}, function() {
				// Upload completed successfully, now we can get the download URL
				var downloadURL = uploadTask.snapshot.downloadURL;
			});

		var user = firebase.auth().currentUser;
        var pathReference = storage.ref('images/' +  user.uid + '/default.jpg');
        pathReference.getDownloadURL().then(url => {
            this.setState({ imgRef: url });
        });


    },

	componentWillMount: function(){
		var storage = firebase.storage();
		var pathReference = storage.ref('images/default.jpg'); 
		
		firebase.auth().onAuthStateChanged((user) => {
			
			pathReference = storage.ref('images/' + user.uid + '/default.jpg');
			
			
			
			pathReference.getDownloadURL().then(url => {
				this.setState({
					imgRef: url
				});
			});
		});
		
		
		
		
	},

    render: function(){
        return (
            <div>
                <img src={this.state.imgRef}
                     className="img-circle" 
					alt="" width="140" 
					height="140"/>
				
				<br />
				<input type="file" id="input"  onChange={this.handleUploadImage} />
				
				<br />
				<br />
            </div>
        );
    }
});

module.exports = UploadImage;