var firebase = require('firebase');
var hashHistory = require('react-router').hashHistory;

function requireAuth(nextState) {
	var directingToPath = nextState.routes[0].path; //gets the path the user wants to go to

	firebase.auth().onAuthStateChanged(function(user) { //check if user is logged in
	  	if (user == null) {
	  		hashHistory.push('/login');
	  	}
	});
};

module.exports = requireAuth;