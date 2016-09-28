var React = require('react');
var ReactDOM = require('react-dom');
var firebase = require('firebase');
var Router = require('react-router').Router;
var Route = require('react-router').Route;
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var routes = require('./config/routes.js');

var config = {
	apiKey: "AIzaSyCVVsLbLodfKpwKvEJB2ASCc-TB5gzkwNw",
	authDomain: "testingproject-cd660.firebaseapp.com",
	databaseURL: "https://testingproject-cd660.firebaseio.com",
	storageBucket: "",
	messagingSenderId: "579173148287"
};

firebase.initializeApp(config);

ReactDOM.render(routes, document.getElementById('app'));