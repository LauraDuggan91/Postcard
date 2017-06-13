import React from 'react';
import Modal from './modal.js'
import Autocomplete from 'react-google-autocomplete';
import Calendar from 'react-input-calendar';

export default class PostcardForm extends React.Component {
	render() {
		return (
			<div className="container">
				<h1>My Postcards</h1>
					<button onClick={this.props.openModal}>Add a new postcard</button>
          			<Modal className='modalStyle' isOpen={this.props.isModalOpen} onClose={() => this.closeModal()}>
					<form onSubmit={this.props.createPostcard}>
						<p>Enter some information about your trip.</p>

						<button onClick={(e) => {
								e.preventDefault();
								this.props.closeModal()
							}
						}>Close Window</button>
						<Autocomplete name="location" value={this.props.postcard.location} id="location" type="text" placeholder="Location" onPlaceSelected={this.props.onPlaceSelected}/>
						
						<Calendar name="dayNumber" format="DD/MM/YYYY" date='6-12-2017' value={this.props.postcard.dayNumber} onDateSelected={this.props.onDateSelected} id="dayNumber" type="text" placeholder="Day Number"/>

						<input name="amountSpent" value={this.props.postcard.amountSpent}onChange={this.props.handleChange} id="amountSpent" type="text" placeholder="Amount you spent"/>

						<textarea name="dayInfo" value={this.props.postcard.dayInfo} onChange={this.props.handleChange} id="dayInfo" cols="30" rows="1" maxLength="600" placeholder="Description (max 600 characters)"></textarea>

						<input name="postcardImage" value={this.props.postcard.postcardImage} onChange={this.props.uploadPhoto} id="postcardImage" type="file" accept="image/*"/>

						<input type="submit" value="Submit"/>
					</form>
				</Modal>
			</div>
		)
	}
}