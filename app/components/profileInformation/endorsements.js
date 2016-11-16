var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var endorsement = React.createClass({
// is current user is being passed as a prop in the other pages but not being called in getinitialstate,
// I'll check the other pages later
// note: some of these initialstates aren't being used, I was just playing around trying to get stuff to work
	getInitialState: function(){
		return{
			logged_in_user_name: '', 
			logged_in_user_id: '', 
			isConnected:false, 
			isCurrentUser: this.props.isCurrentUser, 
			endorsed:false, 
			editing: false, 
			endorsements: [], 
			id: this.props.pageID};
	},


	componentWillMount: function(){
	        this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            this.setState({
				logged_in_user_id: user.uid,
				logged_in_user_name: user.displayName});
			});
		},

// need to use componentdidmount to get endorsements because the check for iscurrentusers will cause a rerender (and delete the endoresements) on change. either from f5 or changing profiles
	componentDidMount: function(){
// var that = this is a workaround for scope. can avoided if using es6
		var that = this;
		
// had to add this to get logged in user id and name since the prop passed in from profile can be of any user.
// suggest adding prop "logged_in_user_id" at login so auth doesn't need to be called when needed.


// use search results.js for an example of how to return a list of connections to set isConnected
// then search endoresements and compare to logged_in_user_id and set endorsed to true or false
// after that, fix the buttons so the state is correct when showing/allowing editing etc.
// later add a handler for "enter" key

// only need one ref, can attach multiple handlers to it. Ref can also be navigated using child/parent.			
        this.endorsementRef = firebase.database().ref().child('user-endorsement/'+this.props.pageID);
		
        this.endorsementRef.on("child_added", snap => {
        	var endorsement = snap.val();
			if(endorsement){
				endorsement.key = snap.ref.key;
				this.state.endorsements.push(endorsement);
				this.setState({endorsements: this.state.endorsements});
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
				this.setState({endorsements: this.state.endorsements});
			}
        });
	},

// dont need componentwillreceiveprops. the handers are redundant since no props are passed

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
		
		this.setState({editing: false});
		this.setState({adding: false});

	},

	handleRemoveExisting: function(){
		var endorsementRef = firebase.database().ref('user-endorsement/' + this.props.pageID + '/' + this.state.endorsements[this.state.indexToEdit].key);
		endorsementRef.remove();

		this.setState({editing: false});
		this.setState({adding: false});
	},

	handleClickCancel: function(){
		this.setState({editing: false});
		this.setState({adding: false});
	},

// not used yet
	toggleEndorsed: function(){
		this.setState({endorsed: !endorsed});
	},
	
	endorsementHeading: function(){
		if(this.props.isCurrentUser || (this.state.isConnected && this.state.endorsed)){
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

// add logic here for checking if the logged in user owns any of the endoresements and is "Connected" 
// so he/she may have access to the edit button
	defaultendorsement: function(){
		if(this.props.isCurrentUser){
			return(
				<div>
					{this.state.endorsements.map((endorsement,index) => (
			        	<div key={index}>
			       			<Link to={"/users/"+ endorsement.endorsedById}>{endorsement.endorsedBy}</Link>
			       			<h5>{endorsement.msg}</h5>
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
			       			<h5>
								{endorsement.msg} 
								<button className="btn btn-default" onClick={this.handleClickEdit.bind(null, index)}>
								<span className="glyphicon glyphicon-pencil" title="Edit endorsement"></span>
								</button>
							</h5>
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
		this.endorsementRef.off();	
        this.unsubscribe();
	},
});

module.exports = endorsement;