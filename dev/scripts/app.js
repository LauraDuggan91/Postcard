import React from 'react';
import ReactDOM from 'react-dom';
import firebase, { config, auth, provider, dbRef} from './firebase.js'
import { 
    BrowserRouter as Router, 
    Route, Link } from 'react-router-dom';
import Autocomplete from 'react-google-autocomplete';
import Calendar from 'react-input-calendar';
// import 'react-input-calendar/style/index.css';
// import { DateField, Calendar } from 'react-date-picker';


//user logs into app using google
//upon logging in, they see their grid of postcards
//ability to add a new entry
//ability to sort entries by date or by country or randomly or by cost



//all login info needs to be in main component
class App extends React.Component {
	constructor() {
		super();
		this.state = {
			postcard: {},
			postcards: [],
			loggedIn: false,
			user: null
		}
		this.createPostcard = this.createPostcard.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.uploadPhoto = this.uploadPhoto.bind(this);
		this.login = this.login.bind(this);
		this.logout = this.logout.bind(this);
	}
	uploadPhoto(e) {
		e.preventDefault();
		let file = e.target.files[0];
		this.file = file;
	}
	createPostcard(e) { //On Submit...		
		e.preventDefault();

		/* Add Photo */
		const storageRef = firebase.storage().ref('userPhotos/' + this.file.name)
		const postcardPhoto = storageRef.child(this.file.name);

		postcardPhoto.put(this.file).then((snapshot) => {
		postcardPhoto.getDownloadURL().then((url) => {
				console.log(this.state);
				const postcardObj = Object.assign({}, this.state.postcard);
				postcardObj.image_url = url;
				const userId = this.state.user.uid;
				const userRef = firebase.database().ref(userId);
				userRef.push(postcardObj);

				/* Clear Postcard */
				this.setState({
					postcard: {
						dayInfo: '',
						dayNumber: '',
						amountSpent: '',
						location: '',
						postcardImage: ''
					}
				});
			}); 
		})
	}
	handleChange(e) {
		const newPostcard = Object.assign({}, this.state.postcard);
		newPostcard[e.target.name] = e.target.value;
		this.setState({
			postcard: newPostcard
		});
	}
	deletePostcard(key) {
		const userId = this.state.user.uid;
		const userRef = firebase.database().ref(`${userId}/${key}`);
		userRef.remove();
	}
	login() {
		auth.signInWithPopup(provider)
		.then((result) => {
			const user = result.user;
			this.setState({
				user: user,
				loggedIn: true
			})
		});
	}
	logout() {
		auth.signOut()
		.then(() => {
			this.setState ({
				user: null,
				loggedIn: false
			})
		});
	}
    render() {
    	const showPostcard = () => {
	    	if (this.state.loggedIn === true) {
	    		return (
	    			<Router>
	    				<div>
			    			<div>
			    				<button className="logoutButton" onClick={this.logout}>Log Out</button>
			    				<PostcardGrid postcard={this.state.postcard} createPostcard={this.createPostcard} handleChange={this.handleChange} uploadPhoto={this.uploadPhoto}/>
			    			</div>
			    			<ul>
			    				{this.state.postcards.map((post) => {
			    					// console.log(post)
			    					return (
			    						<li className="singleCard" key={post.key}>
				    						<div className="displayImage">
				    							<img className="renderedImage" src={post.image_url}/>
				    						</div>
				    						<div className="displayBack clearfix">
					    						<h3>{post.location}</h3>
					    						<p>Day: {post.dayNumber}</p>
					    						<p>Description: {post.dayInfo}</p>
					    						<p>Amount Spent: {post.amountSpent}</p>
					    						<button onClick={() => this.deletePostcard(post.key)}>Delete</button>
				    						</div>
			    						</li>
			    					)	
			    				})}
			    			</ul>
			    			<footer className="container">
			    				<p>&copy; Laura Duggan 2017</p>
			    			</footer>
		    			</div>
	    			</Router>
	    		)
	    	} else {
	    		return (
	    			<div>
			    		<div id="slider">
			    			<figure>
				    			<img src="../../assets/imageslider3.jpg" alt/>
				    			<img src="../../assets/imageslider2.jpg" alt/>
				    			<img src="../../assets/imageslider1.jpg" alt/>
				    			<img src="../../assets/imageslider5.jpg" alt/>
				    			<img src="../../assets/imageslider4.jpg" alt/>
			    			</figure>
		    			</div>
		    			<div className="overlay">
			    			<h1>Postcards</h1>
			    			<h3>Memories for the making</h3>
			    			<button onClick={this.login}>Log In</button>
		    			</div>
		    		</div>
	    		)
	    	}
	    }
	    return (
	    	<main>
	    		{showPostcard()}
	    	</main>
	    )
    }
    componentDidMount() {
    	auth.onAuthStateChanged((user) => {
    		if (user) {
    			this.setState({
    				user: user,
    				loggedIn: true
    			});
    			const userId = user.uid;
				const userRef = firebase.database().ref(userId);

				userRef.on('value', (snapshot) => {
					const dbPostcard = snapshot.val();
					const newPostcard = [];
					for (let key in dbPostcard) {
						newPostcard.push({
							key: key,
							location: dbPostcard[key].location,
							dayNumber: dbPostcard[key].dayNumber,
							amountSpent: dbPostcard[key].amountSpent,
							dayInfo: dbPostcard[key].dayInfo,
							image_url: dbPostcard[key].image_url
						});
					}
					console.log(newPostcard);
					this.setState({
						postcards: newPostcard
					});
				});
    		} else {
    			this.setState({
    				user: null,
    				loggedIn: false
    			})
    		}
    	});
    }
}



class PostcardGrid extends React.Component {
	render() {
		return (
			<div className="container">
				<h1>My Postcards</h1>
				<p>To add a new postcard, enter some information about your trip.</p>
				<form onSubmit={this.props.createPostcard}>
					<Autocomplete name="location" value={this.props.postcard.location} onChange={this.props.handleChange} id="location" type="text" placeholder="Location" onPlaceSelected={(place) => {
      						console.log(place);
      						this.setState({
							location: place.formatted_address
							})
    					}}/>
					<Calendar name="dayNumber" format="DD/MM/YYYY" date='4-12-2014' value={this.props.postcard.dayNumber}onChange={this.props.handleChange} id="dayNumber" type="text" placeholder="Day Number"/>
					<input name="amountSpent" value={this.props.postcard.amountSpent}onChange={this.props.handleChange} id="amountSpent" type="text" placeholder="Amount you spent"/>
					<textarea name="dayInfo" value={this.props.postcard.dayInfo} onChange={this.props.handleChange} id="dayInfo" cols="30" rows="1" maxLength="600" placeholder="Description (max 600 characters)"></textarea>
					<input name="postcardImage" value={this.props.postcard.postcardImage} onChange={this.props.uploadPhoto} id="postcardImage" type="file" accept="image/*"/>
					<input type="submit" value="Submit"/>
				</form>
			</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('app'));