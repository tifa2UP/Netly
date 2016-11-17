var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var endorsement = React.createClass({
	getInitialState: function(){
		return{
			logged_in_user_name: '', 
			logged_in_user_id: '', 
			isConnected:false, 
			isCurrentUser: "", 
			endorsed:false, 
			editing: false, 
			endorsements: [], 
			currentUserID: "",
			id: this.props.pageID,
			pageID: ""};
	},
	
	componentWillMount: function(){
		this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
			this.setState({logged_in_user_id: user.uid});
			
			this.userRef = firebase.database().ref().child('users/'+this.state.logged_in_user_id);
			this.userRef.on("value", snap=>{
				var user = snap.val();
				this.setState({logged_in_user_name: user.first + " " + user.last});
			});
			
			this.connectionRef = firebase.database().ref().child('connections/'+this.props.pageID+"/"+user.uid);
			this.connectionRef.once("value", snap=>{
				var connection = snap.val();
				if(connection && connection.status=="accepted"){
					this.setState({isConnected: true});
				}
			});
        });
	},
	
	componentDidMount: function(){
		this.endorsementRef = firebase.database().ref().child('user-endorsement/'+this.props.pageID);
		this.endorsementRef.on("child_added", snap => {
        	var endorsement = snap.val();
			if(endorsement){
				endorsement.key = snap.ref.key;
				this.state.endorsements.push(endorsement);
				this.setState({endorsements: this.state.endorsements});
			}
			
			var index; // get index of endorsement by logged in user
			for(var i = 0; i < this.state.endorsements.length; i++){
				if(this.state.endorsements[i].endorsedById == this.state.logged_in_user_id){
					index = i;
					console.log("match at index: "+i);
					this.setState({endorsed: true});
				}
			}
        });

        this.endorsementRef.on("child_changed", snap => {
        	var endorsement = snap.val();
			if(endorsement){
				endorsement.key = snap.ref.key;
				var index;
				for(var i = 0; i < this.state.endorsements.length; i++){
					if(this.state.endorsements[i].key == endorsement.key){
						index = i;
					}
				}
				this.state.endorsements.splice(index, 1, endorsement);
				this.setState({endorsements: this.state.endorsements});
			}
        });

        this.endorsementRef.on("child_removed", snap => {
        	var endorsement = snap.val();
			if(endorsement){
				endorsement.key = snap.ref.key;
				var index;
				for(var i = 0; i < this.state.endorsements.length; i++){
					if(this.state.endorsements[i].key == endorsement.key){
						index = i;
					}
				}
				this.state.endorsements.splice(index, 1);
			}
			
			var match = false;
			for(var i = 0; i < this.state.endorsements.length; i++){
				if(this.state.endorsements[i].endorsedById == this.state.logged_in_user_id){
					index = i;
					console.log("match at index: "+i);
					match = true;
					//this.setState({endorsed: true});
				}
			}
			if(!match){
					this.setState({endorsed: false});
					console.log("no match");
			}
        });
	},


	
	getIndexOfEndorsement: function(){

	},
	
	handleClickAdd: function(){
		this.setState({adding: true});
	},

	handleClickEdit: function(index){
		this.setState({editing: true});
		this.setState({indexToEdit: index});
	},

	handleClickSave: function(){
	
		var endorsementData = {
			endorsedById: this.state.logged_in_user_id,
			endorsedBy: this.state.logged_in_user_name,
			msg: this.refs.msg.value
		}

		if(this.state.editing){
			var endorsementUpdate = {};
			endorsementUpdate['/user-endorsement/' + this.props.pageID + '/' + this.state.endorsements[this.state.indexToEdit].key] = endorsementData;
			firebase.database().ref().update(endorsementUpdate);
		}else{
			var newendorsementKey = firebase.database().ref().child('endorsement').push().key;
			firebase.database().ref('/user-endorsement/' + this.props.pageID + '/' + newendorsementKey).set(endorsementData);
		}
		
		this.setState({endorsed: true});
		this.setState({editing: false});
		this.setState({adding: false});

	},

	handleRemoveExisting: function(){
		var endorsementRef = firebase.database().ref('user-endorsement/' + this.props.pageID + '/' + this.state.endorsements[this.state.indexToEdit].key);
		endorsementRef.remove();

		this.setState({endorsed: false});
		this.setState({editing: false});
		this.setState({adding: false});
	},

	handleClickCancel: function(){
		this.setState({editing: false});
		this.setState({adding: false});
	},

	endorsementHeading: function(){
		if(!this.state.isConnected || this.state.endorsed){
				return <h2 style={{color: "#0077B5"}}>Endorsements</h2>	
		}else{
				return <h2 style={{color: "#0077B5"}}>Endorsements 
					<button className="btn btn-default" onClick={this.handleClickAdd}>
						<span className="glyphicon glyphicon-plus" title="Add endorsement">
						</span>
					</button>
				</h2>
		}
	},

	addingendorsement: function(){
		return(
			<div className="col-md-12">
				<div className="col-md-8">
					<input type="text" ref="msg" className="form-control" placeholder="endorsement"/><br />
					<center>
						<div className="btn btn-toolbar">
							<button className="btn btn-primary" onClick={this.handleClickSave}>Save</button>
							<button className="btn btn-default" onClick={this.handleClickCancel}>Cancel</button>
						</div>
					</center><br/>
				</div>
			</div>
		)
	},

	editingendorsement: function(){
		var indexedendorsement = this.state.endorsements[this.state.indexToEdit];

		return(
			<div className="col-md-12">
				<div className="col-md-8">
					<input type="text" ref="msg" className="form-control" defaultValue={indexedendorsement.msg} /><br />
					<center>
						<div className="btn btn-toolbar">
							<button className="btn btn-primary" onClick={this.handleClickSave}>Save</button>
							<button className="btn btn-default" onClick={this.handleClickCancel}>Cancel</button>
							<button className="btn btn-link" onClick={this.handleRemoveExisting}>Remove this endorsement</button>
						</div>
					</center><br/>
				</div>
			</div>
		)
	},

	defaultendorsement: function(){
	
		console.log("this.state.logged_in_user_id: " + this.state.logged_in_user_id);
		console.log("this.state.isConnected: " + this.state.isConnected);
		console.log("this.state.endorsed: " + this.state.endorsed);
		if(this.state.isConnected){
			return(
				<div>
					{this.state.endorsements.map((endorsement,index) => (
			        	<div key={index}>
							<Link to={"/users/"+ endorsement.endorsedById}>{endorsement.endorsedBy}</Link>
								<blockquote>
									"{endorsement.msg}"
								</blockquote>
								{ (this.state.endorsed && endorsement.endorsedById==this.state.logged_in_user_id) ? <button className="btn btn-default" onClick={this.handleClickEdit.bind(null, index)}>
								<span className="glyphicon glyphicon-pencil" title="Edit endorsement"></span>
								</button> : null }
			       		</div>
			   		))}
				</div>
			)
		}else{
			return(
				<div>
					{this.state.endorsements.map((endorsement,index) => (
			        	<div key={index}>
			       			<Link to={"/users/"+ endorsement.endorsedById}>{endorsement.endorsedBy}</Link>
							<blockquote>
								"{endorsement.msg}"
							</blockquote>
			       		</div>
			   		))}
				</div>
			)
		}
	},

	render: function(){
		var show;

		if(this.state.adding){
			show = this.addingendorsement();
		}else if(this.state.editing){
			show = this.editingendorsement();
		}else{
			show = this.defaultendorsement();
		}

		return (
			<div>
				{this.endorsementHeading()}
				{show}
			</div>
		)
	},
	
// only need to unmount one ref that is used by multiple handlers
	componentWillUnmount: function(){
		this.userRef.off();	
		this.endorsementRef.off();	
		this.connectionRef.off();
        this.unsubscribe();
	},
});

module.exports = endorsement;