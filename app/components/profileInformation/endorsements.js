var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var endorsement = React.createClass({
	getInitialState: function(){
		return{
			logged_in_user_name: '', 
			currentUserID: this.props.currentUserID, 
			pageID: this.props.pageID,
			isCurrentUser: this.props.isCurrentUser, 
			isConnected:false, 
			endorsed:false, 
			editing: false, 
			endorsements: [], 
			img: "",
			userData: {}, 
            };
	},
	
	componentWillMount: function(){
	},
	
	componentDidMount: function(){
		this.userRef = firebase.database().ref().child('users/'+this.props.currentUserID);
		this.endorsementRef = firebase.database().ref().child('user-endorsement/'+this.state.pageID);
		this.connectionRef = firebase.database().ref().child('connections/'+this.state.pageID+"/"+this.state.currentUserID);
		
		this.userRef.on("value", snap=>{
			var user = snap.val();
			this.setState({
				userData: user,
				logged_in_user_name: user.first + " " + user.last
			});
        });
		
		this.endorsementRef.on("child_added", snap => {
        	var endorsement = snap.val();
			if(endorsement){
				endorsement.key = snap.ref.key;
				this.state.endorsements.push(endorsement);
				this.setState({endorsements: this.state.endorsements});
			}
			
			var index; // get index of endorsement by logged in user
			for(var i = 0; i < this.state.endorsements.length; i++){
				if(this.state.endorsements[i].endorsedById == this.state.currentUserID){
					index = i;
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
			var match;
			if(endorsement){
				endorsement.key = snap.ref.key;
				var index;
				for(var i = 0; i < this.state.endorsements.length; i++){
					if(this.state.endorsements[i].key == endorsement.key){
						index = i;
						if(this.state.endorsements[i].endorsedById == this.state.currentUserID){
							match = true;
						}
					}
				}
				this.state.endorsements.splice(index, 1);
				if(!match){
					this.setState({endorsed: false});
				}
			}
        });
		
		this.connectionRef.on("value", snap=>{
			var connection = snap.val();
			if(connection && connection.status=="accepted" && !this.state.isCurrentUser){
				this.setState({isConnected: true});
			}
			else{
				this.setState({isConnected: false});
				this.setState({endorsed: false});
			}
		});
		
		this.connectionRef.on("child_changed", snap=>{
			var connection = snap.val();
			if(connection && connection.status=="accepted" && !this.state.isCurrentUser){
				this.setState({isConnected: true});
			}
			else{
				this.setState({isConnected: false});
				this.setState({endorsed: false});
			}
		});
		
		this.connectionRef.on("child_removed", snap=>{
			this.setState({isConnected: false});
			this.setState({endorsed: false});
		});
	},
	
	componentWillReceiveProps: function(nextProps){
		this.userRef.off();	
		this.endorsementRef.off();	
		this.connectionRef.off();
	
		this.setState({currentUserID: nextProps.currentUserID});
		this.setState({pageID: nextProps.pageID});
		this.setState({isCurrentUser: nextProps.isCurrentUser});
		this.setState({endorsements: []});	
		
		this.userRef = firebase.database().ref().child('users/'+nextProps.currentUserID);
		this.endorsementRef = firebase.database().ref().child('user-endorsement/'+nextProps.pageID);
		this.connectionRef = firebase.database().ref().child('connections/'+nextProps.pageID+"/"+nextProps.currentUserID);
		
		this.userRef.on("value", snap=>{
			var user = snap.val();
			this.setState({
				userData: user,
				logged_in_user_name: user.first + " " + user.last
			});
        });
		
		this.endorsementRef.on("child_added", snap => {
        	var endorsement = snap.val();
			if(endorsement){
				endorsement.key = snap.ref.key;
				this.state.endorsements.push(endorsement);
				this.setState({endorsements: this.state.endorsements});
			}
			
			var index; // get index of endorsement by logged in user
			for(var i = 0; i < this.state.endorsements.length; i++){
				if(this.state.endorsements[i].endorsedById == nextProps.currentUserID){
					index = i;
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
			var match;
			if(endorsement){
				endorsement.key = snap.ref.key;
				var index;
				for(var i = 0; i < this.state.endorsements.length; i++){
					if(this.state.endorsements[i].key == endorsement.key){
						index = i;
						if(this.state.endorsements[i].endorsedById == nextProps.currentUserID){
							match = true;
						}
					}
				}
				this.state.endorsements.splice(index, 1);
				if(!match){
					this.setState({endorsed: false});
				}
			}
        });
		
		this.connectionRef.on("value", snap=>{
			var connection = snap.val();
			if(connection && connection.status=="accepted" && !nextProps.isCurrentUser){
				this.setState({isConnected: true});
			}
			else{
				this.setState({isConnected: false});
				this.setState({endorsed: false});
			}
		});
		
		this.connectionRef.on("child_changed", snap=>{
			var connection = snap.val();
			if(connection && connection.status=="accepted" && !nextProps.isCurrentUser){
				this.setState({isConnected: true});
			}
			else{
				this.setState({isConnected: false});
				this.setState({endorsed: false});
			}
		});
		
		this.connectionRef.on("child_removed", snap=>{
			this.setState({isConnected: false});
			this.setState({endorsed: false});
		});
	},
	
	componentWillUnmount: function(){
		this.userRef.off();	
		this.endorsementRef.off();	
		this.connectionRef.off();
	},
	
	handleClickAdd: function(){
		this.setState({adding: true});
	},

	handleClickEdit: function(index){
		this.setState({editing: true});
		this.setState({indexToEdit: index});
	},

	handleClickSave: function(){
		console.log("this.state.img: " + this.state.userData.imageURL);
		var endorsementData = {
			img: this.state.userData.imageURL,
			endorsedById: this.state.currentUserID,
			endorsedBy: this.state.logged_in_user_name,
			msg: this.refs.msg.value
		}

		if(this.state.editing){
			var endorsementUpdate = {};
			endorsementUpdate['user-endorsement/' + this.state.pageID + '/' + this.state.currentUserID] = endorsementData;
			firebase.database().ref().update(endorsementUpdate);
		}else{
			var newendoresement = firebase.database().ref().child('user-endorsement/' + this.state.pageID + '/' + this.state.currentUserID).set(endorsementData);

		}
		
		this.setState({endorsed: true});
		this.setState({editing: false});
		this.setState({adding: false});

	},

	handleRemoveExisting: function(){
		var endorsementRef = firebase.database().ref('user-endorsement/' + this.state.pageID + '/' + this.state.currentUserID);
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
		if (this.state.isConnected && !this.state.endorsed && !this.state.isCurrentUser){
				return <h4 className="profile-heading">Recommendations  
					<button className="btn btn-default" onClick={this.handleClickAdd}>
						<span className="glyphicon glyphicon-plus" title="Add Recommendation">
						</span>
					</button>
				</h4>
		}
		else{
				return <h4 className="profile-heading">Recommendations</h4>	
		}
	},

	addingendorsement: function(){
		return(
			<div className="col-md-12">
				<div className="col-md-8">
					<textarea ref="msg" className="form-control" rows="6" placeholder="Recommend this user!"/><br />
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
					<textarea ref="msg" className="form-control" rows="6" defaultValue={indexedendorsement.msg} /><br />
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
	
		if(this.state.isConnected){
			return(
				<div>
					{this.state.endorsements.map((endorsement,index) => (
			        	<div key={index}>
							<Link to={"/users/"+ endorsement.endorsedById}>
								<img src={endorsement.img} className="img-circle grid-img recommendation-img"  alt="" width="40" height="40" style={{objectFit: 'cover'}}/>
							</Link>
							<Link to={"/users/"+ endorsement.endorsedById}>
								{endorsement.endorsedBy}
							</Link>
								<blockquote className="recommendation-quote">
									"{endorsement.msg}"
								{ (this.state.endorsed && endorsement.endorsedById==this.state.currentUserID) ? <button className="btn btn-default" onClick={this.handleClickEdit.bind(null, index)}>
								<span className="glyphicon glyphicon-pencil" title="Edit endorsement"></span>
								</button> : null }</blockquote>
			       		</div>
			   		))}
				</div>
			)
		}else{
			return(
				<div>
					{this.state.endorsements.map((endorsement,index) => (
			        	<div key={index}>
							<Link to={"/users/"+ endorsement.endorsedById}>
								<img src={endorsement.img} className="img-circle grid-img recommendation-img" alt="" width="40" height="40" style={{objectFit: 'cover'}}/>
							</Link>
			       			<Link to={"/users/"+ endorsement.endorsedById}>
								{endorsement.endorsedBy}
							</Link>
							<blockquote className="recommendation-quote">
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
});

module.exports = endorsement;