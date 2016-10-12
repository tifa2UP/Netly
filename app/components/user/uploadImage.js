var React = require('react');
var ReactDOM = require('react-dom');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var UploadImage = React.createClass({
    getInitialState: function(){
        return{imgRef: ""};
    },

    handleUploadImage: function(){
    },

    componentWillMount: function(){
        var storage = firebase.storage();
        var pathReference = storage.ref('images/default.gif');
        pathReference.getDownloadURL().then(url => {
            this.setState({
                imgRef: url
            });
        });
    },

    render: function(){
        return (
            <div>
                <img src={this.state.imgRef}
                     className="img-circle" alt="" width="140" height="140"/><br />
                <button onClick={this.handleUploadImage} className="btn btn-primary">Upload Image</button><br /><br />
            </div>
        );
    }
});

module.exports = UploadImage;