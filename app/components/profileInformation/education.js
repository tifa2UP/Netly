var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var Education = React.createClass({
	getInitialState: function(){
		return{isCurrentUser: false, editing: false, educations: [], id: this.props.pageID};
	},

	componentWillMount: function(){
        this.educationRef = firebase.database().ref().child('user-education/'+this.props.pageID);
        this.educationRef.on("child_added", snap => {
        	var education = snap.val();
			if(education){
				education.key = snap.ref.key;
				this.state.educations.push(education);
				this.setState({educations: this.state.educations});
			}
        });

        this.educationRefChanged = firebase.database().ref().child('user-education/'+this.props.pageID);
        this.educationRefChanged.on("child_changed", snap => {
        	var education = snap.val();
			if(education){
				education.key = snap.ref.key;

				var index;
				for(var i = 0; i < this.state.educations.length; i++){
					if(this.state.educations[i].key == education.key){
						index = i;
					}
				}

				this.state.educations.splice(index, 1, education);
				this.setState({educations: this.state.educations});
			}
        });

        this.educationRefRemoved = firebase.database().ref().child('user-education/'+this.props.pageID);
        this.educationRefRemoved.on("child_removed", snap => {
        	var education = snap.val();
			if(education){
				education.key = snap.ref.key;
				
				var index;
				for(var i = 0; i < this.state.educations.length; i++){
					if(this.state.educations[i].key == education.key){
						index = i;
					}
				}

				this.state.educations.splice(index, 1);
				this.setState({educations: this.state.educations});
			}
        });
	},

	componentWillReceiveProps: function(nextProps){
		if(nextProps.pageID != this.state.id){
			this.educationRef.off(); //turn off the educationRef in compWillMount-listen only from one.
			this.educationRefChanged.off();
			this.educationRefRemoved.off();
			this.setState({educations: []});

			this.educationRef = firebase.database().ref().child('user-education/'+ nextProps.pageID);
	        this.educationRef.on("child_added", snap => {
	        	var education = snap.val();
				if(education){
					education.key = snap.ref.key;
					this.state.educations.push(education);
					this.setState({educations: this.state.educations});
				}
	        });

	        this.educationRefChanged = firebase.database().ref().child('user-education/' + nextProps.pageID);
	        this.educationRefChanged.on("child_changed", snap => {
	        	var education = snap.val();
				if(education){
					education.key = snap.ref.key;

					var index;
					for(var i = 0; i < this.state.educations.length; i++){
						if(this.state.educations[i].key == education.key){
							index = i;
						}
					}
					
					this.state.educations.splice(index, 1, education);
					this.setState({educations: this.state.educations});
				}
	        });

	        this.educationRefRemoved = firebase.database().ref().child('user-education/' + nextProps.pageID);
	        this.educationRefRemoved.on("child_removed", snap => {
	        	var education = snap.val();
				if(education){
					education.key = snap.ref.key;

					var index;
					for(var i = 0; i < this.state.educations.length; i++){
						if(this.state.educations[i].key == education.key){
							index = i;
						}
					}
					
					this.state.educations.splice(index, 1);
					this.setState({educations: this.state.educations});
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
		var educationData = {
			school: this.refs.school.value,
			degree: this.refs.degree.value,
			major: this.refs.major.value,
			startDate: this.refs.startDate.value,
			endDate: this.refs.endDate.value
		}

		if(this.state.editing){
			var educationUpdate = {};
			educationUpdate['/user-education/' + this.props.pageID + '/' + this.state.educations[this.state.indexToEdit].key] = educationData;
			firebase.database().ref().update(educationUpdate);
		}else{
			var newEducationKey = firebase.database().ref().child('education').push().key;
			firebase.database().ref('/user-education/' + this.props.pageID + '/' + newEducationKey).set(educationData);
		}
		
		this.setState({editing: false});
		this.setState({adding: false});

	},

	handleRemoveExisting: function(){
		var educationRef = firebase.database().ref('user-education/' + this.props.pageID + '/' + this.state.educations[this.state.indexToEdit].key);
		educationRef.remove();

		this.setState({editing: false});
		this.setState({adding: false});
	},

	handleClickCancel: function(){
		this.setState({editing: false});
		this.setState({adding: false});
	},

	educationHeading: function(){
		if(this.props.isCurrentUser){
			return <div> <h4 className="profile-heading">Education <button className="btn btn-default" onClick={this.handleClickAdd}><span className="glyphicon glyphicon-plus" title="Add Education"></span></button></h4> </div>

		}else{
			return <h4 className="profile-heading">Education</h4>
		}
	},

	addingEducation: function(){
		return(
			<div className="col-md-12">
				<div className="col-md-8">
					<input type="text" ref="school" className="form-control" placeholder="School"/><br />
					<input type="text" ref="degree" className="form-control" placeholder="Degree"/><br />
					<input type="text" ref="major" className="form-control" placeholder="Field of Study"/><br />
					<div className="input-group">
						<input type="month" ref="startDate" className="form-control"/>
						<span className="input-group-addon">-</span>
						<input type="month" ref="endDate" className="form-control"/>
					</div>

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

	editingEducation: function(){
		var indexedSchool = this.state.educations[this.state.indexToEdit];

		return(
			<div className="col-md-12">
				<div className="col-md-8">
					<input type="text" ref="school" className="form-control" defaultValue={indexedSchool.school} /><br />
					<input type="text" ref="degree" className="form-control" defaultValue={indexedSchool.degree}/><br />
					<input type="text" ref="major" className="form-control" defaultValue={indexedSchool.major}/><br />
					<div className="input-group">
						<input type="month" ref="startDate" className="form-control" defaultValue={indexedSchool.startDate}/>
						<span className="input-group-addon">-</span>
						<input type="month" ref="endDate" className="form-control" defaultValue={indexedSchool.endDate}/>
					</div>

					<center>
						<div className="btn btn-toolbar">
							<button className="btn btn-primary" onClick={this.handleClickSave}>Save</button>
							<button className="btn btn-default" onClick={this.handleClickCancel}>Cancel</button>
							<button className="btn btn-link" onClick={this.handleRemoveExisting}>Remove this school</button>
						</div>
					</center><br/>
				</div>
			</div>
		)
	},

	defaultEducation: function(){
		if(this.props.isCurrentUser){
			return(
				<div>
					{this.state.educations.map((education,index) => (
			        	<div key={index}>
			       			<h4><strong>{education.school}</strong> <button className="btn btn-default" onClick={this.handleClickEdit.bind(null, index)}><span className="glyphicon glyphicon-pencil" title="Edit Education"></span></button></h4>
			       			<h5>{education.degree}: {education.major}</h5>
			       			<h6>{education.startDate} - {education.endDate}</h6>
			       		</div>
			   		))}
				</div>
			)
		}else{
			return(
				<div>
					{this.state.educations.map((education,index) => (
			        	<div key={index}>
			       			<h4><strong>{education.school}</strong></h4>
			       			<h5>{education.degree}: {education.major}</h5>
			       			<h6>{education.startDate} - {education.endDate}</h6>
			       		</div>
			   		))}
				</div>
			)
		}
	},

	render: function(){
		var show;

		if(this.state.adding){
			show = this.addingEducation();
		}else if(this.state.editing){
			show = this.editingEducation();
		}else{
			show = this.defaultEducation();
		}

		return (
			<div>
				{this.educationHeading()}
				{show}
				<hr />
			</div>
		)
	},

	componentWillUnmount: function(){
		this.educationRef.off();
		this.educationRefChanged.off();
		this.educationRefRemoved.off();
	},
});

module.exports = Education;