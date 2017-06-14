import React from 'react';
import ReactDOM from 'react-dom';
import firebase, { config, auth, provider, dbRef} from './firebase.js'
import { 
    BrowserRouter as Router, 
    Route, Link } from 'react-router-dom';
import PostcardForm from './components/postcardform.js';
import Modal from './components/modal.js';
// import Autocomplete from 'react-google-autocomplete';
// import Calendar from 'react-input-calendar';


//user logs into app using google
//upon logging in, they see their grid of postcards
//ability to add a new entry
//ability to sort entries by date or by country or randomly or by cost



// class Child extends React.Component {
// 	render() {
// 		return(

			
// 		)
// 	}
// }


//all login info needs to be in main component
class App extends React.Component {
	constructor() {
		super();
		this.state = {
			postcard: {},
			postcards: [],
			loggedIn: false,
			user: null,
			isModalOpen: false,
			childVisible: false
		}
		this.createPostcard = this.createPostcard.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.uploadPhoto = this.uploadPhoto.bind(this);
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.onClick = this.onClick.bind(this);
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
		const storageRef = firebase.storage().ref('userPhotos/')
		const postcardPhoto = storageRef.child(this.file.name);

		postcardPhoto.put(this.file).then((snapshot) => {
		postcardPhoto.getDownloadURL().then((url) => {
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

	openModal(e){
		this.setState({
			isModalOpen: true
		});
	}
	closeModal(e){
		this.setState({
			isModalOpen: false
		})
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
			    				<PostcardForm postcard={this.state.postcard} postcards={this.state.postcards} createPostcard={this.createPostcard} handleChange={this.handleChange} uploadPhoto={this.uploadPhoto} openModal={this.openModal} closeModal={this.closeModal} isModalOpen={this.state.isModalOpen} />
			    				
			    			</div>
			    			<ul>
			    				{this.state.postcards.map((post) => {
			    					
			    					return (
			    						<li className="singleCard" key={post.key}>
				    						<div className="displayImage" onClick={this.onClick}>
				    							<img className="renderedImage" src={post.image_url}/>
				    						</div>
					    					<div className="displayBack clearfix">
					    						<div className="postcardLeft">
					    							<p>{post.dayInfo}</p>
					    						</div>
					    						<div className="postcardRight">
						    						<h3>{post.location}</h3>
						    						<p>Day Number: {post.dayNumber}</p>
						    						<p>Amount Spent: ${post.amountSpent}</p>
						    						<button onClick={() => this.deletePostcard(post.key)}>Delete</button>
					    						</div>
					    					</div>
				    						
			    						</li>
			    					)	
				    						// {this.state.childVisible ?<Child /> : null}
			    				})}
			    			</ul>
			    			<div className='totalcost container'>
			    			<p>Total amount spent on travelling: <span className="bolded">${this.state.postcards.reduce((acc, val) => {
			    				return Number(acc) + Number(val.amountSpent);
			    			}, 0)}</span></p>
			  				

			    			</div>
			
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
    onClick() {
    	this.setState({
    		childVisible: !this.state.childVisible
    	})
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







ReactDOM.render(<App />, document.getElementById('app'));