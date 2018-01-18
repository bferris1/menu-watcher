import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class OauthForm extends Component {

	constructor (props) {
		super(props);
		this.handleResult = this.handleResult.bind(this);
		console.log('asdf');
	}

	handleResult (result) {
		this.props.onResult(result);
	}

	render () {
		return (
			<div>
				<p>{this.props.service} would like to access your account.</p>
				<p>This app will be able to view and edit your favorites.</p>
				<button onClick={(e) => {
					e.preventDefault();
					this.handleResult(true);
				}} className="btn btn-block btn-success">Accept
				</button>
				{/*<button onClick={(e) => {
					e.preventDefault();
					this.handleResult(false);
				}} className="btn btn-block btn-danger">Decline
				</button>*/}
			</div>
		);
	}
}

OauthForm.propTypes = {
	service: PropTypes.string.isRequired,
	onResult: PropTypes.func.isRequired
};