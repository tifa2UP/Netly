var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var Experience = React.createClass({
	getInitialState: function(){
		return{isCurrentUser: false, editing: false, experiences: [], id: this.props.pageID};
	},

	componentWillMount: function(){
        this.experienceRef = firebase.database().ref().child('user-experience/'+this.props.pageID);
        this.experienceRef.on("child_added", snap => {
        	var experience = snap.val();
			if(experience){
				experience.key = snap.ref.key;
				this.state.experiences.push(experience);
				this.setState({experiences: this.state.experiences});
			}
        });

        this.experienceRefChanged = firebase.database().ref().child('user-experience/'+this.props.pageID);
        this.experienceRefChanged.on("child_changed", snap => {
        	var experience = snap.val();
			if(experience){
				experience.key = snap.ref.key;

				var index;
				for(var i = 0; i < this.state.experiences.length; i++){
					if(this.state.experiences[i].key == experience.key){
						index = i;
					}
				}

				this.state.experiences.splice(index, 1, experience);
				this.setState({experiences: this.state.experiences});
			}
        });

        this.experienceRefRemoved = firebase.database().ref().child('user-experience/'+this.props.pageID);
        this.experienceRefRemoved.on("child_removed", snap => {
        	var experience = snap.val();
			if(experience){
				experience.key = snap.ref.key;

				var index;
				for(var i = 0; i < this.state.experiences.length; i++){
					if(this.state.experiences[i].key == experience.key){
						index = i;
					}
				}

				this.state.experiences.splice(index, 1);
				this.setState({experiences: this.state.experiences});
			}
        });
	},

	componentWillReceiveProps: function(nextProps){
		if(nextProps.pageID != this.state.id){
			this.experienceRef.off(); //turn off the experienceRef in compWillMount-listen only from one.
			this.experienceRefChanged.off();
			this.experienceRefRemoved.off();
			this.setState({experiences: []});

			this.experienceRef = firebase.database().ref().child('user-experience/'+ nextProps.pageID);
	        this.experienceRef.on("child_added", snap => {
	        	var experience = snap.val();
				if(experience){
					experience.key = snap.ref.key;
					this.state.experiences.push(experience);
					this.setState({experiences: this.state.experiences});
				}
	        });

	        this.experienceRefChanged = firebase.database().ref().child('user-experience/' + nextProps.pageID);
	        this.experienceRefChanged.on("child_changed", snap => {
	        	var experience = snap.val();
				if(experience){
					experience.key = snap.ref.key;

					var index;
					for(var i = 0; i < this.state.experiences.length; i++){
						if(this.state.experiences[i].key == experience.key){
							index = i;
						}
					}
					
					this.state.experiences.splice(index, 1, experience);
					this.setState({experiences: this.state.experiences});
				}
	        });

	        this.experienceRefChanged = firebase.database().ref().child('user-experience/' + nextProps.pageID);
	        this.experienceRefChanged.on("child_removed", snap => {
	        	var experience = snap.val();
				if(experience){
					experience.key = snap.ref.key;

					var index;
					for(var i = 0; i < this.state.experiences.length; i++){
						if(this.state.experiences[i].key == experience.key){
							index = i;
						}
					}
					
					this.state.experiences.splice(index, 1);
					this.setState({experiences: this.state.experiences});
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
		var experienceData = {
			employer: this.refs.employer.value,
			position: this.refs.position.value,
			startDate: this.refs.startDate.value,
			endDate: this.refs.endDate.value,
			description: this.refs.description.value
		}

		if(this.state.editing){
			var experienceUpdate = {};
			experienceUpdate['/user-experience/' + this.props.pageID + '/' + this.state.experiences[this.state.indexToEdit].key] = experienceData;
			firebase.database().ref().update(experienceUpdate);
		}else{
			var newExperienceKey = firebase.database().ref().child('experience').push().key;
			firebase.database().ref('/user-experience/' + this.props.pageID + '/' + newExperienceKey).set(experienceData);
		}
		
		this.setState({editing: false});
		this.setState({adding: false});

	},

	handleRemoveExisting: function(){
		var experienceRef = firebase.database().ref('user-experience/' + this.props.pageID + '/' + this.state.experiences[this.state.indexToEdit].key);
		experienceRef.remove();

		this.setState({editing: false});
		this.setState({adding: false});
	},

	handleClickCancel: function(){
		this.setState({editing: false});
		this.setState({adding: false});
	},

	experienceHeading: function(){
		if(this.props.isCurrentUser){
			return <h4 className="profile-heading">Experience <button className="btn btn-default" onClick={this.handleClickAdd}><span className="glyphicon glyphicon-plus" title="Add Experience"></span></button></h4>
		}else{
			return <h4 className="profile-heading">Experience</h4>
		}
	},

	addingExperience: function(){
		return(
			<div className="col-md-12">
				<div className="col-md-8">
					<input type="text" ref="employer" className="form-control" placeholder="Company Name"/><br />
					<input type="text" ref="position" className="form-control" placeholder="Position"/><br />
					<div className="input-group">
						<input type="month" ref="startDate" className="form-control"/>
						<span className="input-group-addon">-</span>
						<input type="month" ref="endDate" className="form-control"/>
					</div><br/>
					<textarea className="form-control" rows="6" style={{width: '100%'}} ref="description" placeholder="Description" /><br/>
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
		var indexedExperience = this.state.experiences[this.state.indexToEdit];

		return(
			<div className="col-md-12">
				<div className="col-md-8">
					<input type="text" ref="employer" className="form-control" defaultValue={indexedExperience.employer} /><br />
					<input type="text" ref="position" className="form-control" defaultValue={indexedExperience.position}/><br />
					<div className="input-group">
						<input type="month" ref="startDate" className="form-control" defaultValue={indexedExperience.startDate}/>
						<span className="input-group-addon">-</span>
						<input type="month" ref="endDate" className="form-control" defaultValue={indexedExperience.endDate}/>
					</div><br/>
					<textarea className="form-control" rows="6" style={{width: '100%'}} ref="description" defaultValue={indexedExperience.description}/><br/>

					<center>
						<div className="btn btn-toolbar">
							<button className="btn btn-primary" onClick={this.handleClickSave}>Save</button>
							<button className="btn btn-default" onClick={this.handleClickCancel}>Cancel</button>
							<button className="btn btn-link" onClick={this.handleRemoveExisting}>Remove this experience</button>
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
					{this.state.experiences.map((experience,index) => (
			        	<div key={index}>
			       			<h4><strong>{experience.employer}</strong> <button className="btn btn-default" onClick={this.handleClickEdit.bind(null, index)}><span className="glyphicon glyphicon-pencil" title="Edit Experience"></span></button></h4>
			       			<h5>{experience.position}</h5>
			       			<h6>{experience.startDate} - {experience.endDate}</h6>
			       			<h6><pre style={{margin: "-10px 0px 0px -10px", fontFamily: "helvetica", border: "none", width: "100%", background: "none", whiteSpace: "pre-wrap"}}>{experience.description}</pre></h6>
			       		</div>
			   		))}
				</div>
			)
		}else{
			return(
				<div>
					{this.state.experiences.map((experience,index) => (
			        	<div key={index}>
			       			<h4><strong>{experience.employer}</strong></h4>
			       			<h5>{experience.position}</h5>
			       			<h6>{experience.startDate} - {experience.endDate}</h6>
			       			<h6><pre style={{margin: "-10px 0px 0px -10px", fontFamily: "helvetica", border: "none", width: "100%", background: "none", whiteSpace: "pre-wrap"}}>{experience.description}</pre></h6>
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
				{this.experienceHeading()}
				{show}
				<hr></hr>
			</div>
		)
	},

	componentWillUnmount: function(){
		this.experienceRef.off();
		this.experienceRefChanged.off();
		this.experienceRefRemoved.off();
	},
});

module.exports = Experience;