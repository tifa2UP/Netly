var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var JobListings = React.createClass({
	getInitialState: function(){
		return{isCurrentUser: false, editing: false, joblistings: [], id: this.props.pageID};
	},

	componentWillMount: function(){
        this.joblistingRef = firebase.database().ref().child('user-joblisting/'+this.props.pageID);
        this.joblistingRef.on("child_added", snap => {
        	var joblisting = snap.val();
			if(joblisting){
				joblisting.key = snap.ref.key;
				this.state.joblistings.push(joblisting);
				this.setState({joblistings: this.state.joblistings});
			}
        });

        this.joblistingRefChanged = firebase.database().ref().child('user-joblisting/'+this.props.pageID);
        this.joblistingRefChanged.on("child_changed", snap => {
        	var joblisting = snap.val();
			if(joblisting){
				joblisting.key = snap.ref.key;

				var index;
				for(var i = 0; i < this.state.joblistings.length; i++){
					if(this.state.joblistings[i].key == joblisting.key){
						index = i;
					}
				}

				this.state.joblistings.splice(index, 1, joblisting);
				this.setState({joblistings: this.state.joblistings});
			}
        });

        this.joblistingRefRemoved = firebase.database().ref().child('user-joblisting/'+this.props.pageID);
        this.joblistingRefRemoved.on("child_removed", snap => {
        	var joblisting = snap.val();
			if(joblisting){
				joblisting.key = snap.ref.key;

				var index;
				for(var i = 0; i < this.state.joblistings.length; i++){
					if(this.state.joblistings[i].key == joblisting.key){
						index = i;
					}
				}

				this.state.joblistings.splice(index, 1);
				this.setState({joblistings: this.state.joblistings});
			}
        });
	},

	componentWillReceiveProps: function(nextProps){
		if(nextProps.pageID != this.state.id){
			this.joblistingRef.off(); //turn off the joblistingRef in compWillMount-listen only from one.
			this.joblistingRefChanged.off();
			this.joblistingRefRemoved.off();
			this.setState({joblistings: []});

			this.joblistingRef = firebase.database().ref().child('user-joblisting/'+ nextProps.pageID);
	        this.joblistingRef.on("child_added", snap => {
	        	var joblisting = snap.val();
				if(joblisting){
					joblisting.key = snap.ref.key;
					this.state.joblistings.push(joblisting);
					this.setState({joblistings: this.state.joblistings});
				}
	        });

	        this.joblistingRefChanged = firebase.database().ref().child('user-joblisting/' + nextProps.pageID);
	        this.joblistingRefChanged.on("child_changed", snap => {
	        	var joblisting = snap.val();
				if(joblisting){
					joblisting.key = snap.ref.key;

					var index;
					for(var i = 0; i < this.state.joblistings.length; i++){
						if(this.state.joblistings[i].key == joblisting.key){
							index = i;
						}
					}
					
					this.state.joblistings.splice(index, 1, joblisting);
					this.setState({joblistings: this.state.joblistings});
				}
	        });

	        this.joblistingRefChanged = firebase.database().ref().child('user-joblisting/' + nextProps.pageID);
	        this.joblistingRefChanged.on("child_removed", snap => {
	        	var joblisting = snap.val();
				if(joblisting){
					joblisting.key = snap.ref.key;

					var index;
					for(var i = 0; i < this.state.joblistings.length; i++){
						if(this.state.joblistings[i].key == joblisting.key){
							index = i;
						}
					}
					
					this.state.joblistings.splice(index, 1);
					this.setState({joblistings: this.state.joblistings});
				}
	        });
    	}
	},

	handleClickAdd: function(){
		this.setState({adding: true});
	},

	handleClickEdit: function(index){
		this.setState({editing: true});
		this.setState({indexToEdit: index});
	},

	handleClickSave: function(){
		var joblistingData = {
			position: this.refs.position.value,
			industry: this.refs.industry.value,
			employmentType: this.refs.employmentType.value,
			experienceLevel: this.refs.experienceLevel.value,
			payrate: this.refs.payrate.value,
			location: this.refs.location.value,
			description: this.refs.description.value,
			responsibilities: this.refs.responsibilities.value,
			qualitifications: this.refs.qualitifications.value
		}

		if(this.state.editing){
			var joblistingUpdate = {};
			joblistingUpdate['/user-joblisting/' + this.props.pageID + '/' + this.state.joblistings[this.state.indexToEdit].key] = joblistingData;
			firebase.database().ref().update(joblistingUpdate);
		}else{
			var newExperienceKey = firebase.database().ref().child('joblisting').push().key;
			firebase.database().ref('/user-joblisting/' + this.props.pageID + '/' + newExperienceKey).set(joblistingData);
		}
		
		this.setState({editing: false});
		this.setState({adding: false});

	},

	handleRemoveExisting: function(){
		var joblistingRef = firebase.database().ref('user-joblisting/' + this.props.pageID + '/' + this.state.joblistings[this.state.indexToEdit].key);
		joblistingRef.remove();

		this.setState({editing: false});
		this.setState({adding: false});
	},

	handleClickCancel: function(){
		this.setState({editing: false});
		this.setState({adding: false});
	},

	joblistingHeading: function(){
		if(this.props.isCurrentUser){
			return <h2 className="profile-heading">Job Listings <button className="btn btn-default" onClick={this.handleClickAdd}><span className="glyphicon glyphicon-plus" title="Add New Listing"></span></button></h2>
		}else{
			return <h2 className="profile-heading">Job Listings</h2>
		}
	},

	addingExperience: function(){
		return(
			<div className="col-md-12">
				<div className="col-md-8">
					<input type="text" ref="position" className="form-control" placeholder="Position"/><br />
					<input type="text" ref="industry" className="form-control" placeholder="Industry"/><br />
					<input type="text" ref="employmentType" className="form-control" placeholder="Employment Type"/><br />
					<input type="text" ref="experienceLevel" className="form-control" placeholder="Experience Level"/><br />
					<input type="text" ref="payrate" className="form-control" placeholder="Pay Rate"/><br />
					<input type="text" ref="location" className="form-control" placeholder="Location"/><br />
					<textarea className="form-control" rows="6" style={{width: '100%'}} ref="description" placeholder="Job Description" /><br/>
					<textarea className="form-control" rows="6" style={{width: '100%'}} ref="responsibilities" placeholder="Responsibilities"/><br/>
					<textarea className="form-control" rows="6" style={{width: '100%'}} ref="qualitifications" placeholder="Qualifications"/><br/>
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

	editingExperience: function(){
		var indexedExperience = this.state.joblistings[this.state.indexToEdit];

		return(
			<div className="col-md-12">
				<div className="col-md-8">
					<input type="text" ref="position" className="form-control" defaultValue={indexedExperience.position} /><br />
					<input type="text" ref="industry" className="form-control" defaultValue={indexedExperience.industry} /><br />
					<input type="text" ref="employmentType" className="form-control" defaultValue={indexedExperience.employmentType} /><br />
					<input type="text" ref="experienceLevel" className="form-control" defaultValue={indexedExperience.experienceLevel} /><br />
					<input type="text" ref="payrate" className="form-control" defaultValue={indexedExperience.payrate}/><br />
					<input type="text" ref="location" className="form-control" defaultValue={indexedExperience.location}/><br />
					<textarea className="form-control" rows="6" style={{width: '100%'}} ref="description" defaultValue={indexedExperience.description}/><br/>
					<textarea className="form-control" rows="6" style={{width: '100%'}} ref="responsibilities" defaultValue={indexedExperience.responsibilities}/><br/>
					<textarea className="form-control" rows="6" style={{width: '100%'}} ref="qualitifications" defaultValue={indexedExperience.qualitifications}/><br/>

					<center>
						<div className="btn btn-toolbar">
							<button className="btn btn-primary" onClick={this.handleClickSave}>Save</button>
							<button className="btn btn-default" onClick={this.handleClickCancel}>Cancel</button>
							<button className="btn btn-link" onClick={this.handleRemoveExisting}>Remove this listing</button>
						</div>
					</center><br/>
				</div>
			</div>
		)
	},

	defaultExperience: function(){
		if(this.props.isCurrentUser){
			return(
				<div>
					{this.state.joblistings.map((joblisting,index) => (
			        	<div key={index}>
			       			<h4><strong>{index + 1}. {joblisting.position}</strong> <button className="btn btn-default" onClick={this.handleClickEdit.bind(null, index)}><span className="glyphicon glyphicon-pencil" title="Edit Listing"></span></button></h4>
			       			<h6>Industry: {joblisting.industry}</h6>
			       			<h6>Employment Type: {joblisting.employmentType}</h6>
			       			<h6>Experience Level: {joblisting.experienceLevel}</h6>
			       			<h6>Pay Rate: {joblisting.payrate}</h6>
			       			<h6>Location: {joblisting.location}</h6>
			       			<h5><strong>Job Description</strong></h5>
			       			<h6><pre style={{margin: "-10px 0px 0px -10px", fontFamily: "helvetica", border: "none", width: "100%", background: "none", whiteSpace: "pre-wrap"}}>{joblisting.description}</pre></h6>
			       			<h5><strong>Responsibilities</strong></h5>
			       			<h6><pre style={{margin: "-10px 0px 0px -10px", fontFamily: "helvetica", border: "none", width: "100%", background: "none", whiteSpace: "pre-wrap"}}>{joblisting.responsibilities}</pre></h6>
			       			<h5><strong>Qualifications</strong></h5>
			       			<h6><pre style={{margin: "-10px 0px 0px -10px", fontFamily: "helvetica", border: "none", width: "100%", background: "none", whiteSpace: "pre-wrap"}}>{joblisting.qualitifications}</pre></h6>
			       		</div>
			   		))}
				</div>
			)
		}else{
			return(
				<div>
					{this.state.joblistings.map((joblisting,index) => (
			        	<div key={index}>
			       			<h4><strong>{index + 1}. {joblisting.position}</strong></h4>
			       			<h6>Industry: {joblisting.industry}</h6>
			       			<h6>Employment Type: {joblisting.employmentType}</h6>
			       			<h6>Experience Level: {joblisting.experienceLevel}</h6>
			       			<h6>Pay Rate: {joblisting.payrate}</h6>
			       			<h6>Location: {joblisting.location}</h6>
			       			<h5><strong>Job Description</strong></h5>
			       			<h6><pre style={{margin: "-10px 0px 0px -10px", fontFamily: "helvetica", border: "none", width: "100%", background: "none", whiteSpace: "pre-wrap"}}>{joblisting.description}</pre></h6>
			       			<h5><strong>Responsibilities</strong></h5>
			       			<h6><pre style={{margin: "-10px 0px 0px -10px", fontFamily: "helvetica", border: "none", width: "100%", background: "none", whiteSpace: "pre-wrap"}}>{joblisting.responsibilities}</pre></h6>
			       			<h5><strong>Qualifications</strong></h5>
			       			<h6><pre style={{margin: "-10px 0px 0px -10px", fontFamily: "helvetica", border: "none", width: "100%", background: "none", whiteSpace: "pre-wrap"}}>{joblisting.qualitifications}</pre></h6>
			       			<br />
			       		</div>
			   		))}
				</div>
			)
		}
	},

	render: function(){
		var show;

		if(this.state.adding){
			show = this.addingExperience();
		}else if(this.state.editing){
			show = this.editingExperience();
		}else{
			show = this.defaultExperience();
		}

		return (
			<div>
				{this.joblistingHeading()}
				{show}
				<hr />
			</div>
		)
	},

	componentWillUnmount: function(){
		this.joblistingRef.off();
		this.joblistingRefChanged.off();
		this.joblistingRefRemoved.off();
	},
});

module.exports = JobListings;