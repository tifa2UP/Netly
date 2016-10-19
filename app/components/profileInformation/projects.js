var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;


var Projects = React.createClass({
	//initially, no submission errors
	getInitialState: function(){
		return{ userInput: '', showEdit: false};
	},
	onClick: function() {
        this.setState({ showEdit: true });
    },
	handleUserInput: function(e) {
    	this.setState({
	    	userInput: e.target.value
	  	});
  	},
	render: function() {
		return  (
			<div>
				
				<h5>{"Projects Description"} </h5>
				<h1>{this.state.userInput}</h1>
				<div>
					< button  onClick={this.onClick}>
						<strong>EDIT { this.state.showEdit ? <textarea placeholder= "Enter current projects" onChange = {this.handleUserInput}
          				value={this.state.userInput}/> : null } 

						</strong>
					</button>
				</div>
			</div>	  
		);
			
	}

});



module.exports = Projects;

