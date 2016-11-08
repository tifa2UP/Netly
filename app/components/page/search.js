var React = require('react');
var ReactDOM = require('react-dom');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var Search = React.createClass({
    handleSearch: function(e) {
        e.preventDefault();
        if(this.refs.search.value != ""){
            var path = "results/" + this.refs.search.value;
            hashHistory.push(path);
        }
    },

    render: function () {
        return (
            <form className="navbar-form pull-left" onChange={this.handleSearch}>
                <div className="form-group">
                    <input type="text" className="form-control" ref="search" placeholder="Search for people"/>
                </div>
                <button className="btn btn-default"><span className='glyphicon glyphicon-search'></span></button>
            </form>
        )
    }
});


module.exports = Search;