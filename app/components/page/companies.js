var React = require('react');
var firebase = require('firebase');
var Link = require('react-router').Link;
var hashHistory = require('react-router').hashHistory;

var Companies = React.createClass({
	getInitialState: function(){
		return {
			currentUserID: "",
			companies: []
		}
	},

	componentWillMount: function(){
		this.companyRef = firebase.database().ref('users').orderByChild("recruiter").equalTo(true);
		this.companyRef.on("child_added", snap=>{
			company = snap.val();
			company.user_id = snap.ref.key;
			this.state.companies.push(company);
			this.setState({companies: this.state.companies});
		});
	},

	componentWillUnmount: function(){
		this.companyRef.off();
	},

	render: function(){
		var showCompanies;
		if(this.state.companies.length == 0){
			showCompanies = <div><center>We currently have no companies!</center></div>
		}else{
			showCompanies = 
				this.state.companies.map((user,index) => (
        			<div key={index}>
       					<Link to={"users/" + user.user_id}><h4><img src={user.imageURL} className="img-circle" alt="" width="100" height="100" style={{objectFit: 'cover', border: "1px solid #B5A4A4"}}/> 
       					{user.first + " " + user.last}</h4></Link>
        				<br /><br />
        			</div>
   				))
		}

		return(
			<div>
				<center><h1>Companies</h1></center>
				{showCompanies}
			</div>
		);
	}
});

module.exports = Companies;