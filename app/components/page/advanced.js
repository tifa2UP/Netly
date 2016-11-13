var React = require('react');
var ReactDOM = require('react-dom');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var AdvancedSearch = React.createClass({
	getInitialState: function(){
		return ({results: []})
	},

	handleSearch: function(){
		this.state.results.splice(0, this.state.results.length);
		this.setState({results: this.state.results});

		this.userRef = firebase.database().ref().child('users');
		this.userRef.on("child_added", snap=>{
			var user = snap.val();

			if(user.interests.toLowerCase().indexOf(this.refs.interests.value.toLowerCase()) >= 0 && user.skills.toLowerCase().indexOf(this.refs.skills.value.toLowerCase()) >= 0){
				user.id = snap.ref.key;

				//if any experience fields && any education fields were filled out
				if((this.refs.company.value || this.refs.position.value || this.refs.yearsOfExperience.value) && (this.refs.school.value || this.refs.degree.value || this.refs.major.value)){
					this.experienceRef = firebase.database().ref().child('user-experience/' + user.id);
					this.experienceRef.on("child_added", snap =>{
						var experienceUser = snap.val();

						if(experienceUser.employer.toLowerCase().indexOf(this.refs.company.value.toLowerCase()) >= 0 && experienceUser.position.toLowerCase().indexOf(this.refs.position.value.toLowerCase()) >= 0){
							var numYears = parseInt(experienceUser.endDate.substring(0,4)) - parseInt(experienceUser.startDate.substring(0,4));
							var numMonths = parseInt(experienceUser.endDate.substring(5,7)) - parseInt(experienceUser.startDate.substring(5,7));
							if(numMonths < 0){
								numYears -= 1;
							}

							if(numYears >= this.refs.yearsOfExperience.value){
								this.educationRef = firebase.database().ref().child('user-education/' + user.id);
								this.educationRef.on("child_added", snap =>{
									var educationUser = snap.val();

									if(educationUser.school.toLowerCase().indexOf(this.refs.school.value.toLowerCase()) >= 0 && educationUser.major.toLowerCase().indexOf(this.refs.major.value.toLowerCase()) >= 0 && educationUser.degree.toLowerCase().indexOf(this.refs.degree.value.toLowerCase()) >= 0){
										if(this.state.results.indexOf(user) < 0){
											this.state.results.push(user);
											this.setState({results: this.state.results});
										}
									}
								});
							}
						}
					});
				//if any education fields were filled out
				}else if(this.refs.school.value || this.refs.degree.value || this.refs.major.value){
					this.educationRef = firebase.database().ref().child('user-education/' + user.id);
					this.educationRef.on("child_added", snap =>{
						var educationUser = snap.val();

						if(educationUser.school.toLowerCase().indexOf(this.refs.school.value.toLowerCase()) >= 0 && educationUser.major.toLowerCase().indexOf(this.refs.major.value.toLowerCase()) >= 0 && educationUser.degree.toLowerCase().indexOf(this.refs.degree.value.toLowerCase()) >= 0){
							this.state.results.push(user);
							this.setState({results: this.state.results});
						}
					});
				//if any experience fields were filled out
				}else if(this.refs.company.value || this.refs.position.value || this.refs.yearsOfExperience.value){
					this.experienceRef = firebase.database().ref().child('user-experience/' + user.id);
					this.experienceRef.on("child_added", snap =>{
						var experienceUser = snap.val();

						if(experienceUser.employer.toLowerCase().indexOf(this.refs.company.value.toLowerCase()) >= 0 && experienceUser.position.toLowerCase().indexOf(this.refs.position.value.toLowerCase()) >= 0){
							var numYears = parseInt(experienceUser.endDate.substring(0,4)) - parseInt(experienceUser.startDate.substring(0,4));
							var numMonths = parseInt(experienceUser.endDate.substring(5,7)) - parseInt(experienceUser.startDate.substring(5,7));
							if(numMonths < 0){
								numYears -= 1;
							}
							if(numYears >= this.refs.yearsOfExperience.value){
								this.state.results.push(user);
								this.setState({results: this.state.results});
							}
						}
					});
				//if neither education nor experience fields were filled out
				}else{
					this.state.results.push(user);
					this.setState({results: this.state.results});
				}
			}
		});
	},

	componentWillUnmount: function(){
		if (typeof this.userRef == 'function') { 
		  	this.userRef.off(); 
		}
		if (typeof this.experienceRef == 'function') { 
		  	this.experienceRef.off(); 
		}
		if (typeof this.eduationRef == 'function') { 
		  	this.educationRef.off(); 
		}
	},

	render: function(){
		return(
			<div>
				<div className="col-md-5">
					<center><h1>Advanced Search</h1></center><br/>
					<input type="text" ref="company" placeholder="Company" className="form-control"/><br/>
					<input type="text" ref="position" placeholder="Position" className="form-control"/><br/>
					<input type="number" ref="yearsOfExperience" placeholder="Years of Work Experience" className="form-control" min="0"/><br/>

					<input type="text" ref="school" placeholder="School" className="form-control"/><br/>
					<input type="text" ref="degree" placeholder="Degree, ex. B.S." className="form-control"/><br/>
					<input type="text" ref="major" placeholder="Field of Study, ex. Software Engineering" className="form-control"/><br/>

					<input type="text" ref="interests" placeholder="Interests, ex. Hiking" className="form-control"/><br/>
					<input type="text" ref="skills" placeholder="Skills, ex. Java" className="form-control"/><br/>

					<center><button className="btn btn-primary" onClick={this.handleSearch}>Go</button></center>
				</div>
				<div className="col-md-2"></div>
				<div className="col-md-5">
					<center><h1>Search Results</h1>
					Your search returned {this.state.results.length} results:
					</center><br/>

					{this.state.results.map((user,index) => (
	        			<div key={index}>
	       					<Link to={"users/" + user.id}><h4><img src={user.imageURL} className="img-circle" alt="" width="100" height="100" style={{objectFit: 'cover', border: "1px solid #B5A4A4"}}/> 
	       					{user.first + " " + user.last}</h4></Link>
	        				<br /><br />
	        			</div>
					))}
				</div>
			</div>
		)
	}
});

module.exports = AdvancedSearch;