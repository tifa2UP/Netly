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
    storageBucket: "testingproject-cd660.appspot.com",
    messagingSenderId: "579173148287"
};

var selingConfigTester = {
    apiKey: "AIzaSyAv-1nDt8s6spRqzcywfxotxiVQLqoGLnE",
    authDomain: "pronet-7debd.firebaseapp.com",
    databaseURL: "https://pronet-7debd.firebaseio.com",
    storageBucket: "pronet-7debd.appspot.com",
    messagingSenderId: "437166099419"
 };

firebase.initializeApp(selingConfigTester);

ReactDOM.render(routes, document.getElementById('app'));