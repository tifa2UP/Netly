var React = require('react');
var ReactDOM = require('react-dom');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var Search = React.createClass({
    getInitialState: function () {
        return {
        userInput: '',
        showResult: false
        };
    },

    handleSearch: function() {
        var path = "results/" + this.refs.search.value;
        hashHistory.push(path);  
    },

    render: function () {
    
        return (

            <div>
                <input type="text" ref="search" placeholder="Search for people" type="text" />
                <button onClick={this.handleSearch}>Search</button>
            </div>
        )
    }
});


module.exports = Search;