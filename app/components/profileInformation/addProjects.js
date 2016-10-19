var EditButton = React.createClass({

 	handleUserInput: function(e) {
    	this.setState({
	    	userInput: e.target.value
	  });
    },
    onClickSave: function () {
    	this.setState({ showEdit: true }); 

  		<h3>{this.state.userInput}</h3> 
	},

	handleClickCancel: function () {
  		//alert('Done!');
	},

	render: function(){
		return (
			<div>
				<div>
					<textarea id="projects"  className ="EditButton_projects" value={this.userInput}/> 
					 
				</div>	   
				<div>
					<button onClick={this.onClickSave} >
        				<strong>SAVE </strong>
      				</button>

      				<button onClick={this.onClickCancel}>
        				<strong>CANCEL </strong>
      				</button>
      			</div>
      		</div>

		);

	}
	
});
module.exports = EditButton;