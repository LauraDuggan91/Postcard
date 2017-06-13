import React from 'react';

export default class Modal extends React.Component {
  render() {
    if (this.props.isOpen === false){
  		return null
    } else {
  		return (
    		<div>
        	<div className='modalStyle'>
            {this.props.children}
        	</div>
        	{!this.props.noBackdrop &&<div className='backgroundModal' onClick={this.props.onClose}/>}
        </div>
  		)
    }
  }

}