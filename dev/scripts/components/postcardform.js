import React from 'react';
import Modal from './modal.js'
// import Autocomplete from 'react-google-autocomplete';
import Calendar from 'react-input-calendar';

export default class PostcardForm extends React.Component {
	render() {
		return (
			<div className="container">
				<div className="headerImage">
					<h1>My Postcards</h1>
				</div>
					<button className="addNewPostcardButton" onClick={this.props.openModal}>Add a new postcard</button>
          			<Modal className='modalStyle' isOpen={this.props.isModalOpen} onClose={() => this.closeModal()}>
					<form onSubmit={this.props.createPostcard}>
						<button onClick={(e) => {
								e.preventDefault();
								this.props.closeModal()
							}
						}>Close Window</button>

						<p>Enter some information about your trip.</p>

						<input name="postcardImage" value={this.props.postcard.postcardImage} onChange={this.props.uploadPhoto} id="postcardImage" type="file" accept="image/*"/>

						<input name="location" value={this.props.postcard.location} onChange={this.props.handleChange} id="location" type="text" placeholder="Location"/>
						
						<input name="dayNumber" value={this.props.postcard.dayNumber} onChange={this.props.handleChange} id="dayNumber" type="text" placeholder="Day Number"/>

						<input name="amountSpent" value={this.props.postcard.amountSpent} onChange={this.props.handleChange} id="amountSpent" type="text" placeholder="Amount you spent"/>

						<textarea name="dayInfo" value={this.props.postcard.dayInfo} onChange={this.props.handleChange} id="dayInfo" cols="30" rows="3" maxLength="250" placeholder="Description (max 250 characters)"></textarea>


						<input type="submit" value="Submit"/>
					</form>
				</Modal>
			</div>
		)
	}
	// <Autocomplete name="location" value={this.props.postcard.location} id="location" type="text" placeholder="Location" onPlaceSelected={this.props.onPlaceSelected}/>
	// Calendar name="dayNumber" format="DD/MM/YYYY" date='6-14-2017'
}